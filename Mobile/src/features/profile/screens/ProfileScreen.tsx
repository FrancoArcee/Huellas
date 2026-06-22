import React, { useState, useCallback } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  Alert,
} from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { theme } from '../../../theme';
import { CustomText } from '../../../shared/components/ui/CustomText';
import { ConfirmModal } from '../../../shared/components/ui/ConfirmModal';
import { useAuthStore } from '../../../shared/store/authStore';
import { api } from '../../../shared/services/api';
import ProfileSvg from '../../../assets/icons/screens/profile.svg';
import PencilSvg from '../../../assets/icons/buttons/pencil.svg';
import LogoutSvg from '../../../assets/icons/buttons/logout.svg';
import WhatsAppSvg from '../../../assets/icons/socialNetwork/whatsapp.svg';
import TelegramSvg from '../../../assets/icons/socialNetwork/telegram.svg';
import InstagramSvg from '../../../assets/icons/socialNetwork/instagram.svg';
import DiscordSvg from '../../../assets/icons/socialNetwork/discord.svg';
import FacebookSvg from '../../../assets/icons/socialNetwork/facebook.svg';
import MessengerSvg from '../../../assets/icons/socialNetwork/messenger.svg';

const CONTACT_ICONS: Record<string, React.FC<any>> = {
  WhatsApp: WhatsAppSvg,
  Telegram: TelegramSvg,
  Instagram: InstagramSvg,
  Discord: DiscordSvg,
  Facebook: FacebookSvg,
  Messenger: MessengerSvg,
};

export const ProfileScreen = () => {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { user: authUser, logout: authLogout } = useAuthStore();

  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const fetchUserData = useCallback(async () => {
    if (!authUser?.id) return;
    try {
      setLoading(true);
      const res = await api.get(`/users/${authUser.id}`);
      setUserData(res.data.data);
    } catch (err) {
      console.error('Error fetching user profile:', err);
    } finally {
      setLoading(false);
    }
  }, [authUser?.id]);

  useFocusEffect(
    useCallback(() => {
      fetchUserData();
    }, [fetchUserData])
  );

  const handleLogout = async () => {
    setShowLogoutModal(false);
    try {
      await authLogout();
      router.replace('/(auth)/login');
    } catch (error) {
      console.error('Error during logout:', error);
      Alert.alert('Error', 'Ocurrió un error al cerrar sesión.');
    }
  };

  const handleDeleteAccount = async () => {
    setShowDeleteModal(false);
    if (!authUser?.id) return;
    try {
      setLoading(true);
      await api.delete(`/users/${authUser.id}`);
      await authLogout();
      router.replace('/(auth)/login');
    } catch (error) {
      console.error('Error deleting account:', error);
      Alert.alert('Error', 'No se pudo eliminar la cuenta. Inténtalo de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  if (loading && !userData) {
    return (
      <View style={[styles.screen, styles.center]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  const userDisplayName = userData?.name || authUser?.name || '';
  const ContactIcon = userData?.contactType ? CONTACT_ICONS[userData.contactType] : null;

  return (
    <View style={styles.screen}>
      {/* Header naranja con avatar */}
      <View style={[styles.header, { paddingTop: insets.top + theme.spacing['3xl'] }]}>
        <View style={styles.avatarContainer}>
          {userData?.profilePictureUrl ? (
            <Image
              source={{ uri: userData.profilePictureUrl }}
              style={styles.avatarImage}
            />
          ) : (
            <ProfileSvg width={78} height={78} color={theme.colors.primary} />
          )}
        </View>
        <CustomText variant="h3" style={styles.headerName}>
          {userDisplayName}
        </CustomText>
      </View>

      {/* Contenido */}
      <View
        style={[
          styles.content,
          styles.contentContainer,
          { paddingBottom: insets.bottom + 20 },
        ]}
      >
        {/* Card de datos */}
        <View style={styles.dataCard}>
          <View style={styles.dataField}>
            <CustomText variant="caption" style={styles.fieldLabel}>
              Nombre y apellido
            </CustomText>
            <CustomText variant="body" style={styles.fieldValue}>
              {userDisplayName}
            </CustomText>
            <View style={styles.separator} />
          </View>

          <View style={styles.dataField}>
            <CustomText variant="caption" style={styles.fieldLabel}>
              Correo electrónico
            </CustomText>
            <CustomText variant="body" style={styles.fieldValue}>
              {userData?.email || authUser?.email || ''}
            </CustomText>
            <View style={styles.separator} />
          </View>

          <View style={[styles.dataField, styles.dataFieldLast]}>
            <CustomText variant="caption" style={styles.fieldLabel}>
              Contacto ({userData?.contactType || ''})
            </CustomText>
            <View style={styles.whatsappRow}>
              {ContactIcon && <ContactIcon width={28} height={28} style={styles.whatsappIcon} />}
              <CustomText variant="body" style={styles.fieldValue}>
                {userData?.contact || ''}
              </CustomText>
            </View>
          </View>
        </View>

        {/* Botón Editar perfil */}
        <TouchableOpacity
          style={styles.editButton}
          activeOpacity={0.85}
          onPress={() => router.push('/edit-profile')}
        >
          <CustomText variant="p" style={styles.editButtonText}>
            Editar perfil
          </CustomText>
          <PencilSvg width={18} height={18} fill={theme.colors.white} style={styles.editIcon} />
        </TouchableOpacity>

        {/* Fila de botones secundarios */}
        <View style={styles.actionRow}>
          <TouchableOpacity
            style={styles.logoutButton}
            activeOpacity={0.85}
            onPress={() => setShowLogoutModal(true)}
          >
            <CustomText variant="p" style={styles.logoutButtonText}>
              Cerrar{'\n'}sesión
            </CustomText>
            <LogoutSvg width={18} height={18} fill={theme.colors.white} style={styles.actionIcon} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.deleteButton}
            activeOpacity={0.85}
            onPress={() => setShowDeleteModal(true)}
          >
            <CustomText variant="p" style={styles.deleteButtonText}>
              Eliminar{'\n'}cuenta
            </CustomText>
          </TouchableOpacity>
        </View>
      </View>

      {/* Modal de confirmación: Cerrar sesión */}
      <ConfirmModal
        visible={showLogoutModal}
        title="¿Estás seguro que deseas cerrar sesión?"
        message=""
        confirmText="Cerrar sesión"
        cancelText="Cancelar"
        onConfirm={handleLogout}
        onCancel={() => setShowLogoutModal(false)}
      />

      {/* Modal de confirmación: Eliminar cuenta */}
      <ConfirmModal
        visible={showDeleteModal}
        title="¿Estás seguro que deseas eliminar tu cuenta?"
        message=""
        confirmText="Eliminar"
        cancelText="Cancelar"
        onConfirm={handleDeleteAccount}
        onCancel={() => setShowDeleteModal(false)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    backgroundColor: theme.colors.primary,
    alignItems: 'center',
    paddingBottom: theme.spacing['3xl'],
  },
  avatarContainer: {
    width: 136,
    height: 136,
    borderRadius: 68,
    backgroundColor: theme.colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing.md,
  },
  headerName: {
    color: theme.colors.white,
    fontFamily: theme.typography.fontFamily.bold,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: theme.spacing['2xl'],
    paddingTop: theme.spacing['2xl'],
  },
  dataCard: {
    backgroundColor: theme.colors.white,
    borderRadius: 16,
    paddingHorizontal: theme.spacing['2xl'],
    paddingTop: theme.spacing.lg,
    paddingBottom: theme.spacing.sm,
    marginBottom: theme.spacing['2xl'],
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 8,
    elevation: 3,
  },
  dataField: {
    paddingVertical: theme.spacing.sm,
  },
  dataFieldLast: {
    paddingBottom: theme.spacing.md,
  },
  fieldLabel: {
    color: theme.colors.gray500,
    fontSize: 15,
    lineHeight: 20,
    marginBottom: theme.spacing.xs,
  },
  fieldValue: {
    color: theme.colors.textPrimary,
    fontFamily: theme.typography.fontFamily.regular,
    fontSize: 18,
    lineHeight: 24,
  },
  separator: {
    height: 1,
    backgroundColor: theme.colors.gray200,
    marginTop: theme.spacing.sm,
  },
  whatsappRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  whatsappIcon: {
    marginRight: theme.spacing.sm,
  },
  editButton: {
    backgroundColor: theme.colors.primary,
    borderRadius: 100,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing['2xl'],
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: theme.spacing.xl,
    marginBottom: theme.spacing.lg,
  },
  editButtonText: {
    color: theme.colors.white,
    fontFamily: theme.typography.fontFamily.semiBold,
  },
  editIcon: {
    marginLeft: theme.spacing.sm,
  },
  actionRow: {
    flexDirection: 'row',
    gap: theme.spacing.md,
  },
  logoutButton: {
    flex: 1,
    backgroundColor: '#2C2C2C',
    borderRadius: 100,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoutButtonText: {
    color: theme.colors.white,
    fontFamily: theme.typography.fontFamily.semiBold,
    textAlign: 'center',
    fontSize: 14,
  },
  actionIcon: {
    marginLeft: theme.spacing.lg,
  },
  deleteButton: {
    flex: 1,
    backgroundColor: '#CC2222',
    borderRadius: 100,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteButtonText: {
    color: theme.colors.white,
    fontFamily: theme.typography.fontFamily.semiBold,
    textAlign: 'center',
    fontSize: 14,
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarImage: {
    width: 136,
    height: 136,
    borderRadius: 68,
  },
});
