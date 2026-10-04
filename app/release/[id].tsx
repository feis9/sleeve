import { Ionicons } from '@expo/vector-icons';
import { useMemo, useState } from 'react';
import { useLocalSearchParams } from 'expo-router';
import { ActivityIndicator, Linking, ScrollView, StyleSheet, Text, View } from 'react-native';

import { Chip } from '@/components/chip';
import { Cover } from '@/components/cover';
import { PressingMap } from '@/components/pressing-map';
import { PrimaryButton } from '@/components/primary-button';
import { ReviewCard } from '@/components/review-card';
import { ReviewModal } from '@/components/review-modal';
import { SectionHeader } from '@/components/section-header';
import { fontSize, radius, spacing, type Palette } from '@/constants/theme';
import { useTexts, useTheme } from '@/context/settings';
import { useCollection } from '@/context/collection';
import { useReviews } from '@/context/reviews';
import { getRelease } from '@/data/mock';
import { findPlaceLabel, formatFindDate, getCurrentFind, type FindResult } from '@/utils/location';

// Por qué el disco quedó sin ubicación. La ubicación es un plus: nunca impide agregarlo.
type AvisoUbicacion = Exclude<FindResult, { status: 'ok' }>;


function RatingBox({ label, value, caption }: { label: string; value: string; caption: string }) {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  return (
    <View style={styles.ratingBox}>
      <Text style={styles.ratingLabel}>{label}</Text>
      <Text style={styles.ratingValue}>★ {value}</Text>
      <Text style={styles.ratingCaption}>{caption}</Text>
    </View>
  );
}

export default function ReleaseScreen() {
  const { colors } = useTheme();
  const texts = useTexts();
  const styles = useMemo(() => createStyles(colors), [colors]);

  const { id } = useLocalSearchParams<{ id: string }>();
  const { has, add, remove, findFor, saveFind } = useCollection();
  const [ubicando, setUbicando] = useState(false);
  const [aviso, setAviso] = useState<AvisoUbicacion | null>(null);
  const { reviewsFor, myReviewFor, saveReview } = useReviews();
  const [resenando, setResenando] = useState(false);

  const release = getRelease(id);
  if (!release) {
    return (
      <View style={styles.notFound}>
        <Text style={styles.muted}>{texts.release.notFound}</Text>
      </View>
    );
  }

  const releaseReviews = reviewsFor(release.id);
  const sleeveRating =
    releaseReviews.length > 0
      ? (releaseReviews.reduce((acc, r) => acc + r.rating, 0) / releaseReviews.length).toFixed(1)
      : '-';
  const enColeccion = has(release.id);
  const hallazgo = findFor(release.id);
  const miResena = myReviewFor(release.id);

  // Escanear → identificar → registrar dónde. El disco se agrega al instante y la ubicación llega después.
  async function agregar(id: string) {
    add(id);
    setAviso(null);
    setUbicando(true);
    const resultado = await getCurrentFind();
    setUbicando(false);
    if (resultado.status === 'ok') saveFind(id, resultado.find);
    else setAviso(resultado);
  }

  function quitar(id: string) {
    remove(id);
    setAviso(null);
  }

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <Cover release={release} showTitle />

      <View style={styles.titleBlock}>
        <Text style={styles.title}>{release.title}</Text>
        <Text style={styles.artist}>{release.artist}</Text>
      </View>

      <View style={styles.chips}>
        <Chip label={String(release.year)} />
        <Chip label={release.country} />
        <Chip label={release.label} />
        <Chip label={release.format} />
      </View>

      <View style={styles.ratings}>
        <RatingBox label="Discogs" value={release.discogsRating.toFixed(1)} caption={texts.release.community} />
        <RatingBox
          label="Sleeve"
          value={sleeveRating}
          caption={texts.release.reviewsCount(releaseReviews.length)}
        />
      </View>

      <PrimaryButton
        label={enColeccion ? texts.release.inCollection : texts.release.addToCollection}
        icon={enColeccion ? 'checkmark' : 'add'}
        variant={enColeccion ? 'outline' : 'solid'}
        onPress={() => (enColeccion ? quitar(release.id) : agregar(release.id))}
      />

      {enColeccion && ubicando && (
        <View style={styles.findRow}>
          <ActivityIndicator size="small" color={colors.muted} />
          <Text style={styles.muted}>{texts.release.locating}</Text>
        </View>
      )}
      {enColeccion && hallazgo && (
        <View style={styles.findRow}>
          <Ionicons name="location" size={16} color={colors.primary} />
          <Text style={styles.findText}>
            {texts.release.foundAt(findPlaceLabel(hallazgo), formatFindDate(hallazgo.date))}
          </Text>
        </View>
      )}
      {enColeccion && aviso && (
        <View style={styles.findRow}>
          <Ionicons name="location-outline" size={16} color={colors.muted} />
          <Text style={[styles.findText, styles.muted]}>
            {texts.release.findWarnings[aviso.status]}
            {aviso.status === 'denied' && !aviso.canAskAgain && (
              <Text style={styles.link} onPress={() => Linking.openSettings()}>
                {' '}
                {texts.release.openSettings}
              </Text>
            )}
          </Text>
        </View>
      )}

      <SectionHeader title={texts.release.countrySection} />
      <PressingMap release={release} />

      <SectionHeader title={texts.release.tracklist} />
      <View style={styles.card}>
        {release.tracklist.map((track) => (
          <View key={track.position} style={styles.track}>
            <Text style={styles.trackPosition}>{track.position}</Text>
            <Text style={styles.trackTitle} numberOfLines={1}>
              {track.title}
            </Text>
            <Text style={styles.muted}>{track.duration ?? ''}</Text>
          </View>
        ))}
      </View>

      <SectionHeader
        title={texts.release.reviews}
        actionLabel={miResena ? texts.release.editReview : texts.release.writeReview}
        onAction={() => setResenando(true)}
      />
      {releaseReviews.length === 0 ? (
        <Text style={styles.muted}>{texts.release.noReviews}</Text>
      ) : (
        releaseReviews.map((review) => <ReviewCard key={review.id} review={review} />)
      )}

      <ReviewModal
        visible={resenando}
        releaseTitle={`${release.title} · ${release.artist}`}
        initialRating={miResena?.rating}
        initialBody={miResena?.body}
        onCancel={() => setResenando(false)}
        onSubmit={(rating, body) => {
          saveReview(release.id, rating, body);
          setResenando(false);
        }}
      />
    </ScrollView>
  );
}

const createStyles = (colors: Palette) =>
  StyleSheet.create({
    screen: {
      flex: 1,
      backgroundColor: colors.bg,
    },
    content: {
      padding: spacing.lg,
      paddingBottom: spacing.xxl,
    },
    notFound: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.bg,
    },
    titleBlock: {
      marginTop: spacing.lg,
      gap: spacing.xs,
    },
    title: {
      color: colors.text,
      fontSize: fontSize.xl,
      fontWeight: '800',
    },
    artist: {
      color: colors.primary,
      fontSize: fontSize.md,
      fontWeight: '600',
    },
    chips: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: spacing.sm,
      marginVertical: spacing.lg,
    },
    ratings: {
      flexDirection: 'row',
      gap: spacing.md,
      marginBottom: spacing.lg,
    },
    ratingBox: {
      flex: 1,
      padding: spacing.md,
      borderRadius: radius.md,
      backgroundColor: colors.surface,
    },
    ratingLabel: {
      color: colors.muted,
      fontSize: fontSize.xs,
      textTransform: 'uppercase',
      letterSpacing: 1,
    },
    ratingValue: {
      color: colors.text,
      fontSize: fontSize.lg,
      fontWeight: '700',
      marginVertical: 2,
    },
    ratingCaption: {
      color: colors.muted,
      fontSize: fontSize.xs,
    },
    card: {
      backgroundColor: colors.surface,
      borderRadius: radius.md,
      padding: spacing.md,
    },
    findRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.sm,
      marginTop: spacing.md,
    },
    findText: {
      flex: 1,
      color: colors.text,
      fontSize: fontSize.sm,
    },
    link: {
      color: colors.primary,
      fontWeight: '600',
    },
    track: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.md,
      paddingVertical: spacing.sm,
    },
    trackPosition: {
      width: 28,
      color: colors.muted,
      fontSize: fontSize.sm,
    },
    trackTitle: {
      flex: 1,
      color: colors.text,
      fontSize: fontSize.base,
    },
    muted: {
      color: colors.muted,
      fontSize: fontSize.sm,
    },
  });
