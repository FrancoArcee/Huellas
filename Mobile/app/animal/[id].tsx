import { Text, View, StyleSheet } from "react-native";
import { Stack } from "expo-router";

export default function AnimalDetailScreen() {
    return (
        <View style={styles.container}>
            <Stack.Screen
                options={{
                    headerTransparent: true,
                    headerTitle: '',
                }}
            />
            <Text style={styles.title}>Animal Detail</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
        justifyContent: "center"
    },
    title: {
        fontSize: 24,
        textAlign: "center",
        fontWeight: 'bold',
        color: '#000',
    },
});