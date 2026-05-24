import React, { useMemo, useState } from 'react';
import {
  Alert,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import Svg, { Path } from 'react-native-svg';
import { theme } from '../../../theme';
import { CustomText } from '../../../shared/components/ui/CustomText';

const TOTAL_STEPS = 3;
const ORANGE = '#FA9D24';
const STEP_GRAY = '#8F8F8F';
const FORM_HORIZONTAL_PADDING = 24;
const dayOptions = Array.from({ length: 31 }, (_, index) => String(index + 1).padStart(2, '0'));
const monthOptions = Array.from({ length: 12 }, (_, index) => String(index + 1).padStart(2, '0'));
const currentYear = new Date().getFullYear();
const yearOptions = Array.from({ length: 40 }, (_, index) => String(currentYear - index));

const sizeOptions = ['Pequeño', 'Mediano', 'Grande'];
const genderOptions = ['Hembra', 'Macho'];
const castratedOptions = ['Sí', 'No'];

interface Props {
  topInset?: number;
  bottomInset?: number;
}

export const CreatePostScreen = ({ topInset = 0, bottomInset = 0 }: Props) => {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [created, setCreated] = useState(false);
  const [photoCount, setPhotoCount] = useState(0);
  const [form, setForm] = useState({
    name: '',
    birthDate: '',
    age: '',
    size: '',
    location: '',
    weight: '',
    gender: '',
    castrated: '',
    description: '',
  });

  const buttonTitle = step === TOTAL_STEPS ? 'Crear publicación' : 'Continuar';

  const handlePrimaryAction = () => {
    if (step === TOTAL_STEPS) {
      setCreated(true);
      return;
    }

    setStep((current) => Math.min(current + 1, TOTAL_STEPS));
  };

  const updateField = (field: keyof typeof form, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
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

    if (!result.canceled) {
      setPhotoCount(Math.min(result.assets.length, 3));
    }
  };

  const content = useMemo(() => {
    if (step === 1) {
      return (
        <>
          <LabeledInput
            label="Nombre de la mascota"
            required
            placeholder="Nombre"
            value={form.name}
            onChangeText={(value) => updateField('name', value)}
          />
          <DateField
            label="Fecha de nacimiento"
            value={form.birthDate}
            onChange={(value) => updateField('birthDate', value)}
          />
          <LabeledInput
            label="Edad"
            required
            placeholder="Edad (puede ser aproximada)"
            value={form.age}
            onChangeText={(value) => updateField('age', value)}
          />
          <SelectField
            label="Tamaño"
            required
            value={form.size}
            options={sizeOptions}
            onChange={(value) => updateField('size', value)}
          />
        </>
      );
    }

    if (step === 2) {
      return (
        <>
          <LabeledInput
            label="Ubicación"
            required
            placeholder="Nombre"
            value={form.location}
            onChangeText={(value) => updateField('location', value)}
            trailing="search"
          />
          <LabeledInput
            label="Peso de la mascota"
            required
            placeholder="Peso en kg"
            value={form.weight}
            onChangeText={(value) => updateField('weight', value)}
            keyboardType="numeric"
          />
          <SelectField
            label="Género"
            required
            value={form.gender}
            options={genderOptions}
            onChange={(value) => updateField('gender', value)}
          />
          <SelectField
            label="Castrado"
            required
            value={form.castrated}
            options={castratedOptions}
            onChange={(value) => updateField('castrated', value)}
          />
        </>
      );
    }

    return (
      <>
        <View style={styles.photoField}>
          <Label text="Fotos" required />
          <Pressable
            accessibilityRole="button"
            onPress={handlePickImages}
            style={({ pressed }) => [styles.uploadBox, pressed && styles.pressed]}
          >
            <View style={styles.imageIcon}>
              <View style={styles.imageIconSun} />
              <View style={styles.imageIconMountain} />
            </View>
            <CustomText style={styles.uploadText}>Adjunta tus imágenes</CustomText>
            <CustomText style={styles.uploadMeta}>(Máximo 3 fotos)</CustomText>
            <CustomText style={styles.uploadMeta}>Peso máximo por foto 3mb</CustomText>
            {photoCount > 0 && (
              <CustomText style={styles.uploadSelected}>{photoCount} foto(s) seleccionada(s)</CustomText>
            )}
          </Pressable>
        </View>

        <View style={styles.descriptionField}>
          <Label text="Descripción" required />
          <TextInput
            multiline
            textAlignVertical="top"
            value={form.description}
            onChangeText={(value) => updateField('description', value)}
            style={[styles.input, styles.textarea]}
          />
        </View>
      </>
    );
  }, [form, photoCount, step]);

  if (created) {
    return (
      <View style={styles.successScreen}>
        <View style={styles.successContent}>
          <View style={styles.successIcon}>
            <Svg width={132} height={108} viewBox="0 0 132 108">
              <Path
                d="M14 58L50 94L118 22"
                fill="none"
                stroke={theme.colors.background}
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={18}
              />
            </Svg>
          </View>

          <CustomText style={styles.successTitle}>Tu publicación se creó con éxito!</CustomText>
          <CustomText style={styles.successSubtitle}>Gracias por dejar tu huella</CustomText>
        </View>

        <Pressable
          accessibilityRole="button"
          onPress={() => router.replace('/explore')}
          style={({ pressed }) => [
            styles.successButton,
            { marginBottom: bottomInset + 48 },
            pressed && styles.pressed,
          ]}
        >
          <CustomText style={styles.successButtonText}>Ver mis publicaciones</CustomText>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <ScrollView
        style={styles.scroll}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.content,
          {
            paddingTop: Math.max(topInset + 34, 54),
            paddingBottom: bottomInset + 56,
          },
        ]}
      >
        <StepIndicator currentStep={step} />

        <CustomText style={[styles.title, step === TOTAL_STEPS && styles.titleStepThree]}>
          Crear publicación
        </CustomText>

        <View style={styles.form}>
          {content}

          <Pressable
            accessibilityRole="button"
            onPress={handlePrimaryAction}
            style={({ pressed }) => [
              styles.primaryButton,
              step !== TOTAL_STEPS && styles.primaryButtonContinue,
              pressed && styles.pressed,
            ]}
          >
            <CustomText style={styles.primaryButtonText}>{buttonTitle}</CustomText>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
};

const StepIndicator = ({ currentStep }: { currentStep: number }) => (
  <View style={styles.steps}>
    {[1, 2, 3].map((item, index) => {
      const isActive = item <= currentStep;
      return (
        <React.Fragment key={item}>
          <View style={[styles.stepCircle, isActive ? styles.stepActive : styles.stepInactive]}>
            <CustomText style={styles.stepText}>{item}</CustomText>
          </View>
          {index < 2 && (
            <View style={[styles.stepLine, item < currentStep ? styles.lineActive : styles.lineInactive]} />
          )}
        </React.Fragment>
      );
    })}
  </View>
);

const Label = ({ text, required = false }: { text: string; required?: boolean }) => (
  <CustomText style={styles.label}>
    {text}
    {required ? <CustomText style={styles.required}> *</CustomText> : null}
  </CustomText>
);

interface InputProps {
  label: string;
  placeholder: string;
  value: string;
  onChangeText: (value: string) => void;
  required?: boolean;
  trailing?: 'search';
  keyboardType?: 'default' | 'numeric';
}

const LabeledInput = ({
  label,
  placeholder,
  value,
  onChangeText,
  required = false,
  trailing,
  keyboardType = 'default',
}: InputProps) => (
  <View style={styles.field}>
    <Label text={label} required={required} />
    <View style={styles.inputWrap}>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#262323"
        keyboardType={keyboardType}
        style={[styles.input, trailing ? styles.inputWithIcon : null]}
      />
      {trailing === 'search' && (
        <View style={styles.searchIcon}>
          <View style={styles.searchCircle} />
          <View style={styles.searchHandle} />
        </View>
      )}
    </View>
  </View>
);

const DateField = ({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) => {
  const [open, setOpen] = useState(false);
  const [day, setDay] = useState(value.split('/')[0] || '01');
  const [month, setMonth] = useState(value.split('/')[1] || '01');
  const [year, setYear] = useState(value.split('/')[2] || String(currentYear));

  const confirmDate = () => {
    onChange(`${day}/${month}/${year}`);
    setOpen(false);
  };

  return (
    <View style={styles.field}>
      <Label text={label} />
      <Pressable
        accessibilityRole="button"
        onPress={() => setOpen(true)}
        style={({ pressed }) => [styles.select, pressed && styles.pressed]}
      >
        <CustomText style={[styles.selectText, !value && styles.selectPlaceholder]}>
          {value || 'Seleccionar fecha'}
        </CustomText>
        <View style={styles.calendarIcon}>
          <View style={styles.calendarBinding} />
          <View style={styles.calendarLine} />
        </View>
      </Pressable>

      <Modal transparent visible={open} animationType="fade" onRequestClose={() => setOpen(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.dateModal}>
            <CustomText style={styles.modalTitle}>Fecha de nacimiento</CustomText>
            <View style={styles.dateColumns}>
              <DateColumn title="Día" value={day} options={dayOptions} onChange={setDay} />
              <DateColumn title="Mes" value={month} options={monthOptions} onChange={setMonth} />
              <DateColumn title="Año" value={year} options={yearOptions} onChange={setYear} />
            </View>
            <View style={styles.modalActions}>
              <Pressable onPress={() => setOpen(false)} style={styles.modalSecondaryButton}>
                <CustomText style={styles.modalSecondaryText}>Cancelar</CustomText>
              </Pressable>
              <Pressable onPress={confirmDate} style={styles.modalPrimaryButton}>
                <CustomText style={styles.modalPrimaryText}>Aceptar</CustomText>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const DateColumn = ({
  title,
  value,
  options,
  onChange,
}: {
  title: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
}) => (
  <View style={styles.dateColumn}>
    <CustomText style={styles.dateColumnTitle}>{title}</CustomText>
    <ScrollView style={styles.dateOptions} showsVerticalScrollIndicator={false}>
      {options.map((option) => (
        <Pressable
          key={option}
          onPress={() => onChange(option)}
          style={[styles.dateOption, value === option && styles.dateOptionSelected]}
        >
          <CustomText style={[styles.dateOptionText, value === option && styles.dateOptionTextSelected]}>
            {option}
          </CustomText>
        </Pressable>
      ))}
    </ScrollView>
  </View>
);

const SelectField = ({
  label,
  value,
  options,
  onChange,
  required = false,
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
  required?: boolean;
}) => {
  const [open, setOpen] = useState(false);

  return (
    <View style={styles.field}>
      <Label text={label} required={required} />
      <Pressable
        accessibilityRole="button"
        onPress={() => setOpen((current) => !current)}
        style={({ pressed }) => [styles.select, open && styles.selectOpen, pressed && styles.pressed]}
      >
        <CustomText style={[styles.selectText, !value && styles.selectPlaceholder]}>
          {value || 'Seleccionar'}
        </CustomText>
        <View style={[styles.chevron, open && styles.chevronOpen]} />
      </Pressable>
      {open && (
        <View style={styles.dropdown}>
          {options.map((option) => (
            <Pressable
              key={option}
              onPress={() => {
                onChange(option);
                setOpen(false);
              }}
              style={({ pressed }) => [
                styles.dropdownOption,
                value === option && styles.dropdownOptionSelected,
                pressed && styles.pressed,
              ]}
            >
              <CustomText
                style={[styles.dropdownOptionText, value === option && styles.dropdownOptionTextSelected]}
              >
                {option}
              </CustomText>
            </Pressable>
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scroll: {
    flex: 1,
    width: '100%',
  },
  successScreen: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: theme.colors.background,
    paddingHorizontal: 22,
  },
  successContent: {
    flex: 1,
    width: '100%',
    maxWidth: 390,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 80,
  },
  successIcon: {
    width: 230,
    height: 230,
    borderRadius: 115,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: ORANGE,
    marginBottom: 22,
  },
  successTitle: {
    color: theme.colors.black,
    fontFamily: theme.typography.fontFamily.bold,
    fontSize: 19,
    lineHeight: 26,
    textAlign: 'center',
    marginTop: 2,
  },
  successSubtitle: {
    color: '#4E4A4A',
    fontFamily: theme.typography.fontFamily.semiBold,
    fontSize: 13,
    lineHeight: 20,
    textAlign: 'center',
    marginTop: 8,
  },
  successButton: {
    width: '100%',
    maxWidth: 313,
    height: 50,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: ORANGE,
  },
  successButtonText: {
    color: theme.colors.white,
    fontFamily: theme.typography.fontFamily.bold,
    fontSize: 20,
    lineHeight: 26,
  },
  content: {
    width: '100%',
    paddingHorizontal: FORM_HORIZONTAL_PADDING,
  },
  steps: {
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 42,
  },
  stepCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  stepActive: {
    backgroundColor: ORANGE,
  },
  stepInactive: {
    backgroundColor: STEP_GRAY,
  },
  stepText: {
    color: theme.colors.white,
    fontFamily: theme.typography.fontFamily.bold,
    fontSize: 18,
    lineHeight: 24,
  },
  stepLine: {
    width: 70,
    height: 4,
    marginHorizontal: -1,
  },
  lineActive: {
    backgroundColor: ORANGE,
  },
  lineInactive: {
    backgroundColor: STEP_GRAY,
  },
  title: {
    alignSelf: 'center',
    color: theme.colors.black,
    fontFamily: theme.typography.fontFamily.bold,
    fontSize: 28,
    lineHeight: 34,
    marginBottom: 50,
  },
  titleStepThree: {
    marginBottom: 58,
  },
  form: {
    width: '100%',
  },
  field: {
    marginBottom: 22,
  },
  photoField: {
    marginBottom: 29,
  },
  descriptionField: {
    marginBottom: 18,
  },
  label: {
    color: theme.colors.black,
    fontFamily: theme.typography.fontFamily.bold,
    fontSize: 20,
    lineHeight: 27,
    marginBottom: 3,
  },
  required: {
    color: ORANGE,
    fontFamily: theme.typography.fontFamily.bold,
  },
  inputWrap: {
    position: 'relative',
  },
  input: {
    height: 40,
    borderWidth: 1,
    borderColor: theme.colors.black,
    borderRadius: 22,
    paddingHorizontal: 16,
    color: theme.colors.black,
    fontFamily: theme.typography.fontFamily.regular,
    fontSize: 13,
    lineHeight: 18,
    backgroundColor: 'transparent',
  },
  inputWithIcon: {
    paddingRight: 46,
  },
  searchIcon: {
    position: 'absolute',
    right: 18,
    top: 10,
    width: 21,
    height: 21,
  },
  searchCircle: {
    width: 15,
    height: 15,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: theme.colors.black,
  },
  searchHandle: {
    position: 'absolute',
    width: 9,
    height: 2,
    borderRadius: 1,
    backgroundColor: theme.colors.black,
    right: 0,
    bottom: 3,
    transform: [{ rotate: '45deg' }],
  },
  select: {
    height: 40,
    borderWidth: 1,
    borderColor: theme.colors.black,
    borderRadius: 22,
    paddingLeft: 16,
    paddingRight: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  selectOpen: {
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
  },
  selectText: {
    color: theme.colors.black,
    fontFamily: theme.typography.fontFamily.regular,
    fontSize: 13,
    lineHeight: 18,
  },
  selectPlaceholder: {
    color: '#6F6B6B',
  },
  chevron: {
    width: 13,
    height: 13,
    borderRightWidth: 2.5,
    borderBottomWidth: 2.5,
    borderColor: theme.colors.black,
    transform: [{ rotate: '45deg' }],
    marginTop: -6,
  },
  chevronOpen: {
    transform: [{ rotate: '225deg' }],
    marginTop: 6,
  },
  dropdown: {
    borderWidth: 1,
    borderTopWidth: 0,
    borderColor: theme.colors.black,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
    overflow: 'hidden',
    backgroundColor: theme.colors.background,
  },
  dropdownOption: {
    minHeight: 38,
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  dropdownOptionSelected: {
    backgroundColor: '#FFE5C1',
  },
  dropdownOptionText: {
    color: theme.colors.black,
    fontFamily: theme.typography.fontFamily.regular,
    fontSize: 13,
    lineHeight: 18,
  },
  dropdownOptionTextSelected: {
    fontFamily: theme.typography.fontFamily.bold,
  },
  calendarIcon: {
    width: 19,
    height: 19,
    borderWidth: 2,
    borderColor: theme.colors.black,
    borderRadius: 4,
  },
  calendarBinding: {
    position: 'absolute',
    top: -4,
    left: 3,
    right: 3,
    height: 6,
    borderLeftWidth: 2,
    borderRightWidth: 2,
    borderColor: theme.colors.black,
  },
  calendarLine: {
    position: 'absolute',
    top: 5,
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: theme.colors.black,
  },
  modalOverlay: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    backgroundColor: 'rgba(0, 0, 0, 0.35)',
  },
  dateModal: {
    width: '100%',
    maxWidth: 360,
    borderRadius: 18,
    padding: 18,
    backgroundColor: theme.colors.background,
  },
  modalTitle: {
    color: theme.colors.black,
    fontFamily: theme.typography.fontFamily.bold,
    fontSize: 18,
    lineHeight: 24,
    textAlign: 'center',
    marginBottom: 16,
  },
  dateColumns: {
    flexDirection: 'row',
    gap: 10,
  },
  dateColumn: {
    flex: 1,
  },
  dateColumnTitle: {
    color: theme.colors.black,
    fontFamily: theme.typography.fontFamily.bold,
    fontSize: 13,
    lineHeight: 18,
    textAlign: 'center',
    marginBottom: 8,
  },
  dateOptions: {
    height: 168,
    borderWidth: 1,
    borderColor: theme.colors.black,
    borderRadius: 14,
  },
  dateOption: {
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dateOptionSelected: {
    backgroundColor: '#FFE5C1',
  },
  dateOptionText: {
    color: theme.colors.black,
    fontFamily: theme.typography.fontFamily.regular,
    fontSize: 13,
    lineHeight: 18,
  },
  dateOptionTextSelected: {
    fontFamily: theme.typography.fontFamily.bold,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
    marginTop: 18,
  },
  modalSecondaryButton: {
    height: 40,
    justifyContent: 'center',
    paddingHorizontal: 12,
  },
  modalPrimaryButton: {
    height: 40,
    borderRadius: 22,
    justifyContent: 'center',
    paddingHorizontal: 20,
    backgroundColor: ORANGE,
  },
  modalSecondaryText: {
    color: theme.colors.black,
    fontFamily: theme.typography.fontFamily.bold,
    fontSize: 14,
    lineHeight: 18,
  },
  modalPrimaryText: {
    color: theme.colors.white,
    fontFamily: theme.typography.fontFamily.bold,
    fontSize: 14,
    lineHeight: 18,
  },
  uploadBox: {
    height: 159,
    borderWidth: 1,
    borderColor: theme.colors.black,
    borderStyle: 'dotted',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageIcon: {
    width: 42,
    height: 32,
    borderWidth: 4,
    borderColor: theme.colors.black,
    borderRadius: 3,
    marginBottom: 16,
    overflow: 'hidden',
  },
  imageIconSun: {
    position: 'absolute',
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: theme.colors.black,
    left: 6,
    top: 5,
  },
  imageIconMountain: {
    position: 'absolute',
    left: 5,
    bottom: -2,
    width: 30,
    height: 20,
    backgroundColor: theme.colors.black,
    transform: [{ rotate: '135deg' }],
  },
  uploadText: {
    color: theme.colors.black,
    fontFamily: theme.typography.fontFamily.regular,
    fontSize: 10,
    lineHeight: 14,
  },
  uploadMeta: {
    color: theme.colors.black,
    fontFamily: theme.typography.fontFamily.regular,
    fontSize: 9,
    lineHeight: 13,
  },
  uploadSelected: {
    color: ORANGE,
    fontFamily: theme.typography.fontFamily.bold,
    fontSize: 10,
    lineHeight: 14,
    marginTop: 6,
  },
  textarea: {
    height: 122,
    borderRadius: 22,
    paddingTop: 12,
  },
  primaryButton: {
    width: '100%',
    height: 50,
    borderRadius: 26,
    backgroundColor: ORANGE,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 22,
  },
  primaryButtonContinue: {
    marginTop: 50,
  },
  primaryButtonText: {
    color: theme.colors.white,
    fontFamily: theme.typography.fontFamily.bold,
    fontSize: 20,
    lineHeight: 26,
  },
  pressed: {
    opacity: 0.82,
    transform: [{ scale: 0.99 }],
  },
});
