import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, spacing, borderRadius } from '../theme';

type ChallengeStackParamList = {
  ChallengeList: undefined;
  Leaderboard: undefined;
  ChallengeDetail: { challengeId: string };
  Subscriptions: undefined;
  Referral: undefined;
  PKBattle: undefined;
  Clips: undefined;
};

type ChallengeTab = 'active' | 'upcoming' | 'past';

interface MockChallenge {
  id: string; title: string; description: string;
  type: string; prize: number; currency: string; prizeType: 'cash';
  participants: number; maxParticipants: number; endsAt: string; bannerUrl: null;
  sponsorName: string | null; winner?: string;
}

const MOCK_CHALLENGES: Record<ChallengeTab, MockChallenge[]> = {
  active: [
    {
      id: '1', title: '30-Second Comedy Challenge', description: 'Make us laugh in 30 seconds! Best comedy clip wins 50,000 NGN.',
      type: 'comedy', prize: 50000, currency: 'NGN', prizeType: 'cash',
      participants: 47, maxParticipants: 100, endsAt: '2 days left', bannerUrl: null,
      sponsorName: 'MTN Nigeria',
    },
    {
      id: '2', title: 'Afrobeat Dance Battle', description: 'Show us your best Afrobeat moves. Winner gets featured on our homepage!',
      type: 'dance', prize: 100000, currency: 'NGN', prizeType: 'cash',
      participants: 82, maxParticipants: 200, endsAt: '5 days left', bannerUrl: null,
      sponsorName: null,
    },
    {
      id: '3', title: 'Jollof Face-Off', description: 'Who makes the best Jollof rice? Show us your recipe and cooking process.',
      type: 'cooking', prize: 30000, currency: 'NGN', prizeType: 'cash',
      participants: 35, maxParticipants: 50, endsAt: '1 week left', bannerUrl: null,
      sponsorName: 'Chef Maya',
    },
  ],
  upcoming: [
    {
      id: '4', title: 'Naija Music Battle', description: 'Original songs only. Showcase your talent to win a recording session!',
      type: 'music_battle', prize: 200000, currency: 'NGN', prizeType: 'cash',
      participants: 0, maxParticipants: 50, endsAt: 'Starts in 3 days', bannerUrl: null,
      sponsorName: 'Universal Music',
    },
  ],
  past: [
    {
      id: '5', title: 'TikTok Dance Challenge', description: 'Create a viral dance routine.',
      type: 'dance', prize: 25000, currency: 'NGN', prizeType: 'cash',
      participants: 156, maxParticipants: 200, endsAt: 'Ended 2 weeks ago', bannerUrl: null,
      sponsorName: null, winner: '@DJ_Vibez',
    },
  ],
};

function ChallengeCard({ challenge, tab }: { challenge: MockChallenge; tab: ChallengeTab }) {
  const isJoined = false;
  const isPast = tab === 'past';

  return (
    <TouchableOpacity style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.cardBadge}>
          <Text style={styles.cardBadgeText}>{challenge.type.replace('_', ' ').toUpperCase()}</Text>
        </View>
        {challenge.sponsorName && (
          <Text style={styles.sponsor}>Sponsored by {challenge.sponsorName}</Text>
        )}
      </View>
      <Text style={styles.cardTitle}>{challenge.title}</Text>
      <Text style={styles.cardDescription} numberOfLines={2}>{challenge.description}</Text>
      <View style={styles.cardMeta}>
        <View style={styles.metaItem}>
          <Ionicons name="trophy" size={14} color={colors.brandOrange} />
          <Text style={styles.metaText}>{challenge.prize.toLocaleString()} {challenge.currency}</Text>
        </View>
        <View style={styles.metaItem}>
          <Ionicons name="people" size={14} color={colors.outline} />
          <Text style={styles.metaText}>{challenge.participants}/{challenge.maxParticipants ?? '∞'}</Text>
        </View>
        <View style={styles.metaItem}>
          <Ionicons name="time" size={14} color={colors.outline} />
          <Text style={styles.metaText}>{challenge.endsAt}</Text>
        </View>
      </View>
      {isPast && challenge.winner && (
        <View style={styles.winnerRow}>
          <Ionicons name="trophy" size={14} color={colors.brandOrange} />
          <Text style={styles.winnerText}>Winner: {challenge.winner}</Text>
        </View>
      )}
      {!isPast && (
        <TouchableOpacity style={[styles.joinBtn, isJoined && styles.joinBtnActive]}>
          <Text style={[styles.joinBtnText, isJoined && styles.joinBtnTextActive]}>
            {isJoined ? 'Submitted' : 'Join Challenge'}
          </Text>
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );
}

export function ChallengeListScreen() {
  const [activeTab, setActiveTab] = useState<ChallengeTab>('active');
  const navigation = useNavigation<NativeStackNavigationProp<ChallengeStackParamList>>();

  const challenges = MOCK_CHALLENGES[activeTab];

  const quickLinks = [
    { key: 'Subscriptions', label: 'Subscriptions', icon: 'heart-circle' as const, color: colors.primary },
    { key: 'Referral', label: 'Refer & Earn', icon: 'people' as const, color: colors.brandOrange },
    { key: 'PKBattle', label: 'PK Battles', icon: 'flash' as const, color: colors.error },
    { key: 'Clips', label: 'Clips & VODs', icon: 'videocam' as const, color: colors.tertiary },
  ];

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.title}>Explore</Text>
        <Ionicons name="compass" size={24} color={colors.brandOrange} />
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.quickLinks} contentContainerStyle={styles.quickLinksContent}>
        {quickLinks.map((link) => (
          <TouchableOpacity key={link.key} style={styles.quickLink} onPress={() => navigation.navigate(link.key as any)}>
            <View style={[styles.quickLinkIcon, { backgroundColor: link.color + '20' }]}>
              <Ionicons name={link.icon} size={22} color={link.color} />
            </View>
            <Text style={styles.quickLinkLabel}>{link.label}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <View style={styles.tabRow}>
        {(['active', 'upcoming', 'past'] as const).map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[styles.tab, activeTab === tab && styles.tabActive]}
            onPress={() => setActiveTab(tab)}
          >
            <Text style={[styles.tabLabel, activeTab === tab && styles.tabLabelActive]}>
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.featuredBanner}>
        <Ionicons name="megaphone" size={20} color={colors.brandOrange} />
        <View style={styles.featuredContent}>
          <Text style={styles.featuredTitle}>Weekly Challenge</Text>
          <Text style={styles.featuredSubtitle}>Win up to 200,000 NGN in prizes every week!</Text>
        </View>
      </View>

      <View style={styles.list}>
        {challenges.map((challenge) => (
          <ChallengeCard key={challenge.id} challenge={challenge} tab={activeTab} />
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
  tabRow: {
    flexDirection: 'row', marginHorizontal: spacing.gutter, marginBottom: spacing.lg,
    backgroundColor: colors.surfaceContainerLow, borderRadius: borderRadius.md, padding: 3,
  },
  tab: { flex: 1, paddingVertical: spacing.sm, alignItems: 'center', borderRadius: borderRadius.md },
  tabActive: { backgroundColor: colors.primary },
  tabLabel: { ...typography.labelMd, color: colors.outline, fontWeight: '600' },
  tabLabelActive: { color: colors.black },
  featuredBanner: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.md,
    marginHorizontal: spacing.gutter, marginBottom: spacing.lg,
    padding: spacing.md, backgroundColor: colors.surfaceContainerLow,
    borderRadius: borderRadius.md, borderWidth: 1, borderColor: colors.brandOrange,
  },
  featuredContent: { flex: 1 },
  quickLinks: { maxHeight: 90, marginBottom: spacing.md },
  quickLinksContent: { paddingHorizontal: spacing.gutter, gap: spacing.md, alignItems: 'center' },
  quickLink: { alignItems: 'center', gap: spacing.xs, width: 72 },
  quickLinkIcon: { width: 48, height: 48, borderRadius: 24, justifyContent: 'center', alignItems: 'center' },
  quickLinkLabel: { ...typography.labelXs, color: colors.onSurface, textAlign: 'center' },
  featuredTitle: { ...typography.titleSm, color: colors.onSurface },
  featuredSubtitle: { ...typography.bodyXs, color: colors.outline, marginTop: 2 },
  list: { paddingHorizontal: spacing.gutter, gap: spacing.md },
  card: {
    backgroundColor: colors.surfaceContainerLow, borderRadius: borderRadius.lg,
    padding: spacing.md, borderWidth: 1, borderColor: colors.glassBorder, gap: spacing.sm,
  },
  cardHeader: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
  },
  cardBadge: {
    backgroundColor: colors.primaryContainer, paddingHorizontal: spacing.sm, paddingVertical: 2,
    borderRadius: borderRadius.full, alignSelf: 'flex-start',
  },
  cardBadgeText: { ...typography.labelXs, color: colors.onPrimaryContainer, fontWeight: '700', letterSpacing: 0.5 },
  sponsor: { ...typography.labelXs, color: colors.outline },
  cardTitle: { ...typography.titleMd, color: colors.onSurface, marginTop: 2 },
  cardDescription: { ...typography.bodySm, color: colors.onSurfaceVariant, lineHeight: 20 },
  cardMeta: { flexDirection: 'row', gap: spacing.md, marginTop: spacing.xs, flexWrap: 'wrap' },
  metaItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  metaText: { ...typography.labelSm, color: colors.outline },
  winnerRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: spacing.xs },
  winnerText: { ...typography.labelSm, color: colors.brandOrange, fontWeight: '600' },
  joinBtn: {
    backgroundColor: colors.brandOrange, borderRadius: borderRadius.full,
    paddingVertical: spacing.sm, alignItems: 'center', marginTop: spacing.sm,
  },
  joinBtnActive: { backgroundColor: colors.surfaceContainerHigh },
  joinBtnText: { ...typography.labelMd, color: colors.black, fontWeight: '700' },
  joinBtnTextActive: { color: colors.onSurface },
});
