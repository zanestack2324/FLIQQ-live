import { View, Text, StyleSheet, ScrollView, Switch } from 'react-native';
import { useState, useEffect, useRef } from 'react';
import { colors, typography, spacing } from '../theme';
import { GlassCard } from '../components/GlassCard';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../hooks/useAuth';
import { useUserSettings } from '../hooks/useUserSettings';

interface SettingRowProps {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  description: string;
  value: boolean;
  onValueChange: (v: boolean) => void;
}

function SettingRow({ icon, label, description, value, onValueChange }: SettingRowProps) {
  return (
    <View style={styles.row}>
      <Ionicons name={icon} size={22} color={colors.primary} />
      <View style={styles.rowInfo}>
        <Text style={styles.rowLabel}>{label}</Text>
        <Text style={styles.rowDescription}>{description}</Text>
      </View>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ false: colors.surfaceContainerHigh, true: colors.primaryContainer }}
        thumbColor={value ? colors.primary : colors.outline}
      />
    </View>
  );
}

export function NotificationSettingsScreen() {
  const { user } = useAuth();
  const { settings: backendSettings, update } = useUserSettings(user?.id);
  const initialized = useRef(false);
  const [settings, setSettings] = useState({
    liveStart: true,
    newFollower: true,
    giftReceived: true,
    chatMention: false,
    streamReminder: true,
    weeklyDigest: false,
    marketing: false,
  } as Record<string, boolean>);

  useEffect(() => {
    if (backendSettings && !initialized.current) {
      initialized.current = true;
      setSettings(backendSettings as unknown as Record<string, boolean>);
    }
  }, [backendSettings]);

  const toggle = (key: keyof typeof settings) => {
    const newValue = !settings[key];
    setSettings((prev) => ({ ...prev, [key]: newValue }));
    update({ [key]: newValue } as any);
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.title}>Notifications</Text>
      </View>
      <Text style={styles.sectionLabel}>Push Notifications</Text>
      <GlassCard style={styles.card}>
        <SettingRow
          icon="radio"
          label="Live Stream Start"
          description="When a creator you follow goes live"
          value={settings.liveStart}
          onValueChange={() => toggle('liveStart')}
        />
        <View style={styles.divider} />
        <SettingRow
          icon="person-add"
          label="New Follower"
          description="When someone follows you"
          value={settings.newFollower}
          onValueChange={() => toggle('newFollower')}
        />
        <View style={styles.divider} />
        <SettingRow
          icon="gift"
          label="Gift Received"
          description="When you receive a gift/donation"
          value={settings.giftReceived}
          onValueChange={() => toggle('giftReceived')}
        />
        <View style={styles.divider} />
        <SettingRow
          icon="at"
          label="Chat Mentions"
          description="When someone mentions you in chat"
          value={settings.chatMention}
          onValueChange={() => toggle('chatMention')}
        />
      </GlassCard>
      <Text style={styles.sectionLabel}>Email Notifications</Text>
      <GlassCard style={styles.card}>
        <SettingRow
          icon="calendar"
          label="Stream Reminders"
          description="Reminders for upcoming streams"
          value={settings.streamReminder}
          onValueChange={() => toggle('streamReminder')}
        />
        <View style={styles.divider} />
        <SettingRow
          icon="newspaper"
          label="Weekly Digest"
          description="Weekly activity summary"
          value={settings.weeklyDigest}
          onValueChange={() => toggle('weeklyDigest')}
        />
        <View style={styles.divider} />
        <SettingRow
          icon="megaphone"
          label="Marketing & Promos"
          description="Promotional offers and updates"
          value={settings.marketing}
          onValueChange={() => toggle('marketing')}
        />
      </GlassCard>
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
  sectionLabel: {
    ...typography.labelCaps,
    color: colors.outline,
    marginHorizontal: spacing.gutter,
    marginBottom: spacing.sm,
    marginTop: spacing.md,
  },
  card: {
    marginHorizontal: spacing.gutter,
    padding: spacing.md,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: spacing.xs,
  },
  rowInfo: {
    flex: 1,
  },
  rowLabel: {
    ...typography.bodySm,
    color: colors.onSurface,
    fontWeight: '600',
  },
  rowDescription: {
    ...typography.bodySm,
    color: colors.outline,
    fontSize: 12,
  },
  divider: {
    height: 1,
    backgroundColor: colors.glassBorder,
    marginVertical: spacing.sm,
  },
});
