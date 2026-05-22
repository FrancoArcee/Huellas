import React from 'react';
import {
  Modal,
  Pressable,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import Svg, { Path, Line } from 'react-native-svg';
import { theme } from '../../../theme';
import { CustomText } from './CustomText';
import WarningIcon from '../../../assets/icons/notification/warning.svg'
interface ConfirmModalProps {
  visible: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
}




export const ConfirmModal = ({
  visible,
  title,
  message,
  confirmText = 'Eliminar',
  cancelText = 'Cancelar',
  onConfirm,
  onCancel,
}: ConfirmModalProps) => {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onCancel}>
      <View style={styles.overlay}>
        <Pressable style={styles.backdrop} onPress={onCancel} />
        <View style={styles.dialog}>
          
          {/* Icono agregado del diseño nuevo */}
          <View style={styles.iconContainer}>
           <WarningIcon/>
          </View>

          <CustomText variant="h4" color="textPrimary" style={styles.title}>
            {title}
          </CustomText>
          
          {/* Si el mensaje viene vacío desde la implementación vieja, no ocupa espacio extra */}
          {!!message && (
            <CustomText variant="body" color="textSecondary" style={styles.message}>
              {message}
            </CustomText>
          )}

          <View style={styles.actions}>
            {/* Cancelar a la Izquierda (Gris) */}
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={onCancel}
              style={styles.cancelButton}
            >
              {/* Le puse color "white" para que coincida con el mockup */}
              <CustomText variant="p" color="white" style={styles.buttonText}>
                {cancelText}
              </CustomText>
            </TouchableOpacity>

            {/* Confirmar a la Derecha (Naranja) */}
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={onConfirm}
              style={styles.confirmButton}
            >
              <CustomText variant="p" color="white" style={styles.buttonText}>
                {confirmText}
              </CustomText>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

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
    borderRadius: 32, // Aumentado para que sea bien curvo como el mockup
    paddingVertical: 32, // Padding extra arriba y abajo para que respire
    paddingHorizontal: theme.spacing['2xl'],
    alignItems: 'center',
  },
  iconContainer: {
    marginBottom: 20,
  },
  title: {
    textAlign: 'center',
    marginBottom: theme.spacing.sm,
    lineHeight: 26, // Para que las dos líneas del título no queden muy pegadas
  },
  message: {
    textAlign: 'center',
    marginBottom: theme.spacing['2xl'],
  },
  actions: {
    flexDirection: 'row',
    gap: theme.spacing.xl,
    width: '100%',
    marginTop: 8, // Margen extra para separar del texto
  },
  cancelButton: {
    flex: 1,
    height: 48, // Un pelín más alto
    borderRadius: 24, // Forma de píldora
    backgroundColor: '#4a4a4a', // Gris oscuro del diseño
    alignItems: 'center',
    justifyContent: 'center',
  },
  confirmButton: {
    flex: 1,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#f39c12', // Naranja del diseño
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontFamily: theme.typography.fontFamily.semiBold,
    fontWeight: '700',
  },
});