import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  FlatList,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { usePublicacionesStore, Publicacion } from '../store/publicaciones';
import { useNavigation } from '@react-navigation/native';

// Importando los SVGs directamente
import ChevronBack from '../../../assets/icons/buttons/chevronBack.svg';
import Plus from '../../../assets/icons/buttons/plus.svg';
import Home from '../../../assets/icons/screens/home.svg';
import Search from '../../../assets/icons/screens/search.svg';
import Explore from '../../../assets/icons/screens/explore.svg';
import Like from '../../../assets/icons/screens/like.svg';
import Location from '../../../assets/icons/location.svg';

export function MisPublicacionesScreen() {
  const publicaciones = usePublicacionesStore((state) => state.publicaciones);
  const navigation = useNavigation<any>();

  const handleVolver = () => {
    navigation.goBack();
  };

  const handleEditar = (id: string) => {
    navigation.navigate('EditAnimal', { id }); 
  };

 const handleAgregarNueva = () => {
    navigation.navigate('CreateAnimal'); 
  };

  const renderCardItem = ({ item }: { item: Publicacion }) => (
    <View style={styles.card}>
      {/* Contenido Izquierdo */}
      <View style={styles.cardInfo}>
        <View>
          <Text style={styles.dogName}>{item.nombre}</Text>
          {/* Reemplazamos tipo y raza por tamano y peso que sí existen en el store actual */}
          <Text style={styles.dogDetails}>
            {item.tamano ? `${item.tamano} · ` : ''}{item.peso ? `${item.peso} kg · ` : ''}{item.edad}
          </Text>
          
          <View style={styles.locationContainer}>
            <Location width={14} height={14} color="#666666" style={styles.locationIcon} />
            <Text style={styles.locationText}>{item.ubicacion}</Text>
          </View>
        </View>

        {/* Tags */}
        <View style={styles.tagContainer}>
          <View style={styles.tag}>
            <Text style={styles.tagText}>{item.genero}</Text>
          </View>
          <View style={styles.tag}>
            {/* Cambiamos estado por castrado según el nuevo formulario */}
            <Text style={styles.tagText}>{item.castrado}</Text>
          </View>
        </View>

        {/* Botón Acción */}
        <TouchableOpacity 
          style={styles.btnEditar} 
          onPress={() => handleEditar(item.id)}
          activeOpacity={0.8}
        >
          <Text style={styles.btnEditarText}>Editar</Text>
        </TouchableOpacity>
      </View>

      {/* Contenido Derecho (Imagen) */}
      <View style={styles.imageContainer}>
        {/* Validamos que haya imagen para que no crashee si viene vacío */}
        <Image source={{ uri: item.imagen || 'https://via.placeholder.com/150' }} style={styles.dogImage} />
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <StatusBar barStyle="dark-content" backgroundColor="#f3f3f3" />
      
      {/* Header Area */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleVolver} activeOpacity={0.7}>
          <ChevronBack width={20} height={20} color="#ffffff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Mis Publicaciones</Text>
      </View>

      {/* Listado Principal */}
      <FlatList
        data={publicaciones}
        keyExtractor={(item) => item.id}
        renderItem={renderCardItem}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />

      {/* FAB (Floating Action Button) */}
      <TouchableOpacity 
        style={styles.fab} 
        onPress={handleAgregarNueva}
        activeOpacity={0.8}
      >
        <Plus width={32} height={32} color="#ffffff" />
      </TouchableOpacity>

      {/* Bottom Custom TabBar */}
      <View style={styles.navbar}>
        <TouchableOpacity style={styles.navItem}>
          <Home width={24} height={24} color="#555555" />
          <Text style={styles.navText}>Inicio</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.navItem}>
          <Search width={24} height={24} color="#555555" />
          <Text style={styles.navText}>Búsqueda</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.navItem}>
          <Explore width={24} height={24} color="#e67e22" />
          <Text style={[styles.navText, styles.navTextActive]}>Explorar</Text>
          <View style={styles.activeIndicator} />
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.navItem}>
          <Like width={24} height={24} color="#555555" />
          <Text style={styles.navText}>Favoritos</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f3f3',
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
    backgroundColor: '#7f7f7f',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#000000',
    letterSpacing: -0.5,
  },
  listContent: {
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: 110, 
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
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
    color: '#666666',
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
    color: '#666666',
  },
  tagContainer: {
    flexDirection: 'row',
    gap: 6,
    marginTop: 4,
  },
  tag: {
    backgroundColor: '#e3d7ff',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  tagText: {
    fontSize: 11,
    color: '#8e44ad',
    fontWeight: '600',
  },
  btnEditar: {
    backgroundColor: '#f39c12',
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
    bottom: 95,
    right: 24,
    backgroundColor: '#f39c12',
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
  navbar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 75,
    backgroundColor: '#ffffff',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#eeeeee',
    paddingBottom: 12,
  },
  navItem: {
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    width: 65,
    position: 'relative',
  },
  navText: {
    fontSize: 10,
    color: '#888888',
    marginTop: 4,
  },
  navTextActive: {
    color: '#e67e22',
    fontWeight: '600',
  },
  activeIndicator: {
    position: 'absolute',
    top: 0,
    width: 42,
    height: 3,
    backgroundColor: '#e67e22',
    borderBottomLeftRadius: 3,
    borderBottomRightRadius: 3,
  },
});