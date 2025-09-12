'use client';

import { useState, useEffect } from 'react';
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Users,
  Video,
  Eye,
  Calendar,
  Download,
  Filter,
  RefreshCw,
  ArrowUpRight,
  ArrowDownRight,
  Activity,
  Target,
  Award,
  Globe,
  Smartphone,
  Monitor,
  ChevronDown
} from 'lucide-react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from 'recharts';

interface MetricCard {
  title: string;
  value: string | number;
  change: number;
  changeLabel: string;
  icon: React.ElementType;
  trend: 'up' | 'down' | 'stable';
}

export default function AdminAnalyticsPage() {
  const [timeRange, setTimeRange] = useState('30d');
  const [isLoading, setIsLoading] = useState(true);
  const [selectedMetric, setSelectedMetric] = useState('revenue');
  const [showComparison, setShowComparison] = useState(true);

  // Données pour les graphiques
  const revenueData = [
    { date: '01/01', revenue: 12500, transactions: 145, avgTransaction: 86 },
    { date: '05/01', revenue: 15600, transactions: 178, avgTransaction: 88 },
    { date: '10/01', revenue: 14200, transactions: 162, avgTransaction: 88 },
    { date: '15/01', revenue: 18900, transactions: 210, avgTransaction: 90 },
    { date: '20/01', revenue: 22300, transactions: 245, avgTransaction: 91 },
    { date: '25/01', revenue: 19800, transactions: 220, avgTransaction: 90 },
    { date: '30/01', revenue: 24500, transactions: 268, avgTransaction: 91 }
  ];

  const userGrowthData = [
    { month: 'Jan', clippers: 1200, advertisers: 300, total: 1500 },
    { month: 'Fév', clippers: 1900, advertisers: 450, total: 2350 },
    { month: 'Mar', clippers: 2500, advertisers: 620, total: 3120 },
    { month: 'Avr', clippers: 3200, advertisers: 890, total: 4090 },
    { month: 'Mai', clippers: 4100, advertisers: 1150, total: 5250 },
    { month: 'Juin', clippers: 5234, advertisers: 1456, total: 6690 }
  ];

  const platformData = [
    { name: 'TikTok', value: 45, color: '#000000' },
    { name: 'Instagram', value: 25, color: '#E4405F' },
    { name: 'YouTube', value: 15, color: '#FF0000' },
    { name: 'Twitter', value: 10, color: '#1DA1F2' },
    { name: 'Autres', value: 5, color: '#9CA3AF' }
  ];

  const campaignPerformanceData = [
    { category: 'Mode', campaigns: 45, revenue: 125000, conversion: 3.2 },
    { category: 'Beauté', campaigns: 38, revenue: 98000, conversion: 2.8 },
    { category: 'Tech', campaigns: 32, revenue: 145000, conversion: 4.1 },
    { category: 'Food', campaigns: 28, revenue: 67000, conversion: 2.4 },
    { category: 'Sport', campaigns: 25, revenue: 89000, conversion: 3.5 },
    { category: 'Autres', campaigns: 18, revenue: 45000, conversion: 2.1 }
  ];

  const deviceData = [
    { device: 'Mobile', sessions: 68, revenue: 75 },
    { device: 'Desktop', sessions: 25, revenue: 20 },
    { device: 'Tablet', sessions: 7, revenue: 5 }
  ];

  const countryData = [
    { country: 'France', users: 4500, revenue: 285000 },
    { country: 'Belgique', users: 890, revenue: 56000 },
    { country: 'Suisse', users: 650, revenue: 78000 },
    { country: 'Canada', users: 420, revenue: 35000 },
    { country: 'Autres', users: 230, revenue: 15000 }
  ];

  const conversionFunnelData = [
    { stage: 'Visiteurs', value: 100000, percentage: 100 },
    { stage: 'Inscrits', value: 35000, percentage: 35 },
    { stage: 'Actifs', value: 18000, percentage: 18 },
    { stage: 'Créateurs', value: 8500, percentage: 8.5 },
    { stage: 'Monétisés', value: 3200, percentage: 3.2 }
  ];

  const metrics: MetricCard[] = [
    {
      title: 'Revenus totaux',
      value: '€569,450',
      change: 23.5,
      changeLabel: 'vs mois dernier',
      icon: DollarSign,
      trend: 'up'
    },
    {
      title: 'Utilisateurs actifs',
      value: '18,234',
      change: 12.8,
      changeLabel: 'vs mois dernier',
      icon: Users,
      trend: 'up'
    },
    {
      title: 'Taux de conversion',
      value: '3.2%',
      change: -5.2,
      changeLabel: 'vs mois dernier',
      icon: Target,
      trend: 'down'
    },
    {
      title: 'Valeur moyenne',
      value: '€91',
      change: 8.3,
      changeLabel: 'par transaction',
      icon: Award,
      trend: 'up'
    }
  ];

  const performanceIndicators = [
    { label: 'Campagnes actives', value: 186, change: '+12%' },
    { label: 'Clips créés', value: '8.5k', change: '+25%' },
    { label: 'Vues totales', value: '2.3M', change: '+45%' },
    { label: 'Engagement moyen', value: '4.8%', change: '+0.3%' }
  ];

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, []);

  const handleExport = (format: 'csv' | 'pdf') => {
    console.log(`Exporting analytics in ${format} format`);
    // Implémenter l'export
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
          <p className="text-sm font-medium text-gray-900 dark:text-white">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: {entry.name.includes('€') || entry.dataKey === 'revenue' ? '€' : ''}{entry.value.toLocaleString()}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

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
            Analytics & Rapports
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Analysez les performances et tendances de la plateforme
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800"
          >
            <option value="7d">7 jours</option>
            <option value="30d">30 jours</option>
            <option value="90d">90 jours</option>
            <option value="1y">1 an</option>
            <option value="all">Tout</option>
          </select>
          
          <button className="p-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700">
            <Filter className="h-5 w-5 text-gray-600 dark:text-gray-400" />
          </button>
          
          <button className="p-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700">
            <RefreshCw className="h-5 w-5 text-gray-600 dark:text-gray-400" />
          </button>
          
          <div className="relative">
            <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center gap-2">
              <Download className="h-4 w-4" />
              Exporter
              <ChevronDown className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric, index) => (
          <div
            key={index}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-lg bg-purple-100 dark:bg-purple-900/30">
                <metric.icon className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div className={`flex items-center text-sm font-medium ${
                metric.trend === 'up' ? 'text-green-600' : 'text-red-600'
              }`}>
                {metric.trend === 'up' ? (
                  <ArrowUpRight className="h-4 w-4 mr-1" />
                ) : (
                  <ArrowDownRight className="h-4 w-4 mr-1" />
                )}
                {Math.abs(metric.change)}%
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
              {metric.value}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {metric.title}
            </p>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">
              {metric.changeLabel}
            </p>
          </div>
        ))}
      </div>

      {/* Revenue Chart */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Évolution des revenus
          </h2>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowComparison(!showComparison)}
              className={`px-3 py-1 text-sm rounded-lg ${
                showComparison
                  ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-600'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
              }`}
            >
              Comparaison
            </button>
          </div>
        </div>
        
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={revenueData}>
            <defs>
              <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#9333ea" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#9333ea" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="date" stroke="#6b7280" />
            <YAxis stroke="#6b7280" />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Area
              type="monotone"
              dataKey="revenue"
              stroke="#9333ea"
              fillOpacity={1}
              fill="url(#colorRevenue)"
              name="Revenus (€)"
            />
            {showComparison && (
              <Line
                type="monotone"
                dataKey="transactions"
                stroke="#6366f1"
                strokeWidth={2}
                dot={false}
                name="Transactions"
              />
            )}
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* User Growth and Platform Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User Growth */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
            Croissance des utilisateurs
          </h2>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={userGrowthData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="month" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Bar dataKey="clippers" fill="#9333ea" name="Clippers" />
              <Bar dataKey="advertisers" fill="#6366f1" name="Annonceurs" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Platform Distribution */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
            Répartition par plateforme
          </h2>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={platformData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {platformData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Campaign Performance */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
          Performance par catégorie
        </h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={campaignPerformanceData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="category" stroke="#6b7280" />
            <YAxis yAxisId="left" stroke="#6b7280" />
            <YAxis yAxisId="right" orientation="right" stroke="#6b7280" />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Bar yAxisId="left" dataKey="campaigns" fill="#9333ea" name="Campagnes" />
            <Bar yAxisId="left" dataKey="revenue" fill="#6366f1" name="Revenus (€)" />
            <Line yAxisId="right" type="monotone" dataKey="conversion" stroke="#10b981" name="Conversion (%)" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Conversion Funnel and Device Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Conversion Funnel */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
            Entonnoir de conversion
          </h2>
          <div className="space-y-4">
            {conversionFunnelData.map((stage, index) => (
              <div key={index}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {stage.stage}
                  </span>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {stage.value.toLocaleString()} ({stage.percentage}%)
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-purple-600 to-indigo-600 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${stage.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Device Distribution */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
            Répartition par appareil
          </h2>
          <div className="space-y-6">
            {deviceData.map((device, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {device.device === 'Mobile' ? (
                    <Smartphone className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                  ) : device.device === 'Desktop' ? (
                    <Monitor className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                  ) : (
                    <Monitor className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                  )}
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {device.device}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {device.sessions}% des sessions
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">
                    {device.revenue}%
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    des revenus
                  </p>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Taux mobile</p>
                <p className="text-lg font-semibold text-gray-900 dark:text-white">68%</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Conversion mobile</p>
                <p className="text-lg font-semibold text-gray-900 dark:text-white">3.8%</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Performance Indicators */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
          Indicateurs de performance
        </h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {performanceIndicators.map((indicator, index) => (
            <div key={index} className="text-center">
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {indicator.value}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                {indicator.label}
              </p>
              <p className={`text-xs mt-2 font-medium ${
                indicator.change.startsWith('+') ? 'text-green-600' : 'text-red-600'
              }`}>
                {indicator.change}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Geographic Distribution */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Répartition géographique
          </h2>
          <Globe className="h-5 w-5 text-gray-400" />
        </div>
        
        <div className="space-y-4">
          {countryData.map((country, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {country.country}
                  </span>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {country.users.toLocaleString()} utilisateurs
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-purple-600 h-2 rounded-full"
                    style={{ width: `${(country.users / 6690) * 100}%` }}
                  />
                </div>
              </div>
              <div className="ml-4 text-right">
                <p className="text-sm font-semibold text-gray-900 dark:text-white">
                  €{country.revenue.toLocaleString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}