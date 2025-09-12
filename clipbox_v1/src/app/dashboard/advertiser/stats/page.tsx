'use client';

import { useState, useEffect } from 'react';
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Calendar,
  DollarSign,
  Eye,
  Users,
  Video,
  Clock,
  Download,
  Filter,
  ChevronDown,
  ArrowUp,
  ArrowDown,
  Minus,
  Target,
  MousePointer,
  Megaphone,
  Globe,
  Activity,
  Percent
} from 'lucide-react';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

// Mock data for charts
const mockChartData = {
  budgetEvolution: [
    { day: '1', budget: 450, spent: 320, roi: 2.8 },
    { day: '5', budget: 620, spent: 480, roi: 3.1 },
    { day: '10', budget: 580, spent: 450, roi: 2.9 },
    { day: '15', budget: 890, spent: 720, roi: 3.5 },
    { day: '20', budget: 1200, spent: 980, roi: 3.8 },
    { day: '25', budget: 950, spent: 780, roi: 3.2 },
    { day: '30', budget: 1100, spent: 920, roi: 3.6 },
  ],
  platformPerformance: [
    { platform: 'TikTok', campaigns: 12, budget: 4500, clips: 156, engagement: 8.5, roi: 3.8 },
    { platform: 'Instagram', campaigns: 8, budget: 3200, clips: 98, engagement: 7.2, roi: 3.2 },
    { platform: 'YouTube', campaigns: 5, budget: 2800, clips: 45, engagement: 6.8, roi: 2.9 },
  ],
  topCampaigns: [
    { name: 'Tech Launch 2025', budget: 2500, spent: 1850, clips: 45, views: 450000, engagement: 9.2, roi: 4.2, status: 'active' },
    { name: 'Summer Fashion', budget: 1800, spent: 1200, clips: 32, views: 320000, engagement: 8.5, roi: 3.8, status: 'active' },
    { name: 'Gaming Setup', budget: 1500, spent: 980, clips: 28, views: 280000, engagement: 7.8, roi: 3.5, status: 'active' },
    { name: 'Beauty Tutorial', budget: 1200, spent: 1100, clips: 22, views: 195000, engagement: 8.9, roi: 3.2, status: 'completed' },
    { name: 'Fitness Challenge', budget: 1000, spent: 450, clips: 15, views: 125000, engagement: 7.2, roi: 2.8, status: 'paused' },
  ],
  clipperDistribution: [
    { country: 'France', clippers: 45, percentage: 35 },
    { country: 'USA', clippers: 32, percentage: 25 },
    { country: 'UK', clippers: 20, percentage: 15 },
    { country: 'Germany', clippers: 18, percentage: 14 },
    { country: 'Spain', clippers: 14, percentage: 11 },
  ],
  engagementMetrics: [
    { metric: 'Vues', value: 85 },
    { metric: 'Likes', value: 72 },
    { metric: 'Partages', value: 68 },
    { metric: 'Commentaires', value: 45 },
    { metric: 'Clics', value: 38 },
    { metric: 'Conversions', value: 12 },
  ],
  monthlyComparison: {
    current: {
      budget: 10500,
      spent: 8650,
      campaigns: 8,
      clips: 299,
      views: 1875000,
      engagement: 8.2,
      roi: 3.5,
      conversions: 145
    },
    previous: {
      budget: 9200,
      spent: 7800,
      campaigns: 6,
      clips: 245,
      views: 1520000,
      engagement: 7.5,
      roi: 3.1,
      conversions: 112
    }
  }
};

const mockStats = {
  totalCampaigns: 25,
  activeCampaigns: 8,
  totalBudget: 45000,
  totalSpent: 32450.50,
  clipsGenerated: 892,
  averageEngagement: 8.2,
  globalROI: 3.5,
  totalViews: 4580000,
  totalConversions: 458,
  conversionRate: 3.2,
  costPerEngagement: 2.45,
  averageCostPerClip: 36.40,
};

export default function StatsPage() {
  const [timeRange, setTimeRange] = useState('30days');
  const [selectedPlatform, setSelectedPlatform] = useState('all');
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

  const calculatePercentageChange = (current: number, previous: number) => {
    if (previous === 0) return 0;
    return ((current - previous) / previous * 100).toFixed(1);
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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
            Statistiques & Analytics
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-gray-600 dark:text-gray-400">
            Analysez les performances de vos campagnes publicitaires
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-2 sm:px-3 py-1.5 sm:py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-xs sm:text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
          >
            <option value="7days">7 derniers jours</option>
            <option value="30days">30 derniers jours</option>
            <option value="3months">3 derniers mois</option>
            <option value="year">Cette année</option>
          </select>
          <select
            value={selectedPlatform}
            onChange={(e) => setSelectedPlatform(e.target.value)}
            className="px-2 sm:px-3 py-1.5 sm:py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-xs sm:text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
          >
            <option value="all">Toutes plateformes</option>
            <option value="tiktok">TikTok</option>
            <option value="instagram">Instagram</option>
            <option value="youtube">YouTube</option>
          </select>
          <button className="px-3 sm:px-4 py-1.5 sm:py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors text-xs sm:text-sm font-medium flex items-center justify-center gap-2">
            <Download className="h-3 w-3 sm:h-4 sm:w-4" />
            Exporter
          </button>
        </div>
      </div>

      {/* Key Performance Metrics - Responsive grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
              <Megaphone className="h-6 w-6 text-orange-600 dark:text-orange-400" />
            </div>
            <span className={`flex items-center gap-1 text-sm font-medium ${getTrendColor(14.3)}`}>
              {getTrendIcon(14.3)}
              14.3%
            </span>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">Campagnes totales</p>
          <p className="text-2xl font-bold mt-1">{mockStats.totalCampaigns}</p>
          <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
            {mockStats.activeCampaigns} actives
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-3 sm:p-4 lg:p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-2 sm:mb-4">
            <div className="p-1.5 sm:p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
              <DollarSign className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 text-green-600 dark:text-green-400" />
            </div>
            <span className={`hidden sm:flex items-center gap-1 text-xs sm:text-sm font-medium ${getTrendColor(-8.5)}`}>
              {getTrendIcon(-8.5)}
              <span className="hidden lg:inline">8.5%</span>
            </span>
          </div>
          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 truncate">Budget</p>
          <p className="text-base sm:text-lg lg:text-2xl font-bold mt-1 truncate">{formatCurrency(mockStats.totalSpent)}</p>
          <p className="text-xs text-gray-500 dark:text-gray-500 mt-1 sm:mt-2 truncate">
            / {formatCurrency(mockStats.totalBudget)}
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <Video className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <span className={`flex items-center gap-1 text-sm font-medium ${getTrendColor(23.4)}`}>
              {getTrendIcon(23.4)}
              23.4%
            </span>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">Clips générés</p>
          <p className="text-2xl font-bold mt-1">{mockStats.clipsGenerated}</p>
          <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
            {formatCurrency(mockStats.averageCostPerClip)}/clip
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
              <Activity className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
            <span className={`flex items-center gap-1 text-sm font-medium ${getTrendColor(12.8)}`}>
              {getTrendIcon(12.8)}
              12.8%
            </span>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">Taux d'engagement</p>
          <p className="text-2xl font-bold mt-1">{mockStats.averageEngagement}%</p>
          <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
            {formatCurrency(mockStats.costPerEngagement)}/eng.
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg">
              <Target className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
            </div>
            <span className={`flex items-center gap-1 text-sm font-medium ${getTrendColor(18.5)}`}>
              {getTrendIcon(18.5)}
              18.5%
            </span>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">ROI Global</p>
          <p className="text-2xl font-bold mt-1">{mockStats.globalROI}x</p>
          <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
            {mockStats.conversionRate}% conv.
          </p>
        </div>
      </div>

      {/* Charts Section - Stack on mobile */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6">
        {/* Budget Evolution Chart */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 sm:p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4 sm:mb-6">
            <h2 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">Évolution du budget</h2>
            <div className="flex items-center gap-3 text-xs">
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 sm:w-3 sm:h-3 bg-orange-500 rounded-full"></div>
                <span className="text-gray-600 dark:text-gray-400">Budget</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 sm:w-3 sm:h-3 bg-green-500 rounded-full"></div>
                <span className="text-gray-600 dark:text-gray-400">Dépensé</span>
              </div>
            </div>
          </div>
          <div className="w-full overflow-x-auto">
            <div className="min-w-[350px]">
              <ResponsiveContainer width="100%" height={200} minWidth={350}>
            <AreaChart data={mockChartData.budgetEvolution}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="day" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1f2937',
                  border: 'none',
                  borderRadius: '8px',
                  color: '#fff'
                }}
                formatter={(value: number) => formatCurrency(value)}
              />
              <Area
                type="monotone"
                dataKey="budget"
                stroke="#f97316"
                fill="#f97316"
                fillOpacity={0.3}
              />
              <Area
                type="monotone"
                dataKey="spent"
                stroke="#10b981"
                fill="#10b981"
                fillOpacity={0.3}
              />
              </AreaChart>
            </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Platform Performance */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 sm:p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <h2 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">Performance par plateforme</h2>
          </div>
          <div className="w-full overflow-x-auto">
            <div className="min-w-[350px]">
              <ResponsiveContainer width="100%" height={200} minWidth={350}>
            <BarChart data={mockChartData.platformPerformance}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="platform" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1f2937',
                  border: 'none',
                  borderRadius: '8px',
                  color: '#fff'
                }}
              />
              <Bar dataKey="campaigns" fill="#f97316" radius={[8, 8, 0, 0]} />
              <Bar dataKey="clips" fill="#3b82f6" radius={[8, 8, 0, 0]} />
              <Bar dataKey="engagement" fill="#10b981" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
            </div>
          </div>
          <div className="flex flex-wrap items-center justify-center mt-3 sm:mt-4 gap-2 sm:gap-4 text-xs">
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 sm:w-3 sm:h-3 bg-orange-500 rounded-full"></div>
              <span className="text-gray-600 dark:text-gray-400">Campagnes</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 sm:w-3 sm:h-3 bg-blue-500 rounded-full"></div>
              <span className="text-gray-600 dark:text-gray-400">Clips</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 sm:w-3 sm:h-3 bg-green-500 rounded-full"></div>
              <span className="text-gray-600 dark:text-gray-400">Engagement</span>
            </div>
          </div>
        </div>
      </div>

      {/* Top Campaigns Table - Mobile scrollable */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-4 sm:p-6 border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <h2 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">Top 5 des campagnes</h2>
          <button className="text-xs sm:text-sm text-orange-600 dark:text-orange-400 hover:underline">
            Voir toutes →
          </button>
        </div>
        <div className="overflow-x-auto -mx-4 sm:-mx-6 px-4 sm:px-6">
          <table className="w-full min-w-[600px]">
            <thead>
              <tr className="text-left border-b border-gray-200 dark:border-gray-700">
                <th className="pb-2 sm:pb-3 text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400">Campagne</th>
                <th className="pb-2 sm:pb-3 text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400 text-center">Statut</th>
                <th className="pb-2 sm:pb-3 text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400 text-right">Budget</th>
                <th className="pb-2 sm:pb-3 text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400 text-right">Dépensé</th>
                <th className="pb-2 sm:pb-3 text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400 text-right hidden sm:table-cell">Clips</th>
                <th className="pb-2 sm:pb-3 text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400 text-right">Vues</th>
                <th className="pb-2 sm:pb-3 text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400 text-right hidden lg:table-cell">Engagement</th>
                <th className="pb-2 sm:pb-3 text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400 text-right">ROI</th>
              </tr>
            </thead>
            <tbody>
              {mockChartData.topCampaigns.map((campaign, index) => (
                <tr key={index} className="border-b border-gray-100 dark:border-gray-700/50">
                  <td className="py-3">
                    <p className="font-medium text-sm text-gray-900 dark:text-white">{campaign.name}</p>
                  </td>
                  <td className="py-3 text-center">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium
                      ${campaign.status === 'active' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' : ''}
                      ${campaign.status === 'paused' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400' : ''}
                      ${campaign.status === 'completed' ? 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400' : ''}
                    `}>
                      {campaign.status === 'active' ? 'Active' : campaign.status === 'paused' ? 'En pause' : 'Terminée'}
                    </span>
                  </td>
                  <td className="py-3 text-right">
                    <span className="text-sm text-gray-700 dark:text-gray-300">{formatCurrency(campaign.budget)}</span>
                  </td>
                  <td className="py-3 text-right">
                    <span className="text-sm font-medium text-gray-900 dark:text-white">{formatCurrency(campaign.spent)}</span>
                  </td>
                  <td className="py-3 text-right">
                    <span className="text-sm text-gray-700 dark:text-gray-300">{campaign.clips}</span>
                  </td>
                  <td className="py-3 text-right">
                    <span className="text-sm text-gray-700 dark:text-gray-300">{formatNumber(campaign.views)}</span>
                  </td>
                  <td className="py-3 text-right">
                    <span className="text-sm text-gray-700 dark:text-gray-300">{campaign.engagement}%</span>
                  </td>
                  <td className="py-3 text-right">
                    <span className="inline-flex items-center gap-1 text-sm">
                      <TrendingUp className="h-3 w-3 text-green-500" />
                      <span className="text-green-600 dark:text-green-400 font-medium">{campaign.roi}x</span>
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Distribution and Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Clipper Distribution by Country */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold mb-6 text-gray-900 dark:text-white">Distribution des clippers</h2>
          <div className="space-y-4">
            {mockChartData.clipperDistribution.map((country, index) => (
              <div key={index}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Globe className="h-4 w-4 text-gray-400" />
                    <span className="text-sm font-medium text-gray-900 dark:text-white">{country.country}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600 dark:text-gray-400">{country.clippers} clippers</span>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">{country.percentage}%</span>
                  </div>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className="h-2 rounded-full bg-gradient-to-r from-orange-500 to-orange-600"
                    style={{ width: `${country.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">Total clippers</span>
              <span className="font-medium text-gray-900 dark:text-white">129 actifs</span>
            </div>
          </div>
        </div>

        {/* Engagement Metrics */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold mb-6 text-gray-900 dark:text-white">Métriques d'engagement</h2>
          <div className="space-y-3">
            {mockChartData.engagementMetrics.map((metric, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">{metric.metric}</span>
                <div className="flex items-center gap-2">
                  <div className="w-24 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className="h-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-600"
                      style={{ width: `${metric.value}%` }}
                    />
                  </div>
                  <span className="text-sm font-medium text-gray-900 dark:text-white w-12 text-right">
                    {metric.value}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Period Comparison */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold mb-6 text-gray-900 dark:text-white">Comparaison mensuelle</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">Budget</span>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {formatCurrency(mockChartData.monthlyComparison.current.budget)}
                </span>
                <span className={`text-xs font-medium ${getTrendColor(Number(calculatePercentageChange(mockChartData.monthlyComparison.current.budget, mockChartData.monthlyComparison.previous.budget)))}`}>
                  +{calculatePercentageChange(mockChartData.monthlyComparison.current.budget, mockChartData.monthlyComparison.previous.budget)}%
                </span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">Clips générés</span>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {mockChartData.monthlyComparison.current.clips}
                </span>
                <span className={`text-xs font-medium ${getTrendColor(Number(calculatePercentageChange(mockChartData.monthlyComparison.current.clips, mockChartData.monthlyComparison.previous.clips)))}`}>
                  +{calculatePercentageChange(mockChartData.monthlyComparison.current.clips, mockChartData.monthlyComparison.previous.clips)}%
                </span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">Vues totales</span>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {formatNumber(mockChartData.monthlyComparison.current.views)}
                </span>
                <span className={`text-xs font-medium ${getTrendColor(Number(calculatePercentageChange(mockChartData.monthlyComparison.current.views, mockChartData.monthlyComparison.previous.views)))}`}>
                  +{calculatePercentageChange(mockChartData.monthlyComparison.current.views, mockChartData.monthlyComparison.previous.views)}%
                </span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">Engagement</span>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {mockChartData.monthlyComparison.current.engagement}%
                </span>
                <span className={`text-xs font-medium ${getTrendColor(Number(calculatePercentageChange(mockChartData.monthlyComparison.current.engagement, mockChartData.monthlyComparison.previous.engagement)))}`}>
                  +{calculatePercentageChange(mockChartData.monthlyComparison.current.engagement, mockChartData.monthlyComparison.previous.engagement)}%
                </span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">ROI</span>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {mockChartData.monthlyComparison.current.roi}x
                </span>
                <span className={`text-xs font-medium ${getTrendColor(Number(calculatePercentageChange(mockChartData.monthlyComparison.current.roi, mockChartData.monthlyComparison.previous.roi)))}`}>
                  +{calculatePercentageChange(mockChartData.monthlyComparison.current.roi, mockChartData.monthlyComparison.previous.roi)}%
                </span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">Conversions</span>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {mockChartData.monthlyComparison.current.conversions}
                </span>
                <span className={`text-xs font-medium ${getTrendColor(Number(calculatePercentageChange(mockChartData.monthlyComparison.current.conversions, mockChartData.monthlyComparison.previous.conversions)))}`}>
                  +{calculatePercentageChange(mockChartData.monthlyComparison.current.conversions, mockChartData.monthlyComparison.previous.conversions)}%
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Performance Summary */}
      <div className="bg-gradient-to-r from-orange-600 to-red-600 rounded-xl p-6 text-white">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div>
            <p className="text-white/80 text-sm">Coût moyen par clip</p>
            <p className="text-2xl font-bold mt-1">{formatCurrency(mockStats.averageCostPerClip)}</p>
            <p className="text-xs text-white/60 mt-1">-12% vs mois dernier</p>
          </div>
          <div>
            <p className="text-white/80 text-sm">Meilleure plateforme</p>
            <p className="text-2xl font-bold mt-1">TikTok</p>
            <p className="text-xs text-white/60 mt-1">ROI de 3.8x</p>
          </div>
          <div>
            <p className="text-white/80 text-sm">Taux de conversion</p>
            <p className="text-2xl font-bold mt-1">{mockStats.conversionRate}%</p>
            <p className="text-xs text-white/60 mt-1">+0.5% ce mois</p>
          </div>
          <div>
            <p className="text-white/80 text-sm">Vues totales</p>
            <p className="text-2xl font-bold mt-1">{formatNumber(mockStats.totalViews)}</p>
            <p className="text-xs text-white/60 mt-1">+23% de croissance</p>
          </div>
        </div>
      </div>

      {/* Tips Section */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <TrendingUp className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5" />
          <div>
            <h3 className="text-sm font-medium text-blue-800 dark:text-blue-200">
              Conseil d'optimisation
            </h3>
            <p className="mt-1 text-sm text-blue-700 dark:text-blue-300">
              Vos campagnes TikTok génèrent un ROI 18% supérieur à la moyenne. Considérez augmenter votre budget sur cette plateforme pour maximiser vos résultats. Les clippers français montrent également un taux d'engagement 25% plus élevé.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}