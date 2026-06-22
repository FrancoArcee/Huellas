import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Alert,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { SafeAreaView } from 'react-native-safe-area-context';
import { usePublicacionesStore, type PublicacionForm } from '../store/publicaciones';
import { StepIndicator } from '../components/StepIndicator';
import ChevronDown from '../../../assets/icons/buttons/chevronDown.svg';
import { AddressAutocomplete } from '../../../shared/components/ui/AddressAutocomplete';
import { useRouter, useLocalSearchParams } from 'expo-router';
import {
  animalPhotosSchema,
  sanitizeNumericInput,
  validateAll,
  validateField,
  validateStep,
  type AnimalFormErrors,
  type AnimalFormField,
} from '../utils/validateAnimalForm';

export default function EditAnimalScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { publicaciones, editarPublicacion } = usePublicacionesStore();
  const [step, setStep] = useState(1);

  const [formData, setFormData] = useState<PublicacionForm>({
    nombre: '',
    fechaNacimiento: '',
    edad: '',
    tamano: '',
    ubicacion: '',
    peso: '',
    genero: '',
    castrado: '',
    descripcion: '',
    latitude: null,
    longitude: null,
    placeId: undefined,
  });
  const [imagenes, setImagenes] = useState<ImagePicker.ImagePickerAsset[]>([]);
  const [existingPhotosUrl, setExistingPhotosUrl] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [openSelect, setOpenSelect] = useState<'tamano' | 'genero' | 'castrado' | null>(null);
  const [errors, setErrors] = useState<AnimalFormErrors>({});

  const tamanos = ['Chico', 'Mediano', 'Grande'];
  const generos = ['Macho', 'Hembra'];
  const castrados = ['Si', 'No'];

  useEffect(() => {
    const pub = publicaciones.find(p => p.id === id);
    if (pub) {
      setFormData({
        nombre: pub.nombre,
        fechaNacimiento: pub.fechaNacimiento,
        edad: pub.edad,
        tamano: pub.tamano,
        ubicacion: pub.ubicacion,
        peso: pub.peso,
        genero: pub.genero,
        castrado: pub.castrado,
        descripcion: pub.descripcion,
        latitude: pub.latitude === 0 ? null : pub.latitude,
        longitude: pub.longitude === 0 ? null : pub.longitude,
        placeId: pub.placeId,
      });
      setExistingPhotosUrl(pub.imagenes);
    } else {
      Alert.alert('Error', 'Publicación no encontrada');
      router.back();
    }
  }, [id, publicaciones]);

  const updateForm = (key: AnimalFormField, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
    const error = validateField(key, value);
    setErrors((prev) => ({ ...prev, [key]: error }));
  };

  const handleSiguiente = () => {
    if (step >= 3) return;
    const stepErrors = validateStep(formData, step);
    if (step === 2 && (formData.latitude === null || formData.longitude === null)) {
      stepErrors.ubicacion = 'Seleccioná una dirección sugerida o usá tu ubicación actual';
    }
    if (Object.keys(stepErrors).length > 0) {
      setErrors((prev) => ({ ...prev, ...stepErrors }));
      return;
    }
    setStep(step + 1);
  };

  const handlePickImages = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert('Permiso requerido', 'Necesitamos permiso para abrir tu galería de imágenes.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      allowsMultipleSelection: true,
      mediaTypes: ['images'],
      quality: 1,
      selectionLimit: 3,
      preferredAssetRepresentationMode:
        ImagePicker.UIImagePickerPreferredAssetRepresentationMode.Compatible,
    });
    if (result.canceled) return;

    const parsed = animalPhotosSchema.safeParse(result.assets);
    setErrors((prev) => ({
      ...prev,
      imagenes: parsed.success ? undefined : parsed.error.issues[0]?.message,
    }));
    if (parsed.success) setImagenes(result.assets);
  };

  const handleSubmit = async () => {
    const formErrors = validateAll(formData);
    if (formData.latitude === null || formData.longitude === null) {
      formErrors.ubicacion = 'Seleccioná una dirección sugerida o usá tu ubicación actual';
    }
    const photosResult = animalPhotosSchema.safeParse(imagenes);
    if (!photosResult.success) {
      formErrors.imagenes = photosResult.error.issues[0]?.message;
    }
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    setIsSubmitting(true);
    try {
      await editarPublicacion(
        id,
        formData,
        imagenes,
        imagenes.length > 0 ? [] : existingPhotosUrl,
      );
      Alert.alert('¡Éxito!', 'La Publicación fue actualizada correctamente.');
      router.back();
    } catch (error: any) {
      console.error('Error al editar la publicación:', error);
      Alert.alert(
        'Error',
        error.response?.data?.message ??
          'No se pudo actualizar la publicación. Intentá nuevamente.',
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderError = (key: keyof AnimalFormErrors) => {
    if (!errors[key]) return null;
    return <Text style={localStyles.errorText}>{errors[key]}</Text>;
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <StatusBar barStyle="dark-content" backgroundColor="#f6f6f6" />
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <StepIndicator currentStep={step} />
        <Text style={styles.screenTitle}>Editar publicación</Text>
        
        {step === 1 && (
          <View style={styles.formContainer}>
            <Text style={styles.label}>Nombre de la mascota <Text style={styles.asterisk}>*</Text></Text>
            <TextInput style={styles.input} value={formData.nombre} onChangeText={(t) => updateForm('nombre', t)} />
            {renderError('nombre')}

            <Text style={styles.label}>Fecha de nacimiento</Text>
            <TextInput style={styles.input} value={formData.fechaNacimiento} onChangeText={(t) => updateForm('fechaNacimiento', t)} />
            {renderError('fechaNacimiento')}

            <Text style={styles.label}>Edad <Text style={styles.asterisk}>*</Text></Text>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              value={formData.edad}
              onChangeText={(t) => updateForm('edad', sanitizeNumericInput(t))}
            />
            {renderError('edad')}

            <Text style={styles.label}>Tamaño <Text style={styles.asterisk}>*</Text></Text>
            <TouchableOpacity style={styles.dropdownInput} onPress={() => setOpenSelect(openSelect === 'tamano' ? null : 'tamano')}>
              <Text style={{ color: formData.tamano ? '#000' : '#999' }}>{formData.tamano || 'Seleccionar...'}</Text>
              <ChevronDown width={20} height={20} color="#555" />
            </TouchableOpacity>
            {openSelect === 'tamano' && (
              <View style={styles.selectOptions}>
                {tamanos.map((option) => (
                  <TouchableOpacity
                    key={option}
                    style={styles.selectOption}
                    onPress={() => {
                      updateForm('tamano', option);
                      setOpenSelect(null);
                    }}
                  >
                    <Text style={styles.selectOptionText}>{option}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
            {renderError('tamano')}
            
            <TouchableOpacity style={styles.primaryButton} onPress={handleSiguiente}>
              <Text style={styles.primaryButtonText}>Continuar</Text>
            </TouchableOpacity>
          </View>
        )}

        {step === 2 && (
          <View style={styles.formContainer}>
            <Text style={styles.label}>Ubicación <Text style={styles.asterisk}>*</Text></Text>
            <AddressAutocomplete
              value={formData.ubicacion}
              onChangeText={(text) => updateForm('ubicacion', text)}
              onSelect={(location) => {
                setFormData((current) => ({
                  ...current,
                  latitude: location?.latitude ?? null,
                  longitude: location?.longitude ?? null,
                  placeId: location?.placeId,
                }));
                if (location) {
                  setErrors((current) => ({ ...current, ubicacion: undefined }));
                }
              }}
            />
            {renderError('ubicacion')}

            <Text style={styles.label}>Peso de la mascota <Text style={styles.asterisk}>*</Text></Text>
            <TextInput
              style={styles.input}
              keyboardType="decimal-pad"
              value={formData.peso}
              onChangeText={(t) => updateForm('peso', sanitizeNumericInput(t, true))}
            />
            {renderError('peso')}

            <Text style={styles.label}>Género <Text style={styles.asterisk}>*</Text></Text>
            <TouchableOpacity style={styles.dropdownInput} onPress={() => setOpenSelect(openSelect === 'genero' ? null : 'genero')}>
              <Text style={{ color: formData.genero ? '#000' : '#999' }}>{formData.genero || 'Seleccionar...'}</Text>
              <ChevronDown width={20} height={20} color="#555" />
            </TouchableOpacity>
            {openSelect === 'genero' && (
              <View style={styles.selectOptions}>
                {generos.map((option) => (
                  <TouchableOpacity
                    key={option}
                    style={styles.selectOption}
                    onPress={() => {
                      updateForm('genero', option);
                      setOpenSelect(null);
                    }}
                  >
                    <Text style={styles.selectOptionText}>{option}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
            {renderError('genero')}

            <Text style={styles.label}>Castrado <Text style={styles.asterisk}>*</Text></Text>
            <TouchableOpacity style={styles.dropdownInput} onPress={() => setOpenSelect(openSelect === 'castrado' ? null : 'castrado')}>
              <Text style={{ color: formData.castrado ? '#000' : '#999' }}>{formData.castrado || 'Seleccionar...'}</Text>
              <ChevronDown width={20} height={20} color="#555" />
            </TouchableOpacity>
            {openSelect === 'castrado' && (
              <View style={styles.selectOptions}>
                {castrados.map((option) => (
                  <TouchableOpacity
                    key={option}
                    style={styles.selectOption}
                    onPress={() => {
                      updateForm('castrado', option);
                      setOpenSelect(null);
                    }}
                  >
                    <Text style={styles.selectOptionText}>{option}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
            {renderError('castrado')}

            <TouchableOpacity style={styles.primaryButton} onPress={handleSiguiente}>
              <Text style={styles.primaryButtonText}>Continuar</Text>
            </TouchableOpacity>
          </View>
        )}

        {step === 3 && (
          <View style={styles.formContainer}>
            <Text style={styles.label}>Fotos</Text>
            <TouchableOpacity style={styles.imageUploadArea} onPress={handlePickImages}>
              <Text style={styles.uploadIcon}>{String.fromCodePoint(0x1F4F8)}</Text>
              <Text style={styles.uploadTextBold}>Modificar imágenes</Text>
            </TouchableOpacity>
            {renderError('imagenes')}

            <Text style={styles.label}>Descripción</Text>
            <TextInput 
              style={styles.textArea} 
              multiline 
              numberOfLines={6} 
              value={formData.descripcion} 
              onChangeText={(t) => updateForm('descripcion', t)} 
            />

            <TouchableOpacity style={styles.primaryButton} onPress={handleSubmit} disabled={isSubmitting}>
              <Text style={styles.primaryButtonText}>Guardar cambios</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}


export const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f6f6f6' },
  scrollContent: { paddingHorizontal: 24, paddingBottom: 40 },
  screenTitle: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginBottom: 32, color: '#000' },
  formContainer: { width: '100%' },
  label: { fontSize: 14, fontWeight: '600', color: '#000', marginBottom: 8, marginTop: 16 },
  asterisk: { color: '#f39c12' },
  input: {
    backgroundColor: '#e6e6e6', borderRadius: 20, paddingHorizontal: 16, paddingVertical: 14,
    fontSize: 14, color: '#000', borderWidth: 1, borderColor: '#ccc',
  },
  inputWithIcon: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#e6e6e6',
    borderRadius: 20, paddingHorizontal: 16, borderWidth: 1, borderColor: '#ccc',
  },
  inputFlex: { flex: 1, paddingVertical: 14, fontSize: 14, color: '#000' },
  dropdownInput: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    backgroundColor: '#e6e6e6', borderRadius: 20, paddingHorizontal: 16, paddingVertical: 16,
    borderWidth: 1, borderColor: '#ccc',
  },
  textArea: {
    backgroundColor: '#e6e6e6', borderRadius: 20, paddingHorizontal: 16, paddingVertical: 14,
    fontSize: 14, color: '#000', borderWidth: 1, borderColor: '#ccc', minHeight: 120, textAlignVertical: 'top',
  },
  imageUploadArea: {
    borderWidth: 1, borderStyle: 'dashed', borderColor: '#999', borderRadius: 20,
    padding: 32, alignItems: 'center', justifyContent: 'center', backgroundColor: '#eee',
  },
  selectOptions: {
    backgroundColor: '#fff', borderRadius: 16, borderWidth: 1, borderColor: '#ccc',
    marginTop: 8, overflow: 'hidden', paddingVertical: 4,
  },
  selectOption: {
    paddingVertical: 14, paddingHorizontal: 16,
  },
  selectOptionText: {
    fontSize: 14, color: '#000',
  },
  uploadIcon: { fontSize: 32, marginBottom: 8 },
  uploadTextBold: { fontWeight: 'bold', fontSize: 12, color: '#000' },
  uploadTextSmall: { fontSize: 10, color: '#666', marginTop: 2 },
  primaryButton: {
    backgroundColor: '#f39c12', borderRadius: 25, paddingVertical: 16, alignItems: 'center',
    marginTop: 40, shadowColor: '#f39c12', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3, shadowRadius: 8, elevation: 4,
  },
  primaryButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  successContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 24 },
  successCircle: { width: 140, height: 140, borderRadius: 70, backgroundColor: '#f39c12', justifyContent: 'center', alignItems: 'center', marginBottom: 32 },
  successTitle: { fontSize: 22, fontWeight: 'bold', color: '#000', textAlign: 'center' },
  successSubtitle: { fontSize: 14, color: '#555', marginTop: 8 },
});

const localStyles = StyleSheet.create({
  errorText: {
    color: '#e74c3c',
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
  },
});
