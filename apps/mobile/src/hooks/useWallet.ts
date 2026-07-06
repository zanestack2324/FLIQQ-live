import { useState, useEffect, useCallback } from 'react';
import { getWallet, getTransactions, getDiamondPackages, diamondPurchase } from '@fliqq/sdk';
import type { Wallet, Transaction, DiamondPackage } from '@fliqq/sdk';

export function useWallet(userId: string | undefined) {
  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;
    let cancelled = false;
    (async () => {
      setLoading(true);
      const [w, t] = await Promise.all([getWallet(userId), getTransactions(userId)]);
      if (!cancelled) { setWallet(w); setTransactions(t); setLoading(false); }
    })();
    return () => { cancelled = true; };
  }, [userId]);

  const refresh = useCallback(async () => {
    if (!userId) return;
    setLoading(true);
    const [w, t] = await Promise.all([getWallet(userId), getTransactions(userId)]);
    setWallet(w); setTransactions(t); setLoading(false);
  }, [userId]);

  return { wallet, transactions, loading, refresh };
}

export function useDiamondPackages() {
  const [packages, setPackages] = useState<DiamondPackage[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => { getDiamondPackages().then(d => { setPackages(d); setLoading(false); }); }, []);
  return { packages, loading };
}

export function usePurchaseDiamond() {
  const [purchasing, setPurchasing] = useState(false);
  const purchase = useCallback(async (userId: string, pkgId: string, provider: 'stripe' | 'revenuecat', paymentId: string) => {
    setPurchasing(true);
    await diamondPurchase(userId, pkgId, provider, paymentId);
    setPurchasing(false);
  }, []);
  return { purchasing, purchase };
}

