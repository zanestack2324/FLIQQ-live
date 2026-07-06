import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors, typography, spacing, borderRadius } from '../theme';
import { GlassCard } from '../components/GlassCard';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../hooks/useAuth';
import { useVerification } from '../hooks/useVerification';
import * as ImagePicker from 'expo-image-picker';

export function UploadIDDocumentScreen() {
  const { user } = useAuth();
  const { submit } = useVerification(user?.id);

  const handleUpload = async (documentType: string) => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      quality: 0.8,
    });
    if (!result.canceled && result.assets[0]) {
      submit(documentType, result.assets[0].uri);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity>
          <Ionicons name="chevron-back" size={28} color={colors.onSurface} />
        </TouchableOpacity>
        <Text style={styles.title}>Upload ID</Text>
        <View style={{ width: 28 }} />
      </View>
      <View style={styles.content}>
        <Text style={styles.instruction}>Select a document type to upload</Text>
        <GlassCard style={styles.optionCard}>
          <Ionicons name="id-card" size={40} color={colors.primary} />
          <Text style={styles.optionTitle}>Passport</Text>
          <Text style={styles.optionDesc}>Accepted from any country</Text>
          <TouchableOpacity style={styles.uploadBtn} onPress={() => handleUpload('passport')}>
            <Ionicons name="cloud-upload-outline" size={20} color={colors.black} />
            <Text style={styles.uploadBtnText}>Upload</Text>
          </TouchableOpacity>
        </GlassCard>
        <GlassCard style={styles.optionCard}>
          <Ionicons name="card" size={40} color={colors.primary} />
          <Text style={styles.optionTitle}>Driver's License</Text>
          <Text style={styles.optionDesc}>Valid government-issued license</Text>
          <TouchableOpacity style={styles.uploadBtn} onPress={() => handleUpload('drivers_license')}>
            <Ionicons name="cloud-upload-outline" size={20} color={colors.black} />
            <Text style={styles.uploadBtnText}>Upload</Text>
          </TouchableOpacity>
        </GlassCard>
        <GlassCard style={styles.optionCard}>
          <Ionicons name="document-text" size={40} color={colors.primary} />
          <Text style={styles.optionTitle}>National ID Card</Text>
          <Text style={styles.optionDesc}>Government-issued ID card</Text>
          <TouchableOpacity style={styles.uploadBtn} onPress={() => handleUpload('national_id')}>
            <Ionicons name="cloud-upload-outline" size={20} color={colors.black} />
            <Text style={styles.uploadBtnText}>Upload</Text>
          </TouchableOpacity>
        </GlassCard>
        <Text style={styles.disclaimer}>
          Your documents are encrypted and securely stored. We'll notify you once verification is complete.
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
  instruction: {
    ...typography.bodySm,
    color: colors.outline,
    textAlign: 'center',
  },
  optionCard: {
    padding: spacing.lg,
    alignItems: 'center',
    gap: spacing.sm,
  },
  optionTitle: {
    ...typography.titleMd,
    color: colors.onSurface,
    fontSize: 18,
  },
  optionDesc: {
    ...typography.bodySm,
    color: colors.outline,
    fontSize: 12,
  },
  uploadBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    backgroundColor: colors.brandOrange,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.DEFAULT,
    marginTop: spacing.sm,
  },
  uploadBtnText: {
    color: colors.black,
    fontWeight: '700',
    fontSize: 13,
  },
  disclaimer: {
    ...typography.bodySm,
    color: colors.outline,
    fontSize: 12,
    textAlign: 'center',
    marginTop: spacing.md,
  },
});
