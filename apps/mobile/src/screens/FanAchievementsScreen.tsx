import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { colors, typography, spacing, borderRadius } from '../theme';
import { GlassCard } from '../components/GlassCard';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../hooks/useAuth';
import { useAchievements } from '../hooks/useAchievements';

const FALLBACK_BADGES = [
  { name: 'First Stream', icon: 'play-circle', earned: true },
  { name: 'Super Fan', icon: 'star', earned: true },
  { name: 'Gifter', icon: 'gift', earned: true },
  { name: 'Early Adopter', icon: 'rocket', earned: true },
  { name: 'Diamond', icon: 'diamond', earned: false },
  { name: 'Viral', icon: 'trending-up', earned: false },
  { name: 'Loyal Listener', icon: 'headset', earned: false },
  { name: 'Mod Squad', icon: 'shield-checkmark', earned: false },
];

export function FanAchievementsScreen() {
  const { user } = useAuth();
  const { achievements, loading } = useAchievements(user?.id);

  const badges = loading
    ? FALLBACK_BADGES
    : achievements.map(a => ({ name: a.badgeName, icon: a.badgeIcon, earned: true }));

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.title}>Achievements</Text>
      </View>
      <GlassCard style={styles.levelCard}>
        <Text style={styles.levelLabel}>Level</Text>
        <Text style={styles.levelBadge}>🏆 2 - Bronze</Text>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: '75%' }]} />
        </View>
        <Text style={styles.progressText}>1,500 / 2,000 XP</Text>
      </GlassCard>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Badges</Text>
        <View style={styles.badgeGrid}>
          {badges.map((badge, i) => (
            <GlassCard key={i} style={[styles.badgeCard, !badge.earned ? styles.badgeLocked : undefined] as any}>
              <Ionicons
                name={badge.icon as any}
                size={32}
                color={badge.earned ? colors.brandOrange : colors.outline}
              />
              <Text style={[styles.badgeName, !badge.earned && styles.badgeNameLocked]}>
                {badge.name}
              </Text>
              {!badge.earned && <Ionicons name="lock-closed" size={14} color={colors.outline} />}
            </GlassCard>
          ))}
        </View>
      </View>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Rewards History</Text>
        <GlassCard style={styles.rewardCard}>
          <View style={styles.rewardRow}>
            <Ionicons name="gift" size={24} color={colors.tertiary} />
            <View style={styles.rewardInfo}>
              <Text style={styles.rewardTitle}>1,000 Bonus Diamonds</Text>
              <Text style={styles.rewardDate}>Earned 2 days ago</Text>
            </View>
          </View>
          <View style={styles.divider} />
          <View style={styles.rewardRow}>
            <Ionicons name="flash" size={24} color={colors.primary} />
            <View style={styles.rewardInfo}>
              <Text style={styles.rewardTitle}>5% Stream Boost</Text>
              <Text style={styles.rewardDate}>Earned 1 week ago</Text>
            </View>
          </View>
        </GlassCard>
      </View>
      <View style={{ height: 100 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingHorizontal: spacing.gutter,
    paddingTop: 60,
    paddingBottom: spacing.md,
  },
  title: {
    ...typography.headlineLgMobile,
    color: colors.onSurface,
  },
  levelCard: {
    marginHorizontal: spacing.gutter,
    padding: spacing.lg,
    alignItems: 'center',
  },
  levelLabel: {
    ...typography.bodySm,
    color: colors.outline,
    textTransform: 'uppercase',
  },
  levelBadge: {
    ...typography.headlineLgMobile,
    color: colors.onSurface,
    fontSize: 28,
    marginVertical: spacing.sm,
  },
  progressBar: {
    width: '100%',
    height: 8,
    backgroundColor: colors.surfaceContainerHigh,
    borderRadius: borderRadius.full,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.brandOrange,
    borderRadius: borderRadius.full,
  },
  progressText: {
    ...typography.bodySm,
    color: colors.outline,
    marginTop: spacing.xs,
  },
  section: {
    marginTop: spacing.lg,
    paddingLeft: spacing.gutter,
  },
  sectionTitle: {
    ...typography.titleMd,
    color: colors.onSurface,
    marginBottom: spacing.md,
  },
  badgeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    paddingRight: spacing.gutter,
  },
  badgeCard: {
    width: '22%',
    alignItems: 'center',
    padding: spacing.sm,
    gap: spacing.xs,
  },
  badgeLocked: {
    opacity: 0.5,
  },
  badgeName: {
    ...typography.bodySm,
    color: colors.onSurface,
    fontSize: 11,
    textAlign: 'center',
  },
  badgeNameLocked: {
    color: colors.outline,
  },
  rewardCard: {
    marginRight: spacing.gutter,
    padding: spacing.md,
  },
  rewardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: spacing.sm,
  },
  rewardInfo: {
    flex: 1,
  },
  rewardTitle: {
    ...typography.bodySm,
    color: colors.onSurface,
    fontWeight: '600',
  },
  rewardDate: {
    ...typography.bodySm,
    color: colors.outline,
    fontSize: 12,
  },
  divider: {
    height: 1,
    backgroundColor: colors.glassBorder,
  },
});
