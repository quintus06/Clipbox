'use client';

import Link from 'next/link';
import {
  Eye,
  Users,
  DollarSign,
  Calendar,
  TrendingUp,
  MoreVertical,
  Play,
  Pause,
  Clock,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { useState } from 'react';

interface Campaign {
  id: string;
  title: string;
  status: 'ACTIVE' | 'PENDING' | 'PAUSED' | 'COMPLETED' | 'REJECTED';
  budget: number;
  remainingBudget: number;
  submissions: number;
  approvedSubmissions: number;
  totalViews: number;
  platform: 'TIKTOK' | 'INSTAGRAM' | 'YOUTUBE';
  endDate: Date;
}

interface CampaignCardProps {
  campaign: Campaign;
}

export default function CampaignCard({ campaign }: CampaignCardProps) {
  const [showMenu, setShowMenu] = useState(false);
  const [isPausing, setIsPausing] = useState(false);

  const handlePauseCampaign = async () => {
    if (!confirm('Êtes-vous sûr de vouloir mettre cette campagne en pause ?')) {
      return;
    }

    setIsPausing(true);
    try {
      const response = await fetch(`/api/advertiser/campaigns/${campaign.id}/pause`, {
        method: 'POST',
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erreur lors de la mise en pause');
      }

      alert('Campagne mise en pause avec succès');
      window.location.reload();
    } catch (error) {
      console.error('Error pausing campaign:', error);
      alert(error instanceof Error ? error.message : 'Erreur lors de la mise en pause');
    } finally {
      setIsPausing(false);
      setShowMenu(false);
    }
  };

  const statusConfig = {
    ACTIVE: {
      label: 'Active',
      color: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
      icon: Play
    },
    PENDING: {
      label: 'En attente',
      color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400',
      icon: Clock
    },
    PAUSED: {
      label: 'En pause',
      color: 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400',
      icon: Pause
    },
    COMPLETED: {
      label: 'Terminée',
      color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400',
      icon: CheckCircle
    },
    REJECTED: {
      label: 'Rejetée',
      color: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400',
      icon: XCircle
    }
  };

  const platformColors = {
    TIKTOK: 'bg-black text-white',
    INSTAGRAM: 'bg-gradient-to-r from-purple-500 to-pink-500 text-white',
    YOUTUBE: 'bg-red-600 text-white'
  };

  const status = statusConfig[campaign.status];
  const StatusIcon = status.icon;
  const budgetUsed = campaign.budget - campaign.remainingBudget;
  const budgetPercentage = (budgetUsed / campaign.budget) * 100;
  const approvalRate = campaign.submissions > 0 
    ? (campaign.approvedSubmissions / campaign.submissions) * 100 
    : 0;

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

  const daysRemaining = Math.ceil(
    (new Date(campaign.endDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
  );

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-lg transition-shadow">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <Link
              href={`/dashboard/advertiser/campaigns/${campaign.id}`}
              className="text-lg font-semibold text-gray-900 dark:text-white hover:text-orange-600 dark:hover:text-orange-400 transition-colors"
            >
              {campaign.title}
            </Link>
            <div className="flex items-center mt-2 space-x-2">
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${status.color}`}>
                <StatusIcon className="h-3 w-3 mr-1" />
                {status.label}
              </span>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${platformColors[campaign.platform]}`}>
                {campaign.platform}
              </span>
            </div>
          </div>
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <MoreVertical className="h-5 w-5 text-gray-400" />
            </button>
            {showMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-700 rounded-md shadow-lg z-10 border border-gray-200 dark:border-gray-600">
                <Link
                  href={`/dashboard/advertiser/campaigns/${campaign.id}`}
                  className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600"
                >
                  Voir les détails
                </Link>
                {campaign.status === 'ACTIVE' && (
                  <>
                    <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600">
                      Augmenter le budget
                    </button>
                    <button
                      onClick={handlePauseCampaign}
                      disabled={isPausing}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isPausing ? 'Mise en pause...' : 'Mettre en pause'}
                    </button>
                  </>
                )}
                {campaign.status === 'PAUSED' && (
                  <Link
                    href={`/dashboard/advertiser/campaigns/${campaign.id}/reactivate`}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600"
                  >
                    Réactiver
                  </Link>
                )}
                <button className="block w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-600">
                  Archiver
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
              <Eye className="h-4 w-4 mr-1" />
              Vues
            </div>
            <p className="text-lg font-semibold text-gray-900 dark:text-white">
              {formatNumber(campaign.totalViews)}
            </p>
          </div>
          <div>
            <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
              <Users className="h-4 w-4 mr-1" />
              Soumissions
            </div>
            <p className="text-lg font-semibold text-gray-900 dark:text-white">
              {campaign.approvedSubmissions}/{campaign.submissions}
            </p>
          </div>
        </div>

        {/* Budget Progress */}
        <div className="mb-4">
          <div className="flex items-center justify-between text-sm mb-1">
            <span className="text-gray-500 dark:text-gray-400">Budget utilisé</span>
            <span className="font-medium text-gray-900 dark:text-white">
              {formatCurrency(budgetUsed)} / {formatCurrency(campaign.budget)}
            </span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div
              className="bg-orange-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${Math.min(budgetPercentage, 100)}%` }}
            />
          </div>
          <div className="flex items-center justify-between mt-1">
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {budgetPercentage.toFixed(0)}% utilisé
            </span>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {formatCurrency(campaign.remainingBudget)} restant
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
            <Calendar className="h-4 w-4 mr-1" />
            {daysRemaining > 0 ? (
              <span>{daysRemaining} jours restants</span>
            ) : (
              <span className="text-red-500">Terminée</span>
            )}
          </div>
          <div className="flex items-center text-sm">
            <TrendingUp className="h-4 w-4 mr-1 text-green-500" />
            <span className="text-gray-900 dark:text-white font-medium">
              {approvalRate.toFixed(0)}% approuvé
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}