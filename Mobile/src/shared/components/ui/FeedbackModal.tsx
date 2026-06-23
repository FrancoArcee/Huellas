import React from 'react';
import {
  Modal,
  Pressable,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { AlertCircle } from 'lucide-react-native';
import { theme } from '../../../theme';
import { CustomText } from './CustomText';
import { SuccessCheckIcon } from './SuccessCheckIcon';
import WarningIcon from '../../../assets/icons/notification/warning.svg';

type FeedbackType = 'error' | 'success' | 'info';

interface FeedbackModalProps {
  visible: boolean;
  type?: FeedbackType;
  title: string;
  message?: string | null | undefined;
  confirmText?: string;
  onConfirm?: () => void;
  onClose?: () => void;
}

const typeColors: Record<FeedbackType, string> = {
  error: theme.colors.danger,
  success: '#27ae60',
  info: theme.colors.primary,
};

export const FeedbackModal = ({
  visible,
  type = 'info',
  title,
  message,
  confirmText,
  onConfirm,
  onClose,
}: FeedbackModalProps) => {
  const handleConfirm = onConfirm ?? onClose ?? (() => {});
  const color = typeColors[type];

  const renderIcon = () => {
    switch (type) {
      case 'error':
        return <WarningIcon width={48} height={48} />;
      case 'success':
        return <SuccessCheckIcon size={80} />;
      case 'info':
      default:
        return <AlertCircle size={48} color={color} />;
    }
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={handleConfirm}>
      <View style={styles.overlay}>
        <Pressable style={styles.backdrop} onPress={handleConfirm} />
        <View style={styles.dialog}>
          <View style={styles.iconContainer}>
            {renderIcon()}
          </View>

          <CustomText variant="h4" color="textPrimary" style={styles.title}>
            {title}
          </CustomText>

          {!!message && (
            <CustomText variant="body" color="textSecondary" style={styles.message}>
              {message}
            </CustomText>
          )}

          <View style={styles.actions}>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={handleConfirm}
              style={[styles.confirmButton, { backgroundColor: color }]}
            >
              <CustomText variant="p" color="white" style={styles.buttonText}>
                {confirmText ?? 'Aceptar'}
              </CustomText>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

// Alias for backwards compatibility
export const AlertModal = FeedbackModal;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: theme.spacing['3xl'],
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: theme.colors.black,
    opacity: 0.55,
  },
  dialog: {
    width: '100%',
    backgroundColor: theme.colors.white,
    borderRadius: 32,
    paddingVertical: 32,
    paddingHorizontal: theme.spacing['2xl'],
    alignItems: 'center',
  },
  iconContainer: {
    marginBottom: 20,
  },
  title: {
    textAlign: 'center',
    marginBottom: theme.spacing.sm,
    lineHeight: 26,
  },
  message: {
    textAlign: 'center',
    marginBottom: theme.spacing['2xl'],
  },
  actions: {
    width: '100%',
    marginTop: 8,
  },
  confirmButton: {
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontFamily: theme.typography.fontFamily.semiBold,
    fontWeight: '700',
  },
});
