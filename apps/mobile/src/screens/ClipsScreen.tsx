import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, spacing, borderRadius } from '../theme';

const MOCK_CLIPS = [
  { id: '1', title: 'Ariana hits the high note!', creator: 'ArianaK_Official', views: 12400, duration: '0:32', createdAt: '2 hours ago', thumbnailUrl: null },
  { id: '2', title: 'DJ Vibez drops the beat', creator: 'DJ_Vibez', views: 8900, duration: '0:45', createdAt: '5 hours ago', thumbnailUrl: null },
  { id: '3', title: 'Chef Maya taste test fail', creator: 'ChefMaya', views: 15200, duration: '0:28', createdAt: '1 day ago', thumbnailUrl: null },
  { id: '4', title: 'Comedy King roast session', creator: 'ComedyKing', views: 22100, duration: '1:02', createdAt: '2 days ago', thumbnailUrl: null },
];

const MOCK_VODS = [
  { id: '1', title: 'Weekend Stream - July 2026', creator: 'ArianaK_Official', views: 3400, duration: '2:15:30', createdAt: '3 days ago', thumbnailUrl: null },
  { id: '2', title: 'Late Night Chat with Fans', creator: 'DJ_Vibez', views: 2100, duration: '1:45:00', createdAt: '1 week ago', thumbnailUrl: null },
];

export function ClipsScreen() {
  const [activeTab, setActiveTab] = useState<'clips' | 'vods'>('clips');

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.title}>Clips & VODs</Text>
        <Ionicons name="videocam" size={24} color={colors.primary} />
      </View>

      <View style={styles.tabRow}>
        {(['clips', 'vods'] as const).map((tab) => (
          <TouchableOpacity key={tab} style={[styles.tab, activeTab === tab && styles.tabActive]} onPress={() => setActiveTab(tab)}>
            <Text style={[styles.tabLabel, activeTab === tab && styles.tabLabelActive]}>
              {tab === 'clips' ? 'Clips' : 'VODs'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.searchContainer}>
        <Ionicons name="search" size={18} color={colors.outline} />
        <TextInput style={styles.searchInput} placeholder={`Search ${activeTab}...`} placeholderTextColor={colors.outline} />
      </View>

      {activeTab === 'clips' ? (
        <>
          <TouchableOpacity style={styles.createBtn}>
            <Ionicons name="cut" size={18} color={colors.black} />
            <Text style={styles.createBtnText}>Create a Clip</Text>
          </TouchableOpacity>

          <View style={styles.grid}>
            {MOCK_CLIPS.map((clip) => (
              <TouchableOpacity key={clip.id} style={styles.clipCard}>
                <View style={styles.clipThumbnail}>
                  <Ionicons name="play-circle" size={36} color={colors.white} />
                  <View style={styles.durationBadge}>
                    <Text style={styles.durationText}>{clip.duration}</Text>
                  </View>
                </View>
                <View style={styles.clipInfo}>
                  <Text style={styles.clipTitle} numberOfLines={2}>{clip.title}</Text>
                  <Text style={styles.clipCreator}>{clip.creator}</Text>
                  <View style={styles.clipMeta}>
                    <Ionicons name="eye" size={12} color={colors.outline} />
                    <Text style={styles.clipMetaText}>{clip.views.toLocaleString()} views</Text>
                    <Text style={styles.clipMetaDot}>·</Text>
                    <Text style={styles.clipMetaText}>{clip.createdAt}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </>
      ) : (
        <View style={styles.grid}>
          {MOCK_VODS.map((vod) => (
            <TouchableOpacity key={vod.id} style={styles.clipCard}>
              <View style={styles.clipThumbnail}>
                <Ionicons name="play-circle" size={36} color={colors.white} />
                <View style={styles.durationBadge}>
                  <Text style={styles.durationText}>{vod.duration}</Text>
                </View>
              </View>
              <View style={styles.clipInfo}>
                <Text style={styles.clipTitle} numberOfLines={2}>{vod.title}</Text>
                <Text style={styles.clipCreator}>{vod.creator}</Text>
                <View style={styles.clipMeta}>
                  <Ionicons name="eye" size={12} color={colors.outline} />
                  <Text style={styles.clipMetaText}>{vod.views.toLocaleString()} views</Text>
                  <Text style={styles.clipMetaDot}>·</Text>
                  <Text style={styles.clipMetaText}>{vod.createdAt}</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      )}

      <View style={{ height: 100 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: spacing.gutter, paddingTop: 60, paddingBottom: spacing.md },
  title: { ...typography.headlineLgMobile, color: colors.onSurface },
  tabRow: { flexDirection: 'row', marginHorizontal: spacing.gutter, marginBottom: spacing.md, backgroundColor: colors.surfaceContainerLow, borderRadius: borderRadius.md, padding: 3 },
  tab: { flex: 1, paddingVertical: spacing.sm, alignItems: 'center', borderRadius: borderRadius.md },
  tabActive: { backgroundColor: colors.primary },
  tabLabel: { ...typography.labelMd, color: colors.outline, fontWeight: '600' },
  tabLabelActive: { color: colors.black },
  searchContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.surface, marginHorizontal: spacing.gutter, paddingHorizontal: spacing.md, gap: spacing.sm, borderRadius: borderRadius.md, borderWidth: 1, borderColor: colors.glassBorder, height: 40, marginBottom: spacing.md },
  searchInput: { flex: 1, color: colors.onSurface, fontSize: 14 },
  createBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing.sm, marginHorizontal: spacing.gutter, marginBottom: spacing.md, backgroundColor: colors.primary, borderRadius: borderRadius.full, paddingVertical: spacing.sm },
  createBtnText: { ...typography.labelMd, color: colors.black, fontWeight: '700' },
  grid: { paddingHorizontal: spacing.gutter, gap: spacing.md },
  clipCard: { backgroundColor: colors.surfaceContainerLow, borderRadius: borderRadius.md, overflow: 'hidden', borderWidth: 1, borderColor: colors.glassBorder },
  clipThumbnail: { width: '100%', height: 160, backgroundColor: colors.surface, justifyContent: 'center', alignItems: 'center' },
  durationBadge: { position: 'absolute', bottom: 8, right: 8, backgroundColor: 'rgba(0,0,0,0.8)', paddingHorizontal: spacing.sm, paddingVertical: 2, borderRadius: borderRadius.sm },
  durationText: { ...typography.labelXs, color: colors.white, fontWeight: '600' },
  clipInfo: { padding: spacing.md, gap: 4 },
  clipTitle: { ...typography.bodyMd, color: colors.onSurface, fontWeight: '600' },
  clipCreator: { ...typography.bodyXs, color: colors.primary },
  clipMeta: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  clipMetaText: { ...typography.bodyXs, color: colors.outline },
  clipMetaDot: { ...typography.bodyXs, color: colors.outline },
});
