import { createClient } from '@supabase/supabase-js';
import { projectId, publicAnonKey } from './info';

// Create a singleton Supabase client
let supabaseClient: any = null;
let clientError: Error | null = null;
let initializationAttempted = false;

export function getSupabaseClient() {
  if (clientError) {
    console.error('⚠️ Supabase client previously failed to initialize:', clientError.message);
    // Return a mock client that won't crash the app
    return createMockClient();
  }

  if (!supabaseClient && !initializationAttempted) {
    initializationAttempted = true;
    
    try {
      console.log('🔧 Initializing Supabase client...');
      
      // Validate required configuration
      if (!projectId || !publicAnonKey) {
        throw new Error('Missing Supabase configuration (projectId or publicAnonKey)');
      }

      // Wrap the client creation in a try-catch to handle any network errors
      try {
        supabaseClient = createClient(
          `https://${projectId}.supabase.co`,
          publicAnonKey,
          {
            auth: {
              persistSession: true,
              autoRefreshToken: true,
              detectSessionInUrl: true,
              storageKey: 'brandock-auth-token',
              storage: typeof window !== 'undefined' ? window.localStorage : undefined,
            },
            global: {
              headers: {
                'x-application-name': 'BrandDock',
              },
              fetch: (...args) => {
                // Wrap fetch to catch network errors
                return fetch(...args).catch((error) => {
                  console.error('🌐 Supabase fetch error caught:', error.message);
                  throw error;
                });
              },
            },
          }
        );
        
        console.log('✅ Supabase client initialized successfully');
      } catch (networkError: any) {
        console.error('🌐 Network error during Supabase client creation:', networkError);
        clientError = networkError;
        return createMockClient();
      }
    } catch (error: any) {
      console.error('❌ Failed to initialize Supabase client:', error);
      clientError = error;
      return createMockClient();
    }
  }
  
  return supabaseClient || createMockClient();
}

// Create a mock client for when Supabase is unavailable
function createMockClient() {
  console.warn('⚠️ Using mock Supabase client - features will be limited');
  
  return {
    auth: {
      getSession: async () => {
        console.warn('Mock client: getSession called');
        return { data: { session: null }, error: new Error('Supabase client not available') };
      },
      signInWithPassword: async () => {
        console.warn('Mock client: signInWithPassword called');
        return { data: { user: null, session: null }, error: new Error('Supabase client not available') };
      },
      signUp: async () => {
        console.warn('Mock client: signUp called');
        return { data: { user: null, session: null }, error: new Error('Supabase client not available') };
      },
      signOut: async () => {
        console.warn('Mock client: signOut called');
        return { error: null };
      },
      onAuthStateChange: (callback: any) => {
        console.warn('Mock client: onAuthStateChange called');
        return { data: { subscription: { unsubscribe: () => {} } } };
      },
      getUser: async () => {
        console.warn('Mock client: getUser called');
        return { data: { user: null }, error: new Error('Supabase client not available') };
      },
    },
    from: () => ({
      select: () => ({
        eq: () => ({
          single: async () => ({ data: null, error: new Error('Supabase client not available') }),
        }),
      }),
    }),
  };
}

// Helper to check if the client is available
export function isSupabaseAvailable(): boolean {
  return supabaseClient !== null && clientError === null;
}

// Helper to reset the client (useful for retry logic)
export function resetSupabaseClient() {
  console.log('🔄 Resetting Supabase client...');
  supabaseClient = null;
  clientError = null;
}

// Export the client as default (lazy initialization)
let _cachedClient: any = null;

export const supabase = new Proxy({} as any, {
  get(target, prop) {
    if (!_cachedClient) {
      _cachedClient = getSupabaseClient();
    }
    return _cachedClient[prop];
  },
});