'use client';

import { useState, useEffect } from 'react';
import {
  FileText,
  Search,
  Filter,
  Download,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Info,
  Clock,
  User,
  Users,
  Shield,
  DollarSign,
  Video,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Activity,
  Terminal,
  Database,
  Server,
  AlertCircle,
  Bug,
  Zap,
  Globe
} from 'lucide-react';

interface LogEntry {
  id: string;
  timestamp: Date;
  level: 'info' | 'warning' | 'error' | 'critical' | 'debug';
  category: 'auth' | 'payment' | 'campaign' | 'user' | 'system' | 'api' | 'security';
  action: string;
  user?: {
    id: string;
    name: string;
    role: string;
  };
  details: string;
  metadata?: {
    ip?: string;
    userAgent?: string;
    endpoint?: string;
    duration?: number;
    errorCode?: string;
    stackTrace?: string;
  };
  affectedResource?: {
    type: string;
    id: string;
    name: string;
  };
}

export default function AdminLogsPage() {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [levelFilter, setLevelFilter] = useState<'all' | 'info' | 'warning' | 'error' | 'critical'>('all');
  const [categoryFilter, setCategoryFilter] = useState<'all' | 'auth' | 'payment' | 'campaign' | 'user' | 'system' | 'api' | 'security'>('all');
  const [timeRange, setTimeRange] = useState('24h');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedLog, setSelectedLog] = useState<LogEntry | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(false);

  // Mock data
  const mockLogs: LogEntry[] = [
    {
      id: '1',
      timestamp: new Date(Date.now() - 5 * 60 * 1000),
      level: 'critical',
      category: 'payment',
      action: 'Échec de transaction Stripe',
      user: {
        id: 'usr_123',
        name: 'Nike France',
        role: 'advertiser'
      },
      details: 'Échec du paiement pour la campagne #234. Code erreur: insufficient_funds',
      metadata: {
        ip: '192.168.1.1',
        endpoint: '/api/payments/process',
        errorCode: 'STRIPE_INSUFFICIENT_FUNDS'
      },
      affectedResource: {
        type: 'campaign',
        id: 'camp_234',
        name: 'Nike Summer 2024'
      }
    },
    {
      id: '2',
      timestamp: new Date(Date.now() - 15 * 60 * 1000),
      level: 'warning',
      category: 'security',
      action: 'Tentatives de connexion multiples échouées',
      details: '5 tentatives de connexion échouées depuis la même IP',
      metadata: {
        ip: '45.67.89.123',
        userAgent: 'Mozilla/5.0...'
      }
    },
    {
      id: '3',
      timestamp: new Date(Date.now() - 30 * 60 * 1000),
      level: 'info',
      category: 'campaign',
      action: 'Campagne validée',
      user: {
        id: 'admin_1',
        name: 'Admin Sophie',
        role: 'admin'
      },
      details: 'Validation manuelle de la campagne après vérification',
      affectedResource: {
        type: 'campaign',
        id: 'camp_456',
        name: 'Adidas Spring Collection'
      }
    },
    {
      id: '4',
      timestamp: new Date(Date.now() - 45 * 60 * 1000),
      level: 'error',
      category: 'system',
      action: 'Utilisation CPU élevée',
      details: 'Utilisation CPU dépassant 85% pendant plus de 5 minutes',
      metadata: {
        duration: 312000,
        endpoint: 'server-01'
      }
    },
    {
      id: '5',
      timestamp: new Date(Date.now() - 60 * 60 * 1000),
      level: 'info',
      category: 'auth',
      action: 'Nouvelle inscription',
      user: {
        id: 'usr_789',
        name: '@newclipper',
        role: 'clipper'
      },
      details: 'Nouvel utilisateur inscrit via Google OAuth',
      metadata: {
        ip: '78.90.12.34',
        userAgent: 'Chrome/120.0'
      }
    },
    {
      id: '6',
      timestamp: new Date(Date.now() - 90 * 60 * 1000),
      level: 'warning',
      category: 'api',
      action: 'Limite de taux dépassée',
      details: 'Limite API dépassée pour l\'endpoint /api/campaigns',
      metadata: {
        ip: '123.45.67.89',
        endpoint: '/api/campaigns',
        errorCode: 'RATE_LIMIT_EXCEEDED'
      }
    },
    {
      id: '7',
      timestamp: new Date(Date.now() - 120 * 60 * 1000),
      level: 'error',
      category: 'payment',
      action: 'Échec de retrait',
      user: {
        id: 'usr_456',
        name: '@topclipper',
        role: 'clipper'
      },
      details: 'IBAN invalide fourni pour le retrait',
      metadata: {
        errorCode: 'INVALID_IBAN'
      },
      affectedResource: {
        type: 'withdrawal',
        id: 'wd_789',
        name: 'Retrait €1,250'
      }
    },
    {
      id: '8',
      timestamp: new Date(Date.now() - 180 * 60 * 1000),
      level: 'debug',
      category: 'system',
      action: 'Cache vidé',
      details: 'Cache Redis vidé automatiquement',
      metadata: {
        duration: 1250
      }
    }
  ];

  useEffect(() => {
    // Filtrer les logs
    let filtered = mockLogs;
    
    if (levelFilter !== 'all') {
      filtered = filtered.filter(log => log.level === levelFilter);
    }
    
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(log => log.category === categoryFilter);
    }
    
    if (searchTerm) {
      filtered = filtered.filter(log =>
        log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.details.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.user?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.affectedResource?.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setTimeout(() => {
      setLogs(filtered);
      setIsLoading(false);
    }, 500);
  }, [levelFilter, categoryFilter, searchTerm, timeRange]);

  // Auto-refresh
  useEffect(() => {
    if (autoRefresh) {
      const interval = setInterval(() => {
        // Refresh logs
        console.log('Refreshing logs...');
      }, 5000);
      
      return () => clearInterval(interval);
    }
  }, [autoRefresh]);

  const stats = [
    {
      label: 'Total logs',
      value: logs.length,
      icon: FileText,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100 dark:bg-purple-900/30'
    },
    {
      label: 'Erreurs',
      value: logs.filter(l => l.level === 'error' || l.level === 'critical').length,
      icon: AlertTriangle,
      color: 'text-red-600',
      bgColor: 'bg-red-100 dark:bg-red-900/30'
    },
    {
      label: 'Avertissements',
      value: logs.filter(l => l.level === 'warning').length,
      icon: AlertCircle,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100 dark:bg-yellow-900/30'
    },
    {
      label: 'Actions admin',
      value: logs.filter(l => l.user?.role === 'admin').length,
      icon: Shield,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100 dark:bg-blue-900/30'
    }
  ];

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'info':
        return 'text-blue-600 bg-blue-100 dark:bg-blue-900/30';
      case 'warning':
        return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30';
      case 'error':
        return 'text-orange-600 bg-orange-100 dark:bg-orange-900/30';
      case 'critical':
        return 'text-red-600 bg-red-100 dark:bg-red-900/30';
      case 'debug':
        return 'text-gray-600 bg-gray-100 dark:bg-gray-900/30';
      default:
        return 'text-gray-600 bg-gray-100 dark:bg-gray-900/30';
    }
  };

  const getLevelIcon = (level: string) => {
    switch (level) {
      case 'info':
        return <Info className="h-4 w-4" />;
      case 'warning':
        return <AlertCircle className="h-4 w-4" />;
      case 'error':
        return <XCircle className="h-4 w-4" />;
      case 'critical':
        return <AlertTriangle className="h-4 w-4" />;
      case 'debug':
        return <Bug className="h-4 w-4" />;
      default:
        return <Activity className="h-4 w-4" />;
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'auth':
        return <User className="h-4 w-4" />;
      case 'payment':
        return <DollarSign className="h-4 w-4" />;
      case 'campaign':
        return <Video className="h-4 w-4" />;
      case 'user':
        return <Users className="h-4 w-4" />;
      case 'system':
        return <Server className="h-4 w-4" />;
      case 'api':
        return <Terminal className="h-4 w-4" />;
      case 'security':
        return <Shield className="h-4 w-4" />;
      default:
        return <Database className="h-4 w-4" />;
    }
  };

  const formatTimestamp = (date: Date) => {
    return new Intl.DateTimeFormat('fr-FR', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    }).format(date);
  };

  const handleExport = (format: 'csv' | 'json') => {
    console.log(`Exporting logs in ${format} format`);
    // Implémenter l'export
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
            Logs système
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Historique complet des actions et événements système
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <button
            onClick={() => setAutoRefresh(!autoRefresh)}
            className={`p-2 border rounded-lg ${
              autoRefresh
                ? 'border-green-600 bg-green-50 dark:bg-green-900/30 text-green-600'
                : 'border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
            }`}
            title={autoRefresh ? 'Arrêter auto-refresh' : 'Activer auto-refresh'}
          >
            <RefreshCw className={`h-5 w-5 ${autoRefresh ? 'animate-spin' : ''}`} />
          </button>
          
          <div className="relative">
            <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center gap-2">
              <Download className="h-4 w-4" />
              Exporter
            </button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {stat.label}
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                  {stat.value}
                </p>
              </div>
              <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                <stat.icon className={`h-6 w-6 ${stat.color}`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Critical Alerts */}
      {logs.filter(l => l.level === 'critical').length > 0 && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400" />
            <div>
              <p className="text-sm font-medium text-red-800 dark:text-red-200">
                {logs.filter(l => l.level === 'critical').length} alerte(s) critique(s) détectée(s)
              </p>
              <p className="text-xs text-red-600 dark:text-red-400 mt-1">
                Action immédiate requise
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Rechercher dans les logs..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900"
              />
            </div>
          </div>
          
          <div className="flex gap-2">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900"
            >
              <option value="1h">Dernière heure</option>
              <option value="24h">24 heures</option>
              <option value="7d">7 jours</option>
              <option value="30d">30 jours</option>
              <option value="all">Tout</option>
            </select>
            
            <select
              value={levelFilter}
              onChange={(e) => setLevelFilter(e.target.value as any)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900"
            >
              <option value="all">Tous les niveaux</option>
              <option value="info">Info</option>
              <option value="warning">Warning</option>
              <option value="error">Error</option>
              <option value="critical">Critical</option>
            </select>
            
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value as any)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900"
            >
              <option value="all">Toutes catégories</option>
              <option value="auth">Auth</option>
              <option value="payment">Payment</option>
              <option value="campaign">Campaign</option>
              <option value="user">User</option>
              <option value="system">System</option>
              <option value="api">API</option>
              <option value="security">Security</option>
            </select>
            
            <button className="p-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700">
              <Filter className="h-5 w-5 text-gray-600 dark:text-gray-400" />
            </button>
          </div>
        </div>
      </div>

      {/* Logs List */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {logs.map((log) => (
            <div
              key={log.id}
              className="p-4 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors cursor-pointer"
              onClick={() => {
                setSelectedLog(log);
                setShowDetailModal(true);
              }}
            >
              <div className="flex items-start gap-4">
                <div className="flex items-center gap-2 mt-1">
                  <div className={`p-1 rounded ${getLevelColor(log.level).split(' ')[1]}`}>
                    {getLevelIcon(log.level)}
                  </div>
                  <div className="text-gray-400">
                    {getCategoryIcon(log.category)}
                  </div>
                </div>
                
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                          {log.action}
                        </h3>
                        <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${getLevelColor(log.level)}`}>
                          {log.level}
                        </span>
                        <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400">
                          {log.category}
                        </span>
                      </div>
                      
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                        {log.details}
                      </p>
                      
                      <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          <span>{formatTimestamp(log.timestamp)}</span>
                        </div>
                        
                        {log.user && (
                          <div className="flex items-center gap-1">
                            <User className="h-3 w-3" />
                            <span>{log.user.name} ({log.user.role})</span>
                          </div>
                        )}
                        
                        {log.metadata?.ip && (
                          <div className="flex items-center gap-1">
                            <Globe className="h-3 w-3" />
                            <span>{log.metadata.ip}</span>
                          </div>
                        )}
                        
                        {log.affectedResource && (
                          <div className="flex items-center gap-1">
                            <Zap className="h-3 w-3" />
                            <span>{log.affectedResource.type}: {log.affectedResource.name}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {log.metadata?.errorCode && (
                      <span className="px-2 py-1 text-xs font-mono bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded">
                        {log.metadata.errorCode}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Affichage de 1 à {logs.length} sur {logs.length} entrées
            </p>
            <div className="flex items-center gap-2">
              <button
                disabled={currentPage === 1}
                className="p-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <span className="px-3 py-1 border border-purple-600 bg-purple-50 dark:bg-purple-900/30 text-purple-600 rounded-lg">
                1
              </span>
              <button
                disabled
                className="p-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Detail Modal */}
      {showDetailModal && selectedLog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Détails du log
            </h3>
            
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Action</p>
                <p className="text-gray-900 dark:text-white">{selectedLog.action}</p>
              </div>
              
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Détails</p>
                <p className="text-gray-900 dark:text-white">{selectedLog.details}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Niveau</p>
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getLevelColor(selectedLog.level)}`}>
                    {selectedLog.level}
                  </span>
                </div>
                
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Catégorie</p>
                  <p className="text-gray-900 dark:text-white">{selectedLog.category}</p>
                </div>
              </div>
              
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Timestamp</p>
                <p className="text-gray-900 dark:text-white">{selectedLog.timestamp.toISOString()}</p>
              </div>
              
              {selectedLog.user && (
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Utilisateur</p>
                  <p className="text-gray-900 dark:text-white">
                    {selectedLog.user.name} (ID: {selectedLog.user.id}, Rôle: {selectedLog.user.role})
                  </p>
                </div>
              )}
              
              {selectedLog.metadata && (
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Métadonnées</p>
                  <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-3">
                    <pre className="text-xs text-gray-700 dark:text-gray-300 overflow-x-auto">
                      {JSON.stringify(selectedLog.metadata, null, 2)}
                    </pre>
                  </div>
                </div>
              )}
              
              {selectedLog.affectedResource && (
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Ressource affectée</p>
                  <p className="text-gray-900 dark:text-white">
                    {selectedLog.affectedResource.type}: {selectedLog.affectedResource.name} (ID: {selectedLog.affectedResource.id})
                  </p>
                </div>
              )}
            </div>
            
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => handleExport('json')}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                Exporter JSON
              </button>
              <button
                onClick={() => setShowDetailModal(false)}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}