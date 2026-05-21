import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AnimalDetailScreen } from '../../src/features/animals/screens/AnimalDetailScreen';

export default function AnimalDetailRoute() {
  const insets = useSafeAreaInsets();

  return (
    <View style={{ flex: 1, paddingBottom: insets.bottom }}>
      <AnimalDetailScreen topInset={insets.top} />
    </View>
  );
}
