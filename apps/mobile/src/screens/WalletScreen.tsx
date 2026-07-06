import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { colors, typography, spacing, borderRadius } from '../theme';
import { GlassCard } from '../components/GlassCard';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../hooks/useAuth';
import { useWallet, useDiamondPackages } from '../hooks/useWallet';

export function WalletScreen() {
  const { user } = useAuth();
  const { wallet, transactions } = useWallet(user?.id);
  const { packages } = useDiamondPackages();

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.title}>Wallet</Text>
        <Ionicons name="settings-outline" size={24} color={colors.onSurface} />
      </View>
      <GlassCard style={styles.balanceCard}>
        <Text style={styles.balanceLabel}>Total Balance</Text>
        <Text style={styles.balanceAmount}>${wallet?.balance?.toFixed(2)}</Text>
        <View style={styles.coinRow}>
          <Ionicons name="diamond" size={16} color={colors.primary} />
          <Text style={styles.coinCount}>{wallet?.diamondBalance?.toLocaleString()} Diamonds</Text>
        </View>
        <View style={styles.balanceActions}>
          <TouchableOpacity style={styles.actionBtn}>
            <Ionicons name="add-circle" size={20} color={colors.brandOrange} />
            <Text style={styles.actionBtnText}>Top Up</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionBtn}>
            <Ionicons name="arrow-up-circle" size={20} color={colors.primary} />
            <Text style={styles.actionBtnText}>Withdraw</Text>
          </TouchableOpacity>
        </View>
      </GlassCard>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Top Up Diamonds</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.packagesRow}>
          {packages.map((pkg, index) => (
            <TouchableOpacity key={index} style={[styles.pkgCard, pkg.isPopular && styles.pkgPopular]}>
              {pkg.isPopular && <Text style={styles.popularTag}>BEST VALUE</Text>}
              <Text style={styles.pkgCoins}>{pkg.diamondAmount.toLocaleString()}</Text>
              <Text style={styles.pkgLabel}>Diamonds</Text>
              {pkg.bonusAmount > 0 && (
                <Text style={styles.pkgBonus}>+{pkg.bonusAmount} FREE</Text>
              )}
              <Text style={styles.pkgPrice}>${pkg.price}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Transactions</Text>
        <GlassCard style={styles.transactionsCard}>
          {transactions.map((t, i) => (
            <View key={i}>
              <View style={styles.txRow}>
                <View style={styles.txIcon}>
                  <Ionicons
                    name={t.type === 'purchase' ? 'card' : t.type === 'tip' ? 'heart' : 'arrow-down-circle'}
                    size={20}
                    color={t.type === 'withdraw' ? colors.error : colors.tertiary}
                  />
                </View>
                <View style={styles.txInfo}>
                  <Text style={styles.txTitle}>{t.description}</Text>
                  <Text style={styles.txDate}>{t.createdAt}</Text>
                </View>
                <Text style={[styles.txAmount, t.type === 'withdraw' ? styles.negative : styles.positive]}>
                  {t.type === 'withdraw' ? '-' : '+'}${t.amount.toFixed(2)}
                </Text>
              </View>
              {i < transactions.length - 1 && <View style={styles.divider} />}
            </View>
          ))}
        </GlassCard>
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
  balanceCard: {
    marginHorizontal: spacing.gutter,
    padding: spacing.lg,
    alignItems: 'center',
  },
  balanceLabel: {
    ...typography.bodySm,
    color: colors.outline,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  balanceAmount: {
    ...typography.displayLg,
    color: colors.onSurface,
    fontSize: 40,
    marginVertical: spacing.sm,
  },
  coinRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  coinCount: {
    ...typography.bodySm,
    color: colors.primary,
    fontWeight: '600',
  },
  balanceActions: {
    flexDirection: 'row',
    gap: spacing.md,
    marginTop: spacing.lg,
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    backgroundColor: colors.glassBackground,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.DEFAULT,
    borderWidth: 1,
    borderColor: colors.glassBorder,
  },
  actionBtnText: {
    ...typography.bodySm,
    color: colors.onSurface,
    fontWeight: '600',
  },
  section: {
    marginTop: spacing.lg,
    paddingLeft: spacing.gutter,
  },
  sectionTitle: {
    ...typography.titleMd,
    color: colors.onSurface,
    marginBottom: spacing.md,
  },
  packagesRow: {
    gap: spacing.md,
    paddingRight: spacing.gutter,
  },
  pkgCard: {
    backgroundColor: colors.surface,
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.glassBorder,
    alignItems: 'center',
    minWidth: 130,
  },
  pkgPopular: {
    borderColor: colors.brandOrange,
  },
  popularTag: {
    ...typography.labelCaps,
    color: colors.brandOrange,
    fontSize: 9,
    marginBottom: spacing.xs,
  },
  pkgCoins: {
    ...typography.headlineLgMobile,
    color: colors.onSurface,
    fontSize: 28,
    fontWeight: '800',
  },
  pkgLabel: {
    ...typography.bodySm,
    color: colors.outline,
    fontSize: 12,
  },
  pkgBonus: {
    ...typography.labelCaps,
    color: colors.tertiary,
    fontSize: 11,
    marginTop: spacing.xs,
  },
  pkgPrice: {
    ...typography.titleMd,
    color: colors.onSurface,
    fontSize: 18,
    marginTop: spacing.sm,
  },
  transactionsCard: {
    marginRight: spacing.gutter,
    padding: spacing.md,
  },
  txRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: spacing.sm,
  },
  txIcon: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.lg,
    backgroundColor: colors.glassBackground,
    alignItems: 'center',
    justifyContent: 'center',
  },
  txInfo: {
    flex: 1,
  },
  txTitle: {
    ...typography.bodySm,
    color: colors.onSurface,
    fontWeight: '600',
  },
  txDate: {
    ...typography.bodySm,
    color: colors.outline,
    fontSize: 12,
  },
  txAmount: {
    ...typography.titleMd,
    fontSize: 16,
    fontWeight: '700',
  },
  positive: {
    color: colors.tertiary,
  },
  negative: {
    color: colors.error,
  },
  divider: {
    height: 1,
    backgroundColor: colors.glassBorder,
  },
});
