import { createClient } from '@supabase/supabase-js';

// Types pour la base de données
export interface Database {
  public: {
    Tables: {
      campaigns: {
        Row: {
          id: string;
          title: string;
          description: string;
          brand: string;
          category: string;
          budget: number;
          status: string;
          start_date: string;
          end_date: string;
          requirements: string;
          created_at: string;
          updated_at: string;
          advertiser_id: string;
          search_vector?: any;
        };
        Insert: Omit<Database['public']['Tables']['campaigns']['Row'], 'id' | 'created_at' | 'updated_at' | 'search_vector'>;
        Update: Partial<Database['public']['Tables']['campaigns']['Insert']>;
      };
      users: {
        Row: {
          id: string;
          email: string;
          name: string;
          role: 'clipper' | 'advertiser' | 'admin';
          bio?: string;
          avatar_url?: string;
          created_at: string;
          updated_at: string;
          search_vector?: any;
        };
        Insert: Omit<Database['public']['Tables']['users']['Row'], 'id' | 'created_at' | 'updated_at' | 'search_vector'>;
        Update: Partial<Database['public']['Tables']['users']['Insert']>;
      };
      support_tickets: {
        Row: {
          id: string;
          user_id: string;
          subject: string;
          message: string;
          category: string;
          priority: 'low' | 'normal' | 'high' | 'urgent';
          status: 'open' | 'in_progress' | 'resolved' | 'closed';
          assigned_to?: string;
          created_at: string;
          updated_at: string;
          search_vector?: any;
        };
        Insert: Omit<Database['public']['Tables']['support_tickets']['Row'], 'id' | 'created_at' | 'updated_at' | 'search_vector'>;
        Update: Partial<Database['public']['Tables']['support_tickets']['Insert']>;
      };
      submissions: {
        Row: {
          id: string;
          campaign_id: string;
          clipper_id: string;
          video_url: string;
          status: 'pending' | 'approved' | 'rejected' | 'revision_requested';
          feedback?: string;
          views: number;
          engagement_rate: number;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['submissions']['Row'], 'id' | 'created_at' | 'updated_at' | 'views' | 'engagement_rate'>;
        Update: Partial<Database['public']['Tables']['submissions']['Insert']>;
      };
      payments: {
        Row: {
          id: string;
          clipper_id: string;
          campaign_id: string;
          submission_id: string;
          amount: number;
          status: 'pending' | 'processing' | 'completed' | 'failed';
          payment_method?: string;
          transaction_id?: string;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['payments']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['payments']['Insert']>;
      };
    };
    Views: {};
    Functions: {
      global_search: {
        Args: {
          search_term: string;
          search_type?: string;
          result_limit?: number;
        };
        Returns: {
          campaigns: any[];
          users: any[];
          tickets: any[];
        };
      };
      search_campaigns: {
        Args: {
          search_term: string;
          result_limit?: number;
        };
        Returns: Array<{
          id: string;
          title: string;
          description: string;
          brand: string;
          budget: number;
          status: string;
          created_at: string;
          rank: number;
        }>;
      };
      search_users: {
        Args: {
          search_term: string;
          result_limit?: number;
        };
        Returns: Array<{
          id: string;
          name: string;
          email: string;
          role: string;
          created_at: string;
          rank: number;
        }>;
      };
      search_tickets: {
        Args: {
          search_term: string;
          result_limit?: number;
        };
        Returns: Array<{
          id: string;
          subject: string;
          category: string;
          status: string;
          priority: string;
          created_at: string;
          rank: number;
        }>;
      };
    };
    Enums: {};
  };
}

// Configuration Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase environment variables are not configured. Search functionality will be limited.');
}

// Client public pour le côté client
export const supabase = supabaseUrl && supabaseAnonKey 
  ? createClient<Database>(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    })
  : null;

// Client admin pour le côté serveur (API routes)
// Note: Ne jamais utiliser ce client côté client!
export const createServerSupabaseClient = () => {
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  
  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error('Supabase server configuration is missing');
  }
  
  return createClient<Database>(supabaseUrl, supabaseServiceKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
};

// Helper functions pour les opérations courantes
export const searchHelpers = {
  // Recherche globale
  async globalSearch(query: string, limit = 10) {
    if (!supabase) return { campaigns: [], users: [], tickets: [] };
    
    const { data, error } = await supabase.rpc('global_search', {
      search_term: query,
      result_limit: limit,
    });
    
    if (error) {
      console.error('Search error:', error);
      return { campaigns: [], users: [], tickets: [] };
    }
    
    return data || { campaigns: [], users: [], tickets: [] };
  },

  // Recherche de campagnes
  async searchCampaigns(query: string, limit = 10) {
    if (!supabase) return [];
    
    const { data, error } = await supabase.rpc('search_campaigns', {
      search_term: query,
      result_limit: limit,
    });
    
    if (error) {
      console.error('Campaign search error:', error);
      return [];
    }
    
    return data || [];
  },

  // Recherche d'utilisateurs
  async searchUsers(query: string, limit = 10) {
    if (!supabase) return [];
    
    const { data, error } = await supabase.rpc('search_users', {
      search_term: query,
      result_limit: limit,
    });
    
    if (error) {
      console.error('User search error:', error);
      return [];
    }
    
    return data || [];
  },

  // Recherche de tickets
  async searchTickets(query: string, limit = 10) {
    if (!supabase) return [];
    
    const { data, error } = await supabase.rpc('search_tickets', {
      search_term: query,
      result_limit: limit,
    });
    
    if (error) {
      console.error('Ticket search error:', error);
      return [];
    }
    
    return data || [];
  },
};

// Export des types pour utilisation dans l'application
export type Campaign = Database['public']['Tables']['campaigns']['Row'];
export type User = Database['public']['Tables']['users']['Row'];
export type SupportTicket = Database['public']['Tables']['support_tickets']['Row'];
export type Submission = Database['public']['Tables']['submissions']['Row'];
export type Payment = Database['public']['Tables']['payments']['Row'];