import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LogInScreen } from '../../src/features/auth/screens/LogInScreen';

export default function LoginRoute() {
  const insets = useSafeAreaInsets();

  return (
    <View style={{ flex: 1, paddingTop: insets.top, paddingBottom: insets.bottom }}>
      <LogInScreen />
    </View>
  );
}
