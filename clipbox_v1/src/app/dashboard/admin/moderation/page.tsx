'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import {
  Shield,
  Video,
  Users,
  CreditCard,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  Eye,
  Ban,
  UserCheck,
  FileText,
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  MessageSquare,
  Flag,
  ThumbsUp,
  ThumbsDown,
  MoreVertical,
  PlayCircle,
  DollarSign,
  Calendar,
  TrendingUp,
  AlertCircle,
  RefreshCw
} from 'lucide-react';

interface ModerationItem {
  id: string;
  type: 'campaign' | 'clipper' | 'video' | 'withdrawal';
  title: string;
  description: string;
  user: {
    name: string;
    email: string;
    verified: boolean;
    joinDate: Date;
  };
  status: 'pending' | 'approved' | 'rejected' | 'flagged';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  createdAt: Date;
  amount?: number;
  reason?: string;
  reports?: number;
  metadata?: {
    views?: number;
    likes?: number;
    platform?: string;
    duration?: number;
    kycStatus?: string;
  };
}

export default function AdminModerationPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const typeParam = searchParams.get('type');
  
  // Map URL parameter to activeTab value
  const getTabFromParam = (param: string | null): 'all' | 'campaigns' | 'clippers' | 'videos' | 'withdrawals' => {
    if (!param) return 'all';
    if (param === 'campaigns') return 'campaigns';
    if (param === 'clippers') return 'clippers';
    if (param === 'videos') return 'videos';
    if (param === 'withdrawals') return 'withdrawals';
    return 'all';
  };
  
  const [activeTab, setActiveTab] = useState<'all' | 'campaigns' | 'clippers' | 'videos' | 'withdrawals'>(
    getTabFromParam(typeParam)
  );
  const [items, setItems] = useState<ModerationItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [priorityFilter, setPriorityFilter] = useState<'all' | 'urgent' | 'high' | 'medium' | 'low'>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedItem, setSelectedItem] = useState<ModerationItem | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showActionModal, setShowActionModal] = useState(false);
  const [actionType, setActionType] = useState<'approve' | 'reject' | 'ban'>('approve');
  const [actionReason, setActionReason] = useState('');

  // Mock data
  const mockItems: ModerationItem[] = [
    {
      id: '1',
      type: 'campaign',
      title: 'Campagne Nike Summer 2024',
      description: 'Nouvelle campagne pour la collection été, budget €50,000',
      user: {
        name: 'Nike France',
        email: 'contact@nike.fr',
        verified: true,
        joinDate: new Date('2023-01-15')
      },
      status: 'pending',
      priority: 'high',
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
      amount: 50000,
      metadata: {
        platform: 'TikTok',
        duration: 30
      }
    },
    {
      id: '2',
      type: 'video',
      title: 'Clip TikTok - Produit cosmétique',
      description: 'Vidéo signalée pour contenu potentiellement trompeur',
      user: {
        name: '@beautyguru',
        email: 'beauty@example.com',
        verified: false,
        joinDate: new Date('2023-06-20')
      },
      status: 'flagged',
      priority: 'urgent',
      createdAt: new Date(Date.now() - 30 * 60 * 1000),
      reports: 5,
      reason: 'Allégations médicales non vérifiées',
      metadata: {
        views: 125000,
        likes: 8500,
        platform: 'TikTok',
        duration: 45
      }
    },
    {
      id: '3',
      type: 'clipper',
      title: 'Vérification KYC - @creator123',
      description: 'Documents KYC soumis pour vérification',
      user: {
        name: 'Jean Dupont',
        email: 'jean.dupont@email.com',
        verified: false,
        joinDate: new Date('2024-01-10')
      },
      status: 'pending',
      priority: 'medium',
      createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000),
      metadata: {
        kycStatus: 'documents_submitted'
      }
    },
    {
      id: '4',
      type: 'withdrawal',
      title: 'Demande de retrait €1,250',
      description: 'Retrait vers compte bancaire FR76...',
      user: {
        name: '@topclippper',
        email: 'top@clipper.com',
        verified: true,
        joinDate: new Date('2023-03-15')
      },
      status: 'pending',
      priority: 'high',
      createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000),
      amount: 1250,
      metadata: {
        kycStatus: 'verified'
      }
    },
    {
      id: '5',
      type: 'video',
      title: 'Contenu inapproprié signalé',
      description: 'Vidéo signalée pour langage inapproprié',
      user: {
        name: '@randomuser',
        email: 'random@user.com',
        verified: false,
        joinDate: new Date('2024-01-20')
      },
      status: 'flagged',
      priority: 'high',
      createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000),
      reports: 12,
      reason: 'Langage vulgaire et contenu offensant',
      metadata: {
        views: 45000,
        likes: 1200,
        platform: 'Instagram'
      }
    },
    {
      id: '6',
      type: 'campaign',
      title: 'Campagne Crypto douteuse',
      description: 'Campagne pour plateforme crypto non régulée',
      user: {
        name: 'CryptoInvest',
        email: 'invest@crypto.com',
        verified: false,
        joinDate: new Date('2024-01-25')
      },
      status: 'flagged',
      priority: 'urgent',
      createdAt: new Date(Date.now() - 45 * 60 * 1000),
      amount: 100000,
      reports: 3,
      reason: 'Promesses de gains irréalistes',
      metadata: {
        platform: 'Multiple'
      }
    }
  ];

  // Update activeTab when URL changes
  useEffect(() => {
    const newTab = getTabFromParam(searchParams.get('type'));
    setActiveTab(newTab);
  }, [searchParams]);

  useEffect(() => {
    // Filtrer les items selon l'onglet actif
    let filtered = mockItems;
    if (activeTab !== 'all') {
      const typeMap = {
        'campaigns': 'campaign',
        'clippers': 'clipper',
        'videos': 'video',
        'withdrawals': 'withdrawal'
      };
      filtered = mockItems.filter(item => item.type === typeMap[activeTab]);
    }

    // Filtrer par priorité
    if (priorityFilter !== 'all') {
      filtered = filtered.filter(item => item.priority === priorityFilter);
    }

    // Filtrer par recherche
    if (searchTerm) {
      filtered = filtered.filter(item =>
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.user.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setTimeout(() => {
      setItems(filtered);
      setIsLoading(false);
    }, 500);
  }, [activeTab, priorityFilter, searchTerm]);

  const tabs = [
    { id: 'all', label: 'Tout', icon: Shield, count: mockItems.length },
    { id: 'campaigns', label: 'Campagnes', icon: Video, count: mockItems.filter(i => i.type === 'campaign').length },
    { id: 'clippers', label: 'Clippers', icon: Users, count: mockItems.filter(i => i.type === 'clipper').length },
    { id: 'videos', label: 'Vidéos', icon: PlayCircle, count: mockItems.filter(i => i.type === 'video').length },
    { id: 'withdrawals', label: 'Retraits', icon: CreditCard, count: mockItems.filter(i => i.type === 'withdrawal').length }
  ];

  const stats = [
    {
      label: 'En attente',
      value: items.filter(i => i.status === 'pending').length,
      icon: Clock,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100 dark:bg-yellow-900/30'
    },
    {
      label: 'Signalés',
      value: items.filter(i => i.status === 'flagged').length,
      icon: Flag,
      color: 'text-red-600',
      bgColor: 'bg-red-100 dark:bg-red-900/30'
    },
    {
      label: 'Urgents',
      value: items.filter(i => i.priority === 'urgent').length,
      icon: AlertTriangle,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100 dark:bg-orange-900/30'
    },
    {
      label: 'Traités aujourd\'hui',
      value: 24,
      icon: CheckCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-100 dark:bg-green-900/30'
    }
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'text-red-600 bg-red-100 dark:bg-red-900/30';
      case 'high':
        return 'text-orange-600 bg-orange-100 dark:bg-orange-900/30';
      case 'medium':
        return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30';
      case 'low':
        return 'text-blue-600 bg-blue-100 dark:bg-blue-900/30';
      default:
        return 'text-gray-600 bg-gray-100 dark:bg-gray-900/30';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30';
      case 'approved':
        return 'text-green-600 bg-green-100 dark:bg-green-900/30';
      case 'rejected':
        return 'text-red-600 bg-red-100 dark:bg-red-900/30';
      case 'flagged':
        return 'text-orange-600 bg-orange-100 dark:bg-orange-900/30';
      default:
        return 'text-gray-600 bg-gray-100 dark:bg-gray-900/30';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'campaign':
        return <Video className="h-4 w-4" />;
      case 'clipper':
        return <Users className="h-4 w-4" />;
      case 'video':
        return <PlayCircle className="h-4 w-4" />;
      case 'withdrawal':
        return <CreditCard className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  const handleAction = (item: ModerationItem, action: 'approve' | 'reject' | 'ban') => {
    setSelectedItem(item);
    setActionType(action);
    setShowActionModal(true);
  };

  const confirmAction = () => {
    console.log(`Action ${actionType} on item:`, selectedItem, 'Reason:', actionReason);
    // Implémenter l'action
    setShowActionModal(false);
    setSelectedItem(null);
    setActionReason('');
  };

  const handleBulkAction = (action: string) => {
    console.log(`Bulk action: ${action} on items:`, selectedItems);
    setSelectedItems([]);
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
            Centre de modération
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Gérez et modérez le contenu et les utilisateurs de la plateforme
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <button
            onClick={() => window.location.reload()}
            className="p-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            <RefreshCw className="h-5 w-5 text-gray-600 dark:text-gray-400" />
          </button>
          <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
            Historique
          </button>
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

      {/* Tabs */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
        <div className="border-b border-gray-200 dark:border-gray-700">
          <div className="flex overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  // Update URL when clicking tabs
                  if (tab.id === 'all') {
                    router.push('/dashboard/admin/moderation');
                  } else if (tab.id === 'withdrawals') {
                    router.push('/dashboard/admin/moderation?type=withdrawals');
                  } else {
                    router.push(`/dashboard/admin/moderation?type=${tab.id}`);
                  }
                }}
                className={`flex items-center gap-2 px-6 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-purple-600 text-purple-600'
                    : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
              >
                <tab.icon className="h-4 w-4" />
                <span>{tab.label}</span>
                {tab.count > 0 && (
                  <span className={`px-2 py-0.5 text-xs rounded-full ${
                    activeTab === tab.id
                      ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-600'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                  }`}>
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Filters */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Rechercher..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900"
                />
              </div>
            </div>
            
            <div className="flex gap-2">
              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value as any)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900"
              >
                <option value="all">Toutes priorités</option>
                <option value="urgent">Urgent</option>
                <option value="high">Haute</option>
                <option value="medium">Moyenne</option>
                <option value="low">Basse</option>
              </select>
              
              <button className="p-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700">
                <Filter className="h-5 w-5 text-gray-600 dark:text-gray-400" />
              </button>
            </div>
          </div>

          {/* Bulk Actions */}
          {selectedItems.length > 0 && (
            <div className="mt-4 p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg flex items-center justify-between">
              <span className="text-sm text-purple-600 dark:text-purple-400">
                {selectedItems.length} élément(s) sélectionné(s)
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => handleBulkAction('approve')}
                  className="px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700"
                >
                  Approuver
                </button>
                <button
                  onClick={() => handleBulkAction('reject')}
                  className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700"
                >
                  Rejeter
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Items List */}
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {items.map((item) => (
            <div
              key={item.id}
              className="p-4 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors"
            >
              <div className="flex items-start gap-4">
                <input
                  type="checkbox"
                  checked={selectedItems.includes(item.id)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedItems([...selectedItems, item.id]);
                    } else {
                      setSelectedItems(selectedItems.filter(id => id !== item.id));
                    }
                  }}
                  className="mt-1 rounded border-gray-300 dark:border-gray-600"
                />
                
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        {getTypeIcon(item.type)}
                        <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                          {item.title}
                        </h3>
                        <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${getPriorityColor(item.priority)}`}>
                          {item.priority === 'urgent' ? 'Urgent' : 
                           item.priority === 'high' ? 'Haute' :
                           item.priority === 'medium' ? 'Moyenne' : 'Basse'}
                        </span>
                        <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${getStatusColor(item.status)}`}>
                          {item.status === 'pending' ? 'En attente' :
                           item.status === 'approved' ? 'Approuvé' :
                           item.status === 'rejected' ? 'Rejeté' : 'Signalé'}
                        </span>
                      </div>
                      
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                        {item.description}
                      </p>
                      
                      {item.reason && (
                        <div className="flex items-center gap-2 mb-2 p-2 bg-red-50 dark:bg-red-900/20 rounded">
                          <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
                          <p className="text-sm text-red-600 dark:text-red-400">
                            {item.reason}
                          </p>
                        </div>
                      )}
                      
                      <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                        <div className="flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          <span>{item.user.name}</span>
                          {item.user.verified && (
                            <CheckCircle className="h-3 w-3 text-blue-500" />
                          )}
                        </div>
                        
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          <span>{formatTimeAgo(item.createdAt)}</span>
                        </div>
                        
                        {item.amount && (
                          <div className="flex items-center gap-1">
                            <DollarSign className="h-3 w-3" />
                            <span>€{item.amount.toLocaleString()}</span>
                          </div>
                        )}
                        
                        {item.reports && (
                          <div className="flex items-center gap-1">
                            <Flag className="h-3 w-3 text-red-500" />
                            <span>{item.reports} signalements</span>
                          </div>
                        )}
                        
                        {item.metadata?.views && (
                          <div className="flex items-center gap-1">
                            <Eye className="h-3 w-3" />
                            <span>{item.metadata.views.toLocaleString()} vues</span>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          setSelectedItem(item);
                          setShowDetailModal(true);
                        }}
                        className="p-2 text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400"
                        title="Voir détails"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      
                      {item.status === 'pending' || item.status === 'flagged' ? (
                        <>
                          <button
                            onClick={() => handleAction(item, 'approve')}
                            className="p-2 text-green-600 hover:text-green-700"
                            title="Approuver"
                          >
                            <CheckCircle className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleAction(item, 'reject')}
                            className="p-2 text-red-600 hover:text-red-700"
                            title="Rejeter"
                          >
                            <XCircle className="h-4 w-4" />
                          </button>
                          {item.type === 'clipper' || item.type === 'video' ? (
                            <button
                              onClick={() => handleAction(item, 'ban')}
                              className="p-2 text-orange-600 hover:text-orange-700"
                              title="Bannir"
                            >
                              <Ban className="h-4 w-4" />
                            </button>
                          ) : null}
                        </>
                      ) : null}
                      
                      <div className="relative group">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            // Toggle dropdown menu
                            const dropdown = e.currentTarget.nextElementSibling;
                            if (dropdown) {
                              dropdown.classList.toggle('hidden');
                            }
                          }}
                          className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                        >
                          <MoreVertical className="h-4 w-4" />
                        </button>
                        <div className="hidden absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-10">
                          <button
                            onClick={() => {
                              console.log('Voir historique', item.id);
                              alert(`Voir l'historique de: ${item.title}`);
                            }}
                            className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                          >
                            Voir l'historique
                          </button>
                          <button
                            onClick={() => {
                              console.log('Assigner à', item.id);
                              alert(`Assigner ${item.title} à un modérateur`);
                            }}
                            className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                          >
                            Assigner à...
                          </button>
                          <button
                            onClick={() => {
                              console.log('Marquer comme traité', item.id);
                              alert(`Marquer ${item.title} comme traité`);
                            }}
                            className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                          >
                            Marquer comme traité
                          </button>
                          <hr className="my-1 border-gray-200 dark:border-gray-700" />
                          <button
                            onClick={() => {
                              console.log('Exporter', item.id);
                              const data = JSON.stringify(item, null, 2);
                              const blob = new Blob([data], { type: 'application/json' });
                              const url = URL.createObjectURL(blob);
                              const a = document.createElement('a');
                              a.href = url;
                              a.download = `moderation-${item.id}.json`;
                              a.click();
                              URL.revokeObjectURL(url);
                            }}
                            className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                          >
                            Exporter les détails
                          </button>
                        </div>
                      </div>
                    </div>
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
              Affichage de 1 à {items.length} sur {items.length} éléments
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

      {/* Action Modal */}
      {showActionModal && selectedItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Confirmer l'action
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Êtes-vous sûr de vouloir {
                actionType === 'approve' ? 'approuver' :
                actionType === 'reject' ? 'rejeter' :
                'bannir'
              } "{selectedItem.title}" ?
            </p>
            
            {(actionType === 'reject' || actionType === 'ban') && (
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Raison {actionType === 'ban' ? 'du bannissement' : 'du rejet'}
                </label>
                <textarea
                  value={actionReason}
                  onChange={(e) => setActionReason(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900"
                  rows={3}
                  placeholder="Expliquez la raison..."
                  required
                />
              </div>
            )}
            
            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowActionModal(false);
                  setActionReason('');
                }}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                Annuler
              </button>
              <button
                onClick={confirmAction}
                className={`px-4 py-2 rounded-lg text-white ${
                  actionType === 'approve' ? 'bg-green-600 hover:bg-green-700' :
                  actionType === 'reject' ? 'bg-red-600 hover:bg-red-700' :
                  'bg-orange-600 hover:bg-orange-700'
                }`}
              >
                Confirmer
              </button>
            </div>
          </div>
        </div>
      )}

      {showDetailModal && selectedItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Détails de la modération
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  {selectedItem.type === 'campaign' ? 'Campagne' :
                   selectedItem.type === 'clipper' ? 'Clipper' :
                   selectedItem.type === 'video' ? 'Vidéo' :
                   'Retrait'} - ID: {selectedItem.id}
                </p>
              </div>
              <button
                onClick={() => setShowDetailModal(false)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
              >
                <XCircle className="h-5 w-5 text-gray-500 dark:text-gray-400" />
              </button>
            </div>

            <div className="space-y-6">
              {/* Status and Priority */}
              <div className="flex items-center gap-4">
                <div className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedItem.status)}`}>
                  {selectedItem.status === 'pending' ? <Clock className="h-4 w-4" /> :
                   selectedItem.status === 'approved' ? <CheckCircle className="h-4 w-4" /> :
                   selectedItem.status === 'rejected' ? <XCircle className="h-4 w-4" /> :
                   <Flag className="h-4 w-4" />}
                  <span>
                    {selectedItem.status === 'pending' ? 'En attente' :
                     selectedItem.status === 'approved' ? 'Approuvé' :
                     selectedItem.status === 'rejected' ? 'Rejeté' : 'Signalé'}
                  </span>
                </div>
                <div className={`px-3 py-1 text-sm font-medium rounded-full ${getPriorityColor(selectedItem.priority)}`}>
                  Priorité {selectedItem.priority === 'urgent' ? 'urgente' :
                          selectedItem.priority === 'high' ? 'haute' :
                          selectedItem.priority === 'medium' ? 'moyenne' : 'basse'}
                </div>
              </div>

              {/* Main Info */}
              <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                  {selectedItem.title}
                </h4>
                <p className="text-gray-600 dark:text-gray-400">
                  {selectedItem.description}
                </p>
                {selectedItem.reason && (
                  <div className="mt-3 p-3 bg-red-50 dark:bg-red-900/20 rounded border border-red-200 dark:border-red-800">
                    <div className="flex items-start gap-2">
                      <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-red-800 dark:text-red-200">
                          Raison du signalement
                        </p>
                        <p className="text-sm text-red-700 dark:text-red-300 mt-1">
                          {selectedItem.reason}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* User Info */}
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-3">
                  Informations utilisateur
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Nom</p>
                    <div className="flex items-center gap-2 mt-1">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {selectedItem.user.name}
                      </p>
                      {selectedItem.user.verified && (
                        <CheckCircle className="h-4 w-4 text-blue-500" />
                      )}
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Email</p>
                    <p className="text-sm font-medium text-gray-900 dark:text-white mt-1">
                      {selectedItem.user.email}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Membre depuis</p>
                    <p className="text-sm font-medium text-gray-900 dark:text-white mt-1">
                      {selectedItem.user.joinDate.toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Créé le</p>
                    <p className="text-sm font-medium text-gray-900 dark:text-white mt-1">
                      {selectedItem.createdAt.toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>

              {/* Metadata */}
              {selectedItem.metadata && (
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-3">
                    Détails supplémentaires
                  </h4>
                  <div className="grid grid-cols-2 gap-4">
                    {selectedItem.metadata.views !== undefined && (
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Vues</p>
                        <p className="text-sm font-medium text-gray-900 dark:text-white mt-1">
                          {selectedItem.metadata.views.toLocaleString()}
                        </p>
                      </div>
                    )}
                    {selectedItem.metadata.likes !== undefined && (
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Likes</p>
                        <p className="text-sm font-medium text-gray-900 dark:text-white mt-1">
                          {selectedItem.metadata.likes.toLocaleString()}
                        </p>
                      </div>
                    )}
                    {selectedItem.metadata.platform && (
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Plateforme</p>
                        <p className="text-sm font-medium text-gray-900 dark:text-white mt-1">
                          {selectedItem.metadata.platform}
                        </p>
                      </div>
                    )}
                    {selectedItem.metadata.duration && (
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Durée</p>
                        <p className="text-sm font-medium text-gray-900 dark:text-white mt-1">
                          {selectedItem.metadata.duration} secondes
                        </p>
                      </div>
                    )}
                    {selectedItem.metadata.kycStatus && (
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Statut KYC</p>
                        <p className="text-sm font-medium text-gray-900 dark:text-white mt-1">
                          {selectedItem.metadata.kycStatus === 'documents_submitted' ? 'Documents soumis' :
                           selectedItem.metadata.kycStatus === 'verified' ? 'Vérifié' :
                           selectedItem.metadata.kycStatus}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Stats */}
              {(selectedItem.amount || selectedItem.reports) && (
                <div className="flex items-center gap-6 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
                  {selectedItem.amount && (
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Montant</p>
                        <p className="text-lg font-semibold text-gray-900 dark:text-white">
                          €{selectedItem.amount.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  )}
                  {selectedItem.reports && (
                    <div className="flex items-center gap-2">
                      <Flag className="h-5 w-5 text-red-500" />
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Signalements</p>
                        <p className="text-lg font-semibold text-gray-900 dark:text-white">
                          {selectedItem.reports}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Actions */}
              <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  Fermer
                </button>
                {(selectedItem.status === 'pending' || selectedItem.status === 'flagged') && (
                  <>
                    <button
                      onClick={() => {
                        setShowDetailModal(false);
                        handleAction(selectedItem, 'approve');
                      }}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                    >
                      Approuver
                    </button>
                    <button
                      onClick={() => {
                        setShowDetailModal(false);
                        handleAction(selectedItem, 'reject');
                      }}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                    >
                      Rejeter
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}