import { useState, useEffect, useCallback } from 'react';
import { getChatMessages, sendChatMessage, subscribeToStreamChat } from '@fliqq/sdk';
import type { ChatMessage } from '@fliqq/sdk';

export function useChat(streamId: string | undefined) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    if (!streamId) return;
    getChatMessages(streamId).then(setMessages);
    const unsub = subscribeToStreamChat(streamId, (msg) => setMessages(prev => [...prev, msg]));
    return unsub;
  }, [streamId]);

  const send = useCallback(async (userId: string, message: string) => {
    if (!streamId || !message.trim()) return;
    setSending(true);
    await sendChatMessage(streamId, userId, message);
    setSending(false);
  }, [streamId]);

  return { messages, sending, send };
}

