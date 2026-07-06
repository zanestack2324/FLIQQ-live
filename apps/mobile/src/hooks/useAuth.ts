import { useState, useEffect, useCallback } from 'react';
import { signIn, signUp, signOut, getCurrentUser, onAuthStateChange } from '@fliqq/sdk';
import type { User } from '@fliqq/sdk';

interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

export function useAuth() {
  const [state, setState] = useState<AuthState>({ user: null, isLoading: true, isAuthenticated: false });

  useEffect(() => {
    getCurrentUser().then((user) => setState({ user, isLoading: false, isAuthenticated: !!user }));
    const sub = onAuthStateChange((user) => setState({ user, isLoading: false, isAuthenticated: !!user }));
    return () => sub.data?.subscription?.unsubscribe();
  }, []);

  const login = useCallback(async (email: string, password: string) => { await signIn(email, password); }, []);
  const register = useCallback(async (email: string, password: string, username: string, displayName: string) => {
    await signUp(email, password, username, displayName);
  }, []);
  const logout = useCallback(async () => {
    await signOut();
    setState({ user: null, isLoading: false, isAuthenticated: false });
  }, []);

  return { ...state, login, register, logout };
}

