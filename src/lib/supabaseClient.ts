// Supabase removed: stubbed client to aid migration to local API.
// Keep this file as a temporary shim. Use `src/lib/apiClient.ts` for new API calls.

console.warn("Supabase client has been disabled. The app has been migrated to a local API.");

export const supabase: any = {
  from: () => ({ then: (fn: any) => fn({ data: [], error: new Error('Supabase removed') }) }),
  auth: {
    signInWithPassword: async () => ({ error: { message: 'Supabase removed' } }),
    signOut: async () => ({ error: { message: 'Supabase removed' } }),
    getSession: async () => ({ data: null }),
    onAuthStateChange: (_cb: any) => ({ data: null, unsubscribe: () => {} }),
  },
};

export function getSupabaseConfigSummary() {
  return {
    url: null,
    anonKeySet: false,
    origin: typeof window !== 'undefined' ? window.location.origin : null,
  };
}

