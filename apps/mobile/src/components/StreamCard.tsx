import { View, Image, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, typography, borderRadius, spacing } from '../theme';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface StreamCardProps {
  title: string;
  creator: string;
  viewers: string;
  category?: string;
  imageUri?: string;
  isLive?: boolean;
  size?: 'large' | 'small' | 'square';
  onPress?: () => void;
}

export function StreamCard({
  title,
  creator,
  viewers,
  category,
  imageUri,
  isLive = true,
  size = 'large',
  onPress,
}: StreamCardProps) {
  const isLarge = size === 'large';
  const isSquare = size === 'square';

  return (
    <TouchableOpacity
      style={[
        styles.card,
        isLarge && styles.cardLarge,
        isSquare && styles.cardSquare,
      ]}
      onPress={onPress}
      activeOpacity={0.9}
    >
      <View style={[styles.imageContainer, isSquare && styles.imageSquare]}>
        <View style={[styles.imagePlaceholder, { backgroundColor: colors.surfaceContainerHigh }]}>
          {imageUri && (
            <Image source={{ uri: imageUri }} style={styles.image} />
          )}
        </View>
        <LinearGradient
          colors={['transparent', 'rgba(10,10,15,0.9)']}
          style={styles.gradient}
        />
        {isLive && (
          <View style={styles.liveTag}>
            <View style={styles.liveDot} />
            <Text style={styles.liveText}>LIVE</Text>
          </View>
        )}
        {isLarge && (
          <View style={styles.viewerTag}>
            <Text style={styles.viewerText}>{viewers} VIEWERS</Text>
          </View>
        )}
        {isSquare && (
          <View style={styles.viewerSquare}>
            <Text style={styles.viewerSmallText}>{viewers}</Text>
          </View>
        )}
      </View>
      {isLarge && (
        <View style={styles.overlay}>
          <Text style={styles.title} numberOfLines={2}>{title}</Text>
          <View style={styles.creatorRow}>
            <Text style={styles.creator}>with @{creator}</Text>
            {category && (
              <View style={styles.categoryTag}>
                <Text style={styles.categoryText}>{category}</Text>
              </View>
            )}
          </View>
        </View>
      )}
      {!isLarge && (
        <View style={styles.info}>
          <Text style={styles.creatorSmall} numberOfLines={1}>@{creator}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
  },
  cardLarge: {
    width: SCREEN_WIDTH - spacing.gutter * 2,
    aspectRatio: 16 / 10,
  },
  cardSquare: {
    aspectRatio: 1,
  },
  imageContainer: {
    flex: 1,
  },
  imageSquare: {
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
  },
  imagePlaceholder: {
    flex: 1,
  },
  image: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  gradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '60%',
  },
  liveTag: {
    position: 'absolute',
    top: spacing.sm,
    left: spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(255,140,0,0.9)',
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
    borderRadius: borderRadius.DEFAULT,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.white,
  },
  liveText: {
    ...typography.labelCaps,
    color: colors.white,
    fontSize: 9,
  },
  viewerTag: {
    position: 'absolute',
    top: spacing.sm,
    right: spacing.sm,
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
    borderRadius: borderRadius.DEFAULT,
  },
  viewerText: {
    ...typography.labelCaps,
    color: colors.white,
    fontSize: 9,
  },
  viewerSquare: {
    position: 'absolute',
    top: spacing.xs,
    left: spacing.xs,
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: spacing.xs + 2,
    paddingVertical: 2,
    borderRadius: borderRadius.full,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  viewerSmallText: {
    ...typography.labelCaps,
    color: colors.white,
    fontSize: 9,
  },
  overlay: {
    position: 'absolute',
    bottom: spacing.md,
    left: spacing.md,
    right: spacing.md,
  },
  title: {
    ...typography.titleMd,
    color: colors.white,
    fontSize: 18,
    marginBottom: spacing.xs,
  },
  creatorRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  creator: {
    ...typography.bodySm,
    color: colors.onSurfaceVariant,
  },
  categoryTag: {
    backgroundColor: 'rgba(161,81,0,0.3)',
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: borderRadius.full,
  },
  categoryText: {
    ...typography.labelCaps,
    color: colors.tertiary,
    fontSize: 9,
  },
  info: {
    paddingTop: spacing.xs,
  },
  creatorSmall: {
    ...typography.bodySm,
    color: colors.onSurface,
  },
});
