import { useState, useEffect, useCallback } from 'react';
import { getVerificationStatus, submitVerification } from '@fliqq/sdk';
import type { IdentityVerification } from '@fliqq/sdk';

export function useVerification(userId: string | undefined) {
  const [verification, setVerification] = useState<IdentityVerification | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;
    let cancelled = false;
    (async () => {
      setLoading(true);
      const data = await getVerificationStatus(userId);
      if (!cancelled) { setVerification(data); setLoading(false); }
    })();
    return () => { cancelled = true; };
  }, [userId]);

  const refresh = useCallback(async () => {
    if (!userId) return;
    setLoading(true);
    setVerification(await getVerificationStatus(userId));
    setLoading(false);
  }, [userId]);

  const submit = useCallback(async (documentType: string, documentUrl: string, selfieUrl?: string) => {
    if (!userId) return;
    await submitVerification(userId, documentType, documentUrl, selfieUrl);
    await refresh();
  }, [userId, refresh]);

  return { verification, loading, submit, refresh };
}

