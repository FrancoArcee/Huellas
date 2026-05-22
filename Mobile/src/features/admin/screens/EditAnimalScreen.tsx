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
import { SafeAreaView } from 'react-native-safe-area-context';
import { usePublicacionesStore } from '../store/publicaciones';
import { StepIndicator } from '../components/StepIndicator';
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

export default function EditAnimalScreen({ route, navigation }: any) {
  const { id } = route.params; // ID de la publicación a editar
  const { publicaciones, editarPublicacion } = usePublicacionesStore();
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

  const tamanos = ['Chico', 'Mediano', 'Grande'];
  const generos = ['Macho', 'Hembra'];
  const castrados = ['Si', 'No'];

  // Cargar datos al montar la pantalla
  useEffect(() => {
    const pub = publicaciones.find(p => p.id === id);
    if (pub) {
      setFormData(pub);
    } else {
      Alert.alert('Error', 'Publicación no encontrada');
      navigation.goBack();
    }
  }, [id, publicaciones]);

  const updateForm = (key: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const validateStep = (s: number) => {
    if (s === 1) {
      const { nombre, fechaNacimiento, edad, tamano } = formData;
      if (!nombre.trim() || !fechaNacimiento.trim() || !edad.trim() || !tamano.trim()) {
        Alert.alert('Error', 'Completá todos los campos requeridos del paso 1.');
        return false;
      }
    }
    if (s === 2) {
      const { ubicacion, peso, genero, castrado } = formData;
      if (!ubicacion.trim() || !peso.trim() || !genero.trim() || !castrado.trim()) {
        Alert.alert('Error', 'Completá todos los campos requeridos del paso 2.');
        return false;
      }
    }
    return true;
  };

  const handleSiguiente = () => {
    if (step < 3 && validateStep(step)) setStep(step + 1);
  };

  const handleSubmit = () => {
    // Antes de guardar, validar pasos previos
    if (!validateStep(1) || !validateStep(2)) return;

    editarPublicacion(id, formData);
    Alert.alert('¡Éxito!', 'La publicación fue actualizada correctamente.');
    navigation.goBack(); // Volver a "Mis Publicaciones"
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

            <Text style={styles.label}>Fecha de nacimiento</Text>
            <TextInput style={styles.input} value={formData.fechaNacimiento} onChangeText={(t) => updateForm('fechaNacimiento', t)} />

            <Text style={styles.label}>Edad <Text style={styles.asterisk}>*</Text></Text>
            <TextInput style={styles.input} value={formData.edad} onChangeText={(t) => updateForm('edad', t)} />

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
            
            <TouchableOpacity style={styles.primaryButton} onPress={handleSiguiente}>
              <Text style={styles.primaryButtonText}>Continuar</Text>
            </TouchableOpacity>
          </View>
        )}

        {step === 2 && (
          <View style={styles.formContainer}>
            <Text style={styles.label}>Ubicación <Text style={styles.asterisk}>*</Text></Text>
            <View style={styles.inputWithIcon}>
              <TextInput style={styles.inputFlex} value={formData.ubicacion} onChangeText={(t) => updateForm('ubicacion', t)} />
              <SearchIcon width={20} height={20} color="#555" />
            </View>

            <Text style={styles.label}>Peso de la mascota <Text style={styles.asterisk}>*</Text></Text>
            <TextInput style={styles.input} keyboardType="numeric" value={formData.peso} onChangeText={(t) => updateForm('peso', t)} />

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

            <TouchableOpacity style={styles.primaryButton} onPress={handleSiguiente}>
              <Text style={styles.primaryButtonText}>Continuar</Text>
            </TouchableOpacity>
          </View>
        )}

        {step === 3 && (
          <View style={styles.formContainer}>
            <Text style={styles.label}>Fotos</Text>
            <TouchableOpacity style={styles.imageUploadArea}>
              <Text style={styles.uploadIcon}>📸</Text>
              <Text style={styles.uploadTextBold}>Modificar imágenes</Text>
            </TouchableOpacity>

            <Text style={styles.label}>Descripción</Text>
            <TextInput 
              style={styles.textArea} 
              multiline 
              numberOfLines={6} 
              value={formData.descripcion} 
              onChangeText={(t) => updateForm('descripcion', t)} 
            />

            <TouchableOpacity style={styles.primaryButton} onPress={handleSubmit}>
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