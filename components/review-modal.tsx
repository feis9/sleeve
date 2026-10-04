import { Ionicons } from '@expo/vector-icons';
import { useMemo, useState } from 'react';
import { KeyboardAvoidingView, Modal, Platform, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { PrimaryButton } from '@/components/primary-button';
import { fontSize, radius, spacing, type Palette } from '@/constants/theme';
import { useTheme } from '@/context/settings';
import { REVIEW_MAX, validateRating, validateReviewBody } from '@/utils/validation';

type Props = {
  visible: boolean;
  releaseTitle: string;
  // Si ya reseñaste esta edición, el formulario arranca con tu reseña para editarla.
  initialRating?: number;
  initialBody?: string;
  onCancel: () => void;
  onSubmit: (rating: number, body: string) => void;
};

// Formulario en Modal (mismo patrón que el ejercicio "Formulario Modal" de la Clase 3).
export function ReviewModal(props: Props) {
  // key: al abrir de nuevo, el formulario se reinicia con los valores iniciales.
  return props.visible ? <ReviewForm key={`${props.initialRating}-${props.initialBody}`} {...props} /> : null;
}

function ReviewForm({ visible, releaseTitle, initialRating = 0, initialBody = '', onCancel, onSubmit }: Props) {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const [rating, setRating] = useState(initialRating);
  const [body, setBody] = useState(initialBody);
  const [intentado, setIntentado] = useState(false);

  const errorRating = intentado ? validateRating(rating) : null;
  const errorBody = intentado ? validateReviewBody(body) : null;

  function publicar() {
    setIntentado(true);
    if (validateRating(rating) || validateReviewBody(body)) return;
    onSubmit(rating, body);
  }

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onCancel}>
      {/* KeyboardAvoidingView (núcleo de React Native, NO visto en clase): en iOS el teclado tapaba "Publicar". */}
      <KeyboardAvoidingView style={styles.overlay} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={styles.sheet}>
          <Text style={styles.title}>Tu reseña</Text>
          <Text style={styles.subtitle} numberOfLines={1}>
            {releaseTitle}
          </Text>

          <View style={styles.stars}>
            {[1, 2, 3, 4, 5].map((n) => (
              <Pressable key={n} onPress={() => setRating(n)} hitSlop={6} accessibilityLabel={`${n} estrellas`}>
                <Ionicons name={n <= rating ? 'star' : 'star-outline'} size={34} color={colors.primary} />
              </Pressable>
            ))}
          </View>
          {errorRating && <Text style={styles.error}>{errorRating}</Text>}

          <TextInput
            style={[styles.input, errorBody && styles.inputError]}
            value={body}
            onChangeText={setBody}
            placeholder="¿Cómo suena tu copia? Prensado, ruido de superficie, edición…"
            placeholderTextColor={colors.muted}
            multiline
            maxLength={REVIEW_MAX}
            textAlignVertical="top"
          />
          <View style={styles.row}>
            <Text style={[styles.error, styles.flex]}>{errorBody ?? ''}</Text>
            <Text style={styles.counter}>
              {body.trim().length}/{REVIEW_MAX}
            </Text>
          </View>

          <PrimaryButton label="Publicar" icon="send" onPress={publicar} />
          <PrimaryButton label="Cancelar" variant="outline" onPress={onCancel} />
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const createStyles = (colors: Palette) =>
  StyleSheet.create({
    overlay: {
      flex: 1,
      justifyContent: 'flex-end',
      backgroundColor: 'rgba(0,0,0,0.5)',
    },
    sheet: {
      backgroundColor: colors.surface,
      borderTopLeftRadius: radius.lg,
      borderTopRightRadius: radius.lg,
      padding: spacing.lg,
      paddingBottom: spacing.xxl,
      gap: spacing.md,
    },
    title: {
      color: colors.text,
      fontSize: fontSize.lg,
      fontWeight: '700',
    },
    subtitle: {
      color: colors.muted,
      fontSize: fontSize.sm,
      marginTop: -spacing.sm,
    },
    stars: {
      flexDirection: 'row',
      gap: spacing.sm,
    },
    input: {
      minHeight: 110,
      backgroundColor: colors.bg,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: radius.md,
      padding: spacing.md,
      color: colors.text,
      fontSize: fontSize.base,
    },
    inputError: {
      borderColor: colors.primary,
    },
    row: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      gap: spacing.sm,
      marginTop: -spacing.sm,
    },
    flex: {
      flex: 1,
    },
    error: {
      color: colors.primary,
      fontSize: fontSize.sm,
    },
    counter: {
      color: colors.muted,
      fontSize: fontSize.xs,
    },
  });
