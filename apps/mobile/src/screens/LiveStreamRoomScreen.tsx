import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, typography, spacing, borderRadius } from '../theme';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useChat } from '../hooks/useChat';

const STREAM_ID = 'stream-1';

export function LiveStreamRoomScreen() {
  const { user } = useAuth();
  const { messages, send } = useChat(STREAM_ID);
  const [inputText, setInputText] = useState('');

  const handleSend = () => {
    if (user?.id && inputText.trim()) {
      send(user.id, inputText.trim());
      setInputText('');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.videoArea}>
        <View style={styles.videoPlaceholder} />
        <LinearGradient colors={['transparent', colors.black]} style={styles.videoGradient} />
        <View style={styles.videoControls}>
          <View style={styles.videoTop}>
            <TouchableOpacity style={styles.backBtn}>
              <Ionicons name="chevron-back" size={28} color={colors.white} />
            </TouchableOpacity>
            <View style={styles.streamInfo}>
              <Ionicons name="radio" size={12} color={colors.brandOrange} />
              <Text style={styles.viewerCount}>12.4K</Text>
            </View>
            <TouchableOpacity style={styles.reportBtn}>
              <Ionicons name="ellipsis-vertical" size={20} color={colors.white} />
            </TouchableOpacity>
          </View>
          <View style={styles.videoBottom}>
            <View style={styles.videoUser}>
              <View style={styles.videoAvatar} />
              <View>
                <Text style={styles.videoName}>@ArianaK_Official</Text>
                <Text style={styles.videoTitle}>Exploring New Sounds</Text>
              </View>
            </View>
            <TouchableOpacity style={styles.followBtn}>
              <Text style={styles.followBtnText}>Follow</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.giftBadge}>
          <Ionicons name="gift" size={14} color={colors.brandOrange} />
          <Text style={styles.giftBadgeText}>Send Gifts</Text>
        </View>
      </View>
      <View style={styles.chatSection}>
        <View style={styles.chatHeader}>
          <Text style={styles.chatHeaderText}>Live Chat</Text>
          <Text style={styles.chatCount}>{messages.length}</Text>
        </View>
        <ScrollView style={styles.chatMessages} showsVerticalScrollIndicator={false}>
          {messages.map((msg) => (
            <View key={msg.id} style={styles.chatMsg}>
              <Text style={styles.chatUser}>
                {msg.user.username}:{' '}
                {msg.isMod && <Text style={styles.modTag}>[MOD] </Text>}
              </Text>
              <Text style={styles.chatText}>{msg.message}</Text>
            </View>
          ))}
        </ScrollView>
        <View style={styles.chatInputRow}>
          <TextInput
            style={styles.chatInput}
            placeholder="Send a message..."
            placeholderTextColor={colors.outline}
            value={inputText}
            onChangeText={setInputText}
          />
          <TouchableOpacity style={styles.sendBtn} onPress={handleSend}>
            <Ionicons name="send" size={20} color={colors.white} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.black,
  },
  videoArea: {
    height: '45%',
  },
  videoPlaceholder: {
    ...StyleSheet.absoluteFill,
    backgroundColor: colors.surfaceContainerHigh,
  },
  videoGradient: {
    ...StyleSheet.absoluteFill,
  },
  videoControls: {
    flex: 1,
    justifyContent: 'space-between',
    padding: spacing.gutter,
  },
  videoTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 40,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.4)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  streamInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: borderRadius.full,
  },
  viewerCount: {
    color: colors.white,
    fontSize: 12,
    fontWeight: '600',
  },
  reportBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(0,0,0,0.4)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  videoBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  videoUser: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  videoAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary,
    borderWidth: 2,
    borderColor: colors.white,
  },
  videoName: {
    color: colors.white,
    fontWeight: '700',
    fontSize: 14,
  },
  videoTitle: {
    color: colors.onSurfaceVariant,
    fontSize: 12,
  },
  followBtn: {
    backgroundColor: colors.brandOrange,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs + 2,
    borderRadius: borderRadius.full,
  },
  followBtnText: {
    color: colors.black,
    fontWeight: '700',
    fontSize: 12,
  },
  giftBadge: {
    position: 'absolute',
    bottom: spacing.gutter + 60,
    right: spacing.gutter,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(255,140,0,0.2)',
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: borderRadius.full,
    borderWidth: 1,
    borderColor: colors.brandOrange,
  },
  giftBadgeText: {
    color: colors.brandOrange,
    fontSize: 11,
    fontWeight: '600',
  },
  chatSection: {
    flex: 1,
    backgroundColor: colors.background,
    borderTopLeftRadius: borderRadius.xl,
    borderTopRightRadius: borderRadius.xl,
    marginTop: -20,
    paddingTop: spacing.md,
  },
  chatHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.gutter,
    paddingBottom: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.glassBorder,
  },
  chatHeaderText: {
    ...typography.titleMd,
    color: colors.onSurface,
    fontSize: 16,
  },
  chatCount: {
    ...typography.bodySm,
    color: colors.outline,
  },
  chatMessages: {
    flex: 1,
    paddingHorizontal: spacing.gutter,
    paddingTop: spacing.sm,
  },
  chatMsg: {
    marginBottom: spacing.sm,
  },
  chatUser: {
    color: colors.primary,
    fontWeight: '700',
    fontSize: 13,
  },
  modTag: {
    color: colors.brandOrange,
    fontWeight: '700',
  },
  chatText: {
    color: colors.onSurface,
    fontSize: 13,
    marginLeft: spacing.sm,
  },
  chatInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingHorizontal: spacing.gutter,
    paddingVertical: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.glassBorder,
  },
  chatInput: {
    flex: 1,
    backgroundColor: colors.surface,
    color: colors.onSurface,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.full,
    fontSize: 14,
  },
  sendBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primaryContainer,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
