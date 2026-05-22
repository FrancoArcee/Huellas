import { View, StyleSheet, Image } from "react-native";
import { Button } from "../../../shared/components/ui/Button";
import { CustomText } from "../../../shared/components/ui/CustomText";
import { theme, typography } from "../../../theme";

export function WelcomeScreen() {
    return (
        <View style={styles.container}>
            <View style={styles.content}>
                <View style={styles.textContainer}>
                    <CustomText variant="hero" color="black">
                        Encontrá a tu
                    </CustomText>

                    <CustomText variant="hero" color="primary">
                        nueva compañia
                    </CustomText>

                    <CustomText variant="hero" color="black">
                        con nosotros
                    </CustomText>
                </View>

                <View style={styles.illustrationWrap}>
                    <Image
                        source={require("../../../assets/images/welcome-image.png")}
                        style={styles.image}
                        resizeMode="contain"
                    />
                </View>

                <Button
                    style={styles.button}
                    title="Empecemos"
                    href="/(auth)/login"
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: theme.colors.background,
    },

    content: {
        width: 320,
    },

    textContainer: {
        alignItems: "flex-start",
        gap: 2,
    },

    title: {
        fontSize: 32,
        lineHeight: 38,
        fontFamily: typography.fontFamily.semiBold,
        textAlign: "left",
        includeFontPadding: false,
    },

    highlight: {
        fontSize: 32,
        lineHeight: 38,
        fontFamily: typography.fontFamily.semiBold,
        color: theme.colors.primary,
        includeFontPadding: false,
    },

    illustrationWrap: {
        marginTop: 24,
        alignItems: "center",
        justifyContent: "center",
    },
    image: {
        width: 320,
        height: 400,
    },
    button: {
        width: 300,
        height: 50,
        marginTop: 32,
        alignSelf: "center",
    },
});