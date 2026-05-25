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
import { styles } from './EditAnimalScreen';
import { SafeAreaView } from 'react-native-safe-area-context';
import { usePublicacionesStore, Publicacion } from '../store/publicaciones';
import { StepIndicator } from '../components/StepIndicator';
import { useRouter } from 'expo-router';
import { validateStep, validateAll, sanitizeNumericInput } from '../utils/validateAnimalForm';
import { SuccessCheckIcon } from '../../../shared/components/ui/SuccessCheckIcon';

import ChevronDown from '../../../assets/icons/buttons/chevronDown.svg';
import SearchIcon from '../../../assets/icons/screens/search.svg';

type AnimalFormData = {
  nombre: string;
  fechaNacimiento: string;
  edad: string;
  tamano: string;
  ubicacion: string;
  peso: string;
  genero: string;
  castrado: string;
  descripcion?: string;
  imagen?: string;
};

export default function CreateAnimalScreen() {
  const router = useRouter();
  const agregarPublicacion = usePublicacionesStore((state) => state.agregarPublicacion);
  const [step, setStep] = useState(1);

  const [formData, setFormData] = useState<AnimalFormData>({
    nombre: '',
    fechaNacimiento: '',
    edad: '',
    tamano: '',
    ubicacion: '',
    peso: '',
    genero: '',
    castrado: '',
    descripcion: '',
    imagen: '',
  });
  const [openSelect, setOpenSelect] = useState<'tamano' | 'genero' | 'castrado' | null>(null);
  const [errors, setErrors] = useState<Record<string, string | null>>({});

  const tamanos = ['Chico', 'Mediano', 'Grande'];
  const generos = ['Macho', 'Hembra'];
  const castrados = ['Si', 'No'];

  const setError = (key: string, msg: string | null) => {
    setErrors((prev) => ({ ...prev, [key]: msg }));
  };

  const updateForm = (key: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
    setError(key, null);
  };

  const handleSiguiente = () => {
    if (step >= 3) return;
    const error = validateStep(formData, step);
    if (error) {
      Alert.alert('Error', error);
      return;
    }
    setStep(step + 1);
  };

  const handleSubmit = () => {
    const error = validateAll(formData);
    if (error) {
      Alert.alert('Error', error);
      return;
    }

    const payload: Omit<Publicacion, 'id'> = {
      nombre: formData.nombre,
      fechaNacimiento: formData.fechaNacimiento,
      edad: formData.edad,
      tamano: formData.tamano,
      ubicacion: formData.ubicacion,
      peso: formData.peso,
      genero: formData.genero,
      castrado: formData.castrado,
      descripcion: formData.descripcion ?? '',
      imagen: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1',
    };

    agregarPublicacion(payload);
    setStep(4);
  };

  const renderError = (key: string) => {
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
              <TouchableOpacity style={styles.imageUploadArea}>
                <Text style={styles.uploadIcon}>{String.fromCodePoint(0x1F4F8)}</Text>
                <Text style={styles.uploadTextBold}>Adjuntá tus imágenes</Text>
                <Text style={styles.uploadTextSmall}>(Máximo 3 fotos)</Text>
                <Text style={styles.uploadTextSmall}>Peso Máximo por foto 3mb</Text>
              </TouchableOpacity>

              <Text style={styles.label}>Descripción</Text>
              <TextInput
                style={styles.textArea}
                multiline
                numberOfLines={6}
                placeholder="Cuentanos sobre la mascota..."
                value={formData.descripcion}
                onChangeText={(t) => updateForm('descripcion', t)}
              />

              <TouchableOpacity style={styles.primaryButton} onPress={handleSubmit}>
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