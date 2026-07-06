import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { colors, typography, spacing, borderRadius } from '../theme';
import { GlassCard } from '../components/GlassCard';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../hooks/useAuth';
import { useVerification } from '../hooks/useVerification';

const STEPS = [
  { icon: 'id-card', label: 'Government ID', description: 'Passport, Driver\'s License, or ID Card' },
  { icon: 'camera', label: 'Selfie', description: 'Take a live photo for verification' },
  { icon: 'document-text', label: 'Proof of Address', description: 'Utility bill or bank statement' },
  { icon: 'checkmark-circle', label: 'Review', description: 'We\'ll verify within 24-48 hours' },
];

export function IdentityVerificationScreen() {
  const { user } = useAuth();
  const { verification } = useVerification(user?.id);

  const isPending = verification?.status === 'pending' || verification?.status === 'under_review';

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.title}>Identity Verification</Text>
        <Text style={styles.subtitle}>Verify your identity to unlock all features including withdrawals and higher earning limits.</Text>
      </View>
      <GlassCard style={styles.infoCard}>
        <Ionicons name="shield-checkmark" size={40} color={colors.primary} />
        <Text style={styles.infoTitle}>Why Verify?</Text>
        <Text style={styles.infoText}>
          Identity verification helps keep our community safe and secure. Your documents are encrypted and never shared without your consent.
        </Text>
      </GlassCard>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Steps</Text>
        {STEPS.map((step, i) => (
          <View key={i} style={styles.stepRow}>
            <View style={styles.stepNumber}>
              <Text style={styles.stepNumberText}>{i + 1}</Text>
            </View>
            <View style={styles.stepContent}>
              <Text style={styles.stepLabel}>{step.label}</Text>
              <Text style={styles.stepDesc}>{step.description}</Text>
            </View>
            <Ionicons name={step.icon as any} size={24} color={colors.primary} />
          </View>
        ))}
      </View>
      <TouchableOpacity style={styles.startBtn}>
        <Ionicons name="arrow-forward" size={20} color={colors.black} />
        <Text style={styles.startBtnText}>{isPending ? 'Verification in Progress' : 'Start Verification'}</Text>
      </TouchableOpacity>
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
    paddingHorizontal: spacing.gutter,
    paddingTop: 60,
    paddingBottom: spacing.md,
  },
  title: {
    ...typography.headlineLgMobile,
    color: colors.onSurface,
  },
  subtitle: {
    ...typography.bodySm,
    color: colors.outline,
    marginTop: spacing.sm,
  },
  infoCard: {
    marginHorizontal: spacing.gutter,
    padding: spacing.lg,
    alignItems: 'center',
    gap: spacing.sm,
  },
  infoTitle: {
    ...typography.titleMd,
    color: colors.onSurface,
  },
  infoText: {
    ...typography.bodySm,
    color: colors.outline,
    textAlign: 'center',
  },
  section: {
    marginTop: spacing.lg,
    paddingHorizontal: spacing.gutter,
  },
  sectionTitle: {
    ...typography.titleMd,
    color: colors.onSurface,
    marginBottom: spacing.md,
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    marginBottom: spacing.md,
  },
  stepNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.primaryContainer,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepNumberText: {
    ...typography.titleMd,
    color: colors.onPrimaryContainer,
    fontSize: 14,
  },
  stepContent: {
    flex: 1,
  },
  stepLabel: {
    ...typography.bodySm,
    color: colors.onSurface,
    fontWeight: '600',
  },
  stepDesc: {
    ...typography.bodySm,
    color: colors.outline,
    fontSize: 12,
  },
  startBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    backgroundColor: colors.brandOrange,
    marginHorizontal: spacing.gutter,
    marginTop: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.DEFAULT,
  },
  startBtnText: {
    ...typography.titleMd,
    color: colors.black,
    fontWeight: '700',
  },
});
