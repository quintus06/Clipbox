'use client';

import { useState, useEffect } from 'react';
import {
  TrendingUp,
  Eye,
  Clock,
  DollarSign,
  Megaphone,
  Users,
  ArrowUp,
  ArrowDown,
  Plus,
  BarChart3
} from 'lucide-react';
import Link from 'next/link';
import StatsOverview from '@/components/dashboard/advertiser/stats-overview';
import CampaignCard from '@/components/dashboard/advertiser/campaign-card';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

// Mock data for charts
const performanceData = [
  { date: '01/01', vues: 1200, clics: 150, conversions: 12 },
  { date: '02/01', vues: 1800, clics: 220, conversions: 18 },
  { date: '03/01', vues: 2400, clics: 310, conversions: 25 },
  { date: '04/01', vues: 2100, clics: 280, conversions: 22 },
  { date: '05/01', vues: 2800, clics: 350, conversions: 30 },
  { date: '06/01', vues: 3200, clics: 420, conversions: 35 },
  { date: '07/01', vues: 3500, clics: 480, conversions: 40 },
];

const budgetDistribution = [
  { name: 'Campagnes actives', value: 3500, color: '#10b981' },
  { name: 'En attente', value: 1000, color: '#f59e0b' },
  { name: 'Disponible', value: 500, color: '#6b7280' },
];

const recentCampaigns = [
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
  },
];

export default function AdvertiserDashboard() {
  const [isLoading, setIsLoading] = useState(false);
  const [stats, setStats] = useState({
    totalCampaigns: 8,
    activeCampaigns: 3,
    totalViews: 450000,
    totalWatchTime: 125000, // en minutes
    totalBalance: 5000,
    availableBalance: 3500,
    lockedBalance: 1500,
    totalSpent: 12500,
    averageROI: 3.2,
    totalSubmissions: 156,
    approvedSubmissions: 142,
    rejectedSubmissions: 14,
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setIsLoading(true);
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      // const response = await fetch('/api/advertiser/stats');
      // const data = await response.json();
      // setStats(data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
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

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  const formatWatchTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    if (days > 0) {
      return `${days}j ${hours % 24}h`;
    }
    return `${hours}h ${minutes % 60}m`;
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
            Tableau de bord
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-gray-500 dark:text-gray-400">
            Vue d'ensemble de vos campagnes publicitaires
          </p>
        </div>
        <div>
          <Link
            href="/dashboard/advertiser/campaigns/new"
            className="inline-flex items-center px-3 sm:px-4 py-2 bg-orange-600 text-white text-sm sm:text-base rounded-lg hover:bg-orange-700 transition-colors w-full sm:w-auto justify-center"
          >
            <Plus className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
            Nouvelle Campagne
          </Link>
        </div>
      </div>

      {/* Stats Grid - Responsive: 1 col mobile, 2 cols tablet, 4 cols desktop */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-4">
        <StatsOverview
          title="Campagnes Actives"
          value={stats.activeCampaigns}
          total={stats.totalCampaigns}
          icon={Megaphone}
          trend={{ value: 12, isPositive: true }}
          color="orange"
        />
        <StatsOverview
          title="Vues Totales"
          value={formatNumber(stats.totalViews)}
          icon={Eye}
          trend={{ value: 23, isPositive: true }}
          color="blue"
        />
        <StatsOverview
          title="Temps de Visionnage"
          value={formatWatchTime(stats.totalWatchTime)}
          icon={Clock}
          trend={{ value: 18, isPositive: true }}
          color="green"
        />
        <StatsOverview
          title="Balance Disponible"
          value={formatCurrency(stats.availableBalance)}
          subtitle={`Engagée: ${formatCurrency(stats.lockedBalance)}`}
          icon={DollarSign}
          color="purple"
          action={{
            label: 'Recharger',
            href: '/dashboard/advertiser/balance'
          }}
        />
      </div>

      {/* Charts Section - Stack on mobile, side by side on desktop */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 sm:gap-6">
        {/* Performance Chart */}
        <div className="xl:col-span-2 bg-white dark:bg-gray-800 rounded-lg shadow p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4">
            <h2 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">
              Performance des Campagnes
            </h2>
            <select className="text-xs sm:text-sm border border-gray-300 dark:border-gray-600 rounded-md px-2 sm:px-3 py-1 bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
              <option>7 derniers jours</option>
              <option>30 derniers jours</option>
              <option>3 derniers mois</option>
            </select>
          </div>
          <div className="w-full overflow-x-auto">
            <div className="min-w-[400px]">
              <ResponsiveContainer width="100%" height={250} minWidth={400}>
            <AreaChart data={performanceData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="date" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1f2937',
                  border: 'none',
                  borderRadius: '8px',
                  color: '#fff'
                }}
              />
              <Area
                type="monotone"
                dataKey="vues"
                stackId="1"
                stroke="#3b82f6"
                fill="#3b82f6"
                fillOpacity={0.6}
              />
              <Area
                type="monotone"
                dataKey="clics"
                stackId="1"
                stroke="#10b981"
                fill="#10b981"
                fillOpacity={0.6}
              />
              <Area
                type="monotone"
                dataKey="conversions"
                stackId="1"
                stroke="#f59e0b"
                fill="#f59e0b"
                fillOpacity={0.6}
              />
              </AreaChart>
            </ResponsiveContainer>
            </div>
          </div>
          <div className="flex flex-wrap items-center justify-center mt-4 gap-3 sm:gap-6">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
              <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Vues</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
              <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Clics</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-amber-500 rounded-full mr-2"></div>
              <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Conversions</span>
            </div>
          </div>
        </div>

        {/* Budget Distribution */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 sm:p-6">
          <h2 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Répartition du Budget
          </h2>
          <ResponsiveContainer width="100%" height={180} minWidth={200}>
            <PieChart>
              <Pie
                data={budgetDistribution}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {budgetDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value: number) => formatCurrency(value)}
                contentStyle={{
                  backgroundColor: '#1f2937',
                  border: 'none',
                  borderRadius: '8px',
                  color: '#fff'
                }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-4 space-y-2">
            {budgetDistribution.map((item) => (
              <div key={item.name} className="flex items-center justify-between">
                <div className="flex items-center min-w-0">
                  <div
                    className="w-3 h-3 rounded-full mr-2 flex-shrink-0"
                    style={{ backgroundColor: item.color }}
                  ></div>
                  <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 truncate">
                    {item.name}
                  </span>
                </div>
                <span className="text-xs sm:text-sm font-semibold text-gray-900 dark:text-white ml-2">
                  {formatCurrency(item.value)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Campaigns */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">
            Campagnes Récentes
          </h2>
          <Link
            href="/dashboard/advertiser/campaigns"
            className="text-xs sm:text-sm text-orange-600 dark:text-orange-400 hover:text-orange-700 dark:hover:text-orange-300"
          >
            Voir toutes →
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4">
          {recentCampaigns.map((campaign) => (
            <CampaignCard key={campaign.id} campaign={campaign} />
          ))}
        </div>
      </div>

      {/* Quick Actions - Better mobile layout */}
      <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-lg p-4 sm:p-6 text-white">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex-1">
            <h3 className="text-lg sm:text-xl font-bold mb-2">
              Optimisez vos campagnes
            </h3>
            <p className="text-sm sm:text-base text-orange-100">
              Analysez les performances et ajustez vos stratégies pour maximiser votre ROI
            </p>
          </div>
          <div className="flex">
            <Link
              href="/dashboard/advertiser/stats"
              className="inline-flex items-center justify-center px-3 sm:px-4 py-2 bg-white text-orange-600 text-sm sm:text-base rounded-lg hover:bg-orange-50 transition-colors w-full sm:w-auto"
            >
              <BarChart3 className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
              Voir les Analytics
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}