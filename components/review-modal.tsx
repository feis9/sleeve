import { Ionicons } from '@expo/vector-icons';
import { useMemo, useState } from 'react';
import { KeyboardAvoidingView, Modal, Platform, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { PrimaryButton } from '@/components/primary-button';
import { fontSize, radius, spacing, type Palette } from '@/constants/theme';
import { useTexts, useTheme } from '@/context/settings';
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
  const texts = useTexts();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const [rating, setRating] = useState(initialRating);
  const [body, setBody] = useState(initialBody);
  const [intentado, setIntentado] = useState(false);

  const errorRating = intentado ? validateRating(rating, texts.validation) : null;
  const errorBody = intentado ? validateReviewBody(body, texts.validation) : null;

  function publicar() {
    setIntentado(true);
    if (validateRating(rating, texts.validation) || validateReviewBody(body, texts.validation)) return;
    onSubmit(rating, body);
  }

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onCancel}>
      {/* KeyboardAvoidingView: en iOS el teclado tapaba el botón "Publicar". */}
      <KeyboardAvoidingView style={styles.overlay} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={styles.sheet}>
          <Text style={styles.title}>{texts.reviewForm.title}</Text>
          <Text style={styles.subtitle} numberOfLines={1}>
            {releaseTitle}
          </Text>

          <View style={styles.stars}>
            {[1, 2, 3, 4, 5].map((n) => (
              <Pressable key={n} onPress={() => setRating(n)} hitSlop={6} accessibilityLabel={texts.reviewForm.stars(n)}>
                <Ionicons name={n <= rating ? 'star' : 'star-outline'} size={34} color={colors.primary} />
              </Pressable>
            ))}
          </View>
          {errorRating && <Text style={styles.error}>{errorRating}</Text>}

          <TextInput
            style={[styles.input, errorBody && styles.inputError]}
            value={body}
            onChangeText={setBody}
            placeholder={texts.reviewForm.placeholder}
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

          <PrimaryButton label={texts.reviewForm.publish} icon="send" onPress={publicar} />
          <PrimaryButton label={texts.reviewForm.cancel} variant="outline" onPress={onCancel} />
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
