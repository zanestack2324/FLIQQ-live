import { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { colors, typography, spacing, borderRadius } from '../theme';
import { GlassCard } from '../components/GlassCard';
import { Ionicons } from '@expo/vector-icons';
import { useDiamondPackages } from '../hooks/useWallet';
import { useAuth } from '../hooks/useAuth';
import { payWithPaystack, payWithFlutterwave } from '../services/payment';

const PAYMENT_METHODS = [
  { id: 'paystack', label: 'Paystack', icon: 'card', provider: 'paystack' as const },
  { id: 'flutterwave', label: 'Flutterwave', icon: 'globe', provider: 'flutterwave' as const },
  { id: 'bank_transfer', label: 'Bank Transfer', icon: 'business', provider: 'flutterwave' as const },
  { id: 'ussd', label: 'USSD', icon: 'phone-portrait', provider: 'paystack' as const },
];

export function CompletePurchaseScreen() {
  const { user } = useAuth();
  const { packages } = useDiamondPackages();
  const [selected, setSelected] = useState('paystack');
  const [paying, setPaying] = useState(false);

  const pkg = packages?.[0];
  const diamondAmount = pkg?.diamondAmount ?? 1200;
  const bonusAmount = pkg?.bonusAmount ?? 200;
  const price = pkg?.price ?? 9.99;

  const handlePurchase = async () => {
    if (!user?.email) { Alert.alert('Error', 'You must be logged in to purchase'); return; }
    setPaying(true);
    const method = PAYMENT_METHODS.find(m => m.id === selected);
    let result;
    if (method?.provider === 'paystack') {
      result = await payWithPaystack({ email: user.email, amount: price, currency: 'NGN' });
    } else {
      result = await payWithFlutterwave({ email: user.email, amount: price, currency: 'NGN', name: user.displayName });
    }
    setPaying(false);
    if (result.success) {
      Alert.alert('Payment Successful', `Reference: ${result.reference}`);
    } else {
      Alert.alert('Payment Failed', result.message ?? 'Transaction could not be completed');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity>
          <Ionicons name="chevron-back" size={28} color={colors.onSurface} />
        </TouchableOpacity>
        <Text style={styles.title}>Checkout</Text>
        <View style={{ width: 28 }} />
      </View>
      <View style={styles.content}>
        <GlassCard style={styles.packageCard}>
          <Ionicons name="diamond" size={32} color={colors.brandOrange} />
          <Text style={styles.packageCoins}>{diamondAmount.toLocaleString()} Diamonds</Text>
          <Text style={styles.packageBonus}>+{bonusAmount} FREE Diamonds</Text>
          <View style={styles.priceTag}>
            <Text style={styles.priceText}>₦{price}</Text>
          </View>
        </GlassCard>
        <Text style={styles.sectionTitle}>Payment Method</Text>
        <GlassCard style={styles.paymentCard}>
          {PAYMENT_METHODS.map((pm) => (
            <TouchableOpacity key={pm.id} style={styles.paymentRow} onPress={() => setSelected(pm.id)}>
              <Ionicons name={pm.icon as any} size={24} color={colors.primary} />
              <Text style={styles.paymentLabel}>{pm.label}</Text>
              <View style={styles.radioOuter}>
                <View style={[styles.radioInner, pm.id === selected && styles.radioSelected]} />
              </View>
            </TouchableOpacity>
          ))}
        </GlassCard>
        <GlassCard style={styles.totalCard}>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Subtotal</Text>
            <Text style={styles.totalValue}>₦{price}</Text>
          </View>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Tax</Text>
            <Text style={styles.totalValue}>₦0.80</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.totalRow}>
            <Text style={[styles.totalLabel, { fontWeight: '700' }]}>Total</Text>
            <Text style={[styles.totalValue, { color: colors.onSurface, fontWeight: '700', fontSize: 20 }]}>
              ₦{(price + 0.80).toFixed(2)}
            </Text>
          </View>
        </GlassCard>
        <TouchableOpacity style={[styles.purchaseBtn, paying && { opacity: 0.6 }]} onPress={handlePurchase} disabled={paying}>
          <Ionicons name="lock-closed" size={20} color={colors.black} />
          <Text style={styles.purchaseBtnText}>{paying ? 'Processing...' : 'Complete Purchase'}</Text>
        </TouchableOpacity>
        <Text style={styles.secure}>
          <Ionicons name="shield-checkmark" size={14} color={colors.tertiary} /> Secured by Paystack & Flutterwave
        </Text>
      </View>
    </View>
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
    ...typography.titleMd,
    color: colors.onSurface,
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.gutter,
    gap: spacing.md,
  },
  packageCard: {
    alignItems: 'center',
    padding: spacing.lg,
    gap: spacing.xs,
  },
  packageCoins: {
    ...typography.headlineLgMobile,
    color: colors.onSurface,
    fontSize: 28,
    fontWeight: '800',
  },
  packageBonus: {
    ...typography.bodySm,
    color: colors.tertiary,
    fontWeight: '600',
  },
  priceTag: {
    backgroundColor: colors.glassBackground,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.full,
    marginTop: spacing.sm,
  },
  priceText: {
    ...typography.titleMd,
    color: colors.onSurface,
    fontWeight: '700',
  },
  sectionTitle: {
    ...typography.labelCaps,
    color: colors.outline,
    marginTop: spacing.sm,
  },
  paymentCard: {
    padding: spacing.sm,
  },
  paymentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.sm,
  },
  paymentLabel: {
    ...typography.bodySm,
    color: colors.onSurface,
    flex: 1,
  },
  radioOuter: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: colors.outline,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  radioSelected: {
    backgroundColor: colors.brandOrange,
  },
  totalCard: {
    padding: spacing.md,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: spacing.xs,
  },
  totalLabel: {
    ...typography.bodySm,
    color: colors.outline,
  },
  totalValue: {
    ...typography.bodySm,
    color: colors.onSurface,
    fontWeight: '600',
  },
  divider: {
    height: 1,
    backgroundColor: colors.glassBorder,
    marginVertical: spacing.xs,
  },
  purchaseBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    backgroundColor: colors.brandOrange,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.DEFAULT,
  },
  purchaseBtnText: {
    ...typography.titleMd,
    color: colors.black,
    fontWeight: '700',
  },
  secure: {
    ...typography.bodySm,
    color: colors.tertiary,
    fontSize: 12,
    textAlign: 'center',
    marginTop: spacing.sm,
  },
});
