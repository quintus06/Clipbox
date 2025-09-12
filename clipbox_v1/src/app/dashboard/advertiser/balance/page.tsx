'use client';

import { useState, useEffect } from 'react';
import {
  Wallet,
  CreditCard,
  Building,
  ArrowUpRight,
  ArrowDownRight,
  Download,
  Filter,
  Calendar,
  DollarSign,
  TrendingUp,
  Lock,
  AlertCircle,
  Check,
  X,
  Plus
} from 'lucide-react';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface Transaction {
  id: string;
  type: 'CREDIT' | 'DEBIT' | 'CAMPAIGN_PAYMENT' | 'REFUND';
  amount: number;
  description: string;
  date: Date;
  status: 'COMPLETED' | 'PENDING' | 'FAILED';
  reference: string;
  campaignId?: string;
  campaignName?: string;
}

interface BalanceData {
  totalBalance: number;
  availableBalance: number;
  lockedBalance: number;
  pendingBalance: number;
  currency: string;
}

// Mock data
const mockTransactions: Transaction[] = [
  {
    id: '1',
    type: 'CREDIT',
    amount: 1000,
    description: 'Recharge par carte bancaire',
    date: new Date('2025-01-08'),
    status: 'COMPLETED',
    reference: 'TXN-2025-001'
  },
  {
    id: '2',
    type: 'CAMPAIGN_PAYMENT',
    amount: -250,
    description: 'Paiement campagne',
    date: new Date('2025-01-07'),
    status: 'COMPLETED',
    reference: 'TXN-2025-002',
    campaignId: '1',
    campaignName: 'Lancement Produit Tech 2025'
  },
  {
    id: '3',
    type: 'CREDIT',
    amount: 500,
    description: 'Recharge par virement',
    date: new Date('2025-01-05'),
    status: 'PENDING',
    reference: 'TXN-2025-003'
  },
  {
    id: '4',
    type: 'CAMPAIGN_PAYMENT',
    amount: -150,
    description: 'Paiement campagne',
    date: new Date('2025-01-04'),
    status: 'COMPLETED',
    reference: 'TXN-2025-004',
    campaignId: '2',
    campaignName: 'Campagne Mode Printemps'
  },
  {
    id: '5',
    type: 'REFUND',
    amount: 50,
    description: 'Remboursement campagne annulée',
    date: new Date('2025-01-03'),
    status: 'COMPLETED',
    reference: 'TXN-2025-005'
  }
];

const balanceHistory = [
  { date: '01/01', balance: 3000 },
  { date: '02/01', balance: 3200 },
  { date: '03/01', balance: 3250 },
  { date: '04/01', balance: 3100 },
  { date: '05/01', balance: 3600 },
  { date: '06/01', balance: 3350 },
  { date: '07/01', balance: 3500 },
];

export default function BalancePage() {
  const [balance, setBalance] = useState<BalanceData>({
    totalBalance: 5000,
    availableBalance: 3500,
    lockedBalance: 1500,
    pendingBalance: 500,
    currency: 'EUR'
  });
  const [transactions, setTransactions] = useState<Transaction[]>(mockTransactions);
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>(mockTransactions);
  const [typeFilter, setTypeFilter] = useState('ALL');
  const [showRechargeModal, setShowRechargeModal] = useState(false);
  const [rechargeAmount, setRechargeAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'CARD' | 'TRANSFER'>('CARD');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchBalanceData();
  }, []);

  useEffect(() => {
    filterTransactions();
  }, [typeFilter, transactions]);

  const fetchBalanceData = async () => {
    setIsLoading(true);
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      // const response = await fetch('/api/advertiser/balance');
      // const data = await response.json();
      // setBalance(data.balance);
      // setTransactions(data.transactions);
    } catch (error) {
      console.error('Error fetching balance data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filterTransactions = () => {
    let filtered = [...transactions];
    if (typeFilter !== 'ALL') {
      filtered = filtered.filter(t => t.type === typeFilter);
    }
    setFilteredTransactions(filtered);
  };

  const handleRecharge = async () => {
    if (!rechargeAmount || parseFloat(rechargeAmount) <= 0) return;

    setIsLoading(true);
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Add new transaction
      const newTransaction: Transaction = {
        id: Date.now().toString(),
        type: 'CREDIT',
        amount: parseFloat(rechargeAmount),
        description: paymentMethod === 'CARD' ? 'Recharge par carte bancaire' : 'Recharge par virement',
        date: new Date(),
        status: paymentMethod === 'CARD' ? 'COMPLETED' : 'PENDING',
        reference: `TXN-${Date.now()}`
      };
      
      setTransactions([newTransaction, ...transactions]);
      
      if (paymentMethod === 'CARD') {
        setBalance({
          ...balance,
          availableBalance: balance.availableBalance + parseFloat(rechargeAmount),
          totalBalance: balance.totalBalance + parseFloat(rechargeAmount)
        });
      } else {
        setBalance({
          ...balance,
          pendingBalance: balance.pendingBalance + parseFloat(rechargeAmount)
        });
      }
      
      setShowRechargeModal(false);
      setRechargeAmount('');
    } catch (error) {
      console.error('Error recharging balance:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: balance.currency
    }).format(Math.abs(amount));
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('fr-FR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'CREDIT':
        return <ArrowDownRight className="h-5 w-5 text-green-500" />;
      case 'DEBIT':
      case 'CAMPAIGN_PAYMENT':
        return <ArrowUpRight className="h-5 w-5 text-red-500" />;
      case 'REFUND':
        return <ArrowDownRight className="h-5 w-5 text-blue-500" />;
      default:
        return <DollarSign className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">
            <Check className="h-3 w-3 mr-1" />
            Complété
          </span>
        );
      case 'PENDING':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400">
            <AlertCircle className="h-3 w-3 mr-1" />
            En attente
          </span>
        );
      case 'FAILED':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400">
            <X className="h-3 w-3 mr-1" />
            Échoué
          </span>
        );
      default:
        return null;
    }
  };

  if (isLoading && transactions.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Gestion de la Balance
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Gérez votre balance et consultez l'historique des transactions
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <button
            onClick={() => setShowRechargeModal(true)}
            className="inline-flex items-center px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
          >
            <Plus className="h-5 w-5 mr-2" />
            Recharger la balance
          </button>
        </div>
      </div>

      {/* Balance Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <Wallet className="h-8 w-8 text-orange-500" />
            <TrendingUp className="h-5 w-5 text-green-500" />
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400">Balance totale</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {formatCurrency(balance.totalBalance)}
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <DollarSign className="h-8 w-8 text-green-500" />
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400">Balance disponible</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {formatCurrency(balance.availableBalance)}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Prête à être utilisée
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <Lock className="h-8 w-8 text-orange-500" />
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400">Balance engagée</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {formatCurrency(balance.lockedBalance)}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Dans les campagnes actives
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <AlertCircle className="h-8 w-8 text-yellow-500" />
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400">En attente</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {formatCurrency(balance.pendingBalance)}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Virements en cours
          </p>
        </div>
      </div>

      {/* Balance History Chart */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Évolution de la balance
        </h2>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={balanceHistory}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="date" stroke="#6b7280" />
            <YAxis stroke="#6b7280" />
            <Tooltip
              formatter={(value: number) => formatCurrency(value)}
              contentStyle={{
                backgroundColor: '#1f2937',
                border: 'none',
                borderRadius: '8px',
                color: '#fff'
              }}
            />
            <Area
              type="monotone"
              dataKey="balance"
              stroke="#f97316"
              fill="#f97316"
              fillOpacity={0.2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Transactions Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Historique des transactions
          </h2>
          <div className="flex items-center space-x-3">
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="ALL">Toutes</option>
              <option value="CREDIT">Crédits</option>
              <option value="CAMPAIGN_PAYMENT">Paiements</option>
              <option value="REFUND">Remboursements</option>
            </select>
            <button className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700">
              <Download className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Transactions List */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Transaction
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Référence
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Statut
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Montant
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {filteredTransactions.map((transaction) => (
                  <tr key={transaction.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {getTransactionIcon(transaction.type)}
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {transaction.description}
                          </div>
                          {transaction.campaignName && (
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              {transaction.campaignName}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {formatDate(transaction.date)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {transaction.reference}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(transaction.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <span className={`text-sm font-medium ${
                        transaction.amount > 0 
                          ? 'text-green-600 dark:text-green-400' 
                          : 'text-red-600 dark:text-red-400'
                      }`}>
                        {transaction.amount > 0 ? '+' : ''}{formatCurrency(transaction.amount)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Recharge Modal */}
      {showRechargeModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4">
            <div className="fixed inset-0 bg-black opacity-50" onClick={() => setShowRechargeModal(false)}></div>
            <div className="relative bg-white dark:bg-gray-800 rounded-lg max-w-md w-full p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Recharger la balance
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Montant (€)
                  </label>
                  <input
                    type="number"
                    value={rechargeAmount}
                    onChange={(e) => setRechargeAmount(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="0.00"
                    min="10"
                    step="10"
                  />
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    Montant minimum : 10€
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Méthode de paiement
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => setPaymentMethod('CARD')}
                      className={`p-4 rounded-lg border-2 transition-colors ${
                        paymentMethod === 'CARD'
                          ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/20'
                          : 'border-gray-300 dark:border-gray-600 hover:border-gray-400'
                      }`}
                    >
                      <CreditCard className="h-6 w-6 mx-auto mb-2 text-gray-600 dark:text-gray-400" />
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        Carte bancaire
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        Instantané
                      </p>
                    </button>
                    <button
                      onClick={() => setPaymentMethod('TRANSFER')}
                      className={`p-4 rounded-lg border-2 transition-colors ${
                        paymentMethod === 'TRANSFER'
                          ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/20'
                          : 'border-gray-300 dark:border-gray-600 hover:border-gray-400'
                      }`}
                    >
                      <Building className="h-6 w-6 mx-auto mb-2 text-gray-600 dark:text-gray-400" />
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        Virement
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        2-3 jours
                      </p>
                    </button>
                  </div>
                </div>

                {/* Quick amounts */}
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                    Montants suggérés
                  </p>
                  <div className="grid grid-cols-4 gap-2">
                    {[50, 100, 250, 500].map((amount) => (
                      <button
                        key={amount}
                        onClick={() => setRechargeAmount(amount.toString())}
                        className="px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
                      >
                        {amount}€
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => setShowRechargeModal(false)}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  Annuler
                </button>
                <button
                  onClick={handleRecharge}
                  disabled={!rechargeAmount || parseFloat(rechargeAmount) < 10 || isLoading}
                  className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? 'Traitement...' : 'Confirmer'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}