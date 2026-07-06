import { View, Text, StyleSheet, ScrollView, TextInput } from 'react-native';
import { colors, typography, spacing, borderRadius } from '../theme';
import { CategoryChip } from '../components/CategoryChip';
import { StreamCard } from '../components/StreamCard';
import { Ionicons } from '@expo/vector-icons';
import { useTrendingStreams, useCategories } from '../hooks/useStreams';

export function DiscoverScreen() {
  const { categories } = useCategories();
  const { streams: trending } = useTrendingStreams();

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.title}>Discover</Text>
        <Ionicons name="options-outline" size={24} color={colors.onSurface} />
      </View>
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color={colors.outline} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search creators, streams..."
          placeholderTextColor={colors.outline}
        />
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categories}>
        {categories.map((cat, index) => (
          <CategoryChip key={cat.id} label={cat.name} isActive={index === 0} />
        ))}
      </ScrollView>
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Trending Now</Text>
          <Text style={styles.seeAll}>See All</Text>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.trendingScroll}>
          {trending.map((item) => (
            <View key={item.id} style={styles.trendingCard}>
              <StreamCard
                title={item.title}
                creator={item.user.username}
                viewers={String(item.viewerCount)}
                size="square"
                isLive={item.isLive}
              />
            </View>
          ))}
        </ScrollView>
      </View>
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Live Now</Text>
          <Text style={styles.seeAll}>See All</Text>
        </View>
        {trending.length > 0 ? (
          <StreamCard
            title={trending[0].title}
            creator={trending[0].user.username}
            viewers={String(trending[0].viewerCount)}
            category={trending[0].category ?? undefined}
            size="large"
          />
        ) : (
          <StreamCard
            title="Exploring New Sounds"
            creator="ArianaK_Official"
            viewers="12.4K"
            category="Music"
            size="large"
          />
        )}
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
  title: {
    ...typography.headlineLgMobile,
    color: colors.onSurface,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    marginHorizontal: spacing.gutter,
    paddingHorizontal: spacing.md,
    gap: spacing.sm,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.glassBorder,
    height: 48,
  },
  searchInput: {
    flex: 1,
    color: colors.onSurface,
    fontSize: 16,
  },
  categories: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.gutter,
    gap: spacing.sm,
  },
  section: {
    marginTop: spacing.lg,
    paddingLeft: spacing.gutter,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
    paddingRight: spacing.gutter,
  },
  sectionTitle: {
    ...typography.titleMd,
    color: colors.onSurface,
  },
  seeAll: {
    ...typography.bodySm,
    color: colors.primary,
    fontWeight: '600',
  },
  trendingScroll: {
    gap: spacing.md,
    paddingRight: spacing.gutter,
  },
  trendingCard: {
    width: 160,
  },
});
