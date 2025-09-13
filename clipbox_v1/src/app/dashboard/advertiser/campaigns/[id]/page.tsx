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

  useEffect(() => {
    fetchCampaignData();
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

  const filterSubmissions = () => {
    let filtered = [...submissions];
    if (statusFilter !== 'ALL') {
      filtered = filtered.filter(s => s.status === statusFilter);
    }
    setFilteredSubmissions(filtered);
  };

  const handleApproveSubmission = async (submissionId: string) => {
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 500));
      setSubmissions(submissions.map(s => 
        s.id === submissionId ? { ...s, status: 'APPROVED' as const } : s
      ));
      setShowReviewModal(false);
      setSelectedSubmission(null);
    } catch (error) {
      console.error('Error approving submission:', error);
    }
  };

  const handleRejectSubmission = async (submissionId: string) => {
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 500));
      setSubmissions(submissions.map(s => 
        s.id === submissionId ? { ...s, status: 'REJECTED' as const, reviewNote } : s
      ));
      setShowReviewModal(false);
      setSelectedSubmission(null);
      setReviewNote('');
    } catch (error) {
      console.error('Error rejecting submission:', error);
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
                const newBudget = prompt('Nouveau budget (€):', campaign.budget.toString());
                if (newBudget && !isNaN(Number(newBudget)) && Number(newBudget) > campaign.budget) {
                  const increase = Number(newBudget) - campaign.budget;
                  setCampaign({
                    ...campaign,
                    budget: Number(newBudget),
                    remainingBudget: campaign.remainingBudget + increase
                  });
                  alert(`Budget augmenté de €${increase} avec succès!`);
                }
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

      {/* Review Modal */}
      {showReviewModal && selectedSubmission && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4">
            <div className="fixed inset-0 bg-black opacity-50" onClick={() => setShowReviewModal(false)}></div>
            <div className="relative bg-white dark:bg-gray-800 rounded-lg max-w-md w-full p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Rejeter la soumission
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                Vous êtes sur le point de rejeter la soumission de {selectedSubmission.clipperName}.
                Veuillez indiquer la raison du rejet.
              </p>
              <textarea
                value={reviewNote}
                onChange={(e) => setReviewNote(e.target.value)}
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="Raison du rejet..."
              />
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => setShowReviewModal(false)}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  Annuler
                </button>
                <button
                  onClick={() => handleRejectSubmission(selectedSubmission.id)}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  Confirmer le rejet
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}