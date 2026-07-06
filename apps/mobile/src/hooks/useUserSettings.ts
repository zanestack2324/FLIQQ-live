import { useState, useEffect, useCallback } from 'react';
import { getUserSettings, updateUserSettings } from '@fliqq/sdk';
import type { UserSettings } from '@fliqq/sdk';

export function useUserSettings(userId: string | undefined) {
  const [settings, setSettings] = useState<UserSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!userId) return;
    let cancelled = false;
    (async () => {
      setLoading(true);
      const data = await getUserSettings(userId);
      if (!cancelled) { setSettings(data); setLoading(false); }
    })();
    return () => { cancelled = true; };
  }, [userId]);

  const refresh = useCallback(async () => {
    if (!userId) return;
    setLoading(true);
    setSettings(await getUserSettings(userId));
    setLoading(false);
  }, [userId]);

  const update = useCallback(async (updates: Partial<UserSettings>) => {
    if (!userId) return;
    setSaving(true);
    await updateUserSettings(userId, updates);
    setSettings(prev => prev ? { ...prev, ...updates } : prev);
    setSaving(false);
  }, [userId]);

  return { settings, loading, saving, update, refresh };
}

