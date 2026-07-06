import { useState, useEffect, useCallback } from 'react';
import { getNotifications, markNotificationRead, markAllNotificationsRead, subscribeToNotifications } from '@fliqq/sdk';
import type { Notification } from '@fliqq/sdk';

export function useNotifications(userId: string | undefined) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;
    let cancelled = false;
    (async () => {
      setLoading(true);
      const data = await getNotifications(userId);
      if (!cancelled) {
        setNotifications(data);
        setUnreadCount(data.filter(n => !n.read).length);
        setLoading(false);
      }
    })();
    const unsub = subscribeToNotifications(userId, (notif) => {
      setNotifications(prev => [notif, ...prev]);
      setUnreadCount(c => c + 1);
    });
    return () => { cancelled = true; unsub(); };
  }, [userId]);

  const refresh = useCallback(async () => {
    if (!userId) return;
    setLoading(true);
    const data = await getNotifications(userId);
    setNotifications(data);
    setUnreadCount(data.filter(n => !n.read).length);
    setLoading(false);
  }, [userId]);

  const markRead = useCallback(async (id: string) => {
    await markNotificationRead(id);
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    setUnreadCount(c => Math.max(0, c - 1));
  }, []);

  const markAllRead = useCallback(async () => {
    if (!userId) return;
    await markAllNotificationsRead(userId);
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    setUnreadCount(0);
  }, [userId]);

  return { notifications, unreadCount, loading, markRead, markAllRead, refresh };
}

