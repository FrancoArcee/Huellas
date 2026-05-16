import React from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import { theme } from '../../../theme';
import { CustomText } from './CustomText';

interface Props {
  label: string;
  placeholder: string;
  secureTextEntry?: boolean;
  value?: string;
  onChangeText?: (text: string) => void;
}

export const CustomInput = ({ label, placeholder, secureTextEntry, value, onChangeText }: Props) => {
  return (
    <View style={styles.container}>
      <CustomText variant="h3" style={styles.label}>
        {label}
      </CustomText>
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        placeholderTextColor={theme.colors.gray500}
        secureTextEntry={secureTextEntry}
        value={value}
        onChangeText={onChangeText}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: theme.spacing.md,
    width: '100%'
  },
  label: {
    marginBottom: 8,
    fontFamily: theme.typography.fontFamily.bold
  },
  input: {
    backgroundColor: theme.colors.gray100,
    borderRadius: 100,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: theme.colors.gray200,
    fontFamily: theme.typography.fontFamily.regular,
    fontSize: 16,
    color: theme.colors.textPrimary,
  },
});