'use client';

import { useState, useEffect } from 'react';
import { 
  Video,
  Upload,
  Eye,
  Heart,
  Share2,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Filter,
  Search,
  Calendar,
  DollarSign,
  TrendingUp,
  Download,
  Edit,
  Trash2,
  ExternalLink,
  Plus,
  MessageSquare,
  BarChart3
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

// Mock data - will be replaced with API calls
const mockSubmissions = [
  {
    id: '1',
    campaignId: '1',
    campaignTitle: 'Summer Fashion Collection 2024',
    platform: 'TIKTOK',
    clipUrl: 'https://tiktok.com/@user/video/123456',
    thumbnailUrl: 'https://via.placeholder.com/200x300',
    status: 'APPROVED',
    views: 45230,
    likes: 3421,
    shares: 234,
    comments: 89,
    amountEarned: 75,
    submittedAt: '2024-01-28T10:30:00',
    approvedAt: '2024-01-29T14:20:00',
    publishedAt: '2024-01-28T11:00:00',
    description: 'Summer vibes avec la nouvelle collection! ☀️👗 #fashion #summer2024',
    reviewerNotes: 'Excellent travail, contenu engageant et conforme aux guidelines.',
    lastMetricsUpdate: '2024-02-01T08:00:00',
  },
  {
    id: '2',
    campaignId: '2',
    campaignTitle: 'Tech Review - Smartphone Pro Max',
    platform: 'YOUTUBE_SHORTS',
    clipUrl: 'https://youtube.com/shorts/abc123',
    thumbnailUrl: 'https://via.placeholder.com/200x300',
    status: 'PENDING',
    views: 0,
    likes: 0,
    shares: 0,
    comments: 0,
    amountEarned: 0,
    submittedAt: '2024-02-01T15:45:00',
    publishedAt: '2024-02-01T16:00:00',
    description: 'Unboxing et première impression du nouveau smartphone! 📱✨',
    lastMetricsUpdate: null,
  },
  {
    id: '3',
    campaignId: '3',
    campaignTitle: 'Fitness Challenge - 30 Days',
    platform: 'INSTAGRAM_REELS',
    clipUrl: 'https://instagram.com/reel/xyz789',
    thumbnailUrl: 'https://via.placeholder.com/200x300',
    status: 'REJECTED',
    views: 0,
    likes: 0,
    shares: 0,
    comments: 0,
    amountEarned: 0,
    submittedAt: '2024-01-25T09:15:00',
    rejectedAt: '2024-01-26T11:30:00',
    publishedAt: '2024-01-25T09:30:00',
    description: 'Jour 1 du challenge fitness! 💪 #fitness #30daychallenge',
    reviewerNotes: 'Le logo de la marque n\'est pas assez visible. Merci de refaire avec le logo en début de vidéo.',
    revisionNotes: 'Ajouter le logo en intro (3 secondes minimum)',
    lastMetricsUpdate: null,
  },
  {
    id: '4',
    campaignId: '4',
    campaignTitle: 'Beauty Tutorial - Maquillage Naturel',
    platform: 'INSTAGRAM_REELS',
    clipUrl: 'https://instagram.com/reel/beauty123',
    thumbnailUrl: 'https://via.placeholder.com/200x300',
    status: 'REVISION_REQUESTED',
    views: 12500,
    likes: 890,
    shares: 45,
    comments: 23,
    amountEarned: 0,
    submittedAt: '2024-01-30T14:00:00',
    publishedAt: '2024-01-30T14:30:00',
    description: 'Tuto maquillage naturel avec les produits bio 🌿💄',
    reviewerNotes: 'Bon contenu mais il manque la mention du code promo.',
    revisionNotes: 'Ajouter le code promo BEAUTY20 en description et dans la vidéo',
    lastMetricsUpdate: '2024-02-01T08:00:00',
  },
];

const platformIcons: Record<string, string> = {
  TIKTOK: '📱',
  INSTAGRAM_REELS: '📷',
  YOUTUBE_SHORTS: '📹',
};

const statusConfig = {
  PENDING: {
    label: 'En attente',
    color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
    icon: Clock,
  },
  APPROVED: {
    label: 'Approuvé',
    color: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
    icon: CheckCircle,
  },
  REJECTED: {
    label: 'Rejeté',
    color: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
    icon: XCircle,
  },
  REVISION_REQUESTED: {
    label: 'Révision demandée',
    color: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400',
    icon: AlertCircle,
  },
};

export default function SubmissionsPage() {
  const [submissions, setSubmissions] = useState(mockSubmissions);
  const [filteredSubmissions, setFilteredSubmissions] = useState(mockSubmissions);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    status: 'all',
    platform: 'all',
    dateRange: 'all',
  });
  const [sortBy, setSortBy] = useState('newest');
  const [selectedSubmission, setSelectedSubmission] = useState<any>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  useEffect(() => {
    // Simulate loading
    setTimeout(() => setLoading(false), 1000);
  }, []);

  useEffect(() => {
    // Apply filters and search
    let filtered = [...submissions];

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(submission =>
        submission.campaignTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        submission.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Status filter
    if (filters.status !== 'all') {
      filtered = filtered.filter(s => s.status === filters.status);
    }

    // Platform filter
    if (filters.platform !== 'all') {
      filtered = filtered.filter(s => s.platform === filters.platform);
    }

    // Date range filter
    if (filters.dateRange !== 'all') {
      const now = new Date();
      const dateLimit = new Date();
      
      switch (filters.dateRange) {
        case 'today':
          dateLimit.setDate(now.getDate() - 1);
          break;
        case 'week':
          dateLimit.setDate(now.getDate() - 7);
          break;
        case 'month':
          dateLimit.setMonth(now.getMonth() - 1);
          break;
      }
      
      filtered = filtered.filter(s => new Date(s.submittedAt) >= dateLimit);
    }

    // Sort
    switch (sortBy) {
      case 'newest':
        filtered.sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime());
        break;
      case 'oldest':
        filtered.sort((a, b) => new Date(a.submittedAt).getTime() - new Date(b.submittedAt).getTime());
        break;
      case 'views':
        filtered.sort((a, b) => b.views - a.views);
        break;
      case 'earnings':
        filtered.sort((a, b) => b.amountEarned - a.amountEarned);
        break;
    }

    setFilteredSubmissions(filtered);
  }, [searchQuery, filters, sortBy, submissions]);

  const handleDeleteSubmission = (id: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette soumission ?')) {
      setSubmissions(prev => prev.filter(s => s.id !== id));
    }
  };

  const getEngagementRate = (submission: any) => {
    if (submission.views === 0) return 0;
    return ((submission.likes + submission.shares + submission.comments) / submission.views * 100).toFixed(2);
  };

  // Calculate stats
  const stats = {
    total: submissions.length,
    approved: submissions.filter(s => s.status === 'APPROVED').length,
    pending: submissions.filter(s => s.status === 'PENDING').length,
    rejected: submissions.filter(s => s.status === 'REJECTED').length,
    totalEarnings: submissions.reduce((sum, s) => sum + s.amountEarned, 0),
    totalViews: submissions.reduce((sum, s) => sum + s.views, 0),
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Mes Soumissions
          </h1>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            Gérez vos clips soumis et suivez leurs performances
          </p>
        </div>
        <Link
          href="/dashboard/clipper/submissions/new"
          className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
        >
          <Plus className="h-5 w-5 mr-2" />
          Nouvelle soumission
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.total}</p>
            </div>
            <Video className="h-8 w-8 text-purple-600 dark:text-purple-400" />
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Approuvés</p>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">{stats.approved}</p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">En attente</p>
              <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{stats.pending}</p>
            </div>
            <Clock className="h-8 w-8 text-yellow-600 dark:text-yellow-400" />
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Rejetés</p>
              <p className="text-2xl font-bold text-red-600 dark:text-red-400">{stats.rejected}</p>
            </div>
            <XCircle className="h-8 w-8 text-red-600 dark:text-red-400" />
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Gains</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">€{stats.totalEarnings}</p>
            </div>
            <DollarSign className="h-8 w-8 text-green-600 dark:text-green-400" />
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Vues</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{(stats.totalViews / 1000).toFixed(1)}K</p>
            </div>
            <Eye className="h-8 w-8 text-blue-600 dark:text-blue-400" />
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          {/* Search */}
          <div className="flex-1 max-w-xl">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher par campagne ou description..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap items-center gap-3">
            <select
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="all">Tous les statuts</option>
              <option value="PENDING">En attente</option>
              <option value="APPROVED">Approuvé</option>
              <option value="REJECTED">Rejeté</option>
              <option value="REVISION_REQUESTED">Révision demandée</option>
            </select>

            <select
              value={filters.platform}
              onChange={(e) => setFilters({ ...filters, platform: e.target.value })}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="all">Toutes les plateformes</option>
              <option value="TIKTOK">TikTok</option>
              <option value="INSTAGRAM_REELS">Instagram Reels</option>
              <option value="YOUTUBE_SHORTS">YouTube Shorts</option>
            </select>

            <select
              value={filters.dateRange}
              onChange={(e) => setFilters({ ...filters, dateRange: e.target.value })}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="all">Toutes les dates</option>
              <option value="today">Aujourd'hui</option>
              <option value="week">Cette semaine</option>
              <option value="month">Ce mois</option>
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="newest">Plus récent</option>
              <option value="oldest">Plus ancien</option>
              <option value="views">Plus de vues</option>
              <option value="earnings">Plus de gains</option>
            </select>
          </div>
        </div>
      </div>

      {/* Submissions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {loading ? (
          // Loading skeleton
          [...Array(4)].map((_, i) => (
            <div key={i} className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden animate-pulse">
              <div className="aspect-[9/16] bg-gray-300 dark:bg-gray-700"></div>
              <div className="p-4 space-y-3">
                <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-3/4"></div>
                <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-1/2"></div>
                <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-2/3"></div>
              </div>
            </div>
          ))
        ) : filteredSubmissions.length === 0 ? (
          <div className="col-span-full bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-12 text-center">
            <Video className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              Aucune soumission trouvée
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Commencez par soumettre votre premier clip
            </p>
            <Link
              href="/dashboard/clipper/submissions/new"
              className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              <Plus className="h-5 w-5 mr-2" />
              Nouvelle soumission
            </Link>
          </div>
        ) : (
          filteredSubmissions.map((submission) => {
            const StatusIcon = statusConfig[submission.status as keyof typeof statusConfig].icon;
            
            return (
              <div
                key={submission.id}
                className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-lg transition-shadow"
              >
                {/* Thumbnail */}
                <div className="relative aspect-[9/16] bg-gray-200 dark:bg-gray-700">
                  {/* <Image src={submission.thumbnailUrl} alt={submission.description} fill className="object-cover" /> */}
                  <div className="absolute top-2 left-2 flex items-center gap-2">
                    <span className="text-2xl">{platformIcons[submission.platform]}</span>
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${statusConfig[submission.status as keyof typeof statusConfig].color}`}>
                      <StatusIcon className="w-3 h-3 mr-1" />
                      {statusConfig[submission.status as keyof typeof statusConfig].label}
                    </span>
                  </div>
                  {submission.amountEarned > 0 && (
                    <div className="absolute top-2 right-2 bg-green-600 text-white px-2 py-1 rounded-full text-xs font-bold">
                      +€{submission.amountEarned}
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-4">
                  <h3 className="font-medium text-gray-900 dark:text-white text-sm mb-1 line-clamp-1">
                    {submission.campaignTitle}
                  </h3>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                    {submission.description}
                  </p>

                  {/* Metrics */}
                  {submission.status === 'APPROVED' && (
                    <div className="grid grid-cols-3 gap-2 mb-3">
                      <div className="text-center">
                        <p className="text-xs text-gray-500 dark:text-gray-400">Vues</p>
                        <p className="text-sm font-bold text-gray-900 dark:text-white">{(submission.views / 1000).toFixed(1)}K</p>
                      </div>
                      <div className="text-center">
                        <p className="text-xs text-gray-500 dark:text-gray-400">Likes</p>
                        <p className="text-sm font-bold text-gray-900 dark:text-white">{submission.likes}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-xs text-gray-500 dark:text-gray-400">Engagement</p>
                        <p className="text-sm font-bold text-gray-900 dark:text-white">{getEngagementRate(submission)}%</p>
                      </div>
                    </div>
                  )}

                  {/* Notes */}
                  {(submission.reviewerNotes || submission.revisionNotes) && (
                    <div className="mb-3 p-2 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        {submission.status === 'REVISION_REQUESTED' ? submission.revisionNotes : submission.reviewerNotes}
                      </p>
                    </div>
                  )}

                  {/* Date */}
                  <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-3">
                    <span className="flex items-center">
                      <Calendar className="h-3 w-3 mr-1" />
                      {new Date(submission.submittedAt).toLocaleDateString('fr-FR')}
                    </span>
                    {submission.lastMetricsUpdate && (
                      <span className="flex items-center">
                        <TrendingUp className="h-3 w-3 mr-1" />
                        Màj {new Date(submission.lastMetricsUpdate).toLocaleDateString('fr-FR')}
                      </span>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <a
                      href={submission.clipUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 flex items-center justify-center px-3 py-1.5 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-lg hover:bg-purple-200 dark:hover:bg-purple-900/50 transition-colors text-sm"
                    >
                      <ExternalLink className="h-4 w-4 mr-1" />
                      Voir
                    </a>
                    <button
                      onClick={() => {
                        setSelectedSubmission(submission);
                        setShowDetailsModal(true);
                      }}
                      className="flex-1 flex items-center justify-center px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm"
                    >
                      <BarChart3 className="h-4 w-4 mr-1" />
                      Détails
                    </button>
                    {submission.status === 'REVISION_REQUESTED' && (
                      <button className="p-1.5 text-orange-600 dark:text-orange-400 hover:bg-orange-50 dark:hover:bg-orange-900/20 rounded-lg transition-colors">
                        <Edit className="h-4 w-4" />
                      </button>
                    )}
                    {submission.status === 'PENDING' && (
                      <button
                        onClick={() => handleDeleteSubmission(submission.id)}
                        className="p-1.5 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Load More */}
      {filteredSubmissions.length > 0 && (
        <div className="flex justify-center">
          <button className="px-6 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-gray-700 dark:text-gray-300">
            Charger plus
          </button>
        </div>
      )}
    </div>
  );
}