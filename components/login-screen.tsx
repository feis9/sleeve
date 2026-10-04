import { Ionicons } from '@expo/vector-icons';
import { useMemo, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { PrimaryButton } from '@/components/primary-button';
import { fontSize, radius, spacing, type Palette } from '@/constants/theme';
import { useAuth } from '@/context/auth';
import { useTheme } from '@/context/settings';

// No es una ruta: el layout raíz la muestra cuando no hay sesión (render condicional,
// el mismo patrón que el RootNavigator del ejercicio de navegación).
export function LoginScreen() {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const { login } = useAuth();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');

  function ingresar() {
    // Validación mínima; las validaciones de formato completas llegan en la T10.
    if (!identifier.trim() || !password) {
      Alert.alert('Faltan datos', 'Completá tu email o usuario y tu contraseña.');
      return;
    }
    if (!login(identifier, password)) {
      Alert.alert('No pudimos ingresar', 'El usuario o la contraseña no son correctos.');
    }
  }

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <View style={styles.brand}>
          <Ionicons name="disc" size={64} color={colors.primary} />
          <Text style={styles.logo}>Sleeve</Text>
          <Text style={styles.tagline}>Tu colección de vinilos, edición por edición.</Text>
        </View>

        <View style={styles.form}>
          <Text style={styles.label}>Email o usuario</Text>
          <TextInput
            style={styles.input}
            value={identifier}
            onChangeText={setIdentifier}
            placeholder="luca@sleeve.app o lucaf"
            placeholderTextColor={colors.muted}
            autoCapitalize="none"
            autoCorrect={false}
            autoComplete="username"
            textContentType="username"
            returnKeyType="next"
          />

          <Text style={styles.label}>Contraseña</Text>
          <TextInput
            style={styles.input}
            value={password}
            onChangeText={setPassword}
            placeholder="Tu contraseña"
            placeholderTextColor={colors.muted}
            secureTextEntry
            autoCapitalize="none"
            autoComplete="password"
            textContentType="password"
            returnKeyType="go"
            onSubmitEditing={ingresar}
          />

          <PrimaryButton label="Ingresar" icon="log-in-outline" onPress={ingresar} />
        </View>

        <Text style={styles.demo}>Cuenta de prueba: lucaf · vinilo123</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const createStyles = (colors: Palette) =>
  StyleSheet.create({
    safe: {
      flex: 1,
      backgroundColor: colors.bg,
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
      color: colors.text,
      fontSize: 40,
      fontWeight: '800',
      letterSpacing: -1,
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
    demo: {
      color: colors.muted,
      fontSize: fontSize.xs,
      textAlign: 'center',
    },
  });
