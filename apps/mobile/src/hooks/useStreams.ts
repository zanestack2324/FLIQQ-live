import { useState, useEffect, useCallback } from 'react';
import { getLiveStreams, getTrendingStreams, getFollowingStreams, getRecommendedStreams, searchStreams, getStreamsByCategory, getCategories } from '@fliqq/sdk';
import type { Stream, StreamCategory } from '@fliqq/sdk';

export function useLiveStreams() {
  const [streams, setStreams] = useState<Stream[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      const data = await getLiveStreams();
      if (!cancelled) { setStreams(data); setLoading(false); }
    })();
    return () => { cancelled = true; };
  }, []);
  const refresh = useCallback(async () => {
    setLoading(true);
    setStreams(await getLiveStreams());
    setLoading(false);
  }, []);
  return { streams, loading, refresh };
}

export function useTrendingStreams() {
  const [streams, setStreams] = useState<Stream[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => { getTrendingStreams().then(d => { setStreams(d); setLoading(false); }); }, []);
  return { streams, loading };
}

export function useFollowingStreams(userId: string | undefined) {
  const [streams, setStreams] = useState<Stream[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => { if (!userId) return; getFollowingStreams(userId).then(d => { setStreams(d); setLoading(false); }); }, [userId]);
  return { streams, loading };
}

export function useRecommendedStreams(userId: string | undefined) {
  const [streams, setStreams] = useState<Stream[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => { if (!userId) return; getRecommendedStreams(userId).then(d => { setStreams(d); setLoading(false); }); }, [userId]);
  return { streams, loading };
}

export function useSearchStreams() {
  const [results, setResults] = useState<Stream[]>([]);
  const [searching, setSearching] = useState(false);
  const search = useCallback(async (query: string) => {
    if (!query.trim()) { setResults([]); return; }
    setSearching(true);
    setResults(await searchStreams(query));
    setSearching(false);
  }, []);
  return { results, searching, search };
}

export function useCategories() {
  const [categories, setCategories] = useState<StreamCategory[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => { getCategories().then(d => { setCategories(d); setLoading(false); }); }, []);
  return { categories, loading };
}

export function useStreamsByCategory(slug: string | undefined) {
  const [streams, setStreams] = useState<Stream[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => { if (!slug) return; getStreamsByCategory(slug).then(d => { setStreams(d); setLoading(false); }); }, [slug]);
  return { streams, loading };
}

