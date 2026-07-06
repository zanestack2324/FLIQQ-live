import { supabase } from './client';
import { User } from '../../../shared/src/types';

export async function signUp(email: string, password: string, username: string, displayName: string) {
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { username, displayName },
    },
  });
  if (authError) throw authError;
  if (authData.user) {
    const { error: profileError } = await supabase.from('users').insert({
      id: authData.user.id,
      email,
      username,
      displayName,
      avatarUrl: null,
      bio: null,
      role: 'user',
      accountStatus: 'active',
      isVerified: false,
      followerCount: 0,
      followingCount: 0,
    });
    if (profileError) throw profileError;
    await supabase.from('wallets').insert({ userId: authData.user.id });
    await supabase.from('user_settings').insert({ userId: authData.user.id });
  }
  return authData;
}

export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
  return data;
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

export async function getCurrentUser(): Promise<User | null> {
  const { data: { user: authUser } } = await supabase.auth.getUser();
  if (!authUser) return null;
  const { data } = await supabase
    .from('users')
    .select('*')
    .eq('id', authUser.id)
    .single();
  return data as User | null;
}

export function onAuthStateChange(callback: (user: User | null) => void) {
  return supabase.auth.onAuthStateChange(async (_event, session) => {
    if (session?.user) {
      const { data } = await supabase
        .from('users')
        .select('*')
        .eq('id', session.user.id)
        .single();
      callback(data as User | null);
    } else {
      callback(null);
    }
  });
}

export async function resetPassword(email: string) {
  const { error } = await supabase.auth.resetPasswordForEmail(email);
  if (error) throw error;
}

export async function updateProfile(userId: string, updates: Partial<User>) {
  const { error } = await supabase
    .from('users')
    .update(updates)
    .eq('id', userId);
  if (error) throw error;
}



