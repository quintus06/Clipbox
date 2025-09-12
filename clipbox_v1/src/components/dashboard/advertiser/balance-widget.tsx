'use client';

import { useState, useEffect } from 'react';
import { Wallet, TrendingUp, Lock } from 'lucide-react';
import Link from 'next/link';

interface BalanceData {
  totalBalance: number;
  availableBalance: number;
  lockedBalance: number;
  currency: string;
}

export default function BalanceWidget() {
  const [balance, setBalance] = useState<BalanceData>({
    totalBalance: 5000.00,
    availableBalance: 3500.00,
    lockedBalance: 1500.00,
    currency: 'EUR'
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Fetch balance data
    fetchBalance();
  }, []);

  const fetchBalance = async () => {
    setIsLoading(true);
    try {
      // Mock API call - replace with actual API
      await new Promise(resolve => setTimeout(resolve, 500));
      // const response = await fetch('/api/advertiser/balance');
      // const data = await response.json();
      // setBalance(data);
    } catch (error) {
      console.error('Error fetching balance:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: balance.currency
    }).format(amount);
  };

  if (isLoading) {
    return (
      <div className="flex items-center space-x-2 px-4 py-2 bg-gray-50 dark:bg-gray-700 rounded-lg animate-pulse">
        <div className="h-4 w-20 bg-gray-200 dark:bg-gray-600 rounded"></div>
      </div>
    );
  }

  return (
    <div className="relative group">
      <Link
        href="/dashboard/advertiser/balance"
        className="flex items-center space-x-2 px-4 py-2 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
      >
        <Wallet className="h-5 w-5 text-orange-500" />
        <div className="flex flex-col">
          <span className="text-xs text-gray-500 dark:text-gray-400">Balance</span>
          <span className="text-sm font-semibold text-gray-900 dark:text-white">
            {formatCurrency(balance.availableBalance)}
          </span>
        </div>
      </Link>

      {/* Tooltip with detailed balance */}
      <div className="absolute top-full right-0 mt-2 w-64 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600 dark:text-gray-400">Balance totale</span>
            <span className="text-sm font-semibold text-gray-900 dark:text-white">
              {formatCurrency(balance.totalBalance)}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-1">
              <TrendingUp className="h-4 w-4 text-green-500" />
              <span className="text-sm text-gray-600 dark:text-gray-400">Disponible</span>
            </div>
            <span className="text-sm font-semibold text-green-600 dark:text-green-400">
              {formatCurrency(balance.availableBalance)}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-1">
              <Lock className="h-4 w-4 text-orange-500" />
              <span className="text-sm text-gray-600 dark:text-gray-400">Engagée</span>
            </div>
            <span className="text-sm font-semibold text-orange-600 dark:text-orange-400">
              {formatCurrency(balance.lockedBalance)}
            </span>
          </div>
          <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
            <Link
              href="/dashboard/advertiser/balance"
              className="text-xs text-orange-600 dark:text-orange-400 hover:text-orange-700 dark:hover:text-orange-300"
            >
              Recharger la balance →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}