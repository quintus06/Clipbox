'use client';

import { useState, useEffect } from 'react';
import { 
  DollarSign, 
  Video, 
  Eye, 
  TrendingUp,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  ArrowRight,
  Calendar,
  Users,
  Target
} from 'lucide-react';
import { StatsCard } from '@/components/dashboard/clipper/stats-card';
import Link from 'next/link';
import Image from 'next/image';

// Mock data - will be replaced with API calls
const mockStats = {
  earnings: {
    total: 1245.50,
    pending: 245.00,
    available: 1000.50,
    trend: 12.5,
  },
  clips: {
    total: 24,
    approved: 18,
    pending: 4,
    rejected: 2,
    trend: 8.3,
  },
  views: {
    total: 125400,
    likes: 8920,
    shares: 1240,
    trend: 15.2,
  },
  campaigns: {
    active: 5,
    completed: 12,
    available: 8,
  }
};

const recentCampaigns = [
  {
    id: '1',
    title: 'Summer Vibes Collection',
    advertiser: 'Fashion Brand',
    budget: 5000,
    pricePerClip: 50,
    platform: ['TIKTOK', 'INSTAGRAM_REELS'],
    deadline: '2024-02-15',
    submissions: 12,
    maxSubmissions: 20,
    thumbnail: 'https://via.placeholder.com/150',
  },
  {
    id: '2',
    title: 'Tech Review - Smartphone X',
    advertiser: 'Tech Company',
    budget: 3000,
    pricePerClip: 75,
    platform: ['YOUTUBE_SHORTS'],
    deadline: '2024-02-20',
    submissions: 5,
    maxSubmissions: 10,
    thumbnail: 'https://via.placeholder.com/150',
  },
  {
    id: '3',
    title: 'Fitness Challenge 2024',
    advertiser: 'Gym Chain',
    budget: 4000,
    pricePerClip: 40,
    platform: ['TIKTOK'],
    deadline: '2024-02-18',
    submissions: 18,
    maxSubmissions: 25,
    thumbnail: 'https://via.placeholder.com/150',
  },
];

const recentSubmissions = [
  {
    id: '1',
    campaign: 'Summer Vibes Collection',
    platform: 'TikTok',
    status: 'APPROVED',
    views: 12500,
    likes: 890,
    earnings: 50,
    submittedAt: '2024-01-28',
  },
  {
    id: '2',
    campaign: 'Tech Review - Smartphone X',
    platform: 'YouTube Shorts',
    status: 'PENDING',
    views: 0,
    likes: 0,
    earnings: 0,
    submittedAt: '2024-01-30',
  },
  {
    id: '3',
    campaign: 'Fitness Challenge 2024',
    platform: 'TikTok',
    status: 'APPROVED',
    views: 8900,
    likes: 567,
    earnings: 40,
    submittedAt: '2024-01-25',
  },
  {
    id: '4',
    campaign: 'Beauty Tutorial',
    platform: 'Instagram Reels',
    status: 'REJECTED',
    views: 0,
    likes: 0,
    earnings: 0,
    submittedAt: '2024-01-24',
    rejectionReason: 'Ne respecte pas les guidelines de la marque',
  },
];

export default function ClipperDashboard() {
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('month'); // week, month, year

  useEffect(() => {
    // Simulate loading
    setTimeout(() => setLoading(false), 1000);
  }, []);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'APPROVED':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
            <CheckCircle className="w-3 h-3 mr-1" />
            Approuvé
          </span>
        );
      case 'PENDING':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400">
            <Clock className="w-3 h-3 mr-1" />
            En attente
          </span>
        );
      case 'REJECTED':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400">
            <XCircle className="w-3 h-3 mr-1" />
            Rejeté
          </span>
        );
      default:
        return null;
    }
  };

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'TikTok':
        return '📱';
      case 'Instagram Reels':
        return '📷';
      case 'YouTube Shorts':
        return '📹';
      default:
        return '📱';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Tableau de bord
          </h1>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            Bienvenue ! Voici un aperçu de vos performances
          </p>
        </div>
        <div className="mt-4 sm:mt-0 flex items-center space-x-3">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="week">Cette semaine</option>
            <option value="month">Ce mois</option>
            <option value="year">Cette année</option>
          </select>
          <button
            onClick={() => {
              // Export functionality
              const data = {
                earnings: mockStats.earnings,
                clips: mockStats.clips,
                views: mockStats.views,
                campaigns: mockStats.campaigns,
                exportDate: new Date().toISOString()
              };
              const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = `clipper-data-${new Date().toISOString().split('T')[0]}.json`;
              document.body.appendChild(a);
              a.click();
              document.body.removeChild(a);
              URL.revokeObjectURL(url);
            }}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium"
          >
            Exporter les données
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Gains totaux"
          value={`€${mockStats.earnings.total.toFixed(2)}`}
          subtitle={`€${mockStats.earnings.available.toFixed(2)} disponibles`}
          icon={<DollarSign className="h-6 w-6" />}
          trend={{
            value: mockStats.earnings.trend,
            label: 'vs mois dernier'
          }}
          variant="primary"
          loading={loading}
        />
        <StatsCard
          title="Clips soumis"
          value={mockStats.clips.total}
          subtitle={`${mockStats.clips.approved} approuvés, ${mockStats.clips.pending} en attente`}
          icon={<Video className="h-6 w-6" />}
          trend={{
            value: mockStats.clips.trend,
            label: 'vs mois dernier'
          }}
          loading={loading}
        />
        <StatsCard
          title="Vues totales"
          value={mockStats.views.total.toLocaleString()}
          subtitle={`${mockStats.views.likes.toLocaleString()} likes`}
          icon={<Eye className="h-6 w-6" />}
          trend={{
            value: mockStats.views.trend,
            label: 'vs mois dernier'
          }}
          loading={loading}
        />
        <StatsCard
          title="Campagnes actives"
          value={mockStats.campaigns.active}
          subtitle={`${mockStats.campaigns.available} disponibles`}
          icon={<Target className="h-6 w-6" />}
          loading={loading}
        />
      </div>

      {/* Quick Actions */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl p-6 text-white">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-xl font-bold">Prêt à créer du contenu ?</h2>
            <p className="mt-2 text-white/80">
              Découvrez les nouvelles campagnes disponibles et commencez à gagner de l'argent
            </p>
          </div>
          <div className="mt-4 lg:mt-0 flex flex-col sm:flex-row gap-3">
            <Link
              href="/dashboard/clipper/campaigns"
              className="inline-flex items-center justify-center px-4 py-2 bg-white text-purple-600 rounded-lg hover:bg-gray-100 transition-colors font-medium"
            >
              Explorer les campagnes
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
            <Link
              href="/dashboard/clipper/submissions/new"
              className="inline-flex items-center justify-center px-4 py-2 bg-white/20 text-white rounded-lg hover:bg-white/30 transition-colors font-medium"
            >
              Soumettre un clip
            </Link>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Campaigns */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Campagnes recommandées</h2>
              <Link
                href="/dashboard/clipper/campaigns"
                className="text-sm text-purple-600 dark:text-purple-400 hover:underline"
              >
                Voir tout
              </Link>
            </div>
          </div>
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {recentCampaigns.map((campaign) => (
              <div key={campaign.id} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                <div className="flex items-start space-x-4">
                  <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-lg flex-shrink-0">
                    {/* Campaign thumbnail */}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-gray-900 dark:text-white truncate">
                      {campaign.title}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      {campaign.advertiser} • €{campaign.pricePerClip}/clip
                    </p>
                    <div className="flex items-center mt-2 space-x-4">
                      <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                        <Calendar className="h-3 w-3 mr-1" />
                        {campaign.deadline}
                      </div>
                      <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                        <Users className="h-3 w-3 mr-1" />
                        {campaign.submissions}/{campaign.maxSubmissions}
                      </div>
                    </div>
                  </div>
                  <Link
                    href={`/dashboard/clipper/campaigns/${campaign.id}`}
                    className="px-3 py-1.5 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-lg text-sm font-medium hover:bg-purple-200 dark:hover:bg-purple-900/50 transition-colors"
                  >
                    Voir
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Submissions */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Soumissions récentes</h2>
              <Link
                href="/dashboard/clipper/submissions"
                className="text-sm text-purple-600 dark:text-purple-400 hover:underline"
              >
                Voir tout
              </Link>
            </div>
          </div>
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {recentSubmissions.map((submission) => (
              <div key={submission.id} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <span className="text-lg">{getPlatformIcon(submission.platform)}</span>
                      <h3 className="font-medium text-gray-900 dark:text-white text-sm">
                        {submission.campaign}
                      </h3>
                    </div>
                    <div className="mt-2 flex items-center space-x-4">
                      {submission.status === 'APPROVED' && (
                        <>
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {submission.views.toLocaleString()} vues
                          </span>
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {submission.likes} likes
                          </span>
                          <span className="text-xs font-medium text-green-600 dark:text-green-400">
                            +€{submission.earnings}
                          </span>
                        </>
                      )}
                      {submission.status === 'REJECTED' && submission.rejectionReason && (
                        <span className="text-xs text-red-600 dark:text-red-400">
                          {submission.rejectionReason}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="ml-4">
                    {getStatusBadge(submission.status)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Performance Chart */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
        <h2 className="text-lg font-semibold mb-4">Performance sur 30 jours</h2>
        <div className="h-64 flex items-center justify-center text-gray-400">
          {/* Chart will be implemented with Recharts */}
          <p>Graphique de performance (à implémenter avec Recharts)</p>
        </div>
      </div>

      {/* Notifications */}
      <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl p-4">
        <div className="flex items-start">
          <AlertCircle className="h-5 w-5 text-yellow-600 dark:text-yellow-400 mt-0.5" />
          <div className="ml-3">
            <h3 className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
              Action requise
            </h3>
            <p className="mt-1 text-sm text-yellow-700 dark:text-yellow-300">
              Votre vérification KYC expire dans 7 jours. Veuillez la renouveler pour continuer à recevoir vos paiements.
            </p>
            <Link
              href="/dashboard/clipper/profile#kyc"
              className="mt-2 inline-flex items-center text-sm font-medium text-yellow-800 dark:text-yellow-200 hover:underline"
            >
              Mettre à jour maintenant
              <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}