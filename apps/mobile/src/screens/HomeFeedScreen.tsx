import { View, Text, StyleSheet, Dimensions, StatusBar, FlatList } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, typography, spacing, borderRadius } from '../theme';

import { Ionicons } from '@expo/vector-icons';
import { useLiveStreams } from '../hooks/useStreams';

const { width, height } = Dimensions.get('window');

export function HomeFeedScreen() {
  const { streams, loading } = useLiveStreams();

  if (loading) return null;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <FlatList
        data={streams}
        keyExtractor={(item) => item.id}
        pagingEnabled
        showsVerticalScrollIndicator={false}
        snapToInterval={height}
        decelerationRate="fast"
        renderItem={({ item, index }) => (
          <View style={styles.page}>
            <View style={styles.backgroundPlaceholder} />
            <LinearGradient colors={['transparent', colors.black]} style={styles.overlay} />
            <View style={styles.topBar}>
              <Text style={styles.logo}>fliqq</Text>
              <View style={styles.topActions}>
                <Ionicons name="search" size={24} color={colors.white} />
                <Ionicons name="notifications-outline" size={24} color={colors.white} />
              </View>
            </View>
            <View style={styles.bottomSection}>
              <View style={styles.userInfo}>
                <View style={styles.avatar}>
                  <Ionicons name="person" size={24} color={colors.primary} />
                </View>
                <View>
                  <Text style={styles.creatorName}>@{item.user.username}</Text>
                  <Text style={styles.streamTitle}>{item.title}</Text>
                </View>
              </View>
              <View style={styles.actionRow}>
                <View style={styles.actionItem}>
                  <Ionicons name="heart-outline" size={28} color={colors.white} />
                  <Text style={styles.actionLabel}>12.4K</Text>
                </View>
                <View style={styles.actionItem}>
                  <Ionicons name="chatbubble-ellipses-outline" size={28} color={colors.white} />
                  <Text style={styles.actionLabel}>2.1K</Text>
                </View>
                <View style={styles.actionItem}>
                  <Ionicons name="gift-outline" size={28} color={colors.white} />
                  <Text style={styles.actionLabel}>Send</Text>
                </View>
              </View>
            </View>
            {index === 0 && (
              <View style={styles.liveIndicator}>
                <Ionicons name="radio" size={14} color={colors.brandOrange} />
                <Text style={styles.livingText}>{item.viewerCount} watching</Text>
              </View>
            )}
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.black,
  },
  page: {
    width,
    height,
    justifyContent: 'flex-end',
  },
  backgroundPlaceholder: {
    ...StyleSheet.absoluteFill,
    backgroundColor: colors.surfaceContainerHigh,
  },
  overlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '50%',
  },
  topBar: {
    position: 'absolute',
    top: 60,
    left: spacing.gutter,
    right: spacing.gutter,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    zIndex: 10,
  },
  logo: {
    ...typography.headlineLgMobile,
    color: colors.brandOrange,
    fontWeight: '900',
  },
  topActions: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  bottomSection: {
    padding: spacing.gutter,
    paddingBottom: 100,
    gap: spacing.md,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.glassBackground,
    borderWidth: 2,
    borderColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  creatorName: {
    ...typography.titleMd,
    color: colors.white,
    fontSize: 16,
  },
  streamTitle: {
    ...typography.bodySm,
    color: colors.onSurfaceVariant,
  },
  actionRow: {
    flexDirection: 'row',
    gap: spacing.lg,
    marginTop: spacing.sm,
  },
  actionItem: {
    alignItems: 'center',
    gap: 4,
  },
  actionLabel: {
    ...typography.labelCaps,
    color: colors.white,
    fontSize: 11,
  },
  liveIndicator: {
    position: 'absolute',
    top: 100,
    left: spacing.gutter,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: borderRadius.full,
  },
  livingText: {
    color: colors.white,
    fontSize: 12,
  },
});
