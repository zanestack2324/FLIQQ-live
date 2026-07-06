import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, spacing, borderRadius } from '../theme';

const MOCK_PLANS = [
  { tier: 'TIER_1', name: 'Tier 1', price: 4.99, benefits: ['Subscriber badge', 'Exclusive emotes', 'Ad-free viewing'] },
  { tier: 'TIER_2', name: 'Tier 2', price: 9.99, benefits: ['Everything in Tier 1', 'Custom emote slot', 'Priority chat', 'Subscriber-only streams'] },
  { tier: 'TIER_3', name: 'Tier 3', price: 24.99, benefits: ['Everything in Tier 2', 'Personalized shoutout', 'Direct message access', 'Behind-the-scenes content', 'Monthly Q&A session'] },
];

const MOCK_SUBSCRIBED_CREATORS = [
  { id: '1', username: 'ArianaK_Official', displayName: 'Ariana K.', tier: 'TIER_2', price: 9.99, renewsAt: 'Aug 6, 2026' },
  { id: '2', username: 'DJ_Vibez', displayName: 'DJ Vibez', tier: 'TIER_1', price: 4.99, renewsAt: 'Jul 28, 2026' },
];

export function SubscriptionsScreen() {
  const [activeTab, setActiveTab] = useState<'browse' | 'mine'>('mine');

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.title}>Subscriptions</Text>
        <Ionicons name="heart-circle" size={24} color={colors.primary} />
      </View>

      <View style={styles.tabRow}>
        {(['mine', 'browse'] as const).map((tab) => (
          <TouchableOpacity key={tab} style={[styles.tab, activeTab === tab && styles.tabActive]} onPress={() => setActiveTab(tab)}>
            <Text style={[styles.tabLabel, activeTab === tab && styles.tabLabelActive]}>
              {tab === 'mine' ? 'My Subs' : 'Browse Plans'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {activeTab === 'mine' ? (
        <>
          <Text style={styles.sectionTitle}>Your Subscriptions</Text>
          {MOCK_SUBSCRIBED_CREATORS.map((sub) => (
            <View key={sub.id} style={styles.subCard}>
              <View style={styles.subAvatar}>
                <Text style={styles.subAvatarText}>{sub.username[0]}</Text>
              </View>
              <View style={styles.subInfo}>
                <View style={styles.subNameRow}>
                  <Text style={styles.subName}>{sub.displayName}</Text>
                  <View style={styles.tierBadge}>
                    <Text style={styles.tierBadgeText}>{sub.tier.replace('_', ' ')}</Text>
                  </View>
                </View>
                <Text style={styles.subMeta}>{sub.price}/mo · Renews {sub.renewsAt}</Text>
              </View>
              <TouchableOpacity style={styles.cancelBtn}>
                <Text style={styles.cancelBtnText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          ))}
          {MOCK_SUBSCRIBED_CREATORS.length === 0 && (
            <View style={styles.empty}>
              <Ionicons name="heart-outline" size={48} color={colors.outline} />
              <Text style={styles.emptyText}>No subscriptions yet</Text>
            </View>
          )}
        </>
      ) : (
        <>
          <Text style={styles.sectionTitle}>Support Creators</Text>
          <Text style={styles.sectionSubtitle}>Choose a tier to subscribe and unlock exclusive perks</Text>
          {MOCK_PLANS.map((plan) => (
            <TouchableOpacity key={plan.tier} style={[styles.planCard, plan.tier === 'TIER_2' && styles.planCardPopular]}>
              {plan.tier === 'TIER_2' && (
                <View style={styles.popularBadge}>
                  <Text style={styles.popularBadgeText}>POPULAR</Text>
                </View>
              )}
              <View style={styles.planHeader}>
                <Text style={styles.planName}>{plan.name}</Text>
                <Text style={styles.planPrice}>${plan.price}<Text style={styles.planPeriod}>/mo</Text></Text>
              </View>
              <View style={styles.benefitsList}>
                {plan.benefits.map((b, i) => (
                  <View key={i} style={styles.benefitRow}>
                    <Ionicons name="checkmark-circle" size={16} color={colors.primary} />
                    <Text style={styles.benefitText}>{b}</Text>
                  </View>
                ))}
              </View>
              <TouchableOpacity style={[styles.subscribeBtn, plan.tier === 'TIER_3' && styles.subscribeBtnPremium]}>
                <Text style={styles.subscribeBtnText}>Subscribe ${plan.price}/mo</Text>
              </TouchableOpacity>
            </TouchableOpacity>
          ))}
        </>
      )}

      <View style={styles.revenuecatSection}>
        <Ionicons name="rocket" size={20} color={colors.brandOrange} />
        <Text style={styles.revenuecatText}>Unlock app-wide benefits with a FLIQQ Premium subscription</Text>
        <TouchableOpacity style={styles.premiumBtn}>
          <Text style={styles.premiumBtnText}>View Premium Plans</Text>
        </TouchableOpacity>
      </View>

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
  sectionTitle: { ...typography.titleMd, color: colors.onSurface, paddingHorizontal: spacing.gutter, marginBottom: spacing.xs },
  sectionSubtitle: { ...typography.bodySm, color: colors.outline, paddingHorizontal: spacing.gutter, marginBottom: spacing.lg },
  subCard: {
    flexDirection: 'row', alignItems: 'center', marginHorizontal: spacing.gutter, marginBottom: spacing.sm,
    padding: spacing.md, backgroundColor: colors.surfaceContainerLow, borderRadius: borderRadius.md,
    borderWidth: 1, borderColor: colors.glassBorder, gap: spacing.md,
  },
  subAvatar: { width: 44, height: 44, borderRadius: 22, backgroundColor: colors.surfaceContainerHigh, justifyContent: 'center', alignItems: 'center' },
  subAvatarText: { ...typography.titleMd, color: colors.onSurface },
  subInfo: { flex: 1 },
  subNameRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
  subName: { ...typography.bodyMd, color: colors.onSurface, fontWeight: '600' },
  tierBadge: { backgroundColor: colors.primaryContainer, paddingHorizontal: spacing.sm, paddingVertical: 1, borderRadius: borderRadius.full },
  tierBadgeText: { ...typography.labelXs, color: colors.onPrimaryContainer, fontWeight: '700' },
  subMeta: { ...typography.bodyXs, color: colors.outline, marginTop: 2 },
  cancelBtn: { paddingHorizontal: spacing.md, paddingVertical: spacing.xs, borderRadius: borderRadius.full, borderWidth: 1, borderColor: colors.error },
  cancelBtnText: { ...typography.labelSm, color: colors.error, fontWeight: '600' },
  empty: { alignItems: 'center', paddingVertical: 60, gap: spacing.md },
  emptyText: { ...typography.bodyMd, color: colors.outline },
  planCard: {
    marginHorizontal: spacing.gutter, marginBottom: spacing.md,
    padding: spacing.md, backgroundColor: colors.surfaceContainerLow, borderRadius: borderRadius.lg,
    borderWidth: 1, borderColor: colors.glassBorder, gap: spacing.md,
  },
  planCardPopular: { borderColor: colors.primary, borderWidth: 2 },
  popularBadge: { backgroundColor: colors.primary, alignSelf: 'flex-start', paddingHorizontal: spacing.sm, paddingVertical: 2, borderRadius: borderRadius.full },
  popularBadgeText: { ...typography.labelXs, color: colors.black, fontWeight: '800' },
  planHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  planName: { ...typography.titleMd, color: colors.onSurface },
  planPrice: { ...typography.titleLg, color: colors.onSurface, fontWeight: '700' },
  planPeriod: { ...typography.bodySm, color: colors.outline },
  benefitsList: { gap: spacing.sm },
  benefitRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  benefitText: { ...typography.bodySm, color: colors.onSurfaceVariant, flex: 1 },
  subscribeBtn: { backgroundColor: colors.primary, borderRadius: borderRadius.full, paddingVertical: spacing.md, alignItems: 'center' },
  subscribeBtnPremium: { backgroundColor: colors.brandOrange },
  subscribeBtnText: { ...typography.labelMd, color: colors.black, fontWeight: '700' },
  revenuecatSection: {
    marginHorizontal: spacing.gutter, marginTop: spacing.lg, padding: spacing.md,
    backgroundColor: colors.surfaceContainerLow, borderRadius: borderRadius.md,
    borderWidth: 1, borderColor: colors.brandOrange, alignItems: 'center', gap: spacing.sm,
  },
  revenuecatText: { ...typography.bodySm, color: colors.onSurfaceVariant, textAlign: 'center' },
  premiumBtn: { backgroundColor: colors.brandOrange, borderRadius: borderRadius.full, paddingHorizontal: spacing.lg, paddingVertical: spacing.sm },
  premiumBtnText: { ...typography.labelMd, color: colors.black, fontWeight: '700' },
});
