import { NextRequest, NextResponse } from 'next/server';

// Mock data pour la démonstration
const mockData = {
  campaigns: [
    {
      id: '1',
      title: 'Campagne Nike Air Max',
      description: 'Promotion des nouvelles Nike Air Max 2024',
      brand: 'Nike',
      category: 'Sport',
      budget: 5000,
      status: 'active',
      created_at: '2024-01-15T10:00:00Z'
    },
    {
      id: '2',
      title: 'Lancement Adidas Ultraboost',
      description: 'Présentation de la nouvelle gamme Ultraboost',
      brand: 'Adidas',
      category: 'Sport',
      budget: 4500,
      status: 'active',
      created_at: '2024-01-14T09:00:00Z'
    },
    {
      id: '3',
      title: 'Collection Zara Printemps',
      description: 'Nouvelle collection printemps-été 2024',
      brand: 'Zara',
      category: 'Mode',
      budget: 3000,
      status: 'active',
      created_at: '2024-01-13T08:00:00Z'
    },
    {
      id: '4',
      title: 'Samsung Galaxy S24',
      description: 'Lancement du nouveau smartphone Galaxy S24',
      brand: 'Samsung',
      category: 'Tech',
      budget: 8000,
      status: 'active',
      created_at: '2024-01-12T07:00:00Z'
    },
    {
      id: '5',
      title: 'Apple Vision Pro',
      description: 'Découvrez le casque de réalité mixte Apple',
      brand: 'Apple',
      category: 'Tech',
      budget: 10000,
      status: 'pending',
      created_at: '2024-01-11T06:00:00Z'
    }
  ],
  users: [
    {
      id: '1',
      name: 'Jean Dupont',
      email: 'jean.dupont@example.com',
      role: 'clipper',
      created_at: '2024-01-01T00:00:00Z'
    },
    {
      id: '2',
      name: 'Marie Martin',
      email: 'marie.martin@example.com',
      role: 'clipper',
      created_at: '2024-01-02T00:00:00Z'
    },
    {
      id: '3',
      name: 'Pierre Bernard',
      email: 'pierre.bernard@example.com',
      role: 'advertiser',
      created_at: '2024-01-03T00:00:00Z'
    },
    {
      id: '4',
      name: 'Sophie Leroy',
      email: 'sophie.leroy@example.com',
      role: 'admin',
      created_at: '2024-01-04T00:00:00Z'
    },
    {
      id: '5',
      name: 'Lucas Moreau',
      email: 'lucas.moreau@example.com',
      role: 'clipper',
      created_at: '2024-01-05T00:00:00Z'
    }
  ],
  tickets: [
    {
      id: '1',
      subject: 'Problème de paiement',
      category: 'Paiement',
      status: 'open',
      priority: 'high',
      created_at: '2024-01-20T10:00:00Z'
    },
    {
      id: '2',
      subject: 'Question sur les campagnes',
      category: 'Général',
      status: 'resolved',
      priority: 'normal',
      created_at: '2024-01-19T09:00:00Z'
    },
    {
      id: '3',
      subject: 'Bug dans l\'interface',
      category: 'Technique',
      status: 'in_progress',
      priority: 'urgent',
      created_at: '2024-01-18T08:00:00Z'
    },
    {
      id: '4',
      subject: 'Demande de fonctionnalité',
      category: 'Suggestion',
      status: 'open',
      priority: 'low',
      created_at: '2024-01-17T07:00:00Z'
    }
  ]
};

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get('q');
  const type = searchParams.get('type') || 'all';
  const limit = parseInt(searchParams.get('limit') || '10');

  if (!query || query.length < 2) {
    return NextResponse.json({ 
      results: { campaigns: [], users: [], tickets: [] } 
    });
  }

  // Vérifier si Supabase est configuré
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (supabaseUrl && supabaseServiceKey) {
    try {
      // Importer dynamiquement Supabase seulement si configuré
      const { createClient } = await import('@supabase/supabase-js').catch(() => ({ createClient: null }));
      
      if (!createClient) {
        throw new Error('Supabase module not available');
      }
      
      const supabase = createClient(supabaseUrl, supabaseServiceKey);

      let results: any = {
        campaigns: [],
        users: [],
        tickets: []
      };

      // Recherche selon le type
      if (type === 'all' || type === 'campaigns') {
        const { data: campaigns } = await supabase
          .from('campaigns')
          .select('*')
          .or(`title.ilike.%${query}%,description.ilike.%${query}%,brand.ilike.%${query}%`)
          .limit(limit);
        
        results.campaigns = campaigns || [];
      }

      if (type === 'all' || type === 'users') {
        const { data: users } = await supabase
          .from('users')
          .select('id, name, email, role, created_at')
          .or(`name.ilike.%${query}%,email.ilike.%${query}%`)
          .limit(limit);
        
        results.users = users || [];
      }

      if (type === 'all' || type === 'tickets') {
        const { data: tickets } = await supabase
          .from('support_tickets')
          .select('*')
          .or(`subject.ilike.%${query}%,message.ilike.%${query}%,category.ilike.%${query}%`)
          .limit(limit);
        
        results.tickets = tickets || [];
      }

      return NextResponse.json({ 
        results,
        query,
        type,
        count: {
          campaigns: results.campaigns.length,
          users: results.users.length,
          tickets: results.tickets.length,
          total: results.campaigns.length + results.users.length + results.tickets.length
        }
      });
    } catch (error) {
      console.error('Supabase search error:', error);
      // Fallback vers les données mock
    }
  }

  // Utiliser les données mock si Supabase n'est pas configuré ou en cas d'erreur
  const lowerQuery = query.toLowerCase();
  const results: any = {
    campaigns: [],
    users: [],
    tickets: []
  };

  // Recherche dans les données mock
  if (type === 'all' || type === 'campaigns') {
    results.campaigns = mockData.campaigns.filter(campaign =>
      campaign.title.toLowerCase().includes(lowerQuery) ||
      campaign.description.toLowerCase().includes(lowerQuery) ||
      campaign.brand.toLowerCase().includes(lowerQuery) ||
      campaign.category.toLowerCase().includes(lowerQuery)
    ).slice(0, limit);
  }

  if (type === 'all' || type === 'users') {
    results.users = mockData.users.filter(user =>
      user.name.toLowerCase().includes(lowerQuery) ||
      user.email.toLowerCase().includes(lowerQuery) ||
      user.role.toLowerCase().includes(lowerQuery)
    ).slice(0, limit);
  }

  if (type === 'all' || type === 'tickets') {
    results.tickets = mockData.tickets.filter(ticket =>
      ticket.subject.toLowerCase().includes(lowerQuery) ||
      ticket.category.toLowerCase().includes(lowerQuery) ||
      ticket.status.toLowerCase().includes(lowerQuery)
    ).slice(0, limit);
  }

  return NextResponse.json({ 
    results,
    query,
    type,
    count: {
      campaigns: results.campaigns.length,
      users: results.users.length,
      tickets: results.tickets.length,
      total: results.campaigns.length + results.users.length + results.tickets.length
    },
    mock: true // Indicateur que les données sont des mocks
  });
}