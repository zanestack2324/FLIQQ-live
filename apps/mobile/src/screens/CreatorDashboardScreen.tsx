import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { colors, typography, spacing, borderRadius } from '../theme';
import { GlassCard } from '../components/GlassCard';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../hooks/useAuth';
import { useCreatorAnalytics } from '../hooks/useCreatorAnalytics';

function formatNumber(n: number): string {
  if (n >= 1000000) return (n / 1000000).toFixed(1) + 'M';
  if (n >= 1000) return (n / 1000).toFixed(1) + 'K';
  return n.toString();
}

function formatMinutes(m: number): string {
  return Math.round(m) + 'm';
}

const MOCK_STREAMS = [
  { title: 'Exploring New Sounds', viewerCount: 12400, startedAt: new Date(Date.now() - 2 * 3600000).toISOString() },
  { title: 'Evening Jazz Session', viewerCount: 8200, startedAt: new Date(Date.now() - 86400000).toISOString() },
  { title: 'Fan Q&A', viewerCount: 5600, startedAt: new Date(Date.now() - 3 * 86400000).toISOString() },
];

function timeAgo(dateStr: string | null): string {
  if (!dateStr) return '';
  const now = Date.now();
  const date = new Date(dateStr).getTime();
  const diffSec = Math.floor((now - date) / 1000);
  if (diffSec < 60) return 'Just now';
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) return `${diffHr}h ago`;
  const diffDay = Math.floor(diffHr / 24);
  if (diffDay === 1) return 'Yesterday';
  return `${diffDay} days ago`;
}

export function CreatorDashboardScreen() {
  const { user } = useAuth();
  const { analytics, recentStreams } = useCreatorAnalytics(user?.id);

  const metrics = analytics ? [
    { label: 'Total Views', value: formatNumber(analytics.totalViews), icon: 'eye', change: '+12%' },
    { label: 'Followers', value: formatNumber(analytics.totalFollowers), icon: 'people', change: '+5%' },
    { label: 'Diamonds Earned', value: formatNumber(analytics.totalDiamonds), icon: 'diamond', change: '+18%' },
    { label: 'Avg Watch Time', value: formatMinutes(analytics.avgWatchTime), icon: 'time', change: '+3%' },
  ] : [];

  const name = user?.displayName || user?.username || 'ArianaK_Official';

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Welcome back,</Text>
          <Text style={styles.name}>@{name}</Text>
        </View>
        <TouchableOpacity style={styles.goLiveBtn}>
          <Ionicons name="radio" size={18} color={colors.white} />
          <Text style={styles.goLiveBtnText}>Go Live</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.metricsGrid}>
        {metrics.map((m, i) => (
          <GlassCard key={i} style={styles.metricCard}>
            <Ionicons name={m.icon as any} size={24} color={colors.primary} />
            <Text style={styles.metricValue}>{m.value}</Text>
            <Text style={styles.metricLabel}>{m.label}</Text>
            <Text style={[styles.metricChange, m.change.startsWith('+') ? styles.positive : styles.negative]}>
              {m.change}
            </Text>
          </GlassCard>
        ))}
      </View>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Earnings Summary</Text>
        <GlassCard style={styles.earningsCard}>
          <View style={styles.earningsRow}>
            <Text style={styles.earningsLabel}>This Month</Text>
            <Text style={styles.earningsValue}>${analytics ? analytics.earningsMonth.toFixed(2) : '3,240.00'}</Text>
          </View>
          <View style={styles.earningsRow}>
            <Text style={styles.earningsLabel}>Diamonds</Text>
            <Text style={styles.earningsValue}>{analytics ? analytics.totalDiamonds.toLocaleString() : '32,400'}</Text>
          </View>
          <View style={styles.earningsDivider} />
          <View style={styles.earningsRow}>
            <Text style={styles.earningsLabel}>Pending Payout</Text>
            <Text style={[styles.earningsValue, { color: colors.brandOrange }]}>${analytics ? analytics.pendingPayout.toFixed(2) : '892.00'}</Text>
          </View>
        </GlassCard>
      </View>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recent Streams</Text>
        {(recentStreams.length > 0 ? recentStreams : MOCK_STREAMS).map((s, i) => (
          <GlassCard key={i} style={styles.streamCard}>
            <View style={styles.streamCardLeft}>
              <View style={styles.streamThumb} />
              <View>
                <Text style={styles.streamTitle}>{s.title}</Text>
                <Text style={styles.streamMeta}>{s.viewerCount.toLocaleString()} viewers • {timeAgo(s.startedAt)}</Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.outline} />
          </GlassCard>
        ))}
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.gutter,
    paddingTop: 60,
    paddingBottom: spacing.md,
  },
  greeting: {
    ...typography.bodySm,
    color: colors.outline,
  },
  name: {
    ...typography.titleMd,
    color: colors.onSurface,
  },
  goLiveBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    backgroundColor: colors.brandOrange,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.full,
  },
  goLiveBtnText: {
    color: colors.black,
    fontWeight: '700',
    fontSize: 13,
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: spacing.gutter - 4,
    gap: spacing.sm,
  },
  metricCard: {
    width: '47%',
    padding: spacing.md,
    marginHorizontal: 4,
    marginBottom: spacing.sm,
  },
  metricValue: {
    ...typography.headlineLgMobile,
    color: colors.onSurface,
    fontSize: 22,
    marginTop: spacing.sm,
  },
  metricLabel: {
    ...typography.bodySm,
    color: colors.outline,
    fontSize: 12,
  },
  metricChange: {
    ...typography.labelCaps,
    fontSize: 11,
    marginTop: spacing.xs,
  },
  positive: {
    color: colors.tertiary,
  },
  negative: {
    color: colors.error,
  },
  section: {
    marginTop: spacing.lg,
    paddingHorizontal: spacing.gutter,
  },
  sectionTitle: {
    ...typography.titleMd,
    color: colors.onSurface,
    marginBottom: spacing.md,
  },
  earningsCard: {
    padding: spacing.md,
  },
  earningsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.xs,
  },
  earningsLabel: {
    ...typography.bodySm,
    color: colors.outline,
  },
  earningsValue: {
    ...typography.titleMd,
    color: colors.onSurface,
    fontSize: 18,
  },
  earningsDivider: {
    height: 1,
    backgroundColor: colors.glassBorder,
    marginVertical: spacing.sm,
  },
  streamCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  streamCardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    flex: 1,
  },
  streamThumb: {
    width: 56,
    height: 40,
    borderRadius: borderRadius.DEFAULT,
    backgroundColor: colors.surfaceContainerHigh,
  },
  streamTitle: {
    ...typography.bodySm,
    color: colors.onSurface,
    fontWeight: '600',
  },
  streamMeta: {
    ...typography.bodySm,
    color: colors.outline,
    fontSize: 12,
  },
});
