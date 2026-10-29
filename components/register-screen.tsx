import { useMemo, useRef, useState, type ComponentProps } from 'react';
import {
  Alert,
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
import { validateEmail, validateName, validatePassword, validateUsername } from '@/utils/validation';

// Como el login, no es una ruta: LoginScreen la muestra en su lugar. Al crear la cuenta queda la
// sesión iniciada y el layout raíz pasa solo a las pestañas.
export function RegisterScreen({ onBack }: { onBack: () => void }) {
  const { colors } = useTheme();
  const texts = useTexts();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const { register } = useAuth();

  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  // Igual que en el login: los errores aparecen después del primer intento.
  const [intentado, setIntentado] = useState(false);
  const [enviando, setEnviando] = useState(false);
  // "Siguiente" del teclado salta al campo de abajo.
  const usernameRef = useRef<TextInputInstance>(null);
  const emailRef = useRef<TextInputInstance>(null);
  const passwordRef = useRef<TextInputInstance>(null);

  const errores = {
    name: validateName(name, texts.validation),
    username: validateUsername(username, texts.validation),
    email: validateEmail(email, texts.validation),
    password: validatePassword(password, texts.validation),
  };
  const mostrar = (campo: keyof typeof errores) => (intentado ? errores[campo] : null);

  async function crear() {
    setIntentado(true);
    if (enviando || Object.values(errores).some((e) => e !== null)) return;
    setEnviando(true);
    const resultado = await register({ name: name.trim(), username: username.trim(), email: email.trim(), password });
    setEnviando(false);
    if (resultado === 'taken') Alert.alert(texts.register.failedTitle, texts.register.takenText);
    if (resultado === 'invalid') Alert.alert(texts.register.failedTitle, texts.register.invalidText);
    if (resultado === 'offline') Alert.alert(texts.register.failedTitle, texts.catalog.offline);
  }

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <Text style={styles.title}>{texts.register.title}</Text>

          <View style={styles.form}>
            <Campo
              label={texts.register.name}
              error={mostrar('name')}
              value={name}
              onChangeText={setName}
              placeholder={texts.register.namePlaceholder}
              autoComplete="name"
              textContentType="name"
              returnKeyType="next"
              submitBehavior="submit"
              onSubmitEditing={() => usernameRef.current?.focus()}
              styles={styles}
              mutedColor={colors.muted}
            />
            <Campo
              label={texts.register.username}
              error={mostrar('username')}
              ref={usernameRef}
              value={username}
              onChangeText={setUsername}
              placeholder={texts.register.usernamePlaceholder}
              autoCapitalize="none"
              autoComplete="username-new"
              textContentType="username"
              returnKeyType="next"
              submitBehavior="submit"
              onSubmitEditing={() => emailRef.current?.focus()}
              styles={styles}
              mutedColor={colors.muted}
            />
            <Campo
              label={texts.register.email}
              error={mostrar('email')}
              ref={emailRef}
              value={email}
              onChangeText={setEmail}
              placeholder={texts.register.emailPlaceholder}
              autoCapitalize="none"
              keyboardType="email-address"
              autoComplete="email"
              textContentType="emailAddress"
              returnKeyType="next"
              submitBehavior="submit"
              onSubmitEditing={() => passwordRef.current?.focus()}
              styles={styles}
              mutedColor={colors.muted}
            />
            <Campo
              label={texts.register.password}
              error={mostrar('password')}
              ref={passwordRef}
              value={password}
              onChangeText={setPassword}
              placeholder={texts.register.passwordPlaceholder}
              secureTextEntry
              autoCapitalize="none"
              autoComplete="new-password"
              textContentType="newPassword"
              returnKeyType="go"
              onSubmitEditing={crear}
              styles={styles}
              mutedColor={colors.muted}
            />

            <PrimaryButton
              label={enviando ? texts.register.submitting : texts.register.submit}
              icon="person-add-outline"
              onPress={crear}
            />
          </View>

          <PrimaryButton label={texts.register.haveAccount} variant="outline" onPress={onBack} />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

type CampoProps = ComponentProps<typeof TextInput> & {
  label: string;
  error: string | null;
  styles: ReturnType<typeof createStyles>;
  mutedColor: Palette['muted'];
};

// Etiqueta, campo y error, con el estilo del login.
function Campo({ label, error, styles, mutedColor, ...input }: CampoProps) {
  return (
    <>
      <Text style={styles.label}>{label}</Text>
      <TextInput {...input} style={[styles.input, error && styles.inputError]} placeholderTextColor={mutedColor} autoCorrect={false} />
      {error && <Text style={styles.error}>{error}</Text>}
    </>
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
      gap: spacing.xl,
    },
    title: {
      color: colors.text,
      fontSize: fontSize.xl,
      fontWeight: '800',
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
  });
