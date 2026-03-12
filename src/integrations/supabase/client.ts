// Safe Supabase client wrapper.
// This file provides a no-op fallback when required env vars are missing.
// Keep the generated client (client.orig.ts) for reference.

import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import type { Database } from './types';

const runtimeEnv = (window as unknown as { __ENV__?: Record<string, string> }).__ENV ?? {};

export const SUPABASE_URL =
  import.meta.env.VITE_SUPABASE_URL ||
  runtimeEnv.VITE_SUPABASE_URL ||
  "";
export const SUPABASE_PUBLISHABLE_KEY =
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
  runtimeEnv.VITE_SUPABASE_PUBLISHABLE_KEY ||
  "";

export const isSupabaseConfigured = Boolean(SUPABASE_URL && SUPABASE_PUBLISHABLE_KEY);

if (!isSupabaseConfigured) {
  const missing = [
    SUPABASE_URL ? null : 'VITE_SUPABASE_URL',
    SUPABASE_PUBLISHABLE_KEY ? null : 'VITE_SUPABASE_PUBLISHABLE_KEY',
  ].filter(Boolean);

  // Avoid crashing the app in development when env vars are not set.
  console.warn(
    'Supabase configuration is missing required environment variables:',
    missing.join(', '),
  );
}

const createNoopSupabase = () => {
  const noopResult = { data: null, error: null };
  const noopSubscription = { unsubscribe: () => {} };

  const createNoopQuery = () => {
    const chain = {
      select: () => chain,
      eq: () => chain,
      order: () => chain,
      single: () => chain,
      in: () => chain,
      then: (resolve: any) => Promise.resolve(noopResult).then(resolve),
      catch: (reject: any) => Promise.resolve(noopResult).catch(reject),
    } as any;

    return chain;
  };

  const from = () => createNoopQuery();
  const action = async () => noopResult;

  return {
    auth: {
      getSession: async () => ({ data: { session: null }, error: null }),
      onAuthStateChange: () => ({ data: { subscription: noopSubscription } }),
      signOut: async () => ({ data: null, error: null }),
    },
    from,
    insert: action,
    update: action,
    delete: action,
  } as unknown as SupabaseClient<Database>;
};

export const supabase = isSupabaseConfigured
  ? createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
      auth: {
        storage: localStorage,
        persistSession: true,
        autoRefreshToken: true,
      },
    })
  : createNoopSupabase();
