import { View, Text, StyleSheet } from 'react-native';
import { colors, typography, spacing, borderRadius } from '../theme';
import { Ionicons } from '@expo/vector-icons';

interface TransactionItemProps {
  type: 'purchase' | 'tip' | 'withdraw' | 'reward';
  title: string;
  date: string;
  amount: string;
  isPositive?: boolean;
}

const typeIcons: Record<string, keyof typeof Ionicons.glyphMap> = {
  purchase: 'card',
  tip: 'heart',
  withdraw: 'arrow-down-circle',
  reward: 'gift',
};

export function TransactionItem({ type, title, date, amount, isPositive = false }: TransactionItemProps) {
  return (
    <View style={styles.row}>
      <View style={styles.iconContainer}>
        <Ionicons name={typeIcons[type] || 'ellipse'} size={20} color={colors.primary} />
      </View>
      <View style={styles.info}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.date}>{date}</Text>
      </View>
      <Text style={[styles.amount, isPositive ? styles.positive : styles.negative]}>
        {isPositive ? '+' : '-'}{amount}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    gap: spacing.md,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.lg,
    backgroundColor: colors.glassBackground,
    alignItems: 'center',
    justifyContent: 'center',
  },
  info: {
    flex: 1,
  },
  title: {
    ...typography.bodySm,
    color: colors.onSurface,
    fontWeight: '600',
  },
  date: {
    ...typography.bodySm,
    color: colors.outline,
    fontSize: 12,
    marginTop: 2,
  },
  amount: {
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
});
