import React from 'react';
import { TouchableOpacity, StyleSheet, ActivityIndicator, ViewStyle, Image, ImageSourcePropType, View } from 'react-native';
import { theme } from '../../../theme';
import { CustomText } from './CustomText';
import { SvgProps } from 'react-native-svg';

interface Props {
  title?: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
  icon?: React.FC<SvgProps>;  // ← cambió de ImageSourcePropType
  iconPosition?: 'left' | 'right';
  iconSize?: number;
  textColor?: string;
}

export const Button = ({ 
  title, 
  onPress, 
  loading, 
  disabled, 
  style,
  icon,
  iconPosition = 'left',
  iconSize = 20,
   textColor = "white",
}: Props) => {
const iconElement = icon && (() => {
  const IconComponent = icon;
  return (
    <IconComponent
      width={iconSize}
      height={iconSize}
      style={[
        title && iconPosition === 'left'  && { marginRight: 8 },
        title && iconPosition === 'right' && { marginLeft: 8 },
      ]}
    />
  );
})();

  return (
    <TouchableOpacity 
      style={[
        styles.button, 
        { backgroundColor: disabled ? theme.colors.gray300 : theme.colors.primary },
        style,
      ]}
      onPress={onPress}
      disabled={loading || disabled}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator color={theme.colors.white} />
      ) : (
        <View style={styles.content}>
          {iconPosition === 'left'  && iconElement}
          {title && (
            <CustomText variant="p"  style={[styles.text, textColor ? { color: textColor } : {}]}>
              {title}
            </CustomText>
          )}
          {iconPosition === 'right' && iconElement}
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    padding: theme.spacing.md, 
    borderRadius: 100, 
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontFamily: theme.typography.fontFamily.semiBold,
  },
  icon: {
    resizeMode: 'contain',
  },
});