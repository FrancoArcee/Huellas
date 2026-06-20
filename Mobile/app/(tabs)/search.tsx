import { View, StyleSheet } from 'react-native';
import { Stack } from 'expo-router';
import { SearchResultsScreen } from '../../src/features/search/screens/searchResultsScreen';
import { theme } from '../../src/theme';

export default function SearchRoute() {
  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={styles.container}>
        <SearchResultsScreen />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
});
