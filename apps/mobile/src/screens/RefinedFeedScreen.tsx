import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useState } from 'react';
import { colors, typography, spacing, borderRadius } from '../theme';
import { StreamCard } from '../components/StreamCard';
import { CreatorAvatar } from '../components/CreatorAvatar';
import { Ionicons } from '@expo/vector-icons';
import { useLiveStreams, useFollowingStreams } from '../hooks/useStreams';
import { useAuth } from '../hooks/useAuth';

const TABS = ['For You', 'Following', 'Trending', 'New'];

export function RefinedFeedScreen() {
  const [activeTab, setActiveTab] = useState('For You');
  const { user } = useAuth();
  const { streams: liveStreams } = useLiveStreams();
  const { streams: followingStreams } = useFollowingStreams(user?.id);

  const streams = activeTab === 'Following' ? followingStreams : liveStreams;

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.logo}>fliqq</Text>
        <TouchableOpacity style={styles.filterBtn}>
          <Ionicons name="filter" size={20} color={colors.onSurface} />
        </TouchableOpacity>
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tabBar}>
        {TABS.map((tab) => (
          <TouchableOpacity key={tab} style={[styles.tab, activeTab === tab && styles.activeTab]} onPress={() => setActiveTab(tab)}>
            <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>{tab}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.creatorsRow}>
        {streams.slice(0, 12).map((s) => (
          <View key={s.id} style={styles.creatorItem}>
            <CreatorAvatar size={64} isLive={s.isLive} />
            <Text style={styles.creatorLabel} numberOfLines={1}>@{s.user.username}</Text>
          </View>
        ))}
      </ScrollView>
      <View style={styles.grid}>
        {streams.slice(0, 6).map((s) => (
          <View key={s.id} style={styles.gridItem}>
            <StreamCard
              title={s.title}
              creator={s.user.username}
              viewers={String(s.viewerCount)}
              size="square"
              isLive={s.isLive}
            />
          </View>
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
    paddingBottom: spacing.sm,
  },
  logo: {
    ...typography.headlineLgMobile,
    color: colors.brandOrange,
    fontWeight: '900',
  },
  filterBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.glassBackground,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabBar: {
    flexDirection: 'row',
    paddingHorizontal: spacing.gutter,
    paddingVertical: spacing.sm,
    gap: spacing.sm,
  },
  tab: {
    paddingHorizontal: spacing.md + 4,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.full,
    marginRight: spacing.sm,
  },
  activeTab: {
    backgroundColor: colors.primaryContainer,
  },
  tabText: {
    ...typography.labelCaps,
    color: colors.outline,
  },
  activeTabText: {
    color: colors.onPrimaryContainer,
    fontWeight: '700',
  },
  creatorsRow: {
    paddingHorizontal: spacing.gutter,
    paddingVertical: spacing.md,
    gap: spacing.md,
  },
  creatorItem: {
    alignItems: 'center',
    gap: spacing.xs,
    marginRight: spacing.md,
  },
  creatorLabel: {
    ...typography.bodySm,
    color: colors.onSurface,
    fontSize: 12,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: spacing.gutter - 4,
  },
  gridItem: {
    width: '50%',
    paddingHorizontal: 4,
    marginBottom: spacing.sm,
  },
});
