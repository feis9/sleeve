import { useMemo, useRef, useState } from 'react';
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  type TextInputInstance,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { PrimaryButton } from '@/components/primary-button';
import { fontSize, radius, spacing, type Palette } from '@/constants/theme';
import { useAuth } from '@/context/auth';
import { useTexts, useTheme } from '@/context/settings';
import { validateIdentifier, validatePassword } from '@/utils/validation';

// No es una ruta: el layout raíz la muestra cuando no hay sesión (render condicional,
// el mismo patrón que el RootNavigator del ejercicio de navegación).
// Isologo vertical: versión clara u oscura según el tema.
const LOGO = {
  LIGHT: require('@/assets/images/logo-vertical-light.png'),
  DARK: require('@/assets/images/logo-vertical-dark.png'),
};

export function LoginScreen() {
  const { colors, colorMode } = useTheme();
  const texts = useTexts();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const { login } = useAuth();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  // Los errores aparecen recién después del primer intento, y se recalculan mientras el usuario corrige.
  const [intentado, setIntentado] = useState(false);
  // Para saltar del usuario a la contraseña con el botón "siguiente" del teclado.
  // Desde RN 0.88 el tipo de la instancia es TextInputInstance: TextInput es el componente, no la instancia.
  const passwordRef = useRef<TextInputInstance>(null);

  const errorIdentifier = intentado ? validateIdentifier(identifier, texts.validation) : null;
  const errorPassword = intentado ? validatePassword(password, texts.validation) : null;

  // Mientras espera al backend: evita mandar dos veces y cambia el texto del botón.
  const [enviando, setEnviando] = useState(false);

  async function ingresar() {
    setIntentado(true);
    if (enviando) return;
    if (validateIdentifier(identifier, texts.validation) || validatePassword(password, texts.validation)) return;
    setEnviando(true);
    const resultado = await login(identifier, password);
    setEnviando(false);
    if (resultado === 'invalid') Alert.alert(texts.login.failedTitle, texts.login.failedText);
    if (resultado === 'offline') Alert.alert(texts.login.failedTitle, texts.catalog.offline);
  }

  return (
    <SafeAreaView style={styles.safe}>
      {/* KeyboardAvoidingView: al abrir el teclado achica el área visible para que los campos
          suban y no queden tapados. */}
      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <View style={styles.brand}>
            <Image source={LOGO[colorMode]} style={styles.logo} resizeMode="contain" accessibilityLabel="Sleeve" />
            <Text style={styles.tagline}>{texts.login.tagline}</Text>
          </View>

          <View style={styles.form}>
            <Text style={styles.label}>{texts.login.identifier}</Text>
            <TextInput
              style={[styles.input, errorIdentifier && styles.inputError]}
              value={identifier}
              onChangeText={setIdentifier}
              placeholder={texts.login.identifierPlaceholder}
              placeholderTextColor={colors.muted}
              autoCapitalize="none"
              autoCorrect={false}
              autoComplete="username"
              textContentType="username"
              returnKeyType="next"
              onSubmitEditing={() => passwordRef.current?.focus()}
              submitBehavior="submit"
            />
            {errorIdentifier && <Text style={styles.error}>{errorIdentifier}</Text>}

            <Text style={styles.label}>{texts.login.password}</Text>
            <TextInput
              ref={passwordRef}
              style={[styles.input, errorPassword && styles.inputError]}
              value={password}
              onChangeText={setPassword}
              placeholder={texts.login.passwordPlaceholder}
              placeholderTextColor={colors.muted}
              secureTextEntry
              autoCapitalize="none"
              autoComplete="password"
              textContentType="password"
              returnKeyType="go"
              onSubmitEditing={ingresar}
            />
            {errorPassword && <Text style={styles.error}>{errorPassword}</Text>}

            <PrimaryButton label={enviando ? texts.login.submitting : texts.login.submit} icon="log-in-outline" onPress={ingresar} />
          </View>

          <Text style={styles.demo}>{texts.login.demo}</Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const createStyles = (colors: Palette) =>
  StyleSheet.create({
    safe: {
      flex: 1,
      backgroundColor: colors.bg,
    },
    flex: {
      flex: 1,
    },
    content: {
      flexGrow: 1,
      justifyContent: 'center',
      padding: spacing.xl,
      gap: spacing.xxl,
    },
    brand: {
      alignItems: 'center',
      gap: spacing.sm,
    },
    logo: {
      width: 160,
      height: 190,
    },
    tagline: {
      color: colors.muted,
      fontSize: fontSize.base,
      textAlign: 'center',
    },
    form: {
      gap: spacing.sm,
    },
    label: {
      color: colors.text,
      fontSize: fontSize.sm,
      fontWeight: '600',
      marginTop: spacing.sm,
    },
    input: {
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: radius.md,
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.md,
      color: colors.text,
      fontSize: fontSize.base,
      marginBottom: spacing.sm,
    },
    inputError: {
      borderColor: colors.primary,
    },
    error: {
      color: colors.primary,
      fontSize: fontSize.sm,
      marginTop: -spacing.xs,
      marginBottom: spacing.sm,
    },
    demo: {
      color: colors.muted,
      fontSize: fontSize.xs,
      textAlign: 'center',
    },
  });
