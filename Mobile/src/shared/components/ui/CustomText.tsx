import React from 'react';
import { Text, TextProps, StyleSheet } from 'react-native';
import { theme } from '../../../theme';

interface Props extends TextProps {
  variant?: keyof typeof theme.typography.variants;
  color?: keyof typeof theme.colors;
}

export const CustomText = ({ 
  variant = 'body', 
  color = 'textPrimary', 
  style, 
  ...props 
}: Props) => {
  const variantStyle = theme.typography.variants[variant];

  return (
    <Text 
      style={[
        {
          fontFamily: variantStyle.fontFamily,
          fontSize: variantStyle.fontSize,
          lineHeight: variantStyle.lineHeight,
          color: theme.colors[color],
        },
        style
      ]} 
      {...props} 
    />
  );
};