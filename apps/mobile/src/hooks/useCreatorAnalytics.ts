import { useState, useEffect } from 'react';
import { getCreatorAnalytics, getRecentStreams } from '@fliqq/sdk';
import type { Stream } from '@fliqq/sdk';

export interface CreatorAnalytics {
  totalViews: number;
  totalFollowers: number;
  totalDiamonds: number;
  avgWatchTime: number;
  earningsMonth: number;
  pendingPayout: number;
}

export function useCreatorAnalytics(userId: string | undefined) {
  const [analytics, setAnalytics] = useState<CreatorAnalytics | null>(null);
  const [recentStreams, setRecentStreams] = useState<Stream[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;
    Promise.all([getCreatorAnalytics(userId), getRecentStreams(userId)]).then(([a, s]) => {
      setAnalytics(a);
      setRecentStreams(s);
      setLoading(false);
    });
  }, [userId]);

  return { analytics, recentStreams, loading };
}

