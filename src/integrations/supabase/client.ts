// Safe Supabase client wrapper.
// This file provides a no-op fallback when required env vars are missing.
// Keep the generated client (client.orig.ts) for reference.

import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import type { Database } from './types';

const runtimeEnv = (window as unknown as { __ENV__?: Record<string, string> }).__ENV__ ?? {};

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
  const noopResult = { data: null, error: null, count: null };
  const noopSubscription = { unsubscribe: () => {} };

  const createNoopQuery = () => {
    const chain: any = {
      select: () => chain,
      insert: () => chain,
      update: () => chain,
      delete: () => chain,
      upsert: () => chain,
      eq: () => chain,
      neq: () => chain,
      gt: () => chain,
      gte: () => chain,
      lt: () => chain,
      lte: () => chain,
      like: () => chain,
      ilike: () => chain,
      is: () => chain,
      in: () => chain,
      or: () => chain,
      and: () => chain,
      not: () => chain,
      filter: () => chain,
      match: () => chain,
      order: () => chain,
      limit: () => chain,
      range: () => chain,
      single: () => chain,
      maybeSingle: () => chain,
      csv: () => chain,
      then: (resolve: any) => Promise.resolve(noopResult).then(resolve),
      catch: (reject: any) => Promise.resolve(noopResult).catch(reject),
    };
    return chain;
  };

  const from = () => createNoopQuery();

  return {
    auth: {
      getSession: async () => ({ data: { session: null }, error: null }),
      getUser: async () => ({ data: { user: null }, error: null }),
      onAuthStateChange: () => ({ data: { subscription: noopSubscription } }),
      signOut: async () => ({ data: null, error: null }),
      signInWithPassword: async () => ({ data: null, error: null }),
      signUp: async () => ({ data: null, error: null }),
    },
    from,
    rpc: async () => noopResult,
    functions: {
      invoke: async () => ({ data: null, error: null }),
    },
    channel: () => ({
      on: () => ({ subscribe: () => ({}) }),
      subscribe: () => ({}),
    }),
    removeChannel: async () => {},
    storage: {
      from: () => ({
        upload: async () => ({ data: null, error: null }),
        getPublicUrl: () => ({ data: { publicUrl: "" } }),
        download: async () => ({ data: null, error: null }),
        remove: async () => ({ data: null, error: null }),
        list: async () => ({ data: null, error: null }),
      }),
    },
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
