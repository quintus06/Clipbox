'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  Video,
  Search,
  Filter,
  MoreVertical,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  DollarSign,
  Users,
  Calendar,
  TrendingUp,
  Ban,
  Play,
  Pause,
  Edit,
  Trash2,
  Download,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown
} from 'lucide-react';

interface Campaign {
  id: string;
  title: string;
  advertiser: {
    name: string;
    company: string;
    verified: boolean;
  };
  status: 'pending' | 'active' | 'paused' | 'completed' | 'rejected';
  budget: number;
  spent: number;
  submissions: number;
  views: number;
  startDate: Date;
  endDate: Date;
  platforms: string[];
  createdAt: Date;
  priority: 'low' | 'medium' | 'high';
}

export default function AdminCampaignsPage() {
  const searchParams = useSearchParams();
  const statusFilter = searchParams.get('status') || 'all';
  
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCampaigns, setSelectedCampaigns] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<'date' | 'budget' | 'status'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);
  const [showActionModal, setShowActionModal] = useState(false);
  const [actionType, setActionType] = useState<'validate' | 'reject' | 'pause' | 'delete'>('validate');

  // Mock data
  useEffect(() => {
    const mockCampaigns: Campaign[] = [
      {
        id: '1',
        title: 'Campagne Nike Air Max 2024',
        advertiser: {
          name: 'John Doe',
          company: 'Nike France',
          verified: true
        },
        status: 'pending',
        budget: 50000,
        spent: 0,
        submissions: 0,
        views: 0,
        startDate: new Date('2024-02-01'),
        endDate: new Date('2024-03-01'),
        platforms: ['TikTok', 'Instagram'],
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
        priority: 'high'
      },
      {
        id: '2',
        title: 'Lancement Produit Cosmétique Bio',
        advertiser: {
          name: 'Marie Dupont',
          company: 'Beauty Corp',
          verified: true
        },
        status: 'active',
        budget: 25000,
        spent: 12500,
        submissions: 45,
        views: 125000,
        startDate: new Date('2024-01-15'),
        endDate: new Date('2024-02-15'),
        platforms: ['Instagram', 'YouTube'],
        createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        priority: 'medium'
      },
      {
        id: '3',
        title: 'Promotion Application Mobile',
        advertiser: {
          name: 'Tech Startup',
          company: 'AppDev Inc',
          verified: false
        },
        status: 'pending',
        budget: 15000,
        spent: 0,
        submissions: 0,
        views: 0,
        startDate: new Date('2024-02-10'),
        endDate: new Date('2024-02-25'),
        platforms: ['TikTok'],
        createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000),
        priority: 'medium'
      },
      {
        id: '4',
        title: 'Collection Été 2024',
        advertiser: {
          name: 'Fashion Brand',
          company: 'Style Co',
          verified: true
        },
        status: 'active',
        budget: 35000,
        spent: 28000,
        submissions: 89,
        views: 450000,
        startDate: new Date('2024-01-01'),
        endDate: new Date('2024-02-28'),
        platforms: ['Instagram', 'TikTok', 'YouTube'],
        createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        priority: 'low'
      },
      {
        id: '5',
        title: 'Campagne Alimentaire Healthy',
        advertiser: {
          name: 'Food Company',
          company: 'Healthy Foods',
          verified: true
        },
        status: 'paused',
        budget: 20000,
        spent: 8000,
        submissions: 23,
        views: 67000,
        startDate: new Date('2024-01-20'),
        endDate: new Date('2024-02-20'),
        platforms: ['Instagram'],
        createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
        priority: 'low'
      }
    ];

    // Filter by status if needed
    let filtered = mockCampaigns;
    if (statusFilter !== 'all') {
      filtered = mockCampaigns.filter(c => c.status === statusFilter);
    }

    setTimeout(() => {
      setCampaigns(filtered);
      setIsLoading(false);
    }, 1000);
  }, [statusFilter]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30';
      case 'active':
        return 'text-green-600 bg-green-100 dark:bg-green-900/30';
      case 'paused':
        return 'text-orange-600 bg-orange-100 dark:bg-orange-900/30';
      case 'completed':
        return 'text-blue-600 bg-blue-100 dark:bg-blue-900/30';
      case 'rejected':
        return 'text-red-600 bg-red-100 dark:bg-red-900/30';
      default:
        return 'text-gray-600 bg-gray-100 dark:bg-gray-900/30';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4" />;
      case 'active':
        return <Play className="h-4 w-4" />;
      case 'paused':
        return <Pause className="h-4 w-4" />;
      case 'completed':
        return <CheckCircle className="h-4 w-4" />;
      case 'rejected':
        return <XCircle className="h-4 w-4" />;
      default:
        return <AlertTriangle className="h-4 w-4" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'text-red-600';
      case 'medium':
        return 'text-yellow-600';
      case 'low':
        return 'text-green-600';
      default:
        return 'text-gray-600';
    }
  };

  const handleBulkAction = (action: string) => {
    console.log(`Bulk action: ${action} on campaigns:`, selectedCampaigns);
    // Implémenter l'action en masse
    setSelectedCampaigns([]);
  };

  const handleCampaignAction = (campaign: Campaign, action: 'validate' | 'reject' | 'pause' | 'delete') => {
    setSelectedCampaign(campaign);
    setActionType(action);
    setShowActionModal(true);
  };

  const confirmAction = () => {
    console.log(`Action ${actionType} on campaign:`, selectedCampaign);
    // Implémenter l'action
    setShowActionModal(false);
    setSelectedCampaign(null);
  };

  const stats = [
    {
      label: 'Total campagnes',
      value: campaigns.length,
      icon: Video,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100 dark:bg-purple-900/30'
    },
    {
      label: 'En attente',
      value: campaigns.filter(c => c.status === 'pending').length,
      icon: Clock,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100 dark:bg-yellow-900/30'
    },
    {
      label: 'Actives',
      value: campaigns.filter(c => c.status === 'active').length,
      icon: Play,
      color: 'text-green-600',
      bgColor: 'bg-green-100 dark:bg-green-900/30'
    },
    {
      label: 'Budget total',
      value: `€${campaigns.reduce((sum, c) => sum + c.budget, 0).toLocaleString()}`,
      icon: DollarSign,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100 dark:bg-blue-900/30'
    }
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Gestion des campagnes
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Gérez et modérez toutes les campagnes de la plateforme
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center gap-2">
            <Download className="h-4 w-4" />
            Exporter
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {stat.label}
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                  {stat.value}
                </p>
              </div>
              <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                <stat.icon className={`h-6 w-6 ${stat.color}`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Filters and Search */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Rechercher une campagne..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </div>

          {/* Filters */}
          <div className="flex gap-2">
            <select
              value={statusFilter}
              onChange={(e) => window.location.href = `/dashboard/admin/campaigns?status=${e.target.value}`}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900"
            >
              <option value="all">Tous les statuts</option>
              <option value="pending">En attente</option>
              <option value="active">Actives</option>
              <option value="paused">En pause</option>
              <option value="completed">Terminées</option>
              <option value="rejected">Rejetées</option>
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900"
            >
              <option value="date">Date</option>
              <option value="budget">Budget</option>
              <option value="status">Statut</option>
            </select>

            <button
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              className="p-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              <ArrowUpDown className="h-5 w-5 text-gray-600 dark:text-gray-400" />
            </button>

            <button
              onClick={() => setShowFilters(!showFilters)}
              className="p-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              <Filter className="h-5 w-5 text-gray-600 dark:text-gray-400" />
            </button>
          </div>
        </div>

        {/* Bulk Actions */}
        {selectedCampaigns.length > 0 && (
          <div className="mt-4 p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg flex items-center justify-between">
            <span className="text-sm text-purple-600 dark:text-purple-400">
              {selectedCampaigns.length} campagne(s) sélectionnée(s)
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => handleBulkAction('validate')}
                className="px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700"
              >
                Valider
              </button>
              <button
                onClick={() => handleBulkAction('reject')}
                className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700"
              >
                Rejeter
              </button>
              <button
                onClick={() => handleBulkAction('pause')}
                className="px-3 py-1 text-sm bg-orange-600 text-white rounded hover:bg-orange-700"
              >
                Mettre en pause
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Campaigns Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
              <tr>
                <th className="px-6 py-3 text-left">
                  <input
                    type="checkbox"
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedCampaigns(campaigns.map(c => c.id));
                      } else {
                        setSelectedCampaigns([]);
                      }
                    }}
                    className="rounded border-gray-300 dark:border-gray-600"
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Campagne
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Annonceur
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Statut
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Budget
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Performance
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Période
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {campaigns.map((campaign) => (
                <tr
                  key={campaign.id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-900"
                >
                  <td className="px-6 py-4">
                    <input
                      type="checkbox"
                      checked={selectedCampaigns.includes(campaign.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedCampaigns([...selectedCampaigns, campaign.id]);
                        } else {
                          setSelectedCampaigns(selectedCampaigns.filter(id => id !== campaign.id));
                        }
                      }}
                      className="rounded border-gray-300 dark:border-gray-600"
                    />
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {campaign.title}
                        </p>
                        <span className={`text-xs font-medium ${getPriorityColor(campaign.priority)}`}>
                          {campaign.priority === 'high' ? '●' : campaign.priority === 'medium' ? '◐' : '○'}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        {campaign.platforms.map((platform) => (
                          <span
                            key={platform}
                            className="text-xs px-2 py-0.5 bg-gray-100 dark:bg-gray-700 rounded"
                          >
                            {platform}
                          </span>
                        ))}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <p className="text-sm text-gray-900 dark:text-white">
                        {campaign.advertiser.company}
                      </p>
                      <div className="flex items-center gap-1 mt-1">
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {campaign.advertiser.name}
                        </p>
                        {campaign.advertiser.verified && (
                          <CheckCircle className="h-3 w-3 text-blue-500" />
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(campaign.status)}`}>
                      {getStatusIcon(campaign.status)}
                      <span>
                        {campaign.status === 'pending' && 'En attente'}
                        {campaign.status === 'active' && 'Active'}
                        {campaign.status === 'paused' && 'En pause'}
                        {campaign.status === 'completed' && 'Terminée'}
                        {campaign.status === 'rejected' && 'Rejetée'}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        €{campaign.budget.toLocaleString()}
                      </p>
                      <div className="mt-1">
                        <div className="w-24 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                          <div
                            className="bg-purple-600 h-2 rounded-full"
                            style={{ width: `${(campaign.spent / campaign.budget) * 100}%` }}
                          />
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          €{campaign.spent.toLocaleString()} dépensés
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm">
                      <div className="flex items-center gap-4">
                        <div>
                          <p className="text-xs text-gray-500 dark:text-gray-400">Soumissions</p>
                          <p className="font-medium text-gray-900 dark:text-white">{campaign.submissions}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 dark:text-gray-400">Vues</p>
                          <p className="font-medium text-gray-900 dark:text-white">
                            {campaign.views > 1000 ? `${(campaign.views / 1000).toFixed(1)}k` : campaign.views}
                          </p>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      <p>{campaign.startDate.toLocaleDateString()}</p>
                      <p>{campaign.endDate.toLocaleDateString()}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        className="p-1 text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400"
                        title="Voir détails"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      
                      {campaign.status === 'pending' && (
                        <>
                          <button
                            onClick={() => handleCampaignAction(campaign, 'validate')}
                            className="p-1 text-green-600 hover:text-green-700"
                            title="Valider"
                          >
                            <CheckCircle className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleCampaignAction(campaign, 'reject')}
                            className="p-1 text-red-600 hover:text-red-700"
                            title="Rejeter"
                          >
                            <XCircle className="h-4 w-4" />
                          </button>
                        </>
                      )}
                      
                      {campaign.status === 'active' && (
                        <button
                          onClick={() => handleCampaignAction(campaign, 'pause')}
                          className="p-1 text-orange-600 hover:text-orange-700"
                          title="Mettre en pause"
                        >
                          <Pause className="h-4 w-4" />
                        </button>
                      )}
                      
                      {campaign.status === 'paused' && (
                        <button
                          className="p-1 text-green-600 hover:text-green-700"
                          title="Reprendre"
                        >
                          <Play className="h-4 w-4" />
                        </button>
                      )}
                      
                      <button
                        className="p-1 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                      >
                        <MoreVertical className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Affichage de 1 à {campaigns.length} sur {campaigns.length} campagnes
            </p>
            <div className="flex items-center gap-2">
              <button
                disabled={currentPage === 1}
                className="p-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <span className="px-3 py-1 border border-purple-600 bg-purple-50 dark:bg-purple-900/30 text-purple-600 rounded-lg">
                1
              </span>
              <button
                disabled
                className="p-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Action Modal */}
      {showActionModal && selectedCampaign && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Confirmer l'action
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Êtes-vous sûr de vouloir {actionType === 'validate' ? 'valider' : actionType === 'reject' ? 'rejeter' : actionType === 'pause' ? 'mettre en pause' : 'supprimer'} la campagne "{selectedCampaign.title}" ?
            </p>
            
            {actionType === 'reject' && (
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Raison du rejet
                </label>
                <textarea
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900"
                  rows={3}
                  placeholder="Expliquez la raison du rejet..."
                />
              </div>
            )}
            
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowActionModal(false)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                Annuler
              </button>
              <button
                onClick={confirmAction}
                className={`px-4 py-2 rounded-lg text-white ${
                  actionType === 'validate' ? 'bg-green-600 hover:bg-green-700' :
                  actionType === 'reject' ? 'bg-red-600 hover:bg-red-700' :
                  actionType === 'pause' ? 'bg-orange-600 hover:bg-orange-700' :
                  'bg-red-600 hover:bg-red-700'
                }`}
              >
                Confirmer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}