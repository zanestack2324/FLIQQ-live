import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, spacing, borderRadius } from '../theme';

const CATEGORIES = [
  { key: 'fastest_growing', label: 'Fastest Growing', icon: 'trending-up' as const },
  { key: 'top_musician', label: 'Top Musician', icon: 'musical-notes' as const },
  { key: 'top_comedian', label: 'Top Comedian', icon: 'happy' as const },
  { key: 'best_educator', label: 'Best Educator', icon: 'school' as const },
  { key: 'best_food_creator', label: 'Best Food Creator', icon: 'restaurant' as const },
  { key: 'most_gifted', label: 'Most Gifted', icon: 'gift' as const },
  { key: 'most_viewed', label: 'Most Viewed', icon: 'eye' as const },
  { key: 'top_streamer', label: 'Top Streamer', icon: 'videocam' as const },
];

const PERIODS = [
  { key: 'all_time', label: 'All Time' },
  { key: 'this_month', label: 'This Month' },
  { key: 'this_week', label: 'This Week' },
  { key: 'today', label: 'Today' },
];

const MOCK_LEADERBOARD = [
  { rank: 1, username: 'ArianaK_Official', displayName: 'Ariana K.', avatarUrl: null, score: 28450, metric: 'followers', isVerified: true, followerCount: 28450 },
  { rank: 2, username: 'DJ_Vibez', displayName: 'DJ Vibez', avatarUrl: null, score: 19200, metric: 'followers', isVerified: true, followerCount: 19200 },
  { rank: 3, username: 'ChefMaya', displayName: 'Chef Maya', avatarUrl: null, score: 15800, metric: 'followers', isVerified: true, followerCount: 15800 },
  { rank: 4, username: 'ComedyKing', displayName: 'Comedy King', avatarUrl: null, score: 12400, metric: 'followers', isVerified: true, followerCount: 12400 },
  { rank: 5, username: 'TechGuru', displayName: 'Tech Guru', avatarUrl: null, score: 9800, metric: 'followers', isVerified: false, followerCount: 9800 },
  { rank: 6, username: 'FitWithLiz', displayName: 'Fit With Liz', avatarUrl: null, score: 8700, metric: 'followers', isVerified: true, followerCount: 8700 },
  { rank: 7, username: 'ArtByLeo', displayName: 'Art By Leo', avatarUrl: null, score: 7200, metric: 'followers', isVerified: false, followerCount: 7200 },
  { rank: 8, username: 'TravelSam', displayName: 'Travel Sam', avatarUrl: null, score: 6500, metric: 'followers', isVerified: true, followerCount: 6500 },
];

export function LeaderboardScreen() {
  const [activeCategory, setActiveCategory] = useState('fastest_growing');
  const [activePeriod, setActivePeriod] = useState('all_time');

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.title}>Leaderboard</Text>
        <Ionicons name="trophy" size={24} color={colors.brandOrange} />
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryRow} contentContainerStyle={styles.categoryContent}>
        {CATEGORIES.map((cat) => (
          <TouchableOpacity
            key={cat.key}
            style={[styles.categoryChip, activeCategory === cat.key && styles.categoryChipActive]}
            onPress={() => setActiveCategory(cat.key)}
          >
            <Ionicons name={cat.icon} size={16} color={activeCategory === cat.key ? colors.black : colors.outline} />
            <Text style={[styles.categoryLabel, activeCategory === cat.key && styles.categoryLabelActive]}>{cat.label}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <View style={styles.periodRow}>
        {PERIODS.map((p) => (
          <TouchableOpacity
            key={p.key}
            style={[styles.periodChip, activePeriod === p.key && styles.periodChipActive]}
            onPress={() => setActivePeriod(p.key)}
          >
            <Text style={[styles.periodLabel, activePeriod === p.key && styles.periodLabelActive]}>{p.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.podium}>
        {MOCK_LEADERBOARD.slice(0, 3).map((entry, i) => {
          const heights = [140, 100, 80];
          return (
            <View key={entry.rank} style={[styles.podiumItem, i === 0 && styles.podiumFirst]}>
              <View style={[styles.avatarLarge, { borderColor: i === 0 ? '#FFD700' : i === 1 ? '#C0C0C0' : '#CD7F32' }]}>
                <Text style={styles.avatarText}>{entry.username[0]}</Text>
              </View>
              <View style={[styles.podiumBar, { height: heights[i] }]}>
                <Text style={styles.podiumRank}>#{entry.rank}</Text>
              </View>
              <Text style={styles.podiumName} numberOfLines={1}>{entry.displayName}</Text>
              <Text style={styles.podiumScore}>{entry.score.toLocaleString()}</Text>
            </View>
          );
        })}
      </View>

      <View style={styles.list}>
        {MOCK_LEADERBOARD.slice(3).map((entry) => (
          <TouchableOpacity key={entry.rank + 3} style={styles.listItem}>
            <Text style={styles.listRank}>#{entry.rank + 3}</Text>
            <View style={styles.listAvatar}>
              <Text style={styles.listAvatarText}>{entry.username[0]}</Text>
            </View>
            <View style={styles.listInfo}>
              <View style={styles.listNameRow}>
                <Text style={styles.listName}>{entry.displayName}</Text>
                {entry.isVerified && <Ionicons name="checkmark-circle" size={14} color={colors.primary} />}
              </View>
              <Text style={styles.listMetric}>{entry.score.toLocaleString()} {entry.metric}</Text>
            </View>
            <TouchableOpacity style={styles.followBtn}>
              <Text style={styles.followBtnText}>Follow</Text>
            </TouchableOpacity>
          </TouchableOpacity>
        ))}
      </View>

      <View style={{ height: 100 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: spacing.gutter, paddingTop: 60, paddingBottom: spacing.md,
  },
  title: { ...typography.headlineLgMobile, color: colors.onSurface },
  categoryRow: { maxHeight: 44, marginBottom: spacing.sm },
  categoryContent: { paddingHorizontal: spacing.gutter, gap: spacing.sm, alignItems: 'center' },
  categoryChip: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    paddingHorizontal: spacing.md, paddingVertical: spacing.sm,
    borderRadius: borderRadius.full, backgroundColor: colors.surfaceContainerLow,
    borderWidth: 1, borderColor: colors.glassBorder, height: 36,
  },
  categoryChipActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  categoryLabel: { ...typography.labelSm, color: colors.outline },
  categoryLabelActive: { color: colors.black, fontWeight: '700' },
  periodRow: {
    flexDirection: 'row', paddingHorizontal: spacing.gutter, gap: spacing.sm, marginBottom: spacing.lg,
  },
  periodChip: {
    paddingHorizontal: spacing.md, paddingVertical: spacing.xs,
    borderRadius: borderRadius.full, backgroundColor: colors.surfaceContainerLow,
    borderWidth: 1, borderColor: colors.glassBorder,
  },
  periodChipActive: { backgroundColor: colors.brandOrange, borderColor: colors.brandOrange },
  periodLabel: { ...typography.labelSm, color: colors.outline },
  periodLabelActive: { color: colors.black, fontWeight: '700' },
  podium: {
    flexDirection: 'row', justifyContent: 'center', alignItems: 'flex-end',
    paddingHorizontal: spacing.gutter, marginBottom: spacing.lg, gap: spacing.md, height: 220,
  },
  podiumItem: { alignItems: 'center', width: 100 },
  podiumFirst: { marginTop: -30 },
  avatarLarge: {
    width: 52, height: 52, borderRadius: 26, backgroundColor: colors.surfaceContainerHigh,
    borderWidth: 3, justifyContent: 'center', alignItems: 'center', marginBottom: spacing.sm,
  },
  avatarText: { ...typography.titleLg, color: colors.onSurface },
  podiumBar: {
    width: 60, backgroundColor: colors.surfaceContainer, borderRadius: borderRadius.md,
    justifyContent: 'center', alignItems: 'center', marginBottom: spacing.xs,
    borderWidth: 1, borderColor: colors.glassBorder,
  },
  podiumRank: { ...typography.titleSm, color: colors.onSurface, fontWeight: '800' },
  podiumName: { ...typography.labelSm, color: colors.onSurface, maxWidth: 100 },
  podiumScore: { ...typography.bodyXs, color: colors.outline },
  list: { paddingHorizontal: spacing.gutter, gap: spacing.sm },
  listItem: {
    flexDirection: 'row', alignItems: 'center', padding: spacing.md,
    backgroundColor: colors.surfaceContainerLow, borderRadius: borderRadius.md,
    borderWidth: 1, borderColor: colors.glassBorder, gap: spacing.md,
  },
  listRank: { ...typography.titleSm, color: colors.outline, width: 32, fontWeight: '700' },
  listAvatar: {
    width: 40, height: 40, borderRadius: 20, backgroundColor: colors.surfaceContainerHigh,
    justifyContent: 'center', alignItems: 'center',
  },
  listAvatarText: { ...typography.titleMd, color: colors.onSurface },
  listInfo: { flex: 1 },
  listNameRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  listName: { ...typography.bodyMd, color: colors.onSurface, fontWeight: '600' },
  listMetric: { ...typography.bodyXs, color: colors.outline, marginTop: 2 },
  followBtn: {
    backgroundColor: colors.primary, paddingHorizontal: spacing.md, paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
  },
  followBtnText: { ...typography.labelSm, color: colors.black, fontWeight: '700' },
});
