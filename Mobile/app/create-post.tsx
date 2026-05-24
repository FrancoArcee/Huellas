import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CreatePostScreen } from '../src/features/animals/screens/CreatePostScreen';

export default function CreatePostRoute() {
  const insets = useSafeAreaInsets();

  return (
    <View style={{ flex: 1 }}>
      <CreatePostScreen topInset={insets.top} bottomInset={insets.bottom} />
    </View>
  );
}
