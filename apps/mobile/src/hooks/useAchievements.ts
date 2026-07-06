import { useState, useEffect } from 'react';
import { getAchievements } from '@fliqq/sdk';
import type { Achievement } from '@fliqq/sdk';

export function useAchievements(userId: string | undefined) {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => { if (!userId) return; getAchievements(userId).then(d => { setAchievements(d); setLoading(false); }); }, [userId]);
  return { achievements, loading };
}

