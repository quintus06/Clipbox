'use client';

import { useState, useEffect } from 'react';
import {
  CreditCard,
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Search,
  Filter,
  Download,
  Eye,
  MoreVertical,
  TrendingUp,
  Users,
  Calendar,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  Wallet,
  Send,
  AlertCircle,
  FileText,
  Ban
} from 'lucide-react';

interface Transaction {
  id: string;
  type: 'deposit' | 'withdrawal' | 'commission' | 'refund';
  status: 'pending' | 'completed' | 'failed' | 'cancelled';
  amount: number;
  currency: string;
  user: {
    name: string;
    email: string;
    type: 'clipper' | 'advertiser';
    verified: boolean;
  };
  method: string;
  reference: string;
  createdAt: Date;
  processedAt?: Date;
  description: string;
  fees?: number;
  kycStatus?: 'verified' | 'pending' | 'rejected';
}

interface PaymentStats {
  label: string;
  value: string | number;
  change: number;
  icon: React.ElementType;
  color: string;
  bgColor: string;
}

export default function AdminPaymentsPage() {
  const [activeTab, setActiveTab] = useState<'all' | 'deposits' | 'withdrawals' | 'disputes'>('all');
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTransactions, setSelectedTransactions] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'completed' | 'failed'>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showActionModal, setShowActionModal] = useState(false);
  const [actionType, setActionType] = useState<'approve' | 'reject' | 'refund'>('approve');

  // Mock data
  const mockTransactions: Transaction[] = [
    {
      id: '1',
      type: 'withdrawal',
      status: 'pending',
      amount: 1250,
      currency: 'EUR',
      user: {
        name: '@topclippper',
        email: 'top@clipper.com',
        type: 'clipper',
        verified: true
      },
      method: 'Virement bancaire',
      reference: 'WD-2024-001',
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
      description: 'Retrait des gains',
      fees: 2.5,
      kycStatus: 'verified'
    },
    {
      id: '2',
      type: 'deposit',
      status: 'completed',
      amount: 5000,
      currency: 'EUR',
      user: {
        name: 'Nike France',
        email: 'finance@nike.fr',
        type: 'advertiser',
        verified: true
      },
      method: 'Carte bancaire',
      reference: 'DEP-2024-002',
      createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000),
      processedAt: new Date(Date.now() - 3.5 * 60 * 60 * 1000),
      description: 'Rechargement compte campagne',
      fees: 50
    },
    {
      id: '3',
      type: 'withdrawal',
      status: 'pending',
      amount: 850,
      currency: 'EUR',
      user: {
        name: '@beautyguru',
        email: 'beauty@example.com',
        type: 'clipper',
        verified: false
      },
      method: 'PayPal',
      reference: 'WD-2024-003',
      createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000),
      description: 'Retrait mensuel',
      fees: 1.7,
      kycStatus: 'pending'
    },
    {
      id: '4',
      type: 'commission',
      status: 'completed',
      amount: 125,
      currency: 'EUR',
      user: {
        name: 'Clipbox',
        email: 'system@clipbox.com',
        type: 'clipper',
        verified: true
      },
      method: 'Système',
      reference: 'COM-2024-004',
      createdAt: new Date(Date.now() - 8 * 60 * 60 * 1000),
      processedAt: new Date(Date.now() - 8 * 60 * 60 * 1000),
      description: 'Commission plateforme (10%)'
    },
    {
      id: '5',
      type: 'refund',
      status: 'pending',
      amount: 500,
      currency: 'EUR',
      user: {
        name: 'Tech Startup',
        email: 'support@techstartup.com',
        type: 'advertiser',
        verified: true
      },
      method: 'Carte bancaire',
      reference: 'REF-2024-005',
      createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000),
      description: 'Remboursement campagne annulée'
    },
    {
      id: '6',
      type: 'withdrawal',
      status: 'failed',
      amount: 2000,
      currency: 'EUR',
      user: {
        name: '@creator456',
        email: 'creator@email.com',
        type: 'clipper',
        verified: true
      },
      method: 'Virement bancaire',
      reference: 'WD-2024-006',
      createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
      description: 'IBAN invalide',
      kycStatus: 'verified'
    }
  ];

  useEffect(() => {
    // Filtrer les transactions
    let filtered = mockTransactions;
    
    if (activeTab !== 'all') {
      const typeMap = {
        'deposits': 'deposit',
        'withdrawals': 'withdrawal',
        'disputes': 'refund'
      };
      filtered = filtered.filter(t => 
        activeTab === 'disputes' ? t.type === 'refund' : t.type === typeMap[activeTab]
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(t => t.status === statusFilter);
    }

    if (searchTerm) {
      filtered = filtered.filter(t =>
        t.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.reference.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setTimeout(() => {
      setTransactions(filtered);
      setIsLoading(false);
    }, 500);
  }, [activeTab, statusFilter, searchTerm]);

  const stats: PaymentStats[] = [
    {
      label: 'Volume total',
      value: '€124,560',
      change: 15.3,
      icon: DollarSign,
      color: 'text-green-600',
      bgColor: 'bg-green-100 dark:bg-green-900/30'
    },
    {
      label: 'En attente',
      value: '€4,600',
      change: -8.2,
      icon: Clock,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100 dark:bg-yellow-900/30'
    },
    {
      label: 'Retraits validés',
      value: 142,
      change: 12.5,
      icon: CheckCircle,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100 dark:bg-blue-900/30'
    },
    {
      label: 'Litiges',
      value: 3,
      change: -25,
      icon: AlertTriangle,
      color: 'text-red-600',
      bgColor: 'bg-red-100 dark:bg-red-900/30'
    }
  ];

  const pendingWithdrawals = transactions.filter(t => 
    t.type === 'withdrawal' && t.status === 'pending'
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30';
      case 'completed':
        return 'text-green-600 bg-green-100 dark:bg-green-900/30';
      case 'failed':
        return 'text-red-600 bg-red-100 dark:bg-red-900/30';
      case 'cancelled':
        return 'text-gray-600 bg-gray-100 dark:bg-gray-900/30';
      default:
        return 'text-gray-600 bg-gray-100 dark:bg-gray-900/30';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'deposit':
        return <ArrowDownRight className="h-4 w-4 text-green-500" />;
      case 'withdrawal':
        return <ArrowUpRight className="h-4 w-4 text-blue-500" />;
      case 'commission':
        return <DollarSign className="h-4 w-4 text-purple-500" />;
      case 'refund':
        return <RefreshCw className="h-4 w-4 text-orange-500" />;
      default:
        return <CreditCard className="h-4 w-4 text-gray-500" />;
    }
  };

  const getKycStatusBadge = (status?: string) => {
    if (!status) return null;
    
    const colors: Record<string, string> = {
      verified: 'text-green-600 bg-green-100 dark:bg-green-900/30',
      pending: 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30',
      rejected: 'text-red-600 bg-red-100 dark:bg-red-900/30'
    };

    return (
      <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${colors[status]}`}>
        KYC {status === 'verified' ? '✓' : status === 'pending' ? '⏳' : '✗'}
      </span>
    );
  };

  const handleAction = (transaction: Transaction, action: 'approve' | 'reject' | 'refund') => {
    setSelectedTransaction(transaction);
    setActionType(action);
    setShowActionModal(true);
  };

  const confirmAction = () => {
    console.log(`Action ${actionType} on transaction:`, selectedTransaction);
    setShowActionModal(false);
    setSelectedTransaction(null);
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
            Gestion des paiements
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Gérez les transactions, retraits et litiges financiers
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center gap-2">
            <Download className="h-4 w-4" />
            Exporter
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
            <div className="mt-2 flex items-center text-sm">
              {stat.change > 0 ? (
                <ArrowUpRight className="h-4 w-4 text-green-500 mr-1" />
              ) : (
                <ArrowDownRight className="h-4 w-4 text-red-500 mr-1" />
              )}
              <span className={stat.change > 0 ? 'text-green-600' : 'text-red-600'}>
                {Math.abs(stat.change)}%
              </span>
              <span className="text-gray-500 dark:text-gray-400 ml-1">vs mois dernier</span>
            </div>
          </div>
        ))}
      </div>

      {/* Pending Withdrawals Alert */}
      {pendingWithdrawals.length > 0 && (
        <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <AlertCircle className="h-5 w-5 text-orange-600 dark:text-orange-400" />
              <div>
                <p className="text-sm font-medium text-orange-800 dark:text-orange-200">
                  {pendingWithdrawals.length} retrait(s) en attente de validation
                </p>
                <p className="text-xs text-orange-600 dark:text-orange-400 mt-1">
                  Montant total: €{pendingWithdrawals.reduce((sum, t) => sum + t.amount, 0).toLocaleString()}
                </p>
              </div>
            </div>
            <button className="px-3 py-1 text-sm bg-orange-600 text-white rounded hover:bg-orange-700">
              Traiter maintenant
            </button>
          </div>
        </div>
      )}

      {/* Tabs and Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
        {/* Tabs */}
        <div className="border-b border-gray-200 dark:border-gray-700">
          <div className="flex">
            {[
              { id: 'all', label: 'Toutes', count: mockTransactions.length },
              { id: 'deposits', label: 'Dépôts', count: mockTransactions.filter(t => t.type === 'deposit').length },
              { id: 'withdrawals', label: 'Retraits', count: mockTransactions.filter(t => t.type === 'withdrawal').length },
              { id: 'disputes', label: 'Litiges', count: mockTransactions.filter(t => t.type === 'refund').length }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-purple-600 text-purple-600'
                    : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
              >
                {tab.label}
                {tab.count > 0 && (
                  <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-gray-100 dark:bg-gray-700">
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
                  placeholder="Rechercher par référence, utilisateur..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900"
                />
              </div>
            </div>
            
            <div className="flex gap-2">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900"
              >
                <option value="all">Tous les statuts</option>
                <option value="pending">En attente</option>
                <option value="completed">Complété</option>
                <option value="failed">Échoué</option>
              </select>
              
              <button className="p-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700">
                <Filter className="h-5 w-5 text-gray-600 dark:text-gray-400" />
              </button>
            </div>
          </div>
        </div>

        {/* Transactions Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
              <tr>
                <th className="px-6 py-3 text-left">
                  <input
                    type="checkbox"
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedTransactions(transactions.map(t => t.id));
                      } else {
                        setSelectedTransactions([]);
                      }
                    }}
                    className="rounded border-gray-300 dark:border-gray-600"
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Transaction
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Utilisateur
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Montant
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Méthode
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Statut
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {transactions.map((transaction) => (
                <tr
                  key={transaction.id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-900"
                >
                  <td className="px-6 py-4">
                    <input
                      type="checkbox"
                      checked={selectedTransactions.includes(transaction.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedTransactions([...selectedTransactions, transaction.id]);
                        } else {
                          setSelectedTransactions(selectedTransactions.filter(id => id !== transaction.id));
                        }
                      }}
                      className="rounded border-gray-300 dark:border-gray-600"
                    />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      {getTypeIcon(transaction.type)}
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {transaction.reference}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {transaction.description}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <p className="text-sm text-gray-900 dark:text-white">
                        {transaction.user.name}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {transaction.user.type === 'clipper' ? 'Clipper' : 'Annonceur'}
                        </span>
                        {transaction.user.verified && (
                          <CheckCircle className="h-3 w-3 text-blue-500" />
                        )}
                        {transaction.kycStatus && getKycStatusBadge(transaction.kycStatus)}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <p className="text-sm font-semibold text-gray-900 dark:text-white">
                        {transaction.type === 'withdrawal' ? '-' : '+'}€{transaction.amount.toLocaleString()}
                      </p>
                      {transaction.fees && (
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Frais: €{transaction.fees}
                        </p>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-gray-900 dark:text-white">
                      {transaction.method}
                    </p>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(transaction.status)}`}>
                      {transaction.status === 'pending' && 'En attente'}
                      {transaction.status === 'completed' && 'Complété'}
                      {transaction.status === 'failed' && 'Échoué'}
                      {transaction.status === 'cancelled' && 'Annulé'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      <p>{formatTimeAgo(transaction.createdAt)}</p>
                      {transaction.processedAt && (
                        <p className="text-xs">
                          Traité {formatTimeAgo(transaction.processedAt)}
                        </p>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          setSelectedTransaction(transaction);
                          setShowDetailModal(true);
                        }}
                        className="p-1 text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400"
                        title="Voir détails"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      
                      {transaction.status === 'pending' && transaction.type === 'withdrawal' && (
                        <>
                          <button
                            onClick={() => handleAction(transaction, 'approve')}
                            className="p-1 text-green-600 hover:text-green-700"
                            title="Approuver"
                          >
                            <CheckCircle className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleAction(transaction, 'reject')}
                            className="p-1 text-red-600 hover:text-red-700"
                            title="Rejeter"
                          >
                            <XCircle className="h-4 w-4" />
                          </button>
                        </>
                      )}
                      
                      {transaction.type === 'deposit' && transaction.status === 'completed' && (
                        <button
                          onClick={() => handleAction(transaction, 'refund')}
                          className="p-1 text-orange-600 hover:text-orange-700"
                          title="Rembourser"
                        >
                          <RefreshCw className="h-4 w-4" />
                        </button>
                      )}
                      
                      <button className="p-1 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
                        <MoreVertical className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Affichage de 1 à {transactions.length} sur {transactions.length} transactions
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
      {showActionModal && selectedTransaction && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Confirmer l'action
            </h3>
            
            <div className="mb-4 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
              <p className="text-sm text-gray-600 dark:text-gray-400">Transaction</p>
              <p className="font-medium text-gray-900 dark:text-white">{selectedTransaction.reference}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">Montant</p>
              <p className="font-medium text-gray-900 dark:text-white">€{selectedTransaction.amount.toLocaleString()}</p>
            </div>
            
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Êtes-vous sûr de vouloir {
                actionType === 'approve' ? 'approuver' :
                actionType === 'reject' ? 'rejeter' :
                'rembourser'
              } cette transaction ?
            </p>
            
            {actionType === 'reject' && (
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Raison du rejet
                </label>
                <textarea
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900"
                  rows={3}
                  placeholder="Expliquez la raison..."
                />
              </div>
            )}
            
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowActionModal(false)}
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
    </div>
  );
}