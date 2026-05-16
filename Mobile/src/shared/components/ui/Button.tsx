import React from 'react';
import { Pressable, StyleSheet, ActivityIndicator, ViewStyle, View } from 'react-native';
import { Link, Href } from 'expo-router';
import { theme } from '../../../theme';
import { CustomText } from './CustomText';
import { SvgProps } from 'react-native-svg';

interface Props {
  title?: string;
  onPress?: () => void;
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle | ViewStyle[];
  icon?: React.FC<SvgProps>;
  iconPosition?: 'left' | 'right';
  iconSize?: number;
  textColor?: string;
  href?: Href;
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
  href,
}: Props) => {
  const iconElement = icon && (() => {
    const IconComponent = icon;
    return (
      <IconComponent
        width={iconSize}
        height={iconSize}
        style={[
          title && iconPosition === 'left' && { marginRight: 8 },
          title && iconPosition === 'right' && { marginLeft: 8 },
        ]}
      />
    );
  })();

  const buttonStyle = [
    styles.button,
    { backgroundColor: disabled ? theme.colors.gray300 : theme.colors.primaryDark },
    style,
  ];

  const renderContent = ({ pressed }: { pressed: boolean }) => (
    <View style={[buttonStyle, pressed && { opacity: 0.8 }]}>
      {loading ? (
        <ActivityIndicator color={theme.colors.white} />
      ) : (
        <View style={styles.content}>
          {iconPosition === 'left' && iconElement}
          {title && (
            <CustomText variant="p" style={[styles.text, textColor ? { color: textColor } : {}]}>
              {title}
            </CustomText>
          )}
          {iconPosition === 'right' && iconElement}
        </View>
      )}
    </View>
  );

  if (href) {
    return (
      <Link href={href} asChild>
        <Pressable
          disabled={loading || disabled}
          onPress={onPress}
        >
          {renderContent}
        </Pressable>
      </Link>
    );
  }

  return (
    <Pressable
      disabled={loading || disabled}
      onPress={onPress}
    >
      {renderContent}
    </Pressable>
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
});