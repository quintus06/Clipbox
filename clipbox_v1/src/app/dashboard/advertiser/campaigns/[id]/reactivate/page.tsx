'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  DollarSign,
  Calendar,
  AlertCircle,
  CheckCircle,
  TrendingUp,
  Eye,
  Users
} from 'lucide-react';

interface Campaign {
  id: string;
  title: string;
  description: string;
  status: 'ACTIVE' | 'PENDING' | 'PAUSED' | 'COMPLETED';
  budget: number;
  remainingBudget: number;
  platform: 'TIKTOK' | 'INSTAGRAM' | 'YOUTUBE';
  endDate: Date;
  totalViews: number;
  totalSubmissions: number;
  approvedSubmissions: number;
}

// Mock data - same as in the detail page
const mockCampaign: Campaign = {
  id: '1',
  title: 'Lancement Produit Tech 2025',
  description: 'Campagne de promotion pour notre nouveau produit tech innovant',
  status: 'PAUSED',
  budget: 2000,
  remainingBudget: 1200,
  platform: 'TIKTOK',
  endDate: new Date('2025-03-15'),
  totalViews: 125000,
  totalSubmissions: 45,
  approvedSubmissions: 38
};

export default function ReactivateCampaignPage() {
  const params = useParams();
  const router = useRouter();
  const [campaign, setCampaign] = useState<Campaign>(mockCampaign);
  const [additionalBudget, setAdditionalBudget] = useState<number>(500);
  const [customBudget, setCustomBudget] = useState<string>('');
  const [useCustomBudget, setUseCustomBudget] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const budgetOptions = [500, 1000, 2000, 5000];

  useEffect(() => {
    fetchCampaignData();
  }, [params.id]);

  const fetchCampaignData = async () => {
    setIsLoading(true);
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 500));
      // const response = await fetch(`/api/advertiser/campaigns/${params.id}`);
      // const data = await response.json();
      // setCampaign(data);
    } catch (error) {
      console.error('Error fetching campaign:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReactivate = async () => {
    setIsSubmitting(true);
    try {
      const finalBudget = useCustomBudget ? parseInt(customBudget) : additionalBudget;
      
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      // const response = await fetch(`/api/advertiser/campaigns/${params.id}/reactivate`, {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ additionalBudget: finalBudget })
      // });
      
      // Redirect to campaign detail page
      router.push(`/dashboard/advertiser/campaigns/${params.id}`);
    } catch (error) {
      console.error('Error reactivating campaign:', error);
      setIsSubmitting(false);
    }
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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  const finalBudget = useCustomBudget && customBudget ? parseInt(customBudget) : additionalBudget;
  const newTotalBudget = campaign.budget + finalBudget;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <Link
          href="/dashboard/advertiser/campaigns"
          className="inline-flex items-center text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Retour aux campagnes
        </Link>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Réactiver la campagne
        </h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Relancez votre campagne avec un budget supplémentaire
        </p>
      </div>

      {/* Campaign Info Card */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          {campaign.title}
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          {campaign.description}
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Budget actuel</p>
                <p className="text-lg font-semibold text-gray-900 dark:text-white">
                  {formatCurrency(campaign.budget)}
                </p>
              </div>
              <DollarSign className="h-6 w-6 text-orange-500" />
            </div>
          </div>
          
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Vues totales</p>
                <p className="text-lg font-semibold text-gray-900 dark:text-white">
                  {formatNumber(campaign.totalViews)}
                </p>
              </div>
              <Eye className="h-6 w-6 text-blue-500" />
            </div>
          </div>
          
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Soumissions</p>
                <p className="text-lg font-semibold text-gray-900 dark:text-white">
                  {campaign.approvedSubmissions}/{campaign.totalSubmissions}
                </p>
              </div>
              <Users className="h-6 w-6 text-green-500" />
            </div>
          </div>
        </div>

        {/* Alert */}
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
          <div className="flex">
            <AlertCircle className="h-5 w-5 text-yellow-600 dark:text-yellow-400 mt-0.5" />
            <div className="ml-3">
              <h3 className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                Campagne actuellement en pause
              </h3>
              <p className="mt-1 text-sm text-yellow-700 dark:text-yellow-300">
                Cette campagne a été mise en pause. En la réactivant, elle reprendra avec les mêmes paramètres et cibles.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Budget Selection */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Sélectionner le budget supplémentaire
        </h2>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
          {budgetOptions.map((amount) => (
            <button
              key={amount}
              onClick={() => {
                setAdditionalBudget(amount);
                setUseCustomBudget(false);
              }}
              className={`p-4 rounded-lg border-2 transition-all ${
                !useCustomBudget && additionalBudget === amount
                  ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/20'
                  : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
              }`}
            >
              <p className="text-lg font-semibold text-gray-900 dark:text-white">
                {formatCurrency(amount)}
              </p>
            </button>
          ))}
        </div>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">
              ou
            </span>
          </div>
        </div>

        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Montant personnalisé
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-gray-500 dark:text-gray-400">€</span>
            </div>
            <input
              type="number"
              value={customBudget}
              onChange={(e) => {
                setCustomBudget(e.target.value);
                setUseCustomBudget(true);
              }}
              onFocus={() => setUseCustomBudget(true)}
              min="100"
              step="100"
              placeholder="Entrez un montant"
              className="block w-full pl-8 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            Minimum 100€
          </p>
        </div>
      </div>

      {/* Summary */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Résumé de la réactivation
        </h2>
        
        <div className="space-y-3">
          <div className="flex items-center justify-between py-2">
            <span className="text-sm text-gray-600 dark:text-gray-400">Budget actuel</span>
            <span className="text-sm font-medium text-gray-900 dark:text-white">
              {formatCurrency(campaign.budget)}
            </span>
          </div>
          <div className="flex items-center justify-between py-2">
            <span className="text-sm text-gray-600 dark:text-gray-400">Budget supplémentaire</span>
            <span className="text-sm font-medium text-green-600 dark:text-green-400">
              + {formatCurrency(finalBudget)}
            </span>
          </div>
          <div className="border-t border-gray-200 dark:border-gray-700 pt-3">
            <div className="flex items-center justify-between">
              <span className="text-base font-medium text-gray-900 dark:text-white">
                Nouveau budget total
              </span>
              <span className="text-lg font-bold text-orange-600 dark:text-orange-400">
                {formatCurrency(newTotalBudget)}
              </span>
            </div>
          </div>
        </div>

        <div className="mt-6 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <div className="flex">
            <CheckCircle className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5" />
            <div className="ml-3">
              <p className="text-sm text-blue-800 dark:text-blue-200">
                La campagne sera immédiatement réactivée avec le nouveau budget.
                Les paramètres de ciblage et de paiement restent inchangés.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between">
        <Link
          href={`/dashboard/advertiser/campaigns/${params.id}`}
          className="px-6 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
        >
          Annuler
        </Link>
        <button
          onClick={handleReactivate}
          disabled={isSubmitting || (!useCustomBudget && !additionalBudget) || (useCustomBudget && (!customBudget || parseInt(customBudget) < 100))}
          className="px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isSubmitting ? (
            <span className="flex items-center">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Réactivation...
            </span>
          ) : (
            'Réactiver la campagne'
          )}
        </button>
      </div>
    </div>
  );
}