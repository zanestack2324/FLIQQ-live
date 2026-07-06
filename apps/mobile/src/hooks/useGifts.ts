import { useState, useEffect, useCallback } from 'react';
import { getGiftCatalog, sendGift, subscribeToGifts } from '@fliqq/sdk';
import type { GiftCatalog, Gift } from '@fliqq/sdk';

export function useGiftCatalog() {
  const [catalog, setCatalog] = useState<GiftCatalog[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => { getGiftCatalog().then(d => { setCatalog(d); setLoading(false); }); }, []);
  return { catalog, loading };
}

export function useSendGift() {
  const [sending, setSending] = useState(false);
  const send = useCallback(async (senderId: string, receiverId: string, streamId: string | null, giftType: string, diamondAmount: number) => {
    setSending(true);
    await sendGift(senderId, receiverId, streamId, giftType, diamondAmount);
    setSending(false);
  }, []);
  return { sending, send };
}

export function useStreamGifts(streamId: string | undefined) {
  const [gifts, setGifts] = useState<Gift[]>([]);
  useEffect(() => {
    if (!streamId) return;
    const unsub = subscribeToGifts(streamId, (gift) => setGifts(prev => [gift, ...prev]));
    return unsub;
  }, [streamId]);
  return { gifts };
}

