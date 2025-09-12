'use client';

import { useState, useEffect } from 'react';
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Calendar,
  DollarSign,
  Eye,
  Heart,
  Share2,
  Users,
  Video,
  Clock,
  Download,
  Filter,
  ChevronDown,
  ArrowUp,
  ArrowDown,
  Minus
} from 'lucide-react';

// Mock data for charts
const mockChartData = {
  earnings: [
    { month: 'Jan', amount: 450 },
    { month: 'Fév', amount: 620 },
    { month: 'Mar', amount: 580 },
    { month: 'Avr', amount: 890 },
    { month: 'Mai', amount: 1200 },
    { month: 'Jun', amount: 950 },
  ],
  views: [
    { day: 'Lun', views: 12500, likes: 890, shares: 120 },
    { day: 'Mar', views: 15200, likes: 1100, shares: 145 },
    { day: 'Mer', views: 18900, likes: 1350, shares: 189 },
    { day: 'Jeu', views: 22100, likes: 1680, shares: 220 },
    { day: 'Ven', views: 28500, likes: 2100, shares: 285 },
    { day: 'Sam', views: 35200, likes: 2800, shares: 352 },
    { day: 'Dim', views: 31000, likes: 2400, shares: 310 },
  ],
  platforms: [
    { name: 'TikTok', value: 45, color: '#000000' },
    { name: 'Instagram', value: 35, color: '#E4405F' },
    { name: 'YouTube', value: 20, color: '#FF0000' },
  ],
  topCampaigns: [
    { name: 'Summer Fashion', clips: 12, earnings: 450, views: 125000 },
    { name: 'Tech Review', clips: 8, earnings: 320, views: 89000 },
    { name: 'Fitness Challenge', clips: 15, earnings: 280, views: 156000 },
    { name: 'Beauty Tutorial', clips: 6, earnings: 180, views: 67000 },
  ],
};

const mockStats = {
  totalEarnings: 2450.50,
  monthlyEarnings: 950.00,
  averagePerClip: 65.50,
  totalViews: 458900,
  totalLikes: 32450,
  totalShares: 4890,
  engagementRate: 8.2,
  approvalRate: 85,
  totalClips: 45,
  approvedClips: 38,
  pendingClips: 4,
  rejectedClips: 3,
};

export default function StatsPage() {
  const [timeRange, setTimeRange] = useState('month');
  const [selectedMetric, setSelectedMetric] = useState('earnings');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading
    setTimeout(() => setLoading(false), 1000);
  }, []);

  const getTrendIcon = (value: number) => {
    if (value > 0) return <ArrowUp className="h-4 w-4" />;
    if (value < 0) return <ArrowDown className="h-4 w-4" />;
    return <Minus className="h-4 w-4" />;
  };

  const getTrendColor = (value: number) => {
    if (value > 0) return 'text-green-600 dark:text-green-400';
    if (value < 0) return 'text-red-600 dark:text-red-400';
    return 'text-gray-600 dark:text-gray-400';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Statistiques
          </h1>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            Analysez vos performances et optimisez votre stratégie
          </p>
        </div>
        <div className="mt-4 sm:mt-0 flex items-center gap-3">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="week">Cette semaine</option>
            <option value="month">Ce mois</option>
            <option value="quarter">Ce trimestre</option>
            <option value="year">Cette année</option>
            <option value="all">Tout</option>
          </select>
          <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium flex items-center gap-2">
            <Download className="h-4 w-4" />
            Exporter
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
              <DollarSign className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
            <span className={`flex items-center gap-1 text-sm font-medium ${getTrendColor(12.5)}`}>
              {getTrendIcon(12.5)}
              12.5%
            </span>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">Gains totaux</p>
          <p className="text-2xl font-bold mt-1">€{mockStats.totalEarnings.toFixed(2)}</p>
          <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
            €{mockStats.monthlyEarnings.toFixed(2)} ce mois
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <Eye className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <span className={`flex items-center gap-1 text-sm font-medium ${getTrendColor(23.4)}`}>
              {getTrendIcon(23.4)}
              23.4%
            </span>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">Vues totales</p>
          <p className="text-2xl font-bold mt-1">{(mockStats.totalViews / 1000).toFixed(1)}K</p>
          <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
            {mockStats.totalLikes} likes
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
              <TrendingUp className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
            <span className={`flex items-center gap-1 text-sm font-medium ${getTrendColor(8.2)}`}>
              {getTrendIcon(8.2)}
              8.2%
            </span>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">Taux d'engagement</p>
          <p className="text-2xl font-bold mt-1">{mockStats.engagementRate}%</p>
          <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
            vs 7.5% moyenne
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg">
              <Video className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
            </div>
            <span className={`flex items-center gap-1 text-sm font-medium ${getTrendColor(-5.3)}`}>
              {getTrendIcon(-5.3)}
              5.3%
            </span>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">Taux d'approbation</p>
          <p className="text-2xl font-bold mt-1">{mockStats.approvalRate}%</p>
          <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
            {mockStats.approvedClips}/{mockStats.totalClips} clips
          </p>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Earnings Chart */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Évolution des gains</h2>
            <select className="text-sm px-2 py-1 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white">
              <option>6 derniers mois</option>
              <option>12 derniers mois</option>
            </select>
          </div>
          <div className="space-y-4">
            {mockChartData.earnings.map((item, index) => (
              <div key={index} className="flex items-center gap-4">
                <span className="text-sm text-gray-600 dark:text-gray-400 w-12">{item.month}</span>
                <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-8 relative overflow-hidden">
                  <div
                    className="absolute left-0 top-0 h-full bg-gradient-to-r from-purple-500 to-purple-600 rounded-full flex items-center justify-end pr-3"
                    style={{ width: `${(item.amount / 1200) * 100}%` }}
                  >
                    <span className="text-xs text-white font-medium">€{item.amount}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Engagement Chart */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Engagement par jour</h2>
            <select className="text-sm px-2 py-1 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white">
              <option>Cette semaine</option>
              <option>Semaine dernière</option>
            </select>
          </div>
          <div className="space-y-3">
            {mockChartData.views.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400 w-12">{item.day}</span>
                <div className="flex-1 flex items-center gap-2 mx-4">
                  <div className="flex-1 flex items-center gap-1">
                    <Eye className="h-3 w-3 text-gray-400" />
                    <span className="text-xs text-gray-700 dark:text-gray-300">{(item.views / 1000).toFixed(1)}K</span>
                  </div>
                  <div className="flex-1 flex items-center gap-1">
                    <Heart className="h-3 w-3 text-red-400" />
                    <span className="text-xs text-gray-700 dark:text-gray-300">{item.likes}</span>
                  </div>
                  <div className="flex-1 flex items-center gap-1">
                    <Share2 className="h-3 w-3 text-blue-400" />
                    <span className="text-xs text-gray-700 dark:text-gray-300">{item.shares}</span>
                  </div>
                </div>
                <span className="text-sm font-medium text-purple-600 dark:text-purple-400">
                  {((item.likes + item.shares) / item.views * 100).toFixed(1)}%
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Platform Distribution & Top Campaigns */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Platform Distribution */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold mb-6 text-gray-900 dark:text-white">Répartition par plateforme</h2>
          <div className="space-y-4">
            {mockChartData.platforms.map((platform, index) => (
              <div key={index}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-900 dark:text-white">{platform.name}</span>
                  <span className="text-sm text-gray-600 dark:text-gray-400">{platform.value}%</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className="h-2 rounded-full bg-gradient-to-r from-purple-500 to-purple-600"
                    style={{ width: `${platform.value}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">Total plateformes</span>
              <span className="font-medium text-gray-900 dark:text-white">3 actives</span>
            </div>
          </div>
        </div>

        {/* Top Campaigns */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Top campagnes</h2>
            <button className="text-sm text-purple-600 dark:text-purple-400 hover:underline">
              Voir tout
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left border-b border-gray-200 dark:border-gray-700">
                  <th className="pb-3 text-sm font-medium text-gray-600 dark:text-gray-400">Campagne</th>
                  <th className="pb-3 text-sm font-medium text-gray-600 dark:text-gray-400 text-center">Clips</th>
                  <th className="pb-3 text-sm font-medium text-gray-600 dark:text-gray-400 text-right">Gains</th>
                  <th className="pb-3 text-sm font-medium text-gray-600 dark:text-gray-400 text-right">Vues</th>
                  <th className="pb-3 text-sm font-medium text-gray-600 dark:text-gray-400 text-right">Perf.</th>
                </tr>
              </thead>
              <tbody>
                {mockChartData.topCampaigns.map((campaign, index) => (
                  <tr key={index} className="border-b border-gray-100 dark:border-gray-700/50">
                    <td className="py-3">
                      <p className="font-medium text-sm text-gray-900 dark:text-white">{campaign.name}</p>
                    </td>
                    <td className="py-3 text-center">
                      <span className="text-sm text-gray-700 dark:text-gray-300">{campaign.clips}</span>
                    </td>
                    <td className="py-3 text-right">
                      <span className="text-sm font-medium text-gray-900 dark:text-white">€{campaign.earnings}</span>
                    </td>
                    <td className="py-3 text-right">
                      <span className="text-sm text-gray-700 dark:text-gray-300">{(campaign.views / 1000).toFixed(0)}K</span>
                    </td>
                    <td className="py-3 text-right">
                      <span className="inline-flex items-center gap-1 text-sm">
                        <TrendingUp className="h-3 w-3 text-green-500" />
                        <span className="text-green-600 dark:text-green-400">+12%</span>
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Performance Summary */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl p-6 text-white">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div>
            <p className="text-white/80 text-sm">Moyenne par clip</p>
            <p className="text-2xl font-bold mt-1">€{mockStats.averagePerClip.toFixed(2)}</p>
            <p className="text-xs text-white/60 mt-1">+15% vs mois dernier</p>
          </div>
          <div>
            <p className="text-white/80 text-sm">Meilleur jour</p>
            <p className="text-2xl font-bold mt-1">Samedi</p>
            <p className="text-xs text-white/60 mt-1">35.2K vues moyennes</p>
          </div>
          <div>
            <p className="text-white/80 text-sm">Heure optimale</p>
            <p className="text-2xl font-bold mt-1">19h-21h</p>
            <p className="text-xs text-white/60 mt-1">+45% d'engagement</p>
          </div>
          <div>
            <p className="text-white/80 text-sm">Prochain paiement</p>
            <p className="text-2xl font-bold mt-1">€{mockStats.monthlyEarnings.toFixed(2)}</p>
            <p className="text-xs text-white/60 mt-1">Dans 5 jours</p>
          </div>
        </div>
      </div>

      {/* Tips Section */}
      <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <TrendingUp className="h-5 w-5 text-yellow-600 dark:text-yellow-400 mt-0.5" />
          <div>
            <h3 className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
              Conseil d'optimisation
            </h3>
            <p className="mt-1 text-sm text-yellow-700 dark:text-yellow-300">
              Vos clips du samedi performent 45% mieux que la moyenne. Essayez de publier plus de contenu ce jour-là pour maximiser votre engagement.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}