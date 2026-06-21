import React, { useState } from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { theme } from '../../../theme';
import { CustomText } from './CustomText';
import { Eye, EyeOff } from 'lucide-react-native';

interface Props {
  label: string;
  placeholder: string;
  secureTextEntry?: boolean;
  value?: string;
  onChangeText?: (text: string) => void;
  error?: string | undefined;
  leftIcon?: React.ReactNode;
}

export const CustomInput = ({ 
  label, 
  placeholder, 
  secureTextEntry, 
  value, 
  onChangeText, 
  error,
  leftIcon 
}: Props) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const isSecure = secureTextEntry && !isPasswordVisible;

  return (
    <View style={styles.container}>
      <CustomText variant="h3" style={styles.label}>
        {label}
      </CustomText>
      <View style={[
        styles.inputWrapper,
        error ? { borderColor: theme.colors.danger, borderWidth: 1 } : {}
      ]}>
        {leftIcon && <View style={styles.leftIconContainer}>{leftIcon}</View>}
        <TextInput
          style={styles.input}
          placeholder={placeholder}
          placeholderTextColor={theme.colors.gray500}
          secureTextEntry={isSecure}
          value={value}
          onChangeText={onChangeText}
          autoCapitalize="none"
        />
        {secureTextEntry && (
          <TouchableOpacity 
            style={styles.rightIconContainer}
            onPress={() => setIsPasswordVisible(!isPasswordVisible)}
            activeOpacity={0.7}
          >
            {isPasswordVisible ? (
              <EyeOff size={20} color={theme.colors.gray500} />
            ) : (
              <Eye size={20} color={theme.colors.gray500} />
            )}
          </TouchableOpacity>
        )}
      </View>
      {error && (
        <CustomText variant="caption" color="danger" style={styles.errorText}>
          {error}
        </CustomText>
      )}
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
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.gray100,
    borderRadius: 100,
    borderWidth: 1,
    borderColor: theme.colors.gray200,
    paddingHorizontal: 16,
  },
  leftIconContainer: {
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    paddingVertical: 12,
    fontFamily: theme.typography.fontFamily.regular,
    fontSize: 16,
    color: theme.colors.textPrimary,
  },
  rightIconContainer: {
    padding: 4,
    marginLeft: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    marginTop: 4,
    paddingHorizontal: 16,
  },
});