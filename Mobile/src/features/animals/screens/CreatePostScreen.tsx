import React, { useMemo, useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import { useRouter } from 'expo-router';
import Svg, { Path } from 'react-native-svg';
import { theme } from '../../../theme';
import { CustomText } from '../../../shared/components/ui/CustomText';

const TOTAL_STEPS = 3;
const ORANGE = '#FA9D24';
const STEP_GRAY = '#8F8F8F';
const FORM_HORIZONTAL_PADDING = 24;

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

  const cycleValue = (
    field: 'size' | 'gender' | 'castrated',
    values: string[],
  ) => {
    const currentIndex = values.indexOf(form[field]);
    const nextValue = values[(currentIndex + 1) % values.length] ?? values[0] ?? '';
    updateField(field, nextValue);
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
          <LabeledInput
            label="Fecha de nacimiento"
            placeholder="DD/MM/YYYY"
            value={form.birthDate}
            onChangeText={(value) => updateField('birthDate', value)}
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
            onPress={() => cycleValue('size', sizeOptions)}
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
            onPress={() => cycleValue('gender', genderOptions)}
          />
          <SelectField
            label="Castrado"
            required
            value={form.castrated}
            onPress={() => cycleValue('castrated', castratedOptions)}
          />
        </>
      );
    }

    return (
      <>
        <View style={styles.photoField}>
          <Label text="Fotos" required />
          <Pressable style={({ pressed }) => [styles.uploadBox, pressed && styles.pressed]}>
            <View style={styles.imageIcon}>
              <View style={styles.imageIconSun} />
              <View style={styles.imageIconMountain} />
            </View>
            <CustomText style={styles.uploadText}>Adjunta tus imágenes</CustomText>
            <CustomText style={styles.uploadMeta}>(Máximo 3 fotos)</CustomText>
            <CustomText style={styles.uploadMeta}>Peso máximo por foto 3mb</CustomText>
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
  }, [form, step]);

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

const SelectField = ({
  label,
  value,
  onPress,
  required = false,
}: {
  label: string;
  value: string;
  onPress: () => void;
  required?: boolean;
}) => (
  <View style={styles.field}>
    <Label text={label} required={required} />
    <Pressable onPress={onPress} style={({ pressed }) => [styles.select, pressed && styles.pressed]}>
      <CustomText style={[styles.selectText, !value && styles.selectPlaceholder]}>{value}</CustomText>
      <View style={styles.chevron} />
    </Pressable>
  </View>
);

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
  selectText: {
    color: theme.colors.black,
    fontFamily: theme.typography.fontFamily.regular,
    fontSize: 13,
    lineHeight: 18,
  },
  selectPlaceholder: {
    color: 'transparent',
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
