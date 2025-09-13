'use client';

import { useState, useEffect } from 'react';
import {
  Wallet,
  DollarSign,
  ArrowUpRight,
  ArrowDownLeft,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Download,
  CreditCard,
  Building2,
  FileText,
  Shield,
  TrendingUp,
  Calendar,
  Filter,
  Search,
  Info,
  ChevronRight,
  ExternalLink,
  Settings,
  Plus
} from 'lucide-react';
import Link from 'next/link';

// Mock data
const mockBalance = {
  available: 1245.50,
  pending: 320.00,
  withdrawn: 5680.00,
  currency: 'EUR',
  lastWithdrawal: '2024-01-15',
  nextPaymentDate: '2024-02-05',
};

const mockTransactions = [
  {
    id: '1',
    type: 'CAMPAIGN_PAYMENT',
    amount: 75.00,
    currency: 'EUR',
    status: 'COMPLETED',
    description: 'Paiement pour Summer Fashion Collection',
    campaignId: '1',
    submissionId: '1',
    date: '2024-01-29T14:20:00',
    reference: 'PAY-2024-001',
  },
  {
    id: '2',
    type: 'WITHDRAWAL',
    amount: -500.00,
    currency: 'EUR',
    status: 'COMPLETED',
    description: 'Retrait vers compte bancaire',
    date: '2024-01-15T10:00:00',
    reference: 'WTH-2024-001',
    bankAccount: '**** 1234',
  },
  {
    id: '3',
    type: 'CAMPAIGN_PAYMENT',
    amount: 100.00,
    currency: 'EUR',
    status: 'PENDING',
    description: 'Paiement pour Tech Review',
    campaignId: '2',
    submissionId: '2',
    date: '2024-02-01T15:45:00',
    reference: 'PAY-2024-002',
  },
  {
    id: '4',
    type: 'BONUS',
    amount: 50.00,
    currency: 'EUR',
    status: 'COMPLETED',
    description: 'Bonus performance du mois',
    date: '2024-01-31T00:00:00',
    reference: 'BON-2024-001',
  },
  {
    id: '5',
    type: 'SUBSCRIPTION_PAYMENT',
    amount: -8.00,
    currency: 'EUR',
    status: 'COMPLETED',
    description: 'Abonnement Basic - Février 2024',
    date: '2024-02-01T00:00:00',
    reference: 'SUB-2024-002',
  },
];

const mockPaymentMethods = [
  {
    id: '1',
    type: 'BANK_ACCOUNT',
    name: 'Compte principal',
    details: 'FR76 **** **** **** **** 1234',
    isDefault: true,
    verified: true,
  },
  {
    id: '2',
    type: 'PAYPAL',
    name: 'PayPal',
    details: 'john.doe@example.com',
    isDefault: false,
    verified: true,
  },
];

const transactionTypeConfig = {
  CAMPAIGN_PAYMENT: {
    label: 'Paiement campagne',
    icon: ArrowDownLeft,
    color: 'text-green-600 dark:text-green-400',
    bgColor: 'bg-green-100 dark:bg-green-900/30',
  },
  WITHDRAWAL: {
    label: 'Retrait',
    icon: ArrowUpRight,
    color: 'text-red-600 dark:text-red-400',
    bgColor: 'bg-red-100 dark:bg-red-900/30',
  },
  BONUS: {
    label: 'Bonus',
    icon: TrendingUp,
    color: 'text-purple-600 dark:text-purple-400',
    bgColor: 'bg-purple-100 dark:bg-purple-900/30',
  },
  SUBSCRIPTION_PAYMENT: {
    label: 'Abonnement',
    icon: CreditCard,
    color: 'text-blue-600 dark:text-blue-400',
    bgColor: 'bg-blue-100 dark:bg-blue-900/30',
  },
};

export default function PaymentsPage() {
  const [activeTab, setActiveTab] = useState<'overview' | 'transactions' | 'withdraw' | 'methods'>('overview');
  const [transactions, setTransactions] = useState(mockTransactions);
  const [filteredTransactions, setFilteredTransactions] = useState(mockTransactions);
  const [loading, setLoading] = useState(true);
  const [kycVerified, setKycVerified] = useState(true);
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(mockPaymentMethods[0].id);
  const [filters, setFilters] = useState({
    type: 'all',
    status: 'all',
    dateRange: 'all',
  });

  useEffect(() => {
    // Simulate loading
    setTimeout(() => setLoading(false), 1000);
  }, []);

  useEffect(() => {
    // Apply filters
    let filtered = [...transactions];

    if (filters.type !== 'all') {
      filtered = filtered.filter(t => t.type === filters.type);
    }

    if (filters.status !== 'all') {
      filtered = filtered.filter(t => t.status === filters.status);
    }

    if (filters.dateRange !== 'all') {
      const now = new Date();
      const dateLimit = new Date();
      
      switch (filters.dateRange) {
        case 'week':
          dateLimit.setDate(now.getDate() - 7);
          break;
        case 'month':
          dateLimit.setMonth(now.getMonth() - 1);
          break;
        case 'year':
          dateLimit.setFullYear(now.getFullYear() - 1);
          break;
      }
      
      filtered = filtered.filter(t => new Date(t.date) >= dateLimit);
    }

    setFilteredTransactions(filtered);
  }, [filters, transactions]);

  const handleWithdraw = () => {
    const amount = parseFloat(withdrawAmount);
    if (amount > 0 && amount <= mockBalance.available) {
      // Process withdrawal
      alert(`Demande de retrait de €${amount} envoyée`);
      setWithdrawAmount('');
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
            <CheckCircle className="w-3 h-3 mr-1" />
            Complété
          </span>
        );
      case 'PENDING':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400">
            <Clock className="w-3 h-3 mr-1" />
            En attente
          </span>
        );
      case 'FAILED':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400">
            <XCircle className="w-3 h-3 mr-1" />
            Échoué
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Paiements
        </h1>
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
          Gérez votre balance, vos transactions et vos retraits
        </p>
      </div>

      {/* Balance Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Available Balance */}
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <Wallet className="h-8 w-8 text-white/80" />
            <span className="text-xs bg-white/20 px-2 py-1 rounded-full">Disponible</span>
          </div>
          <p className="text-3xl font-bold mb-2">€{mockBalance.available.toFixed(2)}</p>
          <p className="text-sm text-white/80">Prêt pour retrait</p>
          <button
            onClick={() => setActiveTab('withdraw')}
            className="mt-4 w-full bg-white/20 hover:bg-white/30 text-white py-2 rounded-lg transition-colors text-sm font-medium"
          >
            Demander un retrait
          </button>
        </div>

        {/* Pending Balance */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <Clock className="h-8 w-8 text-yellow-600 dark:text-yellow-400" />
            <span className="text-xs bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400 px-2 py-1 rounded-full">
              En attente
            </span>
          </div>
          <p className="text-3xl font-bold mb-2">€{mockBalance.pending.toFixed(2)}</p>
          <p className="text-sm text-gray-600 dark:text-gray-400">En cours de traitement</p>
          <p className="text-xs text-gray-500 dark:text-gray-500 mt-4">
            Disponible le {new Date(mockBalance.nextPaymentDate).toLocaleDateString('fr-FR')}
          </p>
        </div>

        {/* Total Withdrawn */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <DollarSign className="h-8 w-8 text-purple-600 dark:text-purple-400" />
            <span className="text-xs bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-400 px-2 py-1 rounded-full">
              Total retiré
            </span>
          </div>
          <p className="text-3xl font-bold mb-2">€{mockBalance.withdrawn.toFixed(2)}</p>
          <p className="text-sm text-gray-600 dark:text-gray-400">Depuis le début</p>
          <p className="text-xs text-gray-500 dark:text-gray-500 mt-4">
            Dernier: {new Date(mockBalance.lastWithdrawal).toLocaleDateString('fr-FR')}
          </p>
        </div>
      </div>

      {/* KYC Alert */}
      {!kycVerified && (
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <Shield className="h-5 w-5 text-yellow-600 dark:text-yellow-400 mt-0.5" />
            <div className="flex-1">
              <h3 className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                Vérification KYC requise
              </h3>
              <p className="mt-1 text-sm text-yellow-700 dark:text-yellow-300">
                Pour pouvoir retirer vos gains, vous devez d'abord vérifier votre identité.
              </p>
              <Link
                href="/dashboard/clipper/profile#kyc"
                className="mt-2 inline-flex items-center text-sm font-medium text-yellow-800 dark:text-yellow-200 hover:underline"
              >
                Vérifier maintenant
                <ChevronRight className="ml-1 h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'overview', label: 'Vue d\'ensemble' },
            { id: 'transactions', label: 'Transactions' },
            { id: 'withdraw', label: 'Retrait' },
            { id: 'methods', label: 'Méthodes de paiement' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`
                py-2 px-1 border-b-2 font-medium text-sm transition-colors
                ${activeTab === tab.id
                  ? 'border-purple-600 text-purple-600 dark:text-purple-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                }
              `}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div>
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Recent Transactions */}
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold">Transactions récentes</h2>
                  <button
                    onClick={() => setActiveTab('transactions')}
                    className="text-sm text-purple-600 dark:text-purple-400 hover:underline"
                  >
                    Voir tout
                  </button>
                </div>
              </div>
              <div className="divide-y divide-gray-200 dark:divide-gray-700">
                {transactions.slice(0, 5).map((transaction) => {
                  const config = transactionTypeConfig[transaction.type as keyof typeof transactionTypeConfig];
                  const Icon = config.icon;
                  
                  return (
                    <div key={transaction.id} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className={`p-2 rounded-lg ${config.bgColor}`}>
                            <Icon className={`h-5 w-5 ${config.color}`} />
                          </div>
                          <div>
                            <p className="font-medium text-sm text-gray-900 dark:text-white">{transaction.description}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              {new Date(transaction.date).toLocaleDateString('fr-FR')} • {transaction.reference}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className={`font-bold text-lg ${transaction.amount > 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                            {transaction.amount > 0 ? '+' : ''}€{Math.abs(transaction.amount).toFixed(2)}
                          </p>
                          {getStatusBadge(transaction.status)}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Payment Schedule */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-semibold mb-4">Calendrier de paiement</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Calendar className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                    <div>
                      <p className="font-medium text-sm">Prochain paiement</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {new Date(mockBalance.nextPaymentDate).toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                      </p>
                    </div>
                  </div>
                  <p className="font-bold text-lg">€{mockBalance.pending.toFixed(2)}</p>
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  <p className="flex items-start gap-2">
                    <Info className="h-4 w-4 mt-0.5" />
                    <span>Les paiements sont effectués automatiquement tous les lundis pour les clips approuvés depuis plus de 7 jours.</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Transactions Tab */}
        {activeTab === 'transactions' && (
          <div className="space-y-4">
            {/* Filters */}
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
              <div className="flex flex-wrap items-center gap-3">
                <select
                  value={filters.type}
                  onChange={(e) => setFilters({ ...filters, type: e.target.value })}
                  className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="all">Tous les types</option>
                  <option value="CAMPAIGN_PAYMENT">Paiements campagne</option>
                  <option value="WITHDRAWAL">Retraits</option>
                  <option value="BONUS">Bonus</option>
                  <option value="SUBSCRIPTION_PAYMENT">Abonnements</option>
                </select>

                <select
                  value={filters.status}
                  onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                  className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="all">Tous les statuts</option>
                  <option value="COMPLETED">Complété</option>
                  <option value="PENDING">En attente</option>
                  <option value="FAILED">Échoué</option>
                </select>

                <select
                  value={filters.dateRange}
                  onChange={(e) => setFilters({ ...filters, dateRange: e.target.value })}
                  className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="all">Toutes les dates</option>
                  <option value="week">Cette semaine</option>
                  <option value="month">Ce mois</option>
                  <option value="year">Cette année</option>
                </select>

                <button className="ml-auto px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium flex items-center gap-2">
                  <Download className="h-4 w-4" />
                  Exporter
                </button>
              </div>
            </div>

            {/* Transactions List */}
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-700/50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Transaction
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Statut
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Montant
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {filteredTransactions.map((transaction) => {
                    const config = transactionTypeConfig[transaction.type as keyof typeof transactionTypeConfig];
                    const Icon = config.icon;
                    
                    return (
                      <tr key={transaction.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-lg ${config.bgColor}`}>
                              <Icon className={`h-4 w-4 ${config.color}`} />
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-900 dark:text-white">{transaction.description}</p>
                              <p className="text-xs text-gray-500 dark:text-gray-400">{transaction.reference}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-sm text-gray-900 dark:text-white">
                            {new Date(transaction.date).toLocaleDateString('fr-FR')}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {new Date(transaction.date).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </td>
                        <td className="px-6 py-4">
                          {getStatusBadge(transaction.status)}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <p className={`font-bold ${transaction.amount > 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                            {transaction.amount > 0 ? '+' : ''}€{Math.abs(transaction.amount).toFixed(2)}
                          </p>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button className="text-purple-600 dark:text-purple-400 hover:underline text-sm">
                            <FileText className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Withdraw Tab */}
        {activeTab === 'withdraw' && (
          <div className="max-w-2xl">
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
              <h2 className="text-lg font-semibold mb-6 text-gray-900 dark:text-white">Demander un retrait</h2>
              
              {kycVerified ? (
                <div className="space-y-6">
                  {/* Amount Input */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Montant à retirer
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">€</span>
                      <input
                        type="number"
                        value={withdrawAmount}
                        onChange={(e) => setWithdrawAmount(e.target.value)}
                        max={mockBalance.available}
                        className="w-full pl-8 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                        placeholder="0.00"
                      />
                    </div>
                    <div className="mt-2 flex items-center justify-between text-sm">
                      <span className="text-gray-500 dark:text-gray-400">
                        Disponible: €{mockBalance.available.toFixed(2)}
                      </span>
                      <button
                        onClick={() => setWithdrawAmount(mockBalance.available.toString())}
                        className="text-purple-600 dark:text-purple-400 hover:underline"
                      >
                        Tout retirer
                      </button>
                    </div>
                  </div>

                  {/* Payment Method */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Méthode de paiement
                    </label>
                    <div className="space-y-2">
                      {mockPaymentMethods.map((method) => (
                        <label
                          key={method.id}
                          className={`
                            flex items-center justify-between p-4 border rounded-lg cursor-pointer transition-colors
                            ${selectedPaymentMethod === method.id
                              ? 'border-purple-600 bg-purple-50 dark:bg-purple-900/20'
                              : 'border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700/50'
                            }
                          `}
                        >
                          <div className="flex items-center gap-3">
                            <input
                              type="radio"
                              name="paymentMethod"
                              value={method.id}
                              checked={selectedPaymentMethod === method.id}
                              onChange={(e) => setSelectedPaymentMethod(e.target.value)}
                              className="text-purple-600 focus:ring-purple-500"
                            />
                            <div>
                              <p className="font-medium text-sm text-gray-900 dark:text-white">{method.name}</p>
                              <p className="text-xs text-gray-500 dark:text-gray-400">{method.details}</p>
                            </div>
                          </div>
                          {method.verified && (
                            <CheckCircle className="h-5 w-5 text-green-500" />
                          )}
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Fees Info */}
                  <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Montant demandé</span>
                        <span className="font-medium text-gray-900 dark:text-white">€{parseFloat(withdrawAmount || '0').toFixed(2)}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Frais de traitement</span>
                        <span className="font-medium text-gray-900 dark:text-white">€0.00</span>
                      </div>
                      <div className="pt-2 border-t border-gray-200 dark:border-gray-600">
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-gray-900 dark:text-white">Montant à recevoir</span>
                          <span className="font-bold text-lg text-gray-900 dark:text-white">€{parseFloat(withdrawAmount || '0').toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button
                    onClick={handleWithdraw}
                    disabled={!withdrawAmount || parseFloat(withdrawAmount) <= 0 || parseFloat(withdrawAmount) > mockBalance.available}
                    className="w-full py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors font-medium"
                  >
                    Demander le retrait
                  </button>

                  {/* Info */}
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    <p className="flex items-start gap-2">
                      <Info className="h-4 w-4 mt-0.5" />
                      <span>Les retraits sont traités sous 2-3 jours ouvrés.</span>
                    </p>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <Shield className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2 text-gray-900 dark:text-white">Vérification requise</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    Vous devez vérifier votre identité avant de pouvoir retirer vos gains.
                  </p>
                  <Link
                    href="/dashboard/clipper/profile#kyc"
                    className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                  >
                    Vérifier mon identité
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Payment Methods Tab */}
        {activeTab === 'methods' && (
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Méthodes de paiement</h2>
                <button
                  onClick={() => {
                    // Show modal or navigate to add payment method page
                    alert('Fonctionnalité d\'ajout de méthode de paiement à implémenter');
                  }}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium flex items-center gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Ajouter une méthode
                </button>
              </div>

              <div className="space-y-4">
                {mockPaymentMethods.map((method) => (
                  <div
                    key={method.id}
                    className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg"
                  >
                    <div className="flex items-center gap-4">
                      <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
                        {method.type === 'BANK_ACCOUNT' ? (
                          <Building2 className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                        ) : (
                          <CreditCard className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-sm text-gray-900 dark:text-white">{method.name}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{method.details}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      {method.isDefault && (
                        <span className="px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 text-xs font-medium rounded-full">
                          Par défaut
                        </span>
                      )}
                      {method.verified ? (
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      ) : (
                        <button className="text-xs text-orange-600 dark:text-orange-400 hover:underline">
                          Vérifier
                        </button>
                      )}
                      <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                        <Settings className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Invoices */}
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
              <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Factures récentes</h2>
              <div className="space-y-3">
                {[
                  { id: '1', date: '2024-02-01', amount: 8.00, description: 'Abonnement Basic - Février 2024' },
                  { id: '2', date: '2024-01-01', amount: 8.00, description: 'Abonnement Basic - Janvier 2024' },
                ].map((invoice) => (
                  <div
                    key={invoice.id}
                    className="flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-lg transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <FileText className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">{invoice.description}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {new Date(invoice.date).toLocaleDateString('fr-FR')}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-medium text-gray-900 dark:text-white">€{invoice.amount.toFixed(2)}</span>
                      <button className="text-purple-600 dark:text-purple-400 hover:underline text-sm">
                        <Download className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}