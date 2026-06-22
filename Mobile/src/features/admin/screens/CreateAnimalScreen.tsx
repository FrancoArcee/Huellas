import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Alert
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { styles } from './EditAnimalScreen';
import { SafeAreaView } from 'react-native-safe-area-context';
import { usePublicacionesStore, type PublicacionForm } from '../store/publicaciones';
import { StepIndicator } from '../components/StepIndicator';
import { useRouter } from 'expo-router';
import {
  animalPhotosSchema,
  sanitizeNumericInput,
  validateAll,
  validateField,
  validateStep,
  type AnimalFormErrors,
  type AnimalFormField,
} from '../utils/validateAnimalForm';
import { SuccessCheckIcon } from '../../../shared/components/ui/SuccessCheckIcon';

import ChevronDown from '../../../assets/icons/buttons/chevronDown.svg';
import SearchIcon from '../../../assets/icons/screens/search.svg';

export default function CreateAnimalScreen() {
  const router = useRouter();
  const agregarPublicacion = usePublicacionesStore((state) => state.agregarPublicacion);
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
  });
  const [imagenes, setImagenes] = useState<ImagePicker.ImagePickerAsset[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [openSelect, setOpenSelect] = useState<'tamano' | 'genero' | 'castrado' | null>(null);
  const [errors, setErrors] = useState<AnimalFormErrors>({});

  const tamanos = ['Chico', 'Mediano', 'Grande'];
  const generos = ['Macho', 'Hembra'];
  const castrados = ['Si', 'No'];

  const updateForm = (key: AnimalFormField, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
    const error = validateField(key, value);
    setErrors((prev) => ({ ...prev, [key]: error }));
  };

  const handleSiguiente = () => {
    if (step >= 3) return;
    const stepErrors = validateStep(formData, step);
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
      await agregarPublicacion(formData, imagenes);
      setStep(4);
    } catch (error) {
      console.error('Error al crear la publicación:', error);
      Alert.alert('Error', 'No se pudo crear la publicación. Intentá nuevamente.');
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

      {step < 4 ? (
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <StepIndicator currentStep={step} />
          <Text style={styles.screenTitle}>Crear publicación</Text>

          {step === 1 && (
            <View style={styles.formContainer}>
              <Text style={styles.label}>Nombre de la mascota <Text style={styles.asterisk}>*</Text></Text>
              <TextInput style={styles.input} placeholder="Nombre" value={formData.nombre} onChangeText={(t) => updateForm('nombre', t)} />
              {renderError('nombre')}

              <Text style={styles.label}>Fecha de nacimiento</Text>
              <TextInput style={styles.input} placeholder="DD/MM/YYYY" value={formData.fechaNacimiento} onChangeText={(t) => updateForm('fechaNacimiento', t)} />
              {renderError('fechaNacimiento')}

              <Text style={styles.label}>Edad <Text style={styles.asterisk}>*</Text></Text>
              <TextInput
                style={styles.input}
                placeholder="Edad (puede ser aproximada)"
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
              <View style={styles.inputWithIcon}>
                <TextInput style={styles.inputFlex} placeholder="Nombre" value={formData.ubicacion} onChangeText={(t) => updateForm('ubicacion', t)} />
                <SearchIcon width={20} height={20} color="#555" />
              </View>
              {renderError('ubicacion')}

              <Text style={styles.label}>Peso de la mascota <Text style={styles.asterisk}>*</Text></Text>
              <TextInput
                style={styles.input}
                placeholder="Peso en kg"
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
                <Text style={styles.uploadTextBold}>Adjuntá tus imágenes</Text>
                <Text style={styles.uploadTextSmall}>(Máximo 3 fotos)</Text>
                <Text style={styles.uploadTextSmall}>Peso Máximo por foto 3mb</Text>
              </TouchableOpacity>
              {renderError('imagenes')}

              <Text style={styles.label}>Descripción</Text>
              <TextInput
                style={styles.textArea}
                multiline
                numberOfLines={6}
                placeholder="Cuentanos sobre la mascota..."
                value={formData.descripcion}
                onChangeText={(t) => updateForm('descripcion', t)}
              />

              <TouchableOpacity style={styles.primaryButton} onPress={handleSubmit} disabled={isSubmitting}>
                <Text style={styles.primaryButtonText}>Crear publicación</Text>
              </TouchableOpacity>
            </View>
          )}
        </ScrollView>
      ) : (
        <View style={styles.successContainer}>
          <View style={[styles.successCircle, { marginBottom: 0 }]}>
            <SuccessCheckIcon />
          </View>
          <Text style={[styles.successTitle, { marginTop: 100 }]}>Tu publicación se creó con éxito!</Text>
          <Text style={styles.successSubtitle}>Gracias por dejar tu huella</Text>

          <TouchableOpacity style={[styles.primaryButton, { width: '100%', marginTop: 40 }]} onPress={() => router.push('/(tabs)/mypost')}>
            <Text style={styles.primaryButtonText}>Ver mis publicaciones</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}

const localStyles = StyleSheet.create({
  errorText: {
    color: '#e74c3c',
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
  },
});
