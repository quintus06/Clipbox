'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, Filter, Grid, List, Calendar, DollarSign, Users, TrendingUp, ChevronDown } from 'lucide-react';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';

interface Campaign {
  id: string;
  title: string;
  brand: string;
  budget: number;
  platform: string[];
  category: string;
  description: string;
  startDate: string;
  endDate: string;
  participants: number;
  maxParticipants: number;
  image: string;
  status: 'active' | 'upcoming' | 'ending_soon';
}

export default function ExplorerPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [filteredCampaigns, setFilteredCampaigns] = useState<Campaign[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPlatform, setSelectedPlatform] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedBudget, setSelectedBudget] = useState('all');
  const [sortBy, setSortBy] = useState('recent');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);

  // Données de démonstration
  const mockCampaigns: Campaign[] = [
    {
      id: '1',
      title: 'Lancement nouvelle collection été',
      brand: 'Fashion Brand',
      budget: 5000,
      platform: ['Instagram', 'TikTok'],
      category: 'Mode',
      description: 'Créez du contenu créatif pour notre nouvelle collection été 2024',
      startDate: '2024-03-01',
      endDate: '2024-04-30',
      participants: 45,
      maxParticipants: 100,
      image: 'https://via.placeholder.com/400x300',
      status: 'active'
    },
    {
      id: '2',
      title: 'Challenge danse virale',
      brand: 'Music Label',
      budget: 10000,
      platform: ['TikTok', 'YouTube Shorts'],
      category: 'Musique',
      description: 'Participez au challenge de danse sur notre nouveau single',
      startDate: '2024-03-15',
      endDate: '2024-03-30',
      participants: 234,
      maxParticipants: 500,
      image: 'https://via.placeholder.com/400x300',
      status: 'ending_soon'
    },
    {
      id: '3',
      title: 'Review produit tech innovant',
      brand: 'Tech Company',
      budget: 8000,
      platform: ['YouTube', 'Instagram'],
      category: 'Tech',
      description: 'Testez et présentez notre nouveau gadget révolutionnaire',
      startDate: '2024-04-01',
      endDate: '2024-05-31',
      participants: 12,
      maxParticipants: 50,
      image: 'https://via.placeholder.com/400x300',
      status: 'upcoming'
    },
    {
      id: '4',
      title: 'Recettes healthy printemps',
      brand: 'Food Brand',
      budget: 3000,
      platform: ['Instagram', 'Pinterest'],
      category: 'Food',
      description: 'Créez des recettes originales avec nos produits bio',
      startDate: '2024-03-10',
      endDate: '2024-04-10',
      participants: 78,
      maxParticipants: 150,
      image: 'https://via.placeholder.com/400x300',
      status: 'active'
    },
    {
      id: '5',
      title: 'Routine beauté naturelle',
      brand: 'Beauty Co',
      budget: 6000,
      platform: ['Instagram', 'TikTok', 'YouTube'],
      category: 'Beauté',
      description: 'Partagez votre routine beauté avec nos produits naturels',
      startDate: '2024-03-05',
      endDate: '2024-04-05',
      participants: 156,
      maxParticipants: 200,
      image: 'https://via.placeholder.com/400x300',
      status: 'active'
    },
    {
      id: '6',
      title: 'Gaming tournament promo',
      brand: 'Gaming Studio',
      budget: 15000,
      platform: ['Twitch', 'YouTube', 'TikTok'],
      category: 'Gaming',
      description: 'Streamez notre nouveau jeu et participez au tournoi',
      startDate: '2024-03-20',
      endDate: '2024-04-20',
      participants: 89,
      maxParticipants: 300,
      image: 'https://via.placeholder.com/400x300',
      status: 'active'
    }
  ];

  useEffect(() => {
    setCampaigns(mockCampaigns);
    setFilteredCampaigns(mockCampaigns);
  }, []);

  useEffect(() => {
    filterAndSortCampaigns();
  }, [searchTerm, selectedPlatform, selectedCategory, selectedBudget, sortBy, campaigns]);

  const filterAndSortCampaigns = () => {
    let filtered = [...campaigns];

    // Recherche
    if (searchTerm) {
      filtered = filtered.filter(campaign =>
        campaign.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        campaign.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
        campaign.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filtre par plateforme
    if (selectedPlatform !== 'all') {
      filtered = filtered.filter(campaign =>
        campaign.platform.includes(selectedPlatform)
      );
    }

    // Filtre par catégorie
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(campaign =>
        campaign.category === selectedCategory
      );
    }

    // Filtre par budget
    if (selectedBudget !== 'all') {
      filtered = filtered.filter(campaign => {
        switch (selectedBudget) {
          case 'low':
            return campaign.budget < 5000;
          case 'medium':
            return campaign.budget >= 5000 && campaign.budget < 10000;
          case 'high':
            return campaign.budget >= 10000;
          default:
            return true;
        }
      });
    }

    // Tri
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'budget_high':
          return b.budget - a.budget;
        case 'budget_low':
          return a.budget - b.budget;
        case 'ending_soon':
          return new Date(a.endDate).getTime() - new Date(b.endDate).getTime();
        case 'popular':
          return b.participants - a.participants;
        case 'recent':
        default:
          return new Date(b.startDate).getTime() - new Date(a.startDate).getTime();
      }
    });

    setFilteredCampaigns(filtered);
  };

  const getStatusBadge = (status: Campaign['status']) => {
    switch (status) {
      case 'active':
        return <span className="px-2 py-1 text-xs font-semibold bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 rounded-full">Actif</span>;
      case 'upcoming':
        return <span className="px-2 py-1 text-xs font-semibold bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 rounded-full">À venir</span>;
      case 'ending_soon':
        return <span className="px-2 py-1 text-xs font-semibold bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200 rounded-full">Bientôt terminé</span>;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <Header />
      
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Explorer les Campagnes
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Découvrez toutes les opportunités de collaboration avec les plus grandes marques
          </p>
        </div>

        {/* Search and Filters Bar */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Rechercher une campagne, une marque..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                />
              </div>
            </div>

            {/* Filter Toggle Button (Mobile) */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="lg:hidden flex items-center justify-center gap-2 px-4 py-3 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              <Filter className="w-5 h-5" />
              <span>Filtres</span>
              <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
            </button>

            {/* Desktop Filters */}
            <div className="hidden lg:flex gap-4">
              <select
                value={selectedPlatform}
                onChange={(e) => setSelectedPlatform(e.target.value)}
                className="px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              >
                <option value="all">Toutes les plateformes</option>
                <option value="Instagram">Instagram</option>
                <option value="TikTok">TikTok</option>
                <option value="YouTube">YouTube</option>
                <option value="Twitter">Twitter</option>
                <option value="Twitch">Twitch</option>
                <option value="Pinterest">Pinterest</option>
              </select>

              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              >
                <option value="all">Toutes les catégories</option>
                <option value="Mode">Mode</option>
                <option value="Beauté">Beauté</option>
                <option value="Tech">Tech</option>
                <option value="Food">Food</option>
                <option value="Gaming">Gaming</option>
                <option value="Musique">Musique</option>
                <option value="Sport">Sport</option>
              </select>

              <select
                value={selectedBudget}
                onChange={(e) => setSelectedBudget(e.target.value)}
                className="px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              >
                <option value="all">Tous les budgets</option>
                <option value="low">&lt; 5 000€</option>
                <option value="medium">5 000€ - 10 000€</option>
                <option value="high">&gt; 10 000€</option>
              </select>
            </div>
          </div>

          {/* Mobile Filters (Collapsible) */}
          {showFilters && (
            <div className="lg:hidden mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 space-y-3">
              <select
                value={selectedPlatform}
                onChange={(e) => setSelectedPlatform(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              >
                <option value="all">Toutes les plateformes</option>
                <option value="Instagram">Instagram</option>
                <option value="TikTok">TikTok</option>
                <option value="YouTube">YouTube</option>
                <option value="Twitter">Twitter</option>
                <option value="Twitch">Twitch</option>
                <option value="Pinterest">Pinterest</option>
              </select>

              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              >
                <option value="all">Toutes les catégories</option>
                <option value="Mode">Mode</option>
                <option value="Beauté">Beauté</option>
                <option value="Tech">Tech</option>
                <option value="Food">Food</option>
                <option value="Gaming">Gaming</option>
                <option value="Musique">Musique</option>
                <option value="Sport">Sport</option>
              </select>

              <select
                value={selectedBudget}
                onChange={(e) => setSelectedBudget(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              >
                <option value="all">Tous les budgets</option>
                <option value="low">&lt; 5 000€</option>
                <option value="medium">5 000€ - 10 000€</option>
                <option value="high">&gt; 10 000€</option>
              </select>
            </div>
          )}
        </div>

        {/* Sort and View Options */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div className="flex items-center gap-2">
            <span className="text-gray-600 dark:text-gray-400">
              {filteredCampaigns.length} campagne{filteredCampaigns.length > 1 ? 's' : ''} trouvée{filteredCampaigns.length > 1 ? 's' : ''}
            </span>
          </div>

          <div className="flex items-center gap-4">
            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            >
              <option value="recent">Plus récentes</option>
              <option value="ending_soon">Se termine bientôt</option>
              <option value="budget_high">Budget élevé</option>
              <option value="budget_low">Budget faible</option>
              <option value="popular">Plus populaires</option>
            </select>

            {/* View Mode */}
            <div className="flex items-center bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded ${viewMode === 'grid' ? 'bg-white dark:bg-gray-600 shadow' : ''}`}
              >
                <Grid className="w-5 h-5 text-gray-700 dark:text-gray-300" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded ${viewMode === 'list' ? 'bg-white dark:bg-gray-600 shadow' : ''}`}
              >
                <List className="w-5 h-5 text-gray-700 dark:text-gray-300" />
              </button>
            </div>
          </div>
        </div>

        {/* Campaigns Grid/List */}
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCampaigns.map((campaign) => (
              <div key={campaign.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                <div className="relative h-48 bg-gradient-to-br from-blue-400 to-green-400">
                  <div className="absolute top-4 right-4">
                    {getStatusBadge(campaign.status)}
                  </div>
                </div>
                
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                    {campaign.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-1">{campaign.brand}</p>
                  <p className="text-gray-500 dark:text-gray-500 text-sm mb-4 line-clamp-2">
                    {campaign.description}
                  </p>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {campaign.platform.map((platform) => (
                      <span key={platform} className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded">
                        {platform}
                      </span>
                    ))}
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400 flex items-center gap-1">
                        <DollarSign className="w-4 h-4" />
                        Budget
                      </span>
                      <span className="font-semibold text-gray-900 dark:text-white">
                        {campaign.budget.toLocaleString('fr-FR')}€
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400 flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        Participants
                      </span>
                      <span className="font-semibold text-gray-900 dark:text-white">
                        {campaign.participants}/{campaign.maxParticipants}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400 flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        Fin
                      </span>
                      <span className="font-semibold text-gray-900 dark:text-white">
                        {new Date(campaign.endDate).toLocaleDateString('fr-FR')}
                      </span>
                    </div>
                  </div>

                  <Link
                    href={`/campaigns/${campaign.id}`}
                    className="block w-full text-center px-4 py-2 bg-gradient-to-r from-blue-500 to-green-500 text-white rounded-lg font-medium hover:shadow-lg transform hover:scale-105 transition-all duration-200"
                  >
                    Voir les détails
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredCampaigns.map((campaign) => (
              <div key={campaign.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
                <div className="flex flex-col lg:flex-row gap-6">
                  <div className="lg:w-48 h-32 lg:h-auto bg-gradient-to-br from-blue-400 to-green-400 rounded-lg flex-shrink-0"></div>
                  
                  <div className="flex-1">
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-4">
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                          {campaign.title}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400">{campaign.brand}</p>
                      </div>
                      {getStatusBadge(campaign.status)}
                    </div>

                    <p className="text-gray-500 dark:text-gray-500 mb-4">
                      {campaign.description}
                    </p>

                    <div className="flex flex-wrap gap-2 mb-4">
                      {campaign.platform.map((platform) => (
                        <span key={platform} className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded">
                          {platform}
                        </span>
                      ))}
                    </div>

                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                      <div className="flex flex-wrap gap-4 text-sm">
                        <div className="flex items-center gap-1">
                          <DollarSign className="w-4 h-4 text-gray-400" />
                          <span className="font-semibold text-gray-900 dark:text-white">
                            {campaign.budget.toLocaleString('fr-FR')}€
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="w-4 h-4 text-gray-400" />
                          <span className="font-semibold text-gray-900 dark:text-white">
                            {campaign.participants}/{campaign.maxParticipants}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          <span className="font-semibold text-gray-900 dark:text-white">
                            Jusqu'au {new Date(campaign.endDate).toLocaleDateString('fr-FR')}
                          </span>
                        </div>
                      </div>

                      <Link
                        href={`/campaigns/${campaign.id}`}
                        className="px-6 py-2 bg-gradient-to-r from-blue-500 to-green-500 text-white rounded-lg font-medium hover:shadow-lg transform hover:scale-105 transition-all duration-200"
                      >
                        Voir les détails
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {filteredCampaigns.length === 0 && (
          <div className="text-center py-12">
            <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
              <Search className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Aucune campagne trouvée
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Essayez de modifier vos filtres ou votre recherche
            </p>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}