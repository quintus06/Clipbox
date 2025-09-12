'use client';

import { useState, useEffect } from 'react';
import CampaignCard from './campaign-card';
import { Filter, Search, ChevronDown, TrendingUp, Clock, DollarSign } from 'lucide-react';

interface Campaign {
  id: string;
  title: string;
  description: string;
  imageUrl?: string;
  budget: number;
  budgetSpent: number;
  network: 'TIKTOK' | 'INSTAGRAM' | 'YOUTUBE';
  participantsCount: number;
  endDate: Date;
  advertiserName: string;
  advertiserLogo?: string;
}

interface CampaignsGridProps {
  campaigns: Campaign[];
  loading?: boolean;
}

export default function CampaignsGrid({ campaigns: initialCampaigns, loading = false }: CampaignsGridProps) {
  const [campaigns, setCampaigns] = useState<Campaign[]>(initialCampaigns);
  const [filteredCampaigns, setFilteredCampaigns] = useState<Campaign[]>(initialCampaigns);
  const [selectedNetwork, setSelectedNetwork] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('recent');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    setCampaigns(initialCampaigns);
    setFilteredCampaigns(initialCampaigns);
  }, [initialCampaigns]);

  useEffect(() => {
    let filtered = [...campaigns];

    // Filter by network
    if (selectedNetwork !== 'all') {
      filtered = filtered.filter(campaign => campaign.network === selectedNetwork);
    }

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(campaign =>
        campaign.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        campaign.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        campaign.advertiserName.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Sort campaigns
    switch (sortBy) {
      case 'recent':
        filtered.sort((a, b) => new Date(b.endDate).getTime() - new Date(a.endDate).getTime());
        break;
      case 'budget':
        filtered.sort((a, b) => (b.budget - b.budgetSpent) - (a.budget - a.budgetSpent));
        break;
      case 'popular':
        filtered.sort((a, b) => b.participantsCount - a.participantsCount);
        break;
      case 'ending':
        filtered.sort((a, b) => new Date(a.endDate).getTime() - new Date(b.endDate).getTime());
        break;
    }

    setFilteredCampaigns(filtered);
  }, [campaigns, selectedNetwork, sortBy, searchQuery]);

  const CampaignSkeleton = () => (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden animate-pulse">
      <div className="h-48 bg-gray-200 dark:bg-gray-700"></div>
      <div className="p-6">
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-3"></div>
        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
        <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
        <div className="flex justify-between">
          <div className="h-4 w-20 bg-gray-200 dark:bg-gray-700 rounded"></div>
          <div className="h-4 w-20 bg-gray-200 dark:bg-gray-700 rounded"></div>
        </div>
      </div>
    </div>
  );

  return (
    <section className="py-16 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Campagnes actives
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Découvrez les opportunités qui correspondent à votre audience et commencez à gagner
          </p>
        </div>

        {/* Filters Bar */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-3 sm:p-4 mb-8">
          <div className="flex flex-col gap-3 sm:gap-4">
            {/* Search */}
            <div className="w-full">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
                <input
                  type="text"
                  placeholder="Rechercher..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 sm:pl-10 pr-3 sm:pr-4 py-2 text-sm sm:text-base border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Filters Row */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              {/* Network Filter - Scrollable on mobile with proper container */}
              <div className="flex gap-2 items-center">
                <div className="flex-1 overflow-x-auto scrollbar-hide">
                  <div className="flex gap-2 pb-1">
                    <button
                      onClick={() => setSelectedNetwork('all')}
                      className={`flex-shrink-0 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg font-medium text-xs sm:text-sm lg:text-base transition-colors ${
                        selectedNetwork === 'all'
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                      }`}
                    >
                      Tous
                    </button>
                    <button
                      onClick={() => setSelectedNetwork('TIKTOK')}
                      className={`flex-shrink-0 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg font-medium text-xs sm:text-sm lg:text-base transition-colors ${
                        selectedNetwork === 'TIKTOK'
                          ? 'bg-black text-white'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                      }`}
                    >
                      TikTok
                    </button>
                    <button
                      onClick={() => setSelectedNetwork('INSTAGRAM')}
                      className={`flex-shrink-0 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg font-medium text-xs sm:text-sm lg:text-base transition-colors ${
                        selectedNetwork === 'INSTAGRAM'
                          ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                      }`}
                    >
                      Instagram
                    </button>
                    <button
                      onClick={() => setSelectedNetwork('YOUTUBE')}
                      className={`flex-shrink-0 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg font-medium text-xs sm:text-sm lg:text-base transition-colors ${
                        selectedNetwork === 'YOUTUBE'
                          ? 'bg-red-600 text-white'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                      }`}
                    >
                      YouTube
                    </button>
                  </div>
                </div>

                {/* Sort Dropdown */}
                <div className="relative flex-shrink-0">
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="flex items-center justify-center gap-1 sm:gap-2 px-2.5 sm:px-3 lg:px-4 py-1.5 sm:py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-xs sm:text-sm lg:text-base"
                  >
                    <Filter className="w-3 h-3 sm:w-3.5 sm:h-3.5 lg:w-4 lg:h-4" />
                    <span className="hidden xs:inline">Trier</span>
                    <ChevronDown className={`w-3 h-3 sm:w-3.5 sm:h-3.5 lg:w-4 lg:h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
                  </button>
              
                  {showFilters && (
                    <div className="absolute right-0 sm:left-auto left-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-10">
                      <button
                        onClick={() => { setSortBy('recent'); setShowFilters(false); }}
                        className={`w-full text-left px-3 sm:px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex items-center gap-2 text-sm sm:text-base ${
                          sortBy === 'recent' ? 'text-blue-600 dark:text-blue-400' : 'text-gray-700 dark:text-gray-300'
                        }`}
                      >
                        <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                        Plus récentes
                      </button>
                      <button
                        onClick={() => { setSortBy('budget'); setShowFilters(false); }}
                        className={`w-full text-left px-3 sm:px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex items-center gap-2 text-sm sm:text-base ${
                          sortBy === 'budget' ? 'text-blue-600 dark:text-blue-400' : 'text-gray-700 dark:text-gray-300'
                        }`}
                      >
                        <DollarSign className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                        Budget restant
                      </button>
                      <button
                        onClick={() => { setSortBy('popular'); setShowFilters(false); }}
                        className={`w-full text-left px-3 sm:px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex items-center gap-2 text-sm sm:text-base ${
                          sortBy === 'popular' ? 'text-blue-600 dark:text-blue-400' : 'text-gray-700 dark:text-gray-300'
                        }`}
                      >
                        <TrendingUp className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                        Plus populaires
                      </button>
                      <button
                        onClick={() => { setSortBy('ending'); setShowFilters(false); }}
                        className={`w-full text-left px-3 sm:px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex items-center gap-2 text-sm sm:text-base ${
                          sortBy === 'ending' ? 'text-blue-600 dark:text-blue-400' : 'text-gray-700 dark:text-gray-300'
                        }`}
                      >
                        <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                        Bientôt terminées
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-600 dark:text-gray-400">
            {filteredCampaigns.length} campagne{filteredCampaigns.length > 1 ? 's' : ''} trouvée{filteredCampaigns.length > 1 ? 's' : ''}
          </p>
        </div>

        {/* Campaigns Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, index) => (
              <CampaignSkeleton key={index} />
            ))}
          </div>
        ) : filteredCampaigns.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCampaigns.map((campaign) => (
              <CampaignCard key={campaign.id} {...campaign} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Aucune campagne trouvée
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Essayez de modifier vos filtres ou revenez plus tard
            </p>
          </div>
        )}

        {/* Load More Button */}
        {filteredCampaigns.length > 0 && (
          <div className="text-center mt-12">
            <button className="px-8 py-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-2 border-gray-200 dark:border-gray-700 rounded-full font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-200">
              Charger plus de campagnes
            </button>
          </div>
        )}
      </div>
    </section>
  );
}