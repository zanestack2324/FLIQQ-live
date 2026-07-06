import { supabase } from './client';
import type { RealtimePostgresChangesPayload } from '@supabase/supabase-js';
import type { ChatMessage, Notification } from '../../../shared/src/types';

const POSTGRES_CHANGES = 'postgres_changes' as any;

function postgresChangesFilter(
  event: 'INSERT' | 'UPDATE' | 'DELETE' | '*',
  table: string,
  filter?: string,
): { event: string; schema: string; table: string; filter?: string } {
  return {
    event,
    schema: 'public',
    table,
    ...(filter ? { filter } : {}),
  };
}

export function subscribeToStreamChat(
  streamId: string,
  onMessage: (msg: ChatMessage) => void,
): () => void {
  const channel = supabase
    .channel(`chat:${streamId}`)
    .on(
      POSTGRES_CHANGES,
      postgresChangesFilter('INSERT', 'chat_messages', `streamId=eq.${streamId}`),
      (payload: any) => {
        onMessage(payload.new as ChatMessage);
      },
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}

export function subscribeToStreamViewerCount(
  streamId: string,
  onCount: (count: number) => void,
): () => void {
  const channel = supabase
    .channel(`viewers:${streamId}`)
    .on(
      POSTGRES_CHANGES,
      postgresChangesFilter('UPDATE', 'streams', `id=eq.${streamId}`),
      (payload: any) => {
        if (payload.new && typeof payload.new.viewerCount === 'number') {
          onCount(payload.new.viewerCount);
        }
      },
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}

export function subscribeToNotifications(
  userId: string,
  onNotification: (notif: Notification) => void,
): () => void {
  const channel = supabase
    .channel(`notifications:${userId}`)
    .on(
      POSTGRES_CHANGES,
      postgresChangesFilter('INSERT', 'notifications', `userId=eq.${userId}`),
      (payload: any) => {
        onNotification(payload.new as Notification);
      },
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}

export function subscribeToStreamStatus(
  userId: string,
  onStatus: (stream: { userId: string; isLive: boolean }) => void,
): () => void {
  const channel = supabase
    .channel(`stream_status:${userId}`)
    .on(
      POSTGRES_CHANGES,
      postgresChangesFilter('*', 'streams', `userId=eq.${userId}`),
      (payload: any) => {
        if (payload.new) {
          onStatus({
            userId: payload.new.userId,
            isLive: payload.new.isLive,
          });
        } else if (payload.old) {
          onStatus({
            userId: payload.old.userId,
            isLive: false,
          });
        }
      },
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}

export function subscribeToPollVotes(
  pollId: string,
  onVote: (optionId: string) => void,
): () => void {
  const channel = supabase
    .channel(`poll_votes:${pollId}`)
    .on(
      POSTGRES_CHANGES,
      postgresChangesFilter('INSERT', 'poll_votes', `pollId=eq.${pollId}`),
      (payload: any) => {
        onVote(payload.new.optionId);
      },
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}

export function subscribeToPKBattleUpdates(
  battleId: string,
  onUpdate: (battle: any) => void,
): () => void {
  const channel = supabase
    .channel(`pk_battle:${battleId}`)
    .on(
      POSTGRES_CHANGES,
      postgresChangesFilter('*', 'pk_battles', `id=eq.${battleId}`),
      (payload: any) => {
        onUpdate(payload.new);
      },
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}

export function subscribeToRaid(
  streamId: string,
  onRaid: (raid: any) => void,
): () => void {
  const channel = supabase
    .channel(`raids:${streamId}`)
    .on(
      POSTGRES_CHANGES,
      postgresChangesFilter('INSERT', 'raids', `targetStreamId=eq.${streamId}`),
      (payload: any) => {
        onRaid(payload.new);
      },
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}

export function subscribeToGifts(
  streamId: string,
  onGift: (gift: any) => void,
): () => void {
  const channel = supabase
    .channel(`gifts:${streamId}`)
    .on(
      POSTGRES_CHANGES,
      postgresChangesFilter('INSERT', 'gifts', `streamId=eq.${streamId}`),
      (payload: any) => {
        onGift(payload.new);
      },
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}



