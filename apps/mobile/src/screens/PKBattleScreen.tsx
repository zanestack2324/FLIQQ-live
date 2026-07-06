import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, spacing, borderRadius } from '../theme';

const MOCK_BATTLES = [
  { id: '1', streamerA: 'ArianaK_Official', streamerB: 'DJ_Vibez', scoreA: 1520, scoreB: 1340, status: 'ACTIVE', viewersA: 3400, viewersB: 2800, duration: '2:45 remaining', prize: 50000 },
  { id: '2', streamerA: 'ChefMaya', streamerB: 'ComedyKing', scoreA: 890, scoreB: 920, status: 'ACTIVE', viewersA: 2100, viewersB: 1900, duration: '1:30 remaining', prize: 25000 },
];

const MOCK_RAIDS = [
  { id: '1', from: 'TechGuru', viewerCount: 1200, target: 'FitWithLiz', status: 'PENDING' },
];

export function PKBattleScreen() {
  const [activeTab, setActiveTab] = useState<'battles' | 'raids'>('battles');

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.title}>PK Battles</Text>
        <Ionicons name="flash" size={24} color={colors.brandOrange} />
      </View>

      <View style={styles.tabRow}>
        {(['battles', 'raids'] as const).map((tab) => (
          <TouchableOpacity key={tab} style={[styles.tab, activeTab === tab && styles.tabActive]} onPress={() => setActiveTab(tab)}>
            <Text style={[styles.tabLabel, activeTab === tab && styles.tabLabelActive]}>
              {tab === 'battles' ? 'Live Battles' : 'Raids'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {activeTab === 'battles' ? (
        <>
          <TouchableOpacity style={styles.createBtn}>
            <Ionicons name="add-circle" size={20} color={colors.black} />
            <Text style={styles.createBtnText}>Challenge a Streamer</Text>
          </TouchableOpacity>

          {MOCK_BATTLES.map((battle) => (
            <TouchableOpacity key={battle.id} style={styles.battleCard}>
              <View style={styles.battleHeader}>
                <View style={styles.battleStatusBadge}>
                  <View style={styles.liveDot} />
                  <Text style={styles.battleStatusText}>LIVE</Text>
                </View>
                <Text style={styles.battleTimer}>{battle.duration}</Text>
                <Text style={styles.battlePrize}>🏆 {battle.prize.toLocaleString()} NGN</Text>
              </View>

              <View style={styles.battleContent}>
                <View style={styles.battleSide}>
                  <View style={styles.battleAvatar}>
                    <Text style={styles.battleAvatarText}>{battle.streamerA[0]}</Text>
                  </View>
                  <Text style={styles.battleStreamer} numberOfLines={1}>{battle.streamerA}</Text>
                  <Text style={styles.battleViewers}>{battle.viewersA.toLocaleString()} viewers</Text>
                  <Text style={styles.battleScore}>{battle.scoreA.toLocaleString()}</Text>
                </View>

                <View style={styles.battleCenter}>
                  <Text style={styles.vsText}>VS</Text>
                </View>

                <View style={styles.battleSide}>
                  <View style={styles.battleAvatar}>
                    <Text style={styles.battleAvatarText}>{battle.streamerB[0]}</Text>
                  </View>
                  <Text style={styles.battleStreamer} numberOfLines={1}>{battle.streamerB}</Text>
                  <Text style={styles.battleViewers}>{battle.viewersB.toLocaleString()} viewers</Text>
                  <Text style={styles.battleScore}>{battle.scoreB.toLocaleString()}</Text>
                </View>
              </View>

              <View style={styles.progressBar}>
                <View style={[styles.progressFill, { width: `${(battle.scoreA / (battle.scoreA + battle.scoreB)) * 100}%` }]} />
              </View>

              <View style={styles.battleActions}>
                <TouchableOpacity style={styles.voteBtn}>
                  <Ionicons name="heart" size={16} color={colors.error} />
                  <Text style={styles.voteBtnText}>Vote {battle.streamerA}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.voteBtn}>
                  <Ionicons name="heart" size={16} color={colors.error} />
                  <Text style={styles.voteBtnText}>Vote {battle.streamerB}</Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          ))}
        </>
      ) : (
        <>
          <TouchableOpacity style={styles.createBtn}>
            <Ionicons name="add-circle" size={20} color={colors.black} />
            <Text style={styles.createBtnText}>Raid a Streamer</Text>
          </TouchableOpacity>

          {MOCK_RAIDS.map((raid) => (
            <View key={raid.id} style={styles.raidCard}>
              <View style={styles.raidHeader}>
                <Ionicons name="rocket" size={20} color={colors.brandOrange} />
                <Text style={styles.raidTitle}>Incoming Raid!</Text>
              </View>
              <Text style={styles.raidDetail}>
                <Text style={styles.raidHighlight}>{raid.from}</Text> is raiding with <Text style={styles.raidHighlight}>{raid.viewerCount.toLocaleString()}</Text> viewers
              </Text>
              <View style={styles.raidActions}>
                <TouchableOpacity style={styles.acceptBtn}>
                  <Text style={styles.acceptBtnText}>Accept Raid</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.declineBtn}>
                  <Text style={styles.declineBtnText}>Decline</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </>
      )}

      <View style={{ height: 100 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: spacing.gutter, paddingTop: 60, paddingBottom: spacing.md },
  title: { ...typography.headlineLgMobile, color: colors.onSurface },
  tabRow: { flexDirection: 'row', marginHorizontal: spacing.gutter, marginBottom: spacing.lg, backgroundColor: colors.surfaceContainerLow, borderRadius: borderRadius.md, padding: 3 },
  tab: { flex: 1, paddingVertical: spacing.sm, alignItems: 'center', borderRadius: borderRadius.md },
  tabActive: { backgroundColor: colors.primary },
  tabLabel: { ...typography.labelMd, color: colors.outline, fontWeight: '600' },
  tabLabelActive: { color: colors.black },
  createBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing.sm, marginHorizontal: spacing.gutter, marginBottom: spacing.lg, backgroundColor: colors.brandOrange, borderRadius: borderRadius.full, paddingVertical: spacing.md },
  createBtnText: { ...typography.labelMd, color: colors.black, fontWeight: '700' },
  battleCard: { marginHorizontal: spacing.gutter, marginBottom: spacing.md, padding: spacing.md, backgroundColor: colors.surfaceContainerLow, borderRadius: borderRadius.lg, borderWidth: 1, borderColor: colors.glassBorder, gap: spacing.md },
  battleHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  battleStatusBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: colors.errorContainer, paddingHorizontal: spacing.sm, paddingVertical: 2, borderRadius: borderRadius.full },
  liveDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: colors.error },
  battleStatusText: { ...typography.labelXs, color: colors.error, fontWeight: '700' },
  battleTimer: { ...typography.labelSm, color: colors.onSurface, fontWeight: '600' },
  battlePrize: { ...typography.labelSm, color: colors.brandOrange },
  battleContent: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: spacing.sm },
  battleSide: { alignItems: 'center', flex: 1, gap: 4 },
  battleAvatar: { width: 48, height: 48, borderRadius: 24, backgroundColor: colors.surfaceContainerHigh, justifyContent: 'center', alignItems: 'center' },
  battleAvatarText: { ...typography.titleMd, color: colors.onSurface },
  battleStreamer: { ...typography.bodyMd, color: colors.onSurface, fontWeight: '600' },
  battleViewers: { ...typography.bodyXs, color: colors.outline },
  battleScore: { ...typography.titleLg, color: colors.onSurface, fontWeight: '800' },
  battleCenter: { paddingHorizontal: spacing.md },
  vsText: { ...typography.titleLg, color: colors.brandOrange, fontWeight: '900' },
  progressBar: { height: 6, borderRadius: 3, backgroundColor: colors.surfaceContainer, overflow: 'hidden' },
  progressFill: { height: '100%', backgroundColor: colors.primary, borderRadius: 3 },
  battleActions: { flexDirection: 'row', gap: spacing.sm },
  voteBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 4, paddingVertical: spacing.sm, borderRadius: borderRadius.full, borderWidth: 1, borderColor: colors.glassBorder, backgroundColor: colors.surface },
  voteBtnText: { ...typography.labelSm, color: colors.onSurface, fontWeight: '600' },
  raidCard: { marginHorizontal: spacing.gutter, marginBottom: spacing.md, padding: spacing.md, backgroundColor: colors.surfaceContainerLow, borderRadius: borderRadius.lg, borderWidth: 1, borderColor: colors.brandOrange, gap: spacing.sm },
  raidHeader: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  raidTitle: { ...typography.titleSm, color: colors.onSurface, fontWeight: '700' },
  raidDetail: { ...typography.bodyMd, color: colors.onSurfaceVariant },
  raidHighlight: { color: colors.primary, fontWeight: '700' },
  raidActions: { flexDirection: 'row', gap: spacing.sm, marginTop: spacing.sm },
  acceptBtn: { flex: 1, backgroundColor: colors.primary, borderRadius: borderRadius.full, paddingVertical: spacing.md, alignItems: 'center' },
  acceptBtnText: { ...typography.labelMd, color: colors.black, fontWeight: '700' },
  declineBtn: { flex: 1, borderRadius: borderRadius.full, paddingVertical: spacing.md, alignItems: 'center', borderWidth: 1, borderColor: colors.glassBorder },
  declineBtnText: { ...typography.labelMd, color: colors.outline, fontWeight: '600' },
});
