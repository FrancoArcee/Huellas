import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { RegisterScreen } from '../../src/features/auth/screens/RegisterScreen';

export default function RegisterRoute() {
  const insets = useSafeAreaInsets();

  return (
    <View style={{ flex: 1, paddingTop: insets.top, paddingBottom: insets.bottom }}>
      <RegisterScreen />
    </View>
  );
}
