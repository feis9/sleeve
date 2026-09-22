import { useLocalSearchParams } from 'expo-router';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { Chip } from '@/components/chip';
import { Cover } from '@/components/cover';
import { PrimaryButton } from '@/components/primary-button';
import { ReviewCard } from '@/components/review-card';
import { SectionHeader } from '@/components/section-header';
import { colors, fontSize, radius, spacing } from '@/constants/theme';
import { useCollection } from '@/context/collection';
import { flagFor, getRelease, reviewsFor } from '@/data/mock';

function RatingBox({ label, value, caption }: { label: string; value: string; caption: string }) {
  return (
    <View style={styles.ratingBox}>
      <Text style={styles.ratingLabel}>{label}</Text>
      <Text style={styles.ratingValue}>★ {value}</Text>
      <Text style={styles.ratingCaption}>{caption}</Text>
    </View>
  );
}

export default function ReleaseScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { has, toggle } = useCollection();

  const release = getRelease(id);
  if (!release) {
    return (
      <View style={styles.notFound}>
        <Text style={styles.muted}>No encontramos este disco.</Text>
      </View>
    );
  }

  const releaseReviews = reviewsFor(release.id);
  const sleeveRating =
    releaseReviews.length > 0
      ? (releaseReviews.reduce((acc, r) => acc + r.rating, 0) / releaseReviews.length).toFixed(1)
      : '-';
  const enColeccion = has(release.id);

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
        <RatingBox label="Discogs" value={release.discogsRating.toFixed(1)} caption="comunidad" />
        <RatingBox
          label="Sleeve"
          value={sleeveRating}
          caption={`${releaseReviews.length} ${releaseReviews.length === 1 ? 'reseña' : 'reseñas'}`}
        />
      </View>

      <PrimaryButton
        label={enColeccion ? 'En tu colección' : 'Agregar a mi colección'}
        icon={enColeccion ? 'checkmark' : 'add'}
        variant={enColeccion ? 'outline' : 'solid'}
        onPress={() => toggle(release.id)}
      />

      <SectionHeader title="Origen del prensado" />
      <View style={[styles.card, styles.origin]}>
        <Text style={styles.flag}>{flagFor(release.country)}</Text>
        <View>
          <Text style={styles.originCountry}>{release.country}</Text>
          <Text style={styles.muted}>
            {release.label} · {release.year}
          </Text>
        </View>
      </View>

      <SectionHeader title="Tracklist" />
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

      <SectionHeader title="Reseñas" />
      {releaseReviews.length === 0 ? (
        <Text style={styles.muted}>Nadie reseñó este prensado todavía.</Text>
      ) : (
        releaseReviews.map((review) => <ReviewCard key={review.id} review={review} />)
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
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
    color: colors.accent,
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
  origin: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  flag: {
    fontSize: 36,
  },
  originCountry: {
    color: colors.text,
    fontSize: fontSize.md,
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
