import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors, typography, spacing, borderRadius } from '../theme';
import { GlassCard } from '../components/GlassCard';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../hooks/useAuth';
import { useVerification } from '../hooks/useVerification';

export function VerificationPendingScreen() {
  const { user } = useAuth();
  const { verification } = useVerification(user?.id);

  const isPending = verification?.status === 'pending' || verification?.status === 'under_review';
  const isApproved = verification?.status === 'approved';
  const isRejected = verification?.status === 'rejected';

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <Ionicons
            name={isApproved ? 'checkmark-circle' : isRejected ? 'close-circle' : 'time'}
            size={64}
            color={isApproved ? colors.tertiary : isRejected ? colors.error : colors.brandOrange}
          />
        </View>
        <Text style={styles.title}>
          {isApproved ? 'Verification Approved' : isRejected ? 'Verification Rejected' : 'Verification Pending'}
        </Text>
        <Text style={styles.subtitle}>
          {isApproved
            ? 'Your identity has been verified successfully. You now have access to all features.'
            : isRejected
            ? verification?.rejectionReason || 'Your verification was rejected. Please try again with valid documents.'
            : "We've received your documents and they are being reviewed. This usually takes 24-48 hours."}
        </Text>
        <GlassCard style={styles.statusCard}>
          <View style={styles.statusRow}>
            <Ionicons
              name="checkmark-circle"
              size={20}
              color={isPending || isApproved ? colors.tertiary : colors.outline}
            />
            <Text style={[styles.statusText, { color: isPending || isApproved ? colors.onSurface : colors.outline }]}>
              Documents Received
            </Text>
          </View>
          <View style={styles.statusRow}>
            <Ionicons
              name={isApproved ? 'checkmark-circle' : isRejected ? 'close-circle' : 'time'}
              size={20}
              color={isApproved ? colors.tertiary : isRejected ? colors.error : colors.brandOrange}
            />
            <Text style={[styles.statusText, { color: isApproved ? colors.onSurface : isRejected ? colors.error : colors.onSurface }]}>
              Under Review
            </Text>
          </View>
          <View style={styles.statusRow}>
            <Ionicons
              name={isApproved ? 'checkmark-circle' : isRejected ? 'close-circle' : 'ellipse'}
              size={20}
              color={isApproved ? colors.tertiary : isRejected ? colors.error : colors.outline}
            />
            <Text style={[styles.statusText, { color: isApproved ? colors.onSurface : isRejected ? colors.error : colors.outline }]}>
              Approved
            </Text>
          </View>
        </GlassCard>
        <TouchableOpacity style={styles.supportBtn}>
          <Ionicons name="mail-outline" size={20} color={colors.primary} />
          <Text style={styles.supportBtnText}>Contact Support</Text>
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
  content: {
    flex: 1,
    paddingHorizontal: spacing.gutter,
    justifyContent: 'center',
    alignItems: 'center',
    gap: spacing.md,
  },
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255,140,0,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  title: {
    ...typography.headlineLgMobile,
    color: colors.onSurface,
  },
  subtitle: {
    ...typography.bodySm,
    color: colors.outline,
    textAlign: 'center',
    lineHeight: 22,
  },
  statusCard: {
    width: '100%',
    padding: spacing.lg,
    gap: spacing.md,
    marginTop: spacing.md,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  statusText: {
    ...typography.bodySm,
    color: colors.onSurface,
    fontWeight: '500',
  },
  supportBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: borderRadius.DEFAULT,
    borderWidth: 1,
    borderColor: colors.primary,
    marginTop: spacing.md,
  },
  supportBtnText: {
    ...typography.bodySm,
    color: colors.primary,
    fontWeight: '600',
  },
});
