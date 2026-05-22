import { useWindowDimensions, View, StyleSheet, Pressable, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { theme } from '../src/theme';
import WelcomeIllustration from '../src/assets/images/welcome.svg';
import { CustomText } from '../src/shared/components/ui/CustomText';

export default function WelcomeRoute() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { width, height } = useWindowDimensions();
  const horizontalPadding = width < 380 ? 20 : 24;
  const buttonHeight = width < 360 ? 54 : 60;
  const buttonTextSize = width < 360 ? 16 : 18;
  const illustrationWidth = Math.min(width - horizontalPadding * 2, width * 0.88, 356);
  const illustrationHeight = illustrationWidth * (456 / 356);
  const topSpacing = Math.max(28, Math.min(56, height * 0.07));
  const titleSpacing = Math.max(20, Math.min(28, height * 0.03));
  const bottomSpacing = Math.max(20, insets.bottom + 16);

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={[
        styles.contentContainer,
        {
          paddingTop: insets.top + 16,
          paddingBottom: bottomSpacing,
          paddingHorizontal: horizontalPadding,
          minHeight: height,
        },
      ]}
      showsVerticalScrollIndicator={false}
      bounces={false}
    >
      <View style={styles.content}>
        <View style={styles.header}>
          <CustomText
            variant="hero"
            style={[styles.titleLine, styles.titleSoft]}
          >
            Encontrá a tu
          </CustomText>
          <CustomText
            variant="hero"
            style={[styles.titleLine, styles.highlight]}
          >
            nueva compañía
          </CustomText>
          <CustomText
            variant="hero"
            style={[styles.titleLine, styles.titleSoft]}
          >
            con nosotros
          </CustomText>
        </View>

        <View
          style={[
            styles.illustrationWrap,
            { width: illustrationWidth, height: illustrationHeight, marginTop: titleSpacing },
          ]}
        >
          <WelcomeIllustration width={illustrationWidth} height={illustrationHeight} />
        </View>
      </View>

      <Pressable
        style={[styles.button, { height: buttonHeight }]}
        onPress={() => router.push('/(auth)/login')}
      >
        <CustomText
          variant="h4"
          style={[styles.buttonText, { fontSize: buttonTextSize, lineHeight: buttonTextSize + 6 }]}
        >
          Empecemos
        </CustomText>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  contentContainer: {
    flexGrow: 1,
    justifyContent: 'space-between',
  },
  content: {
    flex: 1,
    justifyContent: 'flex-start',
  },
  header: {
    marginTop: 16,
    marginBottom: 12,
    maxWidth: 320,
  },
  titleLine: {
    textAlign: 'left',
    color: theme.colors.black,
    fontFamily: theme.typography.fontFamily.bold,
    letterSpacing: -0.2,
  },
  titleSoft: {
    fontFamily: theme.typography.fontFamily.semiBold,
  },
  highlight: {
    color: theme.colors.primary,
    fontFamily: theme.typography.fontFamily.bold,
    letterSpacing: -0.3,
  },
  illustrationWrap: {
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    width: '100%',
    borderRadius: 999,
    backgroundColor: theme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  buttonText: {
    color: theme.colors.white,
    fontFamily: theme.typography.fontFamily.semiBold,
  },
});
