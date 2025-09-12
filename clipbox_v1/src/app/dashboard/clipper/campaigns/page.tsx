'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Search,
  Filter,
  ChevronDown,
  Calendar,
  DollarSign,
  Users,
  Target,
  Clock,
  TrendingUp,
  Video,
  CheckCircle,
  XCircle,
  AlertCircle,
  ArrowRight,
  Star,
  Globe,
  Smartphone
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

// Mock data - will be replaced with API calls
const mockCampaigns = [
  {
    id: '1',
    title: 'Summer Fashion Collection 2024',
    advertiser: {
      name: 'Fashion Brand Co.',
      verified: true,
      rating: 4.8,
      directives: 'Montrez les vêtements portés dans un contexte naturel. Focus sur les détails et la qualité. Utilisez des transitions créatives.',
    },
    description: 'Créez des clips tendance pour notre nouvelle collection été. Montrez votre style unique et votre créativité!',
    requirements: 'Minimum 1000 followers, contenu mode/lifestyle, public 18-35 ans',
    budget: 10000,
    remainingBudget: 7500,
    pricePerClip: 75,
    remunerationPer1000Views: 15,
    platforms: ['TIKTOK', 'INSTAGRAM_REELS'],
    languages: ['FR', 'EN'],
    countries: ['FR', 'BE', 'CH'],
    currentClippers: 23,
    startDate: '2024-02-01',
    endDate: '2024-03-01',
    status: 'ACTIVE',
    tags: ['mode', 'été', 'tendance'],
    thumbnail: 'https://via.placeholder.com/300x200',
    totalViews: 125000,
    totalSubmissions: 45,
    approvedSubmissions: 38,
    isSubscribed: false,
    isEligible: true,
  },
  {
    id: '2',
    title: 'Tech Review - Smartphone Pro Max',
    advertiser: {
      name: 'TechCorp',
      verified: true,
      rating: 4.6,
      directives: 'Unboxing obligatoire. Testez la caméra en conditions réelles. Mentionnez les 3 points forts principaux.',
    },
    description: 'Review détaillée de notre nouveau smartphone. Focus sur les fonctionnalités innovantes et la qualité photo/vidéo.',
    requirements: 'Expérience en tech review, qualité vidéo HD minimum, audience tech-savvy',
    budget: 5000,
    remainingBudget: 3200,
    pricePerClip: 100,
    remunerationPer1000Views: 20,
    platforms: ['YOUTUBE_SHORTS', 'TIKTOK'],
    languages: ['FR'],
    countries: ['FR'],
    currentClippers: 12,
    startDate: '2024-02-05',
    endDate: '2024-02-25',
    status: 'ACTIVE',
    tags: ['tech', 'smartphone', 'review'],
    thumbnail: 'https://via.placeholder.com/300x200',
    totalViews: 89000,
    totalSubmissions: 18,
    approvedSubmissions: 15,
    isSubscribed: true,
    isEligible: true,
  },
  {
    id: '3',
    title: 'Fitness Challenge - 30 Days Transformation',
    advertiser: {
      name: 'FitLife Gym',
      verified: false,
      rating: 4.2,
      directives: 'Montrez votre progression jour après jour. Utilisez nos équipements dans les vidéos. Hashtag #FitLife30Days obligatoire.',
    },
    description: 'Documentez votre transformation fitness sur 30 jours avec nos produits et programmes.',
    requirements: 'Contenu fitness/santé, engagement sur 30 jours, posts réguliers',
    budget: 8000,
    remainingBudget: 6000,
    pricePerClip: 50,
    remunerationPer1000Views: 10,
    platforms: ['INSTAGRAM_REELS', 'TIKTOK'],
    languages: ['FR', 'EN'],
    countries: ['FR', 'BE', 'CA'],
    currentClippers: 67,
    startDate: '2024-02-10',
    endDate: '2024-03-10',
    status: 'ACTIVE',
    tags: ['fitness', 'santé', 'transformation'],
    thumbnail: 'https://via.placeholder.com/300x200',
    totalViews: 234000,
    totalSubmissions: 120,
    approvedSubmissions: 98,
    isSubscribed: false,
    isEligible: false, // Not eligible due to content type mismatch
  },
  {
    id: '4',
    title: 'Beauty Tutorial - Maquillage Naturel',
    advertiser: {
      name: 'Beauty Essentials',
      verified: true,
      rating: 4.9,
      directives: 'Tutoriel étape par étape. Lumière naturelle préférée. Mentionnez les noms des produits utilisés.',
    },
    description: 'Créez des tutoriels de maquillage naturel avec notre nouvelle gamme de produits bio.',
    requirements: 'Expérience en beauté/maquillage, lighting professionnel, audience féminine 16-30 ans',
    budget: 6000,
    remainingBudget: 4500,
    pricePerClip: 60,
    remunerationPer1000Views: 12,
    platforms: ['INSTAGRAM_REELS', 'YOUTUBE_SHORTS'],
    languages: ['FR'],
    countries: ['FR', 'BE'],
    currentClippers: 18,
    startDate: '2024-02-15',
    endDate: '2024-03-15',
    status: 'ACTIVE',
    tags: ['beauté', 'maquillage', 'tutoriel', 'bio'],
    thumbnail: 'https://via.placeholder.com/300x200',
    totalViews: 156000,
    totalSubmissions: 25,
    approvedSubmissions: 22,
    isSubscribed: false,
    isEligible: true,
  },
];

const platformIcons: Record<string, string> = {
  TIKTOK: '📱',
  INSTAGRAM_REELS: '📷',
  YOUTUBE_SHORTS: '📹',
};

const statusColors: Record<string, string> = {
  ACTIVE: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
  PAUSED: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
  COMPLETED: 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400',
  DRAFT: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
};

export default function CampaignsPage() {
  const [campaigns, setCampaigns] = useState(mockCampaigns);
  const [filteredCampaigns, setFilteredCampaigns] = useState(mockCampaigns);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    platform: 'all',
    budget: 'all',
    status: 'all',
    subscribed: 'all',
  });
  const [sortBy, setSortBy] = useState('newest');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    // Simulate loading
    setTimeout(() => setLoading(false), 1000);
  }, []);

  useEffect(() => {
    // Apply filters and search
    let filtered = [...campaigns];

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(campaign =>
        campaign.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        campaign.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        campaign.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    // Platform filter
    if (filters.platform !== 'all') {
      filtered = filtered.filter(campaign =>
        campaign.platforms.includes(filters.platform)
      );
    }

    // Budget filter
    if (filters.budget !== 'all') {
      switch (filters.budget) {
        case 'low':
          filtered = filtered.filter(c => c.pricePerClip <= 50);
          break;
        case 'medium':
          filtered = filtered.filter(c => c.pricePerClip > 50 && c.pricePerClip <= 100);
          break;
        case 'high':
          filtered = filtered.filter(c => c.pricePerClip > 100);
          break;
      }
    }

    // Status filter
    if (filters.status !== 'all') {
      filtered = filtered.filter(c => c.status === filters.status);
    }

    // Subscription filter
    if (filters.subscribed === 'subscribed') {
      filtered = filtered.filter(c => c.isSubscribed);
    } else if (filters.subscribed === 'available') {
      filtered = filtered.filter(c => !c.isSubscribed && c.isEligible);
    }

    // Sort
    switch (sortBy) {
      case 'newest':
        filtered.sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime());
        break;
      case 'price-high':
        filtered.sort((a, b) => b.pricePerClip - a.pricePerClip);
        break;
      case 'price-low':
        filtered.sort((a, b) => a.pricePerClip - b.pricePerClip);
        break;
      case 'deadline':
        filtered.sort((a, b) => new Date(a.endDate).getTime() - new Date(b.endDate).getTime());
        break;
    }

    setFilteredCampaigns(filtered);
  }, [searchQuery, filters, sortBy, campaigns]);

  const handleJoinCampaign = (campaignId: string) => {
    // API call to join campaign
    setCampaigns(prev => prev.map(c => 
      c.id === campaignId ? { ...c, isSubscribed: true, currentClippers: c.currentClippers + 1 } : c
    ));
  };

  const handleLeaveCampaign = (campaignId: string) => {
    // API call to leave campaign
    setCampaigns(prev => prev.map(c => 
      c.id === campaignId ? { ...c, isSubscribed: false, currentClippers: c.currentClippers - 1 } : c
    ));
  };

  // Separate joined and non-joined campaigns
  const joinedCampaigns = filteredCampaigns.filter(c => c.isSubscribed);
  const availableCampaigns = filteredCampaigns.filter(c => !c.isSubscribed);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Campagnes
        </h1>
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
          Gérez vos campagnes actives et découvrez de nouvelles opportunités
        </p>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Campagnes actives</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{campaigns.filter(c => c.status === 'ACTIVE').length}</p>
            </div>
            <Target className="h-8 w-8 text-purple-600 dark:text-purple-400" />
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Mes campagnes</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{campaigns.filter(c => c.isSubscribed).length}</p>
            </div>
            <Video className="h-8 w-8 text-green-600 dark:text-green-400" />
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Éligible</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{campaigns.filter(c => c.isEligible && !c.isSubscribed).length}</p>
            </div>
            <CheckCircle className="h-8 w-8 text-blue-600 dark:text-blue-400" />
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Budget total</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">€{campaigns.reduce((sum, c) => sum + c.remainingBudget, 0).toLocaleString()}</p>
            </div>
            <DollarSign className="h-8 w-8 text-yellow-600 dark:text-yellow-400" />
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          {/* Search */}
          <div className="flex-1 md:max-w-xl">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher par titre, description ou tags..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </div>

          {/* Filter Toggle & Sort */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-gray-700 dark:text-gray-300"
            >
              <Filter className="h-4 w-4" />
              Filtres
              {Object.values(filters).filter(v => v !== 'all').length > 0 && (
                <span className="bg-purple-600 text-white text-xs px-1.5 py-0.5 rounded-full">
                  {Object.values(filters).filter(v => v !== 'all').length}
                </span>
              )}
            </button>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="newest">Plus récentes</option>
              <option value="deadline">Date limite proche</option>
              <option value="price-high">Prix élevé</option>
              <option value="price-low">Prix bas</option>
            </select>
          </div>
        </div>

        {/* Expanded Filters */}
        {showFilters && (
          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Plateforme
                </label>
                <select
                  value={filters.platform}
                  onChange={(e) => setFilters({ ...filters, platform: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="all">Toutes</option>
                  <option value="TIKTOK">TikTok</option>
                  <option value="INSTAGRAM_REELS">Instagram Reels</option>
                  <option value="YOUTUBE_SHORTS">YouTube Shorts</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Budget par clip
                </label>
                <select
                  value={filters.budget}
                  onChange={(e) => setFilters({ ...filters, budget: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="all">Tous</option>
                  <option value="low">≤ €50</option>
                  <option value="medium">€50 - €100</option>
                  <option value="high">&gt; €100</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Statut
                </label>
                <select
                  value={filters.status}
                  onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="all">Tous</option>
                  <option value="ACTIVE">Actives</option>
                  <option value="PAUSED">En pause</option>
                  <option value="COMPLETED">Terminées</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Mes campagnes
                </label>
                <select
                  value={filters.subscribed}
                  onChange={(e) => setFilters({ ...filters, subscribed: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="all">Toutes</option>
                  <option value="subscribed">Souscrites</option>
                  <option value="available">Disponibles</option>
                </select>
              </div>
            </div>

            <div className="mt-4 flex justify-end">
              <button
                onClick={() => setFilters({ platform: 'all', budget: 'all', status: 'all', subscribed: 'all' })}
                className="text-sm text-purple-600 dark:text-purple-400 hover:underline"
              >
                Réinitialiser les filtres
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Joined Campaigns Section */}
      {joinedCampaigns.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Mes campagnes ({joinedCampaigns.length})
          </h2>
          <div className="space-y-4">
            {joinedCampaigns.map((campaign) => (
              <CampaignCard key={campaign.id} campaign={campaign} onJoin={handleJoinCampaign} onLeave={handleLeaveCampaign} />
            ))}
          </div>
        </div>
      )}

      {/* Available Campaigns Section */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
          Campagnes disponibles ({availableCampaigns.length})
        </h2>
        {loading ? (
          // Loading skeleton
          [...Array(3)].map((_, i) => (
            <div key={i} className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 animate-pulse">
              <div className="flex items-start space-x-4">
                <div className="w-32 h-20 bg-gray-300 dark:bg-gray-700 rounded-lg"></div>
                <div className="flex-1 space-y-3">
                  <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded w-1/3"></div>
                  <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-2/3"></div>
                  <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/2"></div>
                </div>
              </div>
            </div>
          ))
        ) : filteredCampaigns.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-12 text-center">
            <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              Aucune campagne trouvée
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Essayez de modifier vos filtres ou votre recherche
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {availableCampaigns.map((campaign) => (
              <CampaignCard key={campaign.id} campaign={campaign} onJoin={handleJoinCampaign} onLeave={handleLeaveCampaign} />
            ))}
          </div>
        )}
      </div>

      {/* Pagination */}
      {(joinedCampaigns.length > 0 || availableCampaigns.length > 0) && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
            Affichage de {filteredCampaigns.length} campagne(s)
          </p>
          <div className="flex items-center gap-1 sm:gap-2">
            <button className="px-2 sm:px-3 py-1 text-xs sm:text-sm border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed text-gray-700 dark:text-gray-300">
              Précédent
            </button>
            <button className="px-2 sm:px-3 py-1 text-xs sm:text-sm bg-purple-600 text-white rounded-lg hover:bg-purple-700">
              1
            </button>
            <button className="px-2 sm:px-3 py-1 text-xs sm:text-sm border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300">
              2
            </button>
            <button className="px-2 sm:px-3 py-1 text-xs sm:text-sm border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300">
              Suivant
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// Campaign Card Component
function CampaignCard({
  campaign,
  onJoin,
  onLeave
}: {
  campaign: any;
  onJoin: (id: string) => void;
  onLeave: (id: string) => void;
}) {
  const router = useRouter();
  
  const handleActionClick = () => {
    router.push(`/dashboard/clipper/campaigns/${campaign.id}`);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow">
      <div className="p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-start gap-4 sm:gap-6">
          {/* Thumbnail */}
          <div className="w-full sm:w-32 h-32 sm:h-20 bg-gray-200 dark:bg-gray-700 rounded-lg flex-shrink-0 overflow-hidden">
            {/* <Image src={campaign.thumbnail} alt={campaign.title} width={128} height={80} className="object-cover" /> */}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 sm:gap-4">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white break-words">
                    {campaign.title}
                  </h3>
                  {campaign.isSubscribed && (
                    <span className="px-2 py-0.5 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 text-xs font-medium rounded-full">
                      Souscrite
                    </span>
                  )}
                  <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${statusColors[campaign.status]}`}>
                    {campaign.status === 'ACTIVE' ? 'Active' : campaign.status}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
                  <span className="flex items-center gap-1">
                    {campaign.advertiser.verified && <CheckCircle className="h-3 w-3 text-blue-500" />}
                    {campaign.advertiser.name}
                  </span>
                  {campaign.advertiser.rating && (
                    <span className="flex items-center gap-1">
                      <Star className="h-3 w-3 text-yellow-500 fill-current" />
                      {campaign.advertiser.rating}
                    </span>
                  )}
                </div>
              </div>
            </div>

            <p className="mt-3 text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
              {campaign.description}
            </p>

            {/* Advertiser Directives - Highlighted */}
            {campaign.advertiser.directives && (
              <div className="mt-3 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                <p className="text-sm font-medium text-yellow-800 dark:text-yellow-200 mb-1">
                  📋 Directives importantes:
                </p>
                <p className="text-xs text-yellow-700 dark:text-yellow-300">
                  {campaign.advertiser.directives}
                </p>
              </div>
            )}

            {/* Remuneration Info */}
            <div className="mt-3 p-2 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <p className="text-sm font-medium text-green-800 dark:text-green-400">
                💰 Rémunération: €{campaign.remunerationPer1000Views} pour 1000 vues
              </p>
            </div>

            {/* Platforms and Tags */}
            <div className="mt-3 flex flex-wrap items-center gap-1 sm:gap-2">
              {campaign.platforms.map((platform: string) => (
                <span
                  key={platform}
                  className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-md text-xs text-gray-700 dark:text-gray-300"
                >
                  <span>{platformIcons[platform]}</span>
                  <span>{platform.replace('_', ' ')}</span>
                </span>
              ))}
              {campaign.tags.map((tag: string) => (
                <span
                  key={tag}
                  className="px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-md text-xs"
                >
                  #{tag}
                </span>
              ))}
            </div>

            {/* Stats - Removed minFollowers and maxClippers */}
            <div className="mt-4 flex flex-wrap items-center gap-3 sm:gap-6 text-xs sm:text-sm">
              <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
                <Calendar className="h-4 w-4" />
                <span>Jusqu'au {new Date(campaign.endDate).toLocaleDateString('fr-FR')}</span>
              </div>
              <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
                <Globe className="h-4 w-4" />
                <span>{campaign.countries.join(', ')}</span>
              </div>
            </div>

            {/* Actions and Progress */}
            <div className="mt-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              {/* Action Buttons */}
              <div className="flex gap-2">
                {campaign.isSubscribed ? (
                  <button
                    onClick={handleActionClick}
                    className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-xs sm:text-sm font-medium"
                  >
                    Voir détails
                  </button>
                ) : campaign.isEligible ? (
                  <>
                    <button
                      onClick={handleActionClick}
                      className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-xs sm:text-sm font-medium"
                    >
                      Rejoindre
                    </button>
                    <button
                      onClick={handleActionClick}
                      className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                      Voir détails
                    </button>
                  </>
                ) : (
                  <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                    <XCircle className="h-4 w-4" />
                    <span>Non éligible</span>
                  </div>
                )}
              </div>

              {/* Progress Gauge - Same as landing page */}
              <div className="flex-1 sm:ml-auto">
                <div className="flex items-center gap-3">
                  <div className="flex-1">
                    <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400 mb-1">
                      <span>Budget utilisé</span>
                      <span>{Math.round(((campaign.budget - campaign.remainingBudget) / campaign.budget) * 100)}%</span>
                    </div>
                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-purple-500 to-purple-600 rounded-full transition-all duration-500"
                        style={{ width: `${((campaign.budget - campaign.remainingBudget) / campaign.budget) * 100}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                      <span>€{(campaign.budget - campaign.remainingBudget).toLocaleString()}</span>
                      <span>€{campaign.budget.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
            