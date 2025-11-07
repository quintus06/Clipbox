'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  Eye,
  Users,
  DollarSign,
  Calendar,
  Play,
  Pause,
  CheckCircle,
  XCircle,
  Clock,
  TrendingUp,
  Download,
  Filter,
  ThumbsUp,
  ThumbsDown,
  ExternalLink,
  AlertCircle
} from 'lucide-react';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface Submission {
  id: string;
  clipperId: string;
  clipperName: string;
  clipperAvatar?: string;
  platform: 'TIKTOK' | 'INSTAGRAM' | 'YOUTUBE';
  clipUrl: string;
  submittedAt: Date;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  views: number;
  likes: number;
  shares: number;
  watchTime: number;
  amountEarned: number;
  reviewNote?: string;
}

interface Campaign {
  id: string;
  title: string;
  description: string;
  requirements: string;
  videoUrl: string;
  status: 'ACTIVE' | 'PENDING' | 'PAUSED' | 'COMPLETED';
  budget: number;
  remainingBudget: number;
  paymentRatio: number;
  platform: 'TIKTOK' | 'INSTAGRAM' | 'YOUTUBE';
  targetCountries: string[];
  targetLanguages: string[];
  minFollowers: number;
  startDate: Date;
  endDate: Date;
  totalViews: number;
  totalLikes: number;
  totalShares: number;
  totalSubmissions: number;
  approvedSubmissions: number;
  rejectedSubmissions: number;
}

interface Balance {
  available: number;
  pending: number;
  withdrawn: number;
}

// Mock data
const mockCampaign: Campaign = {
  id: '1',
  title: 'Lancement Produit Tech 2025',
  description: 'Campagne de promotion pour notre nouveau produit tech innovant',
  requirements: 'Mentionner les 3 fonctionnalités principales, utiliser #TechInnovation2025',
  videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
  status: 'ACTIVE',
  budget: 2000,
  remainingBudget: 1200,
  paymentRatio: 70,
  platform: 'TIKTOK',
  targetCountries: ['FR', 'BE', 'CH'],
  targetLanguages: ['fr'],
  minFollowers: 1000,
  startDate: new Date('2025-01-01'),
  endDate: new Date('2025-03-15'),
  totalViews: 125000,
  totalLikes: 8500,
  totalShares: 1200,
  totalSubmissions: 45,
  approvedSubmissions: 38,
  rejectedSubmissions: 7
};

const mockSubmissions: Submission[] = [
  {
    id: '1',
    clipperId: 'c1',
    clipperName: 'Marie Dubois',
    platform: 'TIKTOK',
    clipUrl: 'https://tiktok.com/@marie/video/123',
    submittedAt: new Date('2025-01-05'),
    status: 'APPROVED',
    views: 15000,
    likes: 1200,
    shares: 150,
    watchTime: 45,
    amountEarned: 25
  },
  {
    id: '2',
    clipperId: 'c2',
    clipperName: 'Jean Martin',
    platform: 'TIKTOK',
    clipUrl: 'https://tiktok.com/@jean/video/456',
    submittedAt: new Date('2025-01-06'),
    status: 'PENDING',
    views: 8000,
    likes: 650,
    shares: 80,
    watchTime: 38,
    amountEarned: 0
  },
  {
    id: '3',
    clipperId: 'c3',
    clipperName: 'Sophie Laurent',
    platform: 'TIKTOK',
    clipUrl: 'https://tiktok.com/@sophie/video/789',
    submittedAt: new Date('2025-01-07'),
    status: 'REJECTED',
    views: 2000,
    likes: 150,
    shares: 20,
    watchTime: 15,
    amountEarned: 0,
    reviewNote: 'Ne respecte pas les requirements de la campagne'
  }
];

const performanceData = [
  { date: '01/01', vues: 5000, soumissions: 5 },
  { date: '02/01', vues: 12000, soumissions: 8 },
  { date: '03/01', vues: 18000, soumissions: 12 },
  { date: '04/01', vues: 25000, soumissions: 15 },
  { date: '05/01', vues: 35000, soumissions: 20 },
  { date: '06/01', vues: 48000, soumissions: 25 },
  { date: '07/01', vues: 62000, soumissions: 30 },
];

export default function CampaignDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [campaign, setCampaign] = useState<Campaign>(mockCampaign);
  const [submissions, setSubmissions] = useState<Submission[]>(mockSubmissions);
  const [filteredSubmissions, setFilteredSubmissions] = useState<Submission[]>(mockSubmissions);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewNote, setReviewNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationError, setValidationError] = useState('');
  const [balance, setBalance] = useState<Balance | null>(null);
  const [showBudgetModal, setShowBudgetModal] = useState(false);
  const [newBudget, setNewBudget] = useState('');
  const [budgetError, setBudgetError] = useState('');

  useEffect(() => {
    fetchCampaignData();
    fetchBalance();
  }, [params.id]);

  useEffect(() => {
    filterSubmissions();
  }, [statusFilter, submissions]);

  const fetchCampaignData = async () => {
    setIsLoading(true);
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      // const response = await fetch(`/api/advertiser/campaigns/${params.id}`);
      // const data = await response.json();
      // setCampaign(data.campaign);
      // setSubmissions(data.submissions);
    } catch (error) {
      console.error('Error fetching campaign data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchBalance = async () => {
    try {
      const response = await fetch('/api/advertiser/balance');
      if (response.ok) {
        const data = await response.json();
        setBalance(data.balance);
      }
    } catch (error) {
      console.error('Error fetching balance:', error);
    }
  };

  const filterSubmissions = () => {
    let filtered = [...submissions];
    if (statusFilter !== 'ALL') {
      filtered = filtered.filter(s => s.status === statusFilter);
    }
    setFilteredSubmissions(filtered);
  };

  const handleIncreaseBudget = async () => {
    // Reset errors
    setBudgetError('');
    
    // Validate input
    const budgetValue = parseFloat(newBudget);
    if (isNaN(budgetValue) || budgetValue <= 0) {
      setBudgetError('Veuillez entrer un montant valide');
      return;
    }

    if (budgetValue <= campaign.budget) {
      setBudgetError('Le nouveau budget doit être supérieur au budget actuel');
      return;
    }

    const budgetIncrease = budgetValue - campaign.budget;

    // Check balance
    if (!balance || balance.available < budgetIncrease) {
      const shortfall = budgetIncrease - (balance?.available || 0);
      setBudgetError(
        `Fonds insuffisants. Votre solde actuel est de ${(balance?.available || 0).toFixed(2)}€. ` +
        `Vous avez besoin de ${budgetIncrease.toFixed(2)}€ supplémentaires. ` +
        `Il vous manque ${shortfall.toFixed(2)}€. Veuillez recharger votre compte.`
      );
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch(`/api/advertiser/campaigns/${params.id}/increase-budget`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ newBudget: budgetValue })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || data.error || 'Erreur lors de l\'augmentation du budget');
      }

      // Update local state
      setCampaign({
        ...campaign,
        budget: budgetValue,
        remainingBudget: campaign.remainingBudget + budgetIncrease
      });

      // Update balance
      if (balance) {
        setBalance({
          ...balance,
          available: balance.available - budgetIncrease,
          pending: balance.pending + budgetIncrease
        });
      }

      // Close modal and show success
      setShowBudgetModal(false);
      setNewBudget('');
      alert(data.message || `Budget augmenté de ${budgetIncrease.toFixed(2)}€ avec succès!`);
    } catch (error) {
      console.error('Error increasing budget:', error);
      setBudgetError(error instanceof Error ? error.message : 'Erreur lors de l\'augmentation du budget');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleApproveSubmission = async (submissionId: string) => {
    if (!confirm('Êtes-vous sûr de vouloir approuver cette soumission ?')) {
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch(`/api/advertiser/submissions/${submissionId}/approve`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' }
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to approve submission');
      }
      
      // Update local state
      setSubmissions(submissions.map(s =>
        s.id === submissionId ? { ...s, status: 'APPROVED' as const } : s
      ));
      
      // Show success message
      alert(data.message || 'Soumission approuvée avec succès !');
    } catch (error) {
      console.error('Error approving submission:', error);
      alert(error instanceof Error ? error.message : 'Erreur lors de l\'approbation de la soumission. Veuillez réessayer.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRejectSubmission = async (submissionId: string) => {
    // Validate rejection reason
    if (!reviewNote.trim()) {
      setValidationError('Le motif du rejet est obligatoire');
      return;
    }
    
    if (reviewNote.trim().length < 10) {
      setValidationError('Le motif doit contenir au moins 10 caractères');
      return;
    }

    setIsSubmitting(true);
    setValidationError('');
    
    try {
      const response = await fetch(`/api/advertiser/submissions/${submissionId}/reject`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reviewerNotes: reviewNote })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to reject submission');
      }
      
      // Update local state
      setSubmissions(submissions.map(s =>
        s.id === submissionId ? { ...s, status: 'REJECTED' as const, reviewNote } : s
      ));
      
      setShowReviewModal(false);
      setSelectedSubmission(null);
      setReviewNote('');
      
      // Show success message
      alert(data.message || 'Soumission rejetée avec succès.');
    } catch (error) {
      console.error('Error rejecting submission:', error);
      alert(error instanceof Error ? error.message : 'Erreur lors du rejet de la soumission. Veuillez réessayer.');
    } finally {
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

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('fr-FR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    }).format(date);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'APPROVED':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'REJECTED':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <Link
          href="/dashboard/advertiser/campaigns"
          className="inline-flex items-center text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Retour aux campagnes
        </Link>
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {campaign.title}
            </h1>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {campaign.description}
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => {
                // Export campaign data
                const exportData = {
                  campaign: {
                    ...campaign,
                    submissions: filteredSubmissions
                  },
                  exportDate: new Date().toISOString()
                };
                const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `campaign-${campaign.id}-${new Date().toISOString().split('T')[0]}.json`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
              }}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              <Download className="h-5 w-5" />
            </button>
            <button
              onClick={() => {
                setShowBudgetModal(true);
                setNewBudget(campaign.budget.toString());
                setBudgetError('');
              }}
              className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
            >
              Augmenter le budget
            </button>
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Budget restant</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {formatCurrency(campaign.remainingBudget)}
              </p>
            </div>
            <DollarSign className="h-8 w-8 text-orange-500" />
          </div>
          <div className="mt-2">
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div
                className="bg-orange-500 h-2 rounded-full"
                style={{ width: `${((campaign.budget - campaign.remainingBudget) / campaign.budget) * 100}%` }}
              />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Vues totales</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {formatNumber(campaign.totalViews)}
              </p>
            </div>
            <Eye className="h-8 w-8 text-blue-500" />
          </div>
          <p className="mt-2 text-xs text-green-600 dark:text-green-400">
            +23% cette semaine
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Soumissions</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {campaign.totalSubmissions}
              </p>
            </div>
            <Users className="h-8 w-8 text-green-500" />
          </div>
          <div className="mt-2 flex items-center text-xs">
            <span className="text-green-600 dark:text-green-400">
              {campaign.approvedSubmissions} approuvées
            </span>
            <span className="mx-1 text-gray-400">•</span>
            <span className="text-red-600 dark:text-red-400">
              {campaign.rejectedSubmissions} rejetées
            </span>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Jours restants</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {Math.ceil((campaign.endDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))}
              </p>
            </div>
            <Calendar className="h-8 w-8 text-purple-500" />
          </div>
          <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
            Fin le {formatDate(campaign.endDate)}
          </p>
        </div>
      </div>

      {/* Performance Chart */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Performance de la campagne
        </h2>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={performanceData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="date" stroke="#6b7280" />
            <YAxis stroke="#6b7280" />
            <Tooltip
              contentStyle={{
                backgroundColor: '#1f2937',
                border: 'none',
                borderRadius: '8px',
                color: '#fff'
              }}
            />
            <Area
              type="monotone"
              dataKey="vues"
              stroke="#3b82f6"
              fill="#3b82f6"
              fillOpacity={0.6}
            />
            <Area
              type="monotone"
              dataKey="soumissions"
              stroke="#10b981"
              fill="#10b981"
              fillOpacity={0.6}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Metrics Based on Subscription */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Métriques avancées
          </h2>
          <span className="text-xs px-2 py-1 bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400 rounded-full">
            Plan Premium
          </span>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600 dark:text-gray-400">Taux d'engagement</span>
              <TrendingUp className="h-4 w-4 text-green-500" />
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">6.8%</p>
            <p className="text-xs text-green-600 dark:text-green-400 mt-1">+1.2% vs mois dernier</p>
          </div>
          
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600 dark:text-gray-400">Conversions</span>
              <CheckCircle className="h-4 w-4 text-blue-500" />
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">342</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">3.2% taux de conversion</p>
          </div>
          
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600 dark:text-gray-400">ROI estimé</span>
              <DollarSign className="h-4 w-4 text-orange-500" />
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">2.4x</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Retour sur investissement</p>
          </div>
        </div>

        <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
          <div className="flex items-start">
            <AlertCircle className="h-4 w-4 text-blue-600 dark:text-blue-400 mt-0.5" />
            <p className="ml-2 text-xs text-blue-800 dark:text-blue-200">
              Ces métriques avancées sont disponibles avec votre abonnement Premium.
              Les données sont mises à jour toutes les heures.
            </p>
          </div>
        </div>
      </div>

      {/* Submissions Section with Enhanced Display */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Soumissions des clippers
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Gérez et examinez les vidéos soumises pour cette campagne
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="ALL">Toutes</option>
              <option value="PENDING">En attente</option>
              <option value="APPROVED">Approuvées</option>
              <option value="REJECTED">Rejetées</option>
            </select>
          </div>
        </div>

        {/* Submissions Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 border-l-4 border-green-500">
            <p className="text-sm text-gray-600 dark:text-gray-400">Approuvées</p>
            <p className="text-2xl font-bold text-green-600 dark:text-green-400">
              {campaign.approvedSubmissions}
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 border-l-4 border-yellow-500">
            <p className="text-sm text-gray-600 dark:text-gray-400">En attente</p>
            <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
              {submissions.filter(s => s.status === 'PENDING').length}
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 border-l-4 border-red-500">
            <p className="text-sm text-gray-600 dark:text-gray-400">Rejetées</p>
            <p className="text-2xl font-bold text-red-600 dark:text-red-400">
              {campaign.rejectedSubmissions}
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 border-l-4 border-blue-500">
            <p className="text-sm text-gray-600 dark:text-gray-400">Total</p>
            <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {campaign.totalSubmissions}
            </p>
          </div>
        </div>

        {/* Submissions List */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
          {filteredSubmissions.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Clipper
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Date de soumission
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Métriques
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Statut
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Lien vidéo
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Montant
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {filteredSubmissions.map((submission) => (
                    <tr key={submission.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-10 w-10 rounded-full bg-gradient-to-r from-orange-400 to-pink-500 flex items-center justify-center">
                            <span className="text-sm font-medium text-white">
                              {submission.clipperName.split(' ').map(n => n[0]).join('')}
                            </span>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900 dark:text-white">
                              {submission.clipperName}
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">
                              @{submission.clipperName.toLowerCase().replace(' ', '_')}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 dark:text-white">
                          {formatDate(submission.submittedAt)}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {new Date(submission.submittedAt).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 dark:text-white">
                          <div className="flex flex-col space-y-1">
                            <span className="flex items-center">
                              <Eye className="h-3 w-3 mr-1 text-gray-400" />
                              {formatNumber(submission.views)}
                            </span>
                            <span className="flex items-center">
                              <ThumbsUp className="h-3 w-3 mr-1 text-gray-400" />
                              {formatNumber(submission.likes)}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(submission.status)}`}>
                          {submission.status === 'APPROVED' && <CheckCircle className="h-3 w-3 mr-1" />}
                          {submission.status === 'PENDING' && <Clock className="h-3 w-3 mr-1" />}
                          {submission.status === 'REJECTED' && <XCircle className="h-3 w-3 mr-1" />}
                          {submission.status === 'APPROVED' && 'Approuvée'}
                          {submission.status === 'PENDING' && 'En attente'}
                          {submission.status === 'REJECTED' && 'Rejetée'}
                        </span>
                        {submission.reviewNote && (
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            {submission.reviewNote}
                          </p>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <a
                          href={submission.clipUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center text-sm text-orange-600 dark:text-orange-400 hover:text-orange-700 dark:hover:text-orange-300"
                        >
                          <span className="mr-1">{submission.platform}</span>
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900 dark:text-white">
                        {submission.status === 'APPROVED' ? formatCurrency(submission.amountEarned) : '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {submission.status === 'PENDING' ? (
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => handleApproveSubmission(submission.id)}
                              className="inline-flex items-center px-3 py-1.5 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors"
                              title="Approuver cette soumission"
                            >
                              <ThumbsUp className="h-4 w-4 mr-1" />
                              Approuver
                            </button>
                            <button
                              onClick={() => {
                                setSelectedSubmission(submission);
                                setShowReviewModal(true);
                              }}
                              className="inline-flex items-center px-3 py-1.5 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-colors"
                              title="Rejeter cette soumission"
                            >
                              <ThumbsDown className="h-4 w-4 mr-1" />
                              Rejeter
                            </button>
                          </div>
                        ) : (
                          <span className="text-sm text-gray-400 dark:text-gray-500">-</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12">
              <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                Aucune soumission trouvée
              </h3>
              <p className="text-gray-500 dark:text-gray-400">
                {statusFilter !== 'ALL'
                  ? "Essayez de modifier vos filtres"
                  : "Les clippers n'ont pas encore soumis de vidéos pour cette campagne"}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Rejection Modal */}
      {showReviewModal && selectedSubmission && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20">
            <div
              className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
              onClick={() => {
                if (!isSubmitting) {
                  setShowReviewModal(false);
                  setReviewNote('');
                  setValidationError('');
                  setSelectedSubmission(null);
                }
              }}
            ></div>
            
            <div className="relative bg-white dark:bg-gray-800 rounded-lg max-w-lg w-full p-6 shadow-xl">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Rejeter la soumission
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    Soumission de {selectedSubmission.clipperName}
                  </p>
                </div>
                <button
                  onClick={() => {
                    if (!isSubmitting) {
                      setShowReviewModal(false);
                      setReviewNote('');
                      setValidationError('');
                      setSelectedSubmission(null);
                    }
                  }}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  disabled={isSubmitting}
                >
                  <XCircle className="h-6 w-6" />
                </button>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Motif du rejet <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={reviewNote}
                  onChange={(e) => {
                    setReviewNote(e.target.value);
                    setValidationError('');
                  }}
                  rows={5}
                  className={`w-full px-4 py-3 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                    validationError
                      ? 'border-red-500 dark:border-red-500'
                      : 'border-gray-300 dark:border-gray-600'
                  }`}
                  placeholder="Veuillez expliquer pourquoi cette soumission est rejetée... (minimum 10 caractères)"
                  disabled={isSubmitting}
                />
                {validationError && (
                  <p className="mt-2 text-sm text-red-600 dark:text-red-400 flex items-center">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    {validationError}
                  </p>
                )}
                <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                  {reviewNote.length} caractères (minimum 10 requis)
                </p>
              </div>

              <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-3 mb-6">
                <div className="flex items-start">
                  <AlertCircle className="h-5 w-5 text-yellow-600 dark:text-yellow-400 mt-0.5 mr-2 flex-shrink-0" />
                  <p className="text-sm text-yellow-800 dark:text-yellow-200">
                    Le clipper sera notifié du rejet et pourra voir votre motif. Soyez constructif et précis.
                  </p>
                </div>
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => {
                    setShowReviewModal(false);
                    setReviewNote('');
                    setValidationError('');
                    setSelectedSubmission(null);
                  }}
                  className="px-5 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 font-medium transition-colors"
                  disabled={isSubmitting}
                >
                  Annuler
                </button>
                <button
                  onClick={() => handleRejectSubmission(selectedSubmission.id)}
                  className="px-5 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Traitement...
                    </>
                  ) : (
                    <>
                      <XCircle className="h-4 w-4 mr-2" />
                      Confirmer le rejet
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Budget Increase Modal */}
      {showBudgetModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20">
            <div
              className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
              onClick={() => {
                if (!isSubmitting) {
                  setShowBudgetModal(false);
                  setNewBudget('');
                  setBudgetError('');
                }
              }}
            ></div>
            
            <div className="relative bg-white dark:bg-gray-800 rounded-lg max-w-lg w-full p-6 shadow-xl">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Augmenter le budget de la campagne
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    {campaign.title}
                  </p>
                </div>
                <button
                  onClick={() => {
                    if (!isSubmitting) {
                      setShowBudgetModal(false);
                      setNewBudget('');
                      setBudgetError('');
                    }
                  }}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  disabled={isSubmitting}
                >
                  <XCircle className="h-6 w-6" />
                </button>
              </div>

              {/* Current Budget Info */}
              <div className="mb-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Budget actuel</p>
                    <p className="text-lg font-semibold text-gray-900 dark:text-white">
                      {formatCurrency(campaign.budget)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Solde disponible</p>
                    <p className="text-lg font-semibold text-green-600 dark:text-green-400">
                      {balance ? formatCurrency(balance.available) : '...'}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Nouveau budget <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={newBudget}
                    onChange={(e) => {
                      setNewBudget(e.target.value);
                      setBudgetError('');
                    }}
                    min={campaign.budget + 1}
                    step="0.01"
                    className={`w-full px-4 py-3 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                      budgetError
                        ? 'border-red-500 dark:border-red-500'
                        : 'border-gray-300 dark:border-gray-600'
                    }`}
                    placeholder="Entrez le nouveau budget"
                    disabled={isSubmitting}
                  />
                  <span className="absolute right-4 top-3 text-gray-500 dark:text-gray-400">€</span>
                </div>
                {budgetError && (
                  <div className="mt-2 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                    <p className="text-sm text-red-600 dark:text-red-400 flex items-start">
                      <AlertCircle className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" />
                      <span>{budgetError}</span>
                    </p>
                  </div>
                )}
                {newBudget && !budgetError && parseFloat(newBudget) > campaign.budget && (
                  <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                    Augmentation: <span className="font-semibold text-orange-600 dark:text-orange-400">
                      +{formatCurrency(parseFloat(newBudget) - campaign.budget)}
                    </span>
                  </p>
                )}
              </div>

              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3 mb-6">
                <div className="flex items-start">
                  <AlertCircle className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5 mr-2 flex-shrink-0" />
                  <div className="text-sm text-blue-800 dark:text-blue-200">
                    <p className="font-medium mb-1">Important :</p>
                    <ul className="list-disc list-inside space-y-1 text-xs">
                      <li>Le montant sera déduit de votre solde disponible</li>
                      <li>Le budget ne peut être que augmenté, pas diminué</li>
                      <li>L'augmentation sera immédiatement disponible pour la campagne</li>
                    </ul>
                  </div>
                </div>
              </div>

              {balance && balance.available < 100 && (
                <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-3 mb-4">
                  <div className="flex items-start">
                    <AlertCircle className="h-5 w-5 text-yellow-600 dark:text-yellow-400 mt-0.5 mr-2 flex-shrink-0" />
                    <p className="text-sm text-yellow-800 dark:text-yellow-200">
                      Votre solde est faible. Pensez à{' '}
                      <Link href="/dashboard/advertiser/balance" className="underline font-medium">
                        recharger votre compte
                      </Link>
                      .
                    </p>
                  </div>
                </div>
              )}

              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => {
                    setShowBudgetModal(false);
                    setNewBudget('');
                    setBudgetError('');
                  }}
                  className="px-5 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 font-medium transition-colors"
                  disabled={isSubmitting}
                >
                  Annuler
                </button>
                <button
                  onClick={handleIncreaseBudget}
                  className="px-5 py-2.5 bg-orange-600 text-white rounded-lg hover:bg-orange-700 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Traitement...
                    </>
                  ) : (
                    <>
                      <DollarSign className="h-4 w-4 mr-2" />
                      Confirmer l'augmentation
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}