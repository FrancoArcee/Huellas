import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Image
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { styles } from './EditAnimalScreen';
import { SafeAreaView } from 'react-native-safe-area-context';
import { usePublicacionesStore, type PublicacionForm } from '../store/publicaciones';
import { StepIndicator } from '../components/StepIndicator';
import { BirthDatePicker } from '../components/BirthDatePicker';
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
import { AddressAutocomplete } from '../../../shared/components/ui/AddressAutocomplete';
import { FeedbackModal } from '../../../shared/components/ui/FeedbackModal';

import ChevronDown from '../../../assets/icons/buttons/chevronDown.svg';

const MAX_IMAGENES = 3;

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
    latitude: null,
    longitude: null,
    placeId: undefined,
  });
  const [imagenes, setImagenes] = useState<ImagePicker.ImagePickerAsset[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [openSelect, setOpenSelect] = useState<'tamano' | 'genero' | 'castrado' | null>(null);
  const [errors, setErrors] = useState<AnimalFormErrors>({});
  const [alertError, setAlertError] = useState<{ title: string; message: string } | null>(null);

  const tamanos = ['Chico', 'Mediano', 'Grande'];
  const generos = ['Macho', 'Hembra'];
  const castrados = ['Si', 'No'];

  const agregarImagen = async () => {
    if (imagenes.length >= MAX_IMAGENES) return;

    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      setAlertError({ title: 'Permiso requerido', message: 'Necesitamos permiso para abrir tu galería de imágenes.' });
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      allowsMultipleSelection: false,
      mediaTypes: ['images'],
      quality: 1,
      preferredAssetRepresentationMode:
        ImagePicker.UIImagePickerPreferredAssetRepresentationMode.Compatible,
    });

    if (result.canceled) return;
    const asset = result.assets[0];
    if (!asset) return;

    setImagenes(prev => [...prev, asset]);
    setErrors(prev => ({ ...prev, imagenes: undefined }));
  };

  const eliminarImagen = (index: number) => {
    setImagenes(prev => prev.filter((_, i) => i !== index));
  };

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
      await agregarPublicacion(formData, imagenes);
      setStep(4);
    } catch (error: any) {
      console.error('Error al crear la publicación:', error);
      const serverErrors = error?.response?.data?.errors;
      if (serverErrors) {
        const firstErr = Object.values(serverErrors)[0];
        const msg = Array.isArray(firstErr) ? firstErr[0] : firstErr;
        setAlertError({ title: 'Error', message: msg ?? 'Revisá los datos ingresados.' });
      } else {
        setAlertError({ title: 'Error', message: error.response?.data?.message ?? 'No se pudo crear la publicación. Intentá nuevamente.' });
      }
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
              <BirthDatePicker value={formData.fechaNacimiento} onChange={(value) => updateForm('fechaNacimiento', value)} />
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

              <View style={styles.photoSection}>
                {imagenes.length > 0 && (
                  <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.photoPreviewList}
                  >
                    {imagenes.map((image, index) => (
                      <View key={`${image.uri}-${index}`} style={styles.photoPreviewWrapper}>
                        <Image
                          source={{ uri: image.uri }}
                          resizeMode="cover"
                          style={styles.photoPreview}
                        />
                        <TouchableOpacity
                          style={styles.deleteButton}
                          onPress={() => eliminarImagen(index)}
                        >
                          <Text style={styles.deleteButtonText}>✕</Text>
                        </TouchableOpacity>
                      </View>
                    ))}
                  </ScrollView>
                )}

                {imagenes.length < MAX_IMAGENES && (
                  <TouchableOpacity style={styles.addPhotoButton} onPress={agregarImagen}>
                    <Text style={styles.addPhotoText}>
                      + Agregar foto ({imagenes.length}/{MAX_IMAGENES})
                    </Text>
                  </TouchableOpacity>
                )}
              </View>

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
      {alertError && (
        <FeedbackModal
          visible={true}
          type="error"
          title={alertError.title}
          message={alertError.message}
          onClose={() => setAlertError(null)}
        />
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
