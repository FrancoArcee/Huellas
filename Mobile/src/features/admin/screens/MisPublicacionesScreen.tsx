import React, { useRef, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  FlatList,
  StatusBar,
  Animated,
} from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';
import { usePublicacionesStore, Publicacion } from '../store/publicaciones';
import { useRouter } from 'expo-router';
import { ConfirmModal } from '../../../shared/components/ui/ConfirmModal';
import ChevronBack from '../../../assets/icons/buttons/chevronBack.svg';
import Plus from '../../../assets/icons/buttons/plus.svg';
import Trash from '../../../assets/icons/buttons/trash.svg';
import Location from '../../../assets/icons/location.svg';
import { colors } from '../../../theme/index';

export function MisPublicacionesScreen() {
  const publicaciones = usePublicacionesStore((state) => state.publicaciones);
  const eliminarPublicacion = usePublicacionesStore((state) => state.eliminarPublicacion);
  const router = useRouter();
  const swipeableRefs = useRef<Record<string, Swipeable | null>>({});
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);

  const handleEditar = (id: string) => {
    router.push('/(admin)/edit/' + id);
  };

  const handleAgregarNueva = () => {
    router.push('/(admin)/create');
  };

  const handleSwipeOpen = (id: string) => {
    setPendingDeleteId(id);
  };

  const handleConfirmDelete = () => {
    if (pendingDeleteId) {
      eliminarPublicacion(pendingDeleteId);
      setPendingDeleteId(null);
    }
  };

  const handleCancelDelete = () => {
    if (pendingDeleteId) {
      swipeableRefs.current[pendingDeleteId]?.close();
    }
    setPendingDeleteId(null);
  };

  const renderRightActions = (_progress: Animated.AnimatedInterpolation<number>, _dragX: Animated.AnimatedInterpolation<number>) => {
    return (
      <View style={styles.deleteAction}>
        <Trash width={28} height={28} color="#ffffff" />
      </View>
    );
  };

  const renderCardItem = ({ item }: { item: Publicacion }) => (
    <Swipeable
      ref={(ref) => { swipeableRefs.current[item.id] = ref; }}
      renderRightActions={renderRightActions}
      onSwipeableOpen={() => handleSwipeOpen(item.id)}
      overshootRight={false}
    >
      <View style={styles.card}>
        <View style={styles.cardInfo}>
          <View>
            <Text style={styles.dogName}>{item.nombre}</Text>
            <Text style={styles.dogDetails}>
              {item.tamano ? item.tamano + ' · ' : ''}{item.peso ? item.peso + ' kg · ' : ''}{item.edad}
            </Text>

            <View style={styles.locationContainer}>
              <Location width={14} height={14} color="#666666" style={styles.locationIcon} />
              <Text style={styles.locationText}>{item.ubicacion}</Text>
            </View>
          </View>

          <View style={styles.tagContainer}>
            <View style={styles.tag}>
              <Text style={styles.tagText}>{item.genero}</Text>
            </View>
            <View style={styles.tag}>
              <Text style={styles.tagText}>{item.castrado}</Text>
            </View>
          </View>

          <TouchableOpacity
            style={styles.btnEditar}
            onPress={() => handleEditar(item.id)}
            activeOpacity={0.8}
          >
            <Text style={styles.btnEditarText}>Editar</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.imageContainer}>
          <Image source={{ uri: item.imagen || 'https://via.placeholder.com/150' }} style={styles.dogImage} />
        </View>
      </View>
    </Swipeable>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <StatusBar barStyle="dark-content" backgroundColor="#f3f3f3" />

      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()} activeOpacity={0.7}>
          <ChevronBack width={20} height={20} color={colors.white} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Mis Publicaciones</Text>
      </View>

      <FlatList
        data={publicaciones}
        keyExtractor={(item) => item.id}
        renderItem={renderCardItem}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />

      <TouchableOpacity
        style={styles.fab}
        onPress={handleAgregarNueva}
        activeOpacity={0.8}
      >
        <Plus width={32} height={32} color={colors.white} />
      </TouchableOpacity>

      <ConfirmModal
        visible={pendingDeleteId !== null}
        title="Eliminar publicación"
        message="¿Estás seguro de que querés eliminar esta publicación?"
        confirmText="Eliminar"
        cancelText="Cancelar"
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 16,
    marginBottom: 8,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },

  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.textPrimary,
    letterSpacing: -0.5,
  },
  listContent: {
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: 100,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    borderRadius: 24,
    overflow: 'hidden',
    marginBottom: 16,
    height: 185,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 3,
  },
  cardInfo: {
    flex: 1,
    padding: 16,
    justifyContent: 'space-between',
  },
  dogName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000000',
  },
  dogDetails: {
    fontSize: 12,
    color: colors.gray500,
    marginTop: 2,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  locationIcon: {
    marginRight: 4,
  },
  locationText: {
    fontSize: 12,
    color: colors.gray500,
  },
  tagContainer: {
    flexDirection: 'row',
    gap: 6,
    marginTop: 4,
  },
  tag: {
    backgroundColor: colors.secondaryLight,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  tagText: {
    fontSize: 11,
    color: colors.secondary,
    fontWeight: '600',
  },
  deleteAction: {
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    borderTopRightRadius: 24,
    borderBottomRightRadius: 24,
    marginBottom: 16,
    height: 185,
    width: 80,
  },
  btnEditar: {
    backgroundColor: colors.primary,
    borderRadius: 14,
    paddingVertical: 8,
    alignItems: 'center',
    width: '75%',
  },
  btnEditarText: {
    color: '#ffffff',
    fontWeight: '700',
    fontSize: 13,
  },
  imageContainer: {
    width: '45%',
    height: '100%',
  },
  dogImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    backgroundColor: colors.primary,
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },

});

