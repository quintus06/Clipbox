'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  TrendingUp,
  TrendingDown,
  Users,
  DollarSign,
  Video,
  Shield,
  AlertTriangle,
  CheckCircle,
  Clock,
  Activity,
  CreditCard,
  UserPlus,
  Eye,
  BarChart3,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
  Filter,
  Download,
  RefreshCw
} from 'lucide-react';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface StatCard {
  title: string;
  value: string | number;
  change: number;
  changeLabel: string;
  icon: React.ElementType;
  color: string;
  bgColor: string;
}

interface PendingAction {
  id: string;
  type: 'campaign' | 'withdrawal' | 'moderation' | 'kyc';
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  createdAt: Date;
  amount?: number;
}

interface SystemAlert {
  id: string;
  type: 'error' | 'warning' | 'info';
  message: string;
  timestamp: Date;
}

interface RecentActivity {
  id: string;
  user: string;
  action: string;
  target: string;
  timestamp: Date;
  status: 'success' | 'failed' | 'pending';
}

export default function AdminDashboardPage() {
  const router = useRouter();
  const [timeRange, setTimeRange] = useState('7d');
  const [isLoading, setIsLoading] = useState(true);
  const [lastRefresh, setLastRefresh] = useState(new Date());

  // Mock data - à remplacer par des appels API
  const stats: StatCard[] = [
    {
      title: 'Revenus totaux',
      value: '€124,560',
      change: 12.5,
      changeLabel: 'vs mois dernier',
      icon: DollarSign,
      color: 'text-green-600',
      bgColor: 'bg-green-100 dark:bg-green-900/30'
    },
    {
      title: 'Utilisateurs actifs',
      value: '8,234',
      change: 8.2,
      changeLabel: 'vs semaine dernière',
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100 dark:bg-blue-900/30'
    },
    {
      title: 'Campagnes actives',
      value: '156',
      change: -3.4,
      changeLabel: 'vs mois dernier',
      icon: Video,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100 dark:bg-purple-900/30'
    },
    {
      title: 'Taux de conversion',
      value: '3.8%',
      change: 15.3,
      changeLabel: 'vs moyenne',
      icon: TrendingUp,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-100 dark:bg-indigo-900/30'
    }
  ];

  const pendingActions: PendingAction[] = [
    {
      id: '1',
      type: 'campaign',
      title: 'Nouvelle campagne Nike',
      description: 'Budget: €50,000 - En attente de validation',
      priority: 'high',
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
      amount: 50000
    },
    {
      id: '2',
      type: 'withdrawal',
      title: 'Retrait de @johndoe',
      description: 'Montant: €1,250 - Vérification KYC requise',
      priority: 'high',
      createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000),
      amount: 1250
    },
    {
      id: '3',
      type: 'moderation',
      title: 'Vidéo signalée',
      description: 'Contenu potentiellement inapproprié',
      priority: 'medium',
      createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000)
    },
    {
      id: '4',
      type: 'kyc',
      title: 'Vérification KYC',
      description: '3 nouveaux documents à vérifier',
      priority: 'low',
      createdAt: new Date(Date.now() - 8 * 60 * 60 * 1000)
    }
  ];

  const systemAlerts: SystemAlert[] = [
    {
      id: '1',
      type: 'warning',
      message: 'Utilisation CPU élevée (85%) sur le serveur principal',
      timestamp: new Date(Date.now() - 30 * 60 * 1000)
    },
    {
      id: '2',
      type: 'info',
      message: 'Maintenance planifiée ce soir à 23h00',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000)
    },
    {
      id: '3',
      type: 'error',
      message: '3 échecs de paiement Stripe dans la dernière heure',
      timestamp: new Date(Date.now() - 45 * 60 * 1000)
    }
  ];

  const recentActivity: RecentActivity[] = [
    {
      id: '1',
      user: 'Admin Sophie',
      action: 'a validé',
      target: 'Campagne Adidas #234',
      timestamp: new Date(Date.now() - 5 * 60 * 1000),
      status: 'success'
    },
    {
      id: '2',
      user: 'Système',
      action: 'a suspendu',
      target: 'Utilisateur @spammer123',
      timestamp: new Date(Date.now() - 15 * 60 * 1000),
      status: 'success'
    },
    {
      id: '3',
      user: 'Admin Pierre',
      action: 'a approuvé le retrait de',
      target: '@creator456 (€850)',
      timestamp: new Date(Date.now() - 25 * 60 * 1000),
      status: 'success'
    },
    {
      id: '4',
      user: 'Système',
      action: 'a détecté une anomalie sur',
      target: 'Transaction #789',
      timestamp: new Date(Date.now() - 35 * 60 * 1000),
      status: 'failed'
    }
  ];

  // Données pour les graphiques
  const revenueChartData = {
    labels: ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'],
    datasets: [
      {
        label: 'Revenus',
        data: [12500, 15600, 14200, 18900, 22300, 19800, 24500],
        borderColor: 'rgb(147, 51, 234)',
        backgroundColor: 'rgba(147, 51, 234, 0.1)',
        tension: 0.4,
        fill: true
      },
      {
        label: 'Objectif',
        data: [15000, 15000, 15000, 15000, 15000, 20000, 20000],
        borderColor: 'rgb(156, 163, 175)',
        borderDash: [5, 5],
        backgroundColor: 'transparent',
        tension: 0
      }
    ]
  };

  const userGrowthData = {
    labels: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin'],
    datasets: [
      {
        label: 'Clippers',
        data: [1200, 1900, 2500, 3200, 4100, 5234],
        backgroundColor: 'rgba(147, 51, 234, 0.8)'
      },
      {
        label: 'Annonceurs',
        data: [300, 450, 620, 890, 1150, 1456],
        backgroundColor: 'rgba(99, 102, 241, 0.8)'
      }
    ]
  };

  const platformDistributionData = {
    labels: ['TikTok', 'Instagram', 'YouTube', 'Twitter', 'Autres'],
    datasets: [
      {
        data: [45, 25, 15, 10, 5],
        backgroundColor: [
          'rgba(147, 51, 234, 0.8)',
          'rgba(99, 102, 241, 0.8)',
          'rgba(236, 72, 153, 0.8)',
          'rgba(59, 130, 246, 0.8)',
          'rgba(156, 163, 175, 0.8)'
        ]
      }
    ]
  };

  useEffect(() => {
    // Simuler le chargement des données
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);

  const handleRefresh = () => {
    setIsLoading(true);
    setLastRefresh(new Date());
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'text-red-600 bg-red-100 dark:bg-red-900/30';
      case 'medium':
        return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30';
      case 'low':
        return 'text-blue-600 bg-blue-100 dark:bg-blue-900/30';
      default:
        return 'text-gray-600 bg-gray-100 dark:bg-gray-900/30';
    }
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'error':
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case 'warning':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'info':
        return <Activity className="h-4 w-4 text-blue-500" />;
      default:
        return <Activity className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'failed':
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      default:
        return <Activity className="h-4 w-4 text-gray-500" />;
    }
  };

  const formatTimeAgo = (date: Date) => {
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
    if (seconds < 60) return 'Il y a quelques secondes';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `Il y a ${minutes} minute${minutes > 1 ? 's' : ''}`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `Il y a ${hours} heure${hours > 1 ? 's' : ''}`;
    const days = Math.floor(hours / 24);
    return `Il y a ${days} jour${days > 1 ? 's' : ''}`;
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
            Tableau de bord administrateur
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Dernière mise à jour : {formatTimeAgo(lastRefresh)}
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-sm text-gray-900 dark:text-white"
          >
            <option value="24h">24 heures</option>
            <option value="7d">7 jours</option>
            <option value="30d">30 jours</option>
            <option value="90d">90 jours</option>
          </select>
          
          <button className="p-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700">
            <Filter className="h-5 w-5 text-gray-600 dark:text-gray-400" />
          </button>
          
          <button className="p-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700">
            <Download className="h-5 w-5 text-gray-600 dark:text-gray-400" />
          </button>
          
          <button
            onClick={handleRefresh}
            className="p-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
          >
            <RefreshCw className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                <stat.icon className={`h-6 w-6 ${stat.color}`} />
              </div>
              <div className={`flex items-center text-sm font-medium ${
                stat.change > 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {stat.change > 0 ? (
                  <ArrowUpRight className="h-4 w-4 mr-1" />
                ) : (
                  <ArrowDownRight className="h-4 w-4 mr-1" />
                )}
                {Math.abs(stat.change)}%
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
              {stat.value}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {stat.title}
            </p>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">
              {stat.changeLabel}
            </p>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Chart */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Évolution des revenus
            </h2>
            <button className="text-sm text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300">
              Voir détails →
            </button>
          </div>
          <div style={{ height: '300px' }}>
            <Line
              data={revenueChartData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    display: true,
                    position: 'bottom' as const,
                    labels: {
                      color: 'rgb(156, 163, 175)'
                    }
                  },
                  tooltip: {
                    mode: 'index' as const,
                    intersect: false
                  }
                },
                scales: {
                  y: {
                    beginAtZero: true,
                    grid: {
                      color: 'rgba(156, 163, 175, 0.1)'
                    },
                    ticks: {
                      color: 'rgb(156, 163, 175)',
                      callback: function(value: any) {
                        return '€' + value.toLocaleString();
                      }
                    }
                  },
                  x: {
                    grid: {
                      color: 'rgba(156, 163, 175, 0.1)'
                    },
                    ticks: {
                      color: 'rgb(156, 163, 175)'
                    }
                  }
                }
              }}
            />
          </div>
        </div>

        {/* Platform Distribution */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
            Répartition par plateforme
          </h2>
          <div style={{ height: '300px' }}>
            <Doughnut
              data={platformDistributionData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    display: true,
                    position: 'bottom' as const,
                    labels: {
                      color: 'rgb(156, 163, 175)'
                    }
                  },
                  tooltip: {
                    enabled: true
                  }
                },
                cutout: '60%'
              }}
            />
          </div>
        </div>
      </div>

      {/* Actions and Alerts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pending Actions */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Actions en attente
            </h2>
            <span className="px-3 py-1 text-xs font-semibold text-orange-600 bg-orange-100 dark:bg-orange-900/30 rounded-full">
              {pendingActions.length} en attente
            </span>
          </div>
          
          <div className="space-y-4">
            {pendingActions.map((action) => (
              <div
                key={action.id}
                className="flex items-start justify-between p-4 bg-gray-50 dark:bg-gray-900 rounded-lg"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                      {action.title}
                    </h3>
                    <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${getPriorityColor(action.priority)}`}>
                      {action.priority === 'high' ? 'Urgent' : action.priority === 'medium' ? 'Moyen' : 'Faible'}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {action.description}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
                    {formatTimeAgo(action.createdAt)}
                  </p>
                </div>
                <button
                  onClick={() => {
                    // Redirection based on action type using Next.js router
                    if (action.type === 'campaign') {
                      router.push('/dashboard/admin/campaigns?status=pending');
                    } else if (action.type === 'withdrawal') {
                      router.push('/dashboard/admin/payments');
                    } else if (action.type === 'moderation') {
                      router.push('/dashboard/admin/moderation?type=videos');
                    } else if (action.type === 'kyc') {
                      router.push('/dashboard/admin/moderation?type=clippers');
                    }
                  }}
                  className="ml-4 px-3 py-1 text-sm font-medium text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 bg-purple-100 dark:bg-purple-900/30 rounded-lg transition-colors"
                >
                  Traiter
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* System Alerts */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Alertes système
            </h2>
            <button
              onClick={() => router.push('/dashboard/admin/logs')}
              className="text-sm text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 transition-colors"
            >
              Tout voir →
            </button>
          </div>
          
          <div className="space-y-3">
            {systemAlerts.map((alert) => (
              <div
                key={alert.id}
                className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-900 rounded-lg"
              >
                {getAlertIcon(alert.type)}
                <div className="flex-1">
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    {alert.message}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                    {formatTimeAgo(alert.timestamp)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* User Growth and Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User Growth Chart */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Croissance des utilisateurs
            </h2>
            <button className="text-sm text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300">
              Voir détails →
            </button>
          </div>
          <div style={{ height: '250px' }}>
            <Bar
              data={userGrowthData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    display: true,
                    position: 'bottom' as const,
                    labels: {
                      color: 'rgb(156, 163, 175)'
                    }
                  },
                  tooltip: {
                    mode: 'index' as const,
                    intersect: false
                  }
                },
                scales: {
                  y: {
                    beginAtZero: true,
                    stacked: false,
                    grid: {
                      color: 'rgba(156, 163, 175, 0.1)'
                    },
                    ticks: {
                      color: 'rgb(156, 163, 175)'
                    }
                  },
                  x: {
                    grid: {
                      color: 'rgba(156, 163, 175, 0.1)'
                    },
                    ticks: {
                      color: 'rgb(156, 163, 175)'
                    }
                  }
                }
              }}
            />
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Activité récente
            </h2>
            <button className="text-sm text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300">
              Voir logs →
            </button>
          </div>
          
          <div className="space-y-3">
            {recentActivity.map((activity) => (
              <div
                key={activity.id}
                className="flex items-start gap-3"
              >
                {getStatusIcon(activity.status)}
                <div className="flex-1">
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    <span className="font-medium">{activity.user}</span>{' '}
                    {activity.action}{' '}
                    <span className="font-medium">{activity.target}</span>
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                    {formatTimeAgo(activity.timestamp)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}