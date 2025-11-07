'use client';

import { useState, useEffect } from 'react';
import {
  Search,
  Filter,
  Plus,
  Download,
  ChevronDown,
  Calendar,
  DollarSign,
  TrendingUp,
  Eye
} from 'lucide-react';
import Link from 'next/link';
import CampaignCard from '@/components/dashboard/advertiser/campaign-card';

// Mock data
const mockCampaigns = [
  {
    id: '1',
    title: 'Lancement Produit Tech 2025',
    status: 'ACTIVE' as const,
    budget: 2000,
    remainingBudget: 1200,
    submissions: 45,
    approvedSubmissions: 38,
    totalViews: 125000,
    platform: 'TIKTOK' as const,
    endDate: new Date('2025-03-15'),
    createdAt: new Date('2025-01-01'),
  },
  {
    id: '2',
    title: 'Campagne Mode Printemps',
    status: 'ACTIVE' as const,
    budget: 1500,
    remainingBudget: 800,
    submissions: 32,
    approvedSubmissions: 28,
    totalViews: 89000,
    platform: 'INSTAGRAM' as const,
    endDate: new Date('2025-02-28'),
    createdAt: new Date('2025-01-05'),
  },
  {
    id: '3',
    title: 'Promo Gaming Setup',
    status: 'PENDING' as const,
    budget: 1000,
    remainingBudget: 1000,
    submissions: 0,
    approvedSubmissions: 0,
    totalViews: 0,
    platform: 'YOUTUBE' as const,
    endDate: new Date('2025-04-01'),
    createdAt: new Date('2025-01-08'),
  },
  {
    id: '4',
    title: 'Black Friday Electronics',
    status: 'COMPLETED' as const,
    budget: 3000,
    remainingBudget: 0,
    submissions: 78,
    approvedSubmissions: 65,
    totalViews: 250000,
    platform: 'TIKTOK' as const,
    endDate: new Date('2024-11-30'),
    createdAt: new Date('2024-10-01'),
  },
  {
    id: '5',
    title: 'Campagne Fitness Nouvel An',
    status: 'PAUSED' as const,
    budget: 1200,
    remainingBudget: 600,
    submissions: 20,
    approvedSubmissions: 18,
    totalViews: 45000,
    platform: 'INSTAGRAM' as const,
    endDate: new Date('2025-02-15'),
    createdAt: new Date('2024-12-20'),
  },
];

export default function CampaignsPage() {
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [filteredCampaigns, setFilteredCampaigns] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [platformFilter, setPlatformFilter] = useState('ALL');
  const [sortBy, setSortBy] = useState('createdAt');
  const [isLoading, setIsLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);

  // Stats
  const stats = {
    total: campaigns.length,
    active: campaigns.filter(c => c.status === 'ACTIVE').length,
    pending: campaigns.filter(c => c.status === 'PENDING' || c.status === 'DRAFT').length,
    completed: campaigns.filter(c => c.status === 'COMPLETED').length,
    totalBudget: campaigns.reduce((sum, c) => sum + Number(c.budget), 0),
    totalSpent: campaigns.reduce((sum, c) => sum + (Number(c.budget) - Number(c.remainingBudget)), 0),
    totalViews: campaigns.reduce((sum, c) => sum + c.totalViews, 0),
  };

  useEffect(() => {
    fetchCampaigns();
  }, []);

  useEffect(() => {
    filterAndSortCampaigns();
  }, [campaigns, searchTerm, statusFilter, platformFilter, sortBy]);

  const fetchCampaigns = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/advertiser/campaigns');
      if (!response.ok) {
        throw new Error('Failed to fetch campaigns');
      }
      const data = await response.json();
      
      // Transform data to match expected format
      const transformedData = data.map((campaign: any) => ({
        id: campaign.id,
        title: campaign.title,
        status: campaign.status,
        budget: Number(campaign.budget),
        remainingBudget: Number(campaign.remainingBudget),
        submissions: campaign.totalSubmissions || 0,
        approvedSubmissions: campaign.approvedSubmissions || 0,
        totalViews: campaign.totalViews || 0,
        platform: campaign.targetPlatforms?.[0] || 'TIKTOK',
        endDate: new Date(campaign.endDate),
        createdAt: new Date(campaign.createdAt),
      }));
      
      setCampaigns(transformedData);
    } catch (error) {
      console.error('Error fetching campaigns:', error);
      // Fallback to mock data on error
      setCampaigns(mockCampaigns);
    } finally {
      setIsLoading(false);
    }
  };

  const filterAndSortCampaigns = () => {
    let filtered = [...campaigns];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(campaign =>
        campaign.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== 'ALL') {
      filtered = filtered.filter(campaign => campaign.status === statusFilter);
    }

    // Platform filter
    if (platformFilter !== 'ALL') {
      filtered = filtered.filter(campaign => campaign.platform === platformFilter);
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'createdAt':
          return b.createdAt.getTime() - a.createdAt.getTime();
        case 'budget':
          return b.budget - a.budget;
        case 'views':
          return b.totalViews - a.totalViews;
        case 'endDate':
          return a.endDate.getTime() - b.endDate.getTime();
        default:
          return 0;
      }
    });

    setFilteredCampaigns(filtered);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`;
    }
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`;
    }
    return num.toString();
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
            Mes Campagnes
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-gray-500 dark:text-gray-400">
            Gérez et suivez vos campagnes publicitaires
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
          <button className="inline-flex items-center justify-center px-3 sm:px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
            <Download className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
            Exporter
          </button>
          <Link
            href="/dashboard/advertiser/campaigns/new"
            className="inline-flex items-center justify-center px-3 sm:px-4 py-2 bg-orange-600 text-white text-sm rounded-lg hover:bg-orange-700 transition-colors"
          >
            <Plus className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
            Nouvelle Campagne
          </Link>
        </div>
      </div>

      {/* Stats Cards - Responsive grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-3 sm:p-4">
          <div className="flex items-center justify-between gap-2">
            <div className="flex-1 min-w-0">
              <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 truncate">Total Campagnes</p>
              <p className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-white">{stats.total}</p>
            </div>
            <div className="p-2 sm:p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg flex-shrink-0">
              <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 text-orange-600 dark:text-orange-400" />
            </div>
          </div>
          <div className="mt-2 flex flex-wrap items-center gap-x-2 text-xs">
            <span className="text-green-600 dark:text-green-400 font-medium whitespace-nowrap">
              {stats.active} actives
            </span>
            <span className="text-gray-400 hidden xs:inline">•</span>
            <span className="text-yellow-600 dark:text-yellow-400 font-medium whitespace-nowrap">
              {stats.pending} en attente
            </span>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-3 sm:p-4">
          <div className="flex items-center justify-between gap-2">
            <div className="flex-1 min-w-0">
              <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 truncate">Budget Total</p>
              <p className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-white truncate">
                {formatCurrency(stats.totalBudget)}
              </p>
            </div>
            <div className="p-2 sm:p-3 bg-green-50 dark:bg-green-900/20 rounded-lg flex-shrink-0">
              <DollarSign className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
          <div className="mt-2 text-xs text-gray-500 dark:text-gray-400 truncate">
            {formatCurrency(stats.totalSpent)} dépensés
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-3 sm:p-4">
          <div className="flex items-center justify-between gap-2">
            <div className="flex-1 min-w-0">
              <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 truncate">Vues Totales</p>
              <p className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-white">
                {formatNumber(stats.totalViews)}
              </p>
            </div>
            <div className="p-2 sm:p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg flex-shrink-0">
              <Eye className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
          <div className="mt-2 text-xs text-green-600 dark:text-green-400 font-medium">
            +23% ce mois
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-3 sm:p-4">
          <div className="flex items-center justify-between gap-2">
            <div className="flex-1 min-w-0">
              <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 truncate">Taux de Conversion</p>
              <p className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-white">3.2%</p>
            </div>
            <div className="p-2 sm:p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg flex-shrink-0">
              <Calendar className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
          <div className="mt-2 text-xs text-gray-500 dark:text-gray-400 truncate">
            Moyenne sur 30 jours
          </div>
        </div>
      </div>

      {/* Filters and Search - Mobile optimized */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-3 sm:p-4">
        <div className="flex flex-col space-y-3">
          {/* Search */}
          <div className="w-full">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 sm:pl-10 pr-3 sm:pr-4 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
          </div>

          {/* Filter buttons - Responsive layout */}
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex-1 sm:flex-initial inline-flex items-center justify-center px-3 sm:px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              <Filter className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
              Filtres
              <ChevronDown className={`h-3 w-3 sm:h-4 sm:w-4 ml-2 transform transition-transform ${showFilters ? 'rotate-180' : ''}`} />
            </button>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="flex-1 sm:flex-initial px-3 sm:px-4 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option value="createdAt">Plus récentes</option>
              <option value="budget">Budget</option>
              <option value="views">Vues</option>
              <option value="endDate">Date de fin</option>
            </select>
          </div>
        </div>

        {/* Expanded Filters - Mobile optimized */}
        {showFilters && (
          <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-gray-200 dark:border-gray-700 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 sm:mb-2">
                Statut
              </label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-2 sm:px-3 py-1.5 sm:py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                <option value="ALL">Tous</option>
                <option value="ACTIVE">Actives</option>
                <option value="PENDING">En attente</option>
                <option value="PAUSED">En pause</option>
                <option value="COMPLETED">Terminées</option>
              </select>
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 sm:mb-2">
                Plateforme
              </label>
              <select
                value={platformFilter}
                onChange={(e) => setPlatformFilter(e.target.value)}
                className="w-full px-2 sm:px-3 py-1.5 sm:py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                <option value="ALL">Toutes</option>
                <option value="TIKTOK">TikTok</option>
                <option value="INSTAGRAM">Instagram</option>
                <option value="YOUTUBE">YouTube</option>
              </select>
            </div>

            <div className="sm:col-span-2 lg:col-span-1 flex items-end">
              <button
                onClick={() => {
                  setStatusFilter('ALL');
                  setPlatformFilter('ALL');
                  setSearchTerm('');
                }}
                className="w-full px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                Réinitialiser les filtres
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Campaigns Grid - Responsive */}
      {filteredCampaigns.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
          {filteredCampaigns.map((campaign) => (
            <div key={campaign.id} className="relative">
              <CampaignCard campaign={campaign} />
              {(campaign.status === 'PAUSED' || campaign.status === 'COMPLETED') && (
                <div className="absolute top-4 right-4 z-20">
                  <Link
                    href={`/dashboard/advertiser/campaigns/${campaign.id}/reactivate`}
                    className="inline-flex items-center px-3 py-1.5 bg-orange-600 text-white text-xs font-medium rounded-lg hover:bg-orange-700 transition-colors shadow-lg"
                  >
                    Réactiver
                  </Link>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-12 text-center">
          <div className="max-w-md mx-auto">
            <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              Aucune campagne trouvée
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6">
              {searchTerm || statusFilter !== 'ALL' || platformFilter !== 'ALL'
                ? "Essayez de modifier vos filtres de recherche"
                : "Créez votre première campagne pour commencer"}
            </p>
            {!searchTerm && statusFilter === 'ALL' && platformFilter === 'ALL' && (
              <Link
                href="/dashboard/advertiser/campaigns/new"
                className="inline-flex items-center px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
              >
                <Plus className="h-5 w-5 mr-2" />
                Créer une campagne
              </Link>
            )}
          </div>
        </div>
      )}
    </div>
  );
}