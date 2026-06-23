import React from 'react';
import { TouchableWithoutFeedback, Keyboard, Platform, View, type ViewProps } from 'react-native';

export function DismissKeyboard({ children, ...props }: ViewProps) {
  if (Platform.OS === 'web') {
    return <View {...props}>{children}</View>;
  }
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View {...props}>{children}</View>
    </TouchableWithoutFeedback>
  );
}