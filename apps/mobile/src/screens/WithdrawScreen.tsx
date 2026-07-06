import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { useState } from 'react';
import { colors, typography, spacing, borderRadius } from '../theme';
import { GlassCard } from '../components/GlassCard';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../hooks/useAuth';
import { useWallet } from '../hooks/useWallet';

const METHODS = ['PayPal', 'Bank Transfer', 'Crypto'];

export function WithdrawScreen() {
  const [method, setMethod] = useState('PayPal');
  const [amount, setAmount] = useState('');
  const [address, setAddress] = useState('');
  const { user } = useAuth();
  const { wallet } = useWallet(user?.id);
  const availableBalance = `${wallet?.diamondBalance?.toLocaleString() || '0'} Diamonds`;

  const steps = ['Method', 'Amount', 'Confirm', 'Done'];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity>
          <Ionicons name="chevron-back" size={28} color={colors.onSurface} />
        </TouchableOpacity>
        <Text style={styles.title}>Withdraw Funds</Text>
        <View style={{ width: 28 }} />
      </View>
      <View style={styles.steps}>
        {steps.map((s, i) => (
          <View key={i} style={styles.stepItem}>
            <View style={[styles.stepDot, i === 0 && styles.stepDotActive]}>
              <Text style={[styles.stepDotText, i === 0 && styles.stepDotTextActive]}>{i + 1}</Text>
            </View>
            <Text style={[styles.stepLabel, i === 0 && styles.stepLabelActive]}>{s}</Text>
          </View>
        ))}
      </View>
      <View style={styles.content}>
        <Text style={styles.available}>Available: {availableBalance}</Text>
        <Text style={styles.sectionTitle}>Withdrawal Method</Text>
        <View style={styles.methodsRow}>
          {METHODS.map((m) => (
            <TouchableOpacity
              key={m}
              style={[styles.methodBtn, method === m && styles.methodBtnActive]}
              onPress={() => setMethod(m)}
            >
              <Ionicons
                name={m === 'PayPal' ? 'logo-paypal' : m === 'Bank Transfer' ? 'business' : 'logo-bitcoin'}
                size={24}
                color={method === m ? colors.brandOrange : colors.outline}
              />
              <Text style={[styles.methodLabel, method === m && styles.methodLabelActive]}>{m}</Text>
            </TouchableOpacity>
          ))}
        </View>
        {method === 'Crypto' && (
          <GlassCard style={styles.addressCard}>
            <Text style={styles.addressLabel}>Wallet Address</Text>
            <TextInput
              style={styles.addressInput}
              value={address}
              onChangeText={setAddress}
              placeholder="Enter your wallet address"
              placeholderTextColor={colors.outline}
            />
          </GlassCard>
        )}
        <Text style={styles.sectionTitle}>Amount</Text>
        <GlassCard style={styles.amountCard}>
          <TextInput
            style={styles.amountInput}
            value={amount}
            onChangeText={setAmount}
            placeholder="0"
            placeholderTextColor={colors.outline}
            keyboardType="numeric"
          />
          <Text style={styles.amountLabel}>Diamonds</Text>
        </GlassCard>
        <GlassCard style={styles.summaryCard}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Amount</Text>
            <Text style={styles.summaryValue}>{amount || '0'} Diamonds</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Fee (2%)</Text>
            <Text style={styles.summaryValue}>{amount ? (parseInt(amount) * 0.02).toFixed(0) : '0'} Diamonds</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>You Receive</Text>
            <Text style={[styles.summaryValue, { color: colors.tertiary, fontWeight: '700' }]}>
              ${amount ? (parseInt(amount) * 0.001).toFixed(2) : '0.00'}
            </Text>
          </View>
        </GlassCard>
        <TouchableOpacity style={styles.withdrawBtn}>
          <Ionicons name="arrow-up-circle" size={20} color={colors.black} />
          <Text style={styles.withdrawBtnText}>Withdraw</Text>
        </TouchableOpacity>
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
  steps: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing.lg,
    paddingHorizontal: spacing.gutter,
    marginBottom: spacing.lg,
  },
  stepItem: {
    alignItems: 'center',
    gap: 4,
  },
  stepDot: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.surfaceContainerHigh,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepDotActive: {
    backgroundColor: colors.brandOrange,
  },
  stepDotText: {
    ...typography.bodySm,
    color: colors.outline,
    fontWeight: '700',
  },
  stepDotTextActive: {
    color: colors.black,
  },
  stepLabel: {
    ...typography.bodySm,
    color: colors.outline,
    fontSize: 11,
  },
  stepLabelActive: {
    color: colors.brandOrange,
    fontWeight: '600',
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.gutter,
  },
  available: {
    ...typography.bodySm,
    color: colors.primary,
    fontWeight: '600',
    marginBottom: spacing.md,
    textAlign: 'center',
  },
  sectionTitle: {
    ...typography.labelCaps,
    color: colors.outline,
    marginBottom: spacing.sm,
    marginTop: spacing.md,
  },
  methodsRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  methodBtn: {
    flex: 1,
    alignItems: 'center',
    gap: spacing.xs,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.glassBorder,
  },
  methodBtnActive: {
    borderColor: colors.brandOrange,
  },
  methodLabel: {
    ...typography.bodySm,
    color: colors.outline,
    fontSize: 12,
  },
  methodLabelActive: {
    color: colors.brandOrange,
    fontWeight: '600',
  },
  addressCard: {
    padding: spacing.md,
    marginTop: spacing.sm,
  },
  addressLabel: {
    ...typography.bodySm,
    color: colors.outline,
    fontSize: 12,
    marginBottom: spacing.xs,
  },
  addressInput: {
    color: colors.onSurface,
    fontSize: 14,
    paddingVertical: spacing.sm,
  },
  amountCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
  },
  amountInput: {
    flex: 1,
    color: colors.onSurface,
    fontSize: 32,
    fontWeight: '700',
  },
  amountLabel: {
    ...typography.bodySm,
    color: colors.outline,
  },
  summaryCard: {
    padding: spacing.md,
    marginTop: spacing.md,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: spacing.xs,
  },
  summaryLabel: {
    ...typography.bodySm,
    color: colors.outline,
  },
  summaryValue: {
    ...typography.bodySm,
    color: colors.onSurface,
    fontWeight: '600',
  },
  divider: {
    height: 1,
    backgroundColor: colors.glassBorder,
    marginVertical: spacing.xs,
  },
  withdrawBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    backgroundColor: colors.brandOrange,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.DEFAULT,
    marginTop: spacing.lg,
  },
  withdrawBtnText: {
    ...typography.titleMd,
    color: colors.black,
    fontWeight: '700',
  },
});
