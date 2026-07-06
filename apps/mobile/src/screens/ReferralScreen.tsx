import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Share, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, spacing, borderRadius } from '../theme';

export function ReferralScreen() {
  const [referralCode] = useState('FLIQQ-ABC123');
  const [referralLink] = useState('https://fliqq.app/ref/FLIQQ-ABC123');
  const [enteredCode, setEnteredCode] = useState('');

  const MOCK_REFERRALS = [
    { id: '1', username: 'new_user_42', status: 'COMPLETED', bonusEarned: 5.00, completedAt: '2 days ago' },
    { id: '2', username: 'streamer_99', status: 'QUALIFIED', bonusEarned: 2.50, completedAt: '1 week ago' },
    { id: '3', username: 'fan_101', status: 'PENDING', bonusEarned: 0, completedAt: null },
  ];

  const handleShare = async () => {
    await Share.share({ message: `Join me on FLIQQ! Use my referral code: ${referralCode}\n\n${referralLink}` });
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.title}>Refer & Earn</Text>
        <Ionicons name="people" size={24} color={colors.brandOrange} />
      </View>

      <View style={styles.earningsCard}>
        <Text style={styles.earningsLabel}>Total Earnings</Text>
        <Text style={styles.earningsAmount}>$12.50</Text>
        <Text style={styles.earningsSubtext}>5% bonus on every referred friend's first purchase</Text>
      </View>

      <View style={styles.codeSection}>
        <Text style={styles.codeLabel}>Your Referral Code</Text>
        <View style={styles.codeRow}>
          <View style={styles.codeBox}>
            <Text style={styles.codeText}>{referralCode}</Text>
          </View>
          <TouchableOpacity style={styles.copyBtn}>
            <Ionicons name="copy" size={18} color={colors.primary} />
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={styles.shareBtn} onPress={handleShare}>
          <Ionicons name="share-social" size={18} color={colors.black} />
          <Text style={styles.shareBtnText}>Share Your Link</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.redeemSection}>
        <Text style={styles.redeemTitle}>Have a referral code?</Text>
        <View style={styles.redeemRow}>
          <TextInput
            style={styles.redeemInput}
            placeholder="Enter code"
            placeholderTextColor={colors.outline}
            value={enteredCode}
            onChangeText={setEnteredCode}
          />
          <TouchableOpacity style={styles.redeemBtn}>
            <Text style={styles.redeemBtnText}>Redeem</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.statsRow}>
        <View style={styles.statBox}>
          <Text style={styles.statValue}>12</Text>
          <Text style={styles.statLabel}>Total Referrals</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statValue}>8</Text>
          <Text style={styles.statLabel}>Completed</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statValue}>$12.50</Text>
          <Text style={styles.statLabel}>Earned</Text>
        </View>
      </View>

      <Text style={styles.sectionTitle}>Recent Referrals</Text>
      {MOCK_REFERRALS.map((ref) => (
        <View key={ref.id} style={styles.referralCard}>
          <View style={styles.referralAvatar}>
            <Text style={styles.referralAvatarText}>{ref.username[0]}</Text>
          </View>
          <View style={styles.referralInfo}>
            <Text style={styles.referralName}>{ref.username}</Text>
            <Text style={styles.referralStatus}>{ref.status} {ref.completedAt ? `· ${ref.completedAt}` : ''}</Text>
          </View>
          <Text style={[styles.referralBonus, ref.status === 'PENDING' && { color: colors.outline }]}>
            {ref.status === 'PENDING' ? 'Pending' : `+$${ref.bonusEarned.toFixed(2)}`}
          </Text>
        </View>
      ))}

      <View style={{ height: 100 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: spacing.gutter, paddingTop: 60, paddingBottom: spacing.md },
  title: { ...typography.headlineLgMobile, color: colors.onSurface },
  earningsCard: {
    marginHorizontal: spacing.gutter, padding: spacing.lg, borderRadius: borderRadius.lg,
    backgroundColor: colors.surfaceContainerLow, borderWidth: 1, borderColor: colors.brandOrange,
    alignItems: 'center', marginBottom: spacing.lg, gap: spacing.xs,
  },
  earningsLabel: { ...typography.bodySm, color: colors.outline },
  earningsAmount: { ...typography.headlineLgMobile, color: colors.onSurface, fontWeight: '700' },
  earningsSubtext: { ...typography.bodyXs, color: colors.outline, textAlign: 'center' },
  codeSection: { paddingHorizontal: spacing.gutter, marginBottom: spacing.lg, gap: spacing.md },
  codeLabel: { ...typography.labelMd, color: colors.onSurfaceVariant },
  codeRow: { flexDirection: 'row', gap: spacing.sm, alignItems: 'center' },
  codeBox: { flex: 1, backgroundColor: colors.surfaceContainerLow, borderRadius: borderRadius.md, padding: spacing.md, borderWidth: 1, borderColor: colors.glassBorder },
  codeText: { ...typography.titleMd, color: colors.onSurface, textAlign: 'center', letterSpacing: 2, fontWeight: '700' },
  copyBtn: { width: 44, height: 44, borderRadius: borderRadius.md, backgroundColor: colors.surfaceContainerLow, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: colors.glassBorder },
  shareBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing.sm, backgroundColor: colors.brandOrange, borderRadius: borderRadius.full, paddingVertical: spacing.md },
  shareBtnText: { ...typography.labelMd, color: colors.black, fontWeight: '700' },
  redeemSection: { paddingHorizontal: spacing.gutter, marginBottom: spacing.lg },
  redeemTitle: { ...typography.titleSm, color: colors.onSurface, marginBottom: spacing.sm },
  redeemRow: { flexDirection: 'row', gap: spacing.sm },
  redeemInput: { flex: 1, backgroundColor: colors.surfaceContainerLow, borderRadius: borderRadius.md, paddingHorizontal: spacing.md, color: colors.onSurface, borderWidth: 1, borderColor: colors.glassBorder, height: 44 },
  redeemBtn: { backgroundColor: colors.primary, borderRadius: borderRadius.md, paddingHorizontal: spacing.lg, justifyContent: 'center' },
  redeemBtnText: { ...typography.labelMd, color: colors.black, fontWeight: '700' },
  statsRow: { flexDirection: 'row', marginHorizontal: spacing.gutter, gap: spacing.sm, marginBottom: spacing.lg },
  statBox: { flex: 1, backgroundColor: colors.surfaceContainerLow, borderRadius: borderRadius.md, padding: spacing.md, alignItems: 'center', borderWidth: 1, borderColor: colors.glassBorder, gap: 4 },
  statValue: { ...typography.titleMd, color: colors.onSurface, fontWeight: '700' },
  statLabel: { ...typography.labelXs, color: colors.outline },
  sectionTitle: { ...typography.titleSm, color: colors.onSurface, paddingHorizontal: spacing.gutter, marginBottom: spacing.sm },
  referralCard: { flexDirection: 'row', alignItems: 'center', marginHorizontal: spacing.gutter, marginBottom: spacing.sm, padding: spacing.md, backgroundColor: colors.surfaceContainerLow, borderRadius: borderRadius.md, borderWidth: 1, borderColor: colors.glassBorder, gap: spacing.md },
  referralAvatar: { width: 40, height: 40, borderRadius: 20, backgroundColor: colors.surfaceContainerHigh, justifyContent: 'center', alignItems: 'center' },
  referralAvatarText: { ...typography.titleMd, color: colors.onSurface },
  referralInfo: { flex: 1 },
  referralName: { ...typography.bodyMd, color: colors.onSurface, fontWeight: '600' },
  referralStatus: { ...typography.bodyXs, color: colors.outline, marginTop: 2 },
  referralBonus: { ...typography.labelSm, color: colors.brandOrange, fontWeight: '700' },
});
