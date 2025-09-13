'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Video,
  DollarSign,
  Users,
  Eye,
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Play,
  Pause,
  Ban,
  Edit,
  Trash2,
  Download,
  TrendingUp,
  MessageSquare,
  Flag,
  MoreVertical,
  ExternalLink,
  Copy,
  Share2
} from 'lucide-react';

interface CampaignDetails {
  id: string;
  title: string;
  description: string;
  advertiser: {
    name: string;
    company: string;
    email: string;
    verified: boolean;
    joinDate: Date;
  };
  status: 'pending' | 'active' | 'paused' | 'completed' | 'rejected';
  budget: number;
  spent: number;
  submissions: number;
  views: number;
  clicks: number;
  conversions: number;
  startDate: Date;
  endDate: Date;
  platforms: string[];
  targetAudience: {
    ageRange: string;
    gender: string;
    location: string[];
    interests: string[];
  };
  requirements: string[];
  createdAt: Date;
  updatedAt: Date;
  priority: 'low' | 'medium' | 'high';
  notes: string;
}

export default function AdminCampaignDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const campaignId = params.id as string;
  
  const [campaign, setCampaign] = useState<CampaignDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showActionModal, setShowActionModal] = useState(false);
  const [actionType, setActionType] = useState<'validate' | 'reject' | 'pause' | 'delete'>('validate');
  const [actionReason, setActionReason] = useState('');

  // Mock data
  useEffect(() => {
    const mockCampaign: CampaignDetails = {
      id: campaignId,
      title: 'Campagne Nike Air Max 2024',
      description: 'Promotion de la nouvelle collection Nike Air Max 2024. Nous recherchons des créateurs de contenu passionnés pour créer des vidéos authentiques mettant en avant le confort et le style de nos nouvelles sneakers.',
      advertiser: {
        name: 'John Doe',
        company: 'Nike France',
        email: 'john.doe@nike.fr',
        verified: true,
        joinDate: new Date('2023-01-15')
      },
      status: 'pending',
      budget: 50000,
      spent: 0,
      submissions: 0,
      views: 0,
      clicks: 0,
      conversions: 0,
      startDate: new Date('2024-02-01'),
      endDate: new Date('2024-03-01'),
      platforms: ['TikTok', 'Instagram'],
      targetAudience: {
        ageRange: '18-35',
        gender: 'Tous',
        location: ['France', 'Belgique', 'Suisse'],
        interests: ['Sport', 'Mode', 'Lifestyle', 'Fitness']
      },
      requirements: [
        'Minimum 10K followers',
        'Contenu en français',
        'Vidéo de 30-60 secondes',
        'Mention @nikefrance',
        'Hashtags: #NikeAirMax2024 #JustDoIt'
      ],
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
      updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
      priority: 'high',
      notes: 'Client VIP - Traiter en priorité'
    };

    setTimeout(() => {
      setCampaign(mockCampaign);
      setIsLoading(false);
    }, 500);
  }, [campaignId]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30';
      case 'active':
        return 'text-green-600 bg-green-100 dark:bg-green-900/30';
      case 'paused':
        return 'text-orange-600 bg-orange-100 dark:bg-orange-900/30';
      case 'completed':
        return 'text-blue-600 bg-blue-100 dark:bg-blue-900/30';
      case 'rejected':
        return 'text-red-600 bg-red-100 dark:bg-red-900/30';
      default:
        return 'text-gray-600 bg-gray-100 dark:bg-gray-900/30';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4" />;
      case 'active':
        return <Play className="h-4 w-4" />;
      case 'paused':
        return <Pause className="h-4 w-4" />;
      case 'completed':
        return <CheckCircle className="h-4 w-4" />;
      case 'rejected':
        return <XCircle className="h-4 w-4" />;
      default:
        return <AlertTriangle className="h-4 w-4" />;
    }
  };

  const handleAction = (action: 'validate' | 'reject' | 'pause' | 'delete') => {
    setActionType(action);
    setShowActionModal(true);
  };

  const confirmAction = () => {
    console.log(`Action ${actionType} on campaign:`, campaign?.id, 'Reason:', actionReason);
    // Implémenter l'action
    setShowActionModal(false);
    setActionReason('');
    
    // Simuler le changement de statut
    if (campaign) {
      const newStatus = actionType === 'validate' ? 'active' : 
                       actionType === 'reject' ? 'rejected' :
                       actionType === 'pause' ? 'paused' : campaign.status;
      setCampaign({ ...campaign, status: newStatus });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (!campaign) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Campagne non trouvée
          </h2>
          <button
            onClick={() => router.back()}
            className="text-purple-600 hover:text-purple-700"
          >
            Retour aux campagnes
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
          >
            <ArrowLeft className="h-5 w-5 text-gray-600 dark:text-gray-400" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {campaign.title}
            </h1>
            <div className="flex items-center gap-3 mt-2">
              <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(campaign.status)}`}>
                {getStatusIcon(campaign.status)}
                <span>
                  {campaign.status === 'pending' && 'En attente'}
                  {campaign.status === 'active' && 'Active'}
                  {campaign.status === 'paused' && 'En pause'}
                  {campaign.status === 'completed' && 'Terminée'}
                  {campaign.status === 'rejected' && 'Rejetée'}
                </span>
              </div>
              <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                campaign.priority === 'high' ? 'text-red-600 bg-red-100 dark:bg-red-900/30' :
                campaign.priority === 'medium' ? 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30' :
                'text-blue-600 bg-blue-100 dark:bg-blue-900/30'
              }`}>
                Priorité {campaign.priority === 'high' ? 'haute' : campaign.priority === 'medium' ? 'moyenne' : 'basse'}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {campaign.status === 'pending' && (
            <>
              <button
                onClick={() => handleAction('validate')}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2"
              >
                <CheckCircle className="h-4 w-4" />
                Valider
              </button>
              <button
                onClick={() => handleAction('reject')}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center gap-2"
              >
                <XCircle className="h-4 w-4" />
                Rejeter
              </button>
            </>
          )}
          
          {campaign.status === 'active' && (
            <button
              onClick={() => handleAction('pause')}
              className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 flex items-center gap-2"
            >
              <Pause className="h-4 w-4" />
              Mettre en pause
            </button>
          )}
          
          {campaign.status === 'paused' && (
            <button
              onClick={() => handleAction('validate')}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2"
            >
              <Play className="h-4 w-4" />
              Reprendre
            </button>
          )}
          
          <button className="p-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700">
            <Edit className="h-5 w-5 text-gray-600 dark:text-gray-400" />
          </button>
          
          <button className="p-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700">
            <MoreVertical className="h-5 w-5 text-gray-600 dark:text-gray-400" />
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-500 dark:text-gray-400">Budget</span>
            <DollarSign className="h-4 w-4 text-gray-400" />
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            €{campaign.budget.toLocaleString()}
          </p>
          <div className="mt-2">
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div
                className="bg-purple-600 h-2 rounded-full"
                style={{ width: `${(campaign.spent / campaign.budget) * 100}%` }}
              />
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              €{campaign.spent.toLocaleString()} dépensés
            </p>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-500 dark:text-gray-400">Soumissions</span>
            <Video className="h-4 w-4 text-gray-400" />
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {campaign.submissions}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            0 en attente de validation
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-500 dark:text-gray-400">Vues</span>
            <Eye className="h-4 w-4 text-gray-400" />
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {campaign.views > 1000 ? `${(campaign.views / 1000).toFixed(1)}k` : campaign.views}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            {campaign.clicks} clics
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-500 dark:text-gray-400">Conversions</span>
            <TrendingUp className="h-4 w-4 text-gray-400" />
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {campaign.conversions}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            0% taux de conversion
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Campaign Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Description */}
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Description de la campagne
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              {campaign.description}
            </p>
          </div>

          {/* Requirements */}
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Exigences
            </h2>
            <ul className="space-y-2">
              {campaign.requirements.map((req, index) => (
                <li key={index} className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">{req}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Target Audience */}
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Audience cible
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Âge</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">{campaign.targetAudience.ageRange} ans</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Genre</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">{campaign.targetAudience.gender}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Localisation</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">{campaign.targetAudience.location.join(', ')}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Intérêts</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">{campaign.targetAudience.interests.join(', ')}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Advertiser Info & Actions */}
        <div className="space-y-6">
          {/* Advertiser Info */}
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Informations annonceur
            </h2>
            <div className="space-y-3">
              <div>
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Entreprise</p>
                <div className="flex items-center gap-2 mt-1">
                  <p className="text-sm text-gray-600 dark:text-gray-400">{campaign.advertiser.company}</p>
                  {campaign.advertiser.verified && (
                    <CheckCircle className="h-4 w-4 text-blue-500" />
                  )}
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Contact</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">{campaign.advertiser.name}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">{campaign.advertiser.email}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Membre depuis</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {campaign.advertiser.joinDate.toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>

          {/* Campaign Info */}
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Informations campagne
            </h2>
            <div className="space-y-3">
              <div>
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Plateformes</p>
                <div className="flex gap-2 mt-1">
                  {campaign.platforms.map((platform) => (
                    <span
                      key={platform}
                      className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 rounded"
                    >
                      {platform}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Période</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {campaign.startDate.toLocaleDateString()} - {campaign.endDate.toLocaleDateString()}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Créée le</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {campaign.createdAt.toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Dernière mise à jour</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {campaign.updatedAt.toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          {/* Admin Notes */}
          {campaign.notes && (
            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
              <div className="flex items-start gap-2">
                <AlertTriangle className="h-4 w-4 text-yellow-600 dark:text-yellow-400 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                    Note admin
                  </p>
                  <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-1">
                    {campaign.notes}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Quick Actions */}
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Actions rapides
            </h2>
            <div className="space-y-2">
              <button className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg flex items-center gap-2">
                <MessageSquare className="h-4 w-4" />
                Contacter l'annonceur
              </button>
              <button className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg flex items-center gap-2">
                <Download className="h-4 w-4" />
                Exporter les données
              </button>
              <button className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg flex items-center gap-2">
                <Copy className="h-4 w-4" />
                Dupliquer la campagne
              </button>
              <button className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg flex items-center gap-2">
                <Share2 className="h-4 w-4" />
                Partager
              </button>
              <button
                onClick={() => handleAction('delete')}
                className="w-full px-4 py-2 text-left text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg flex items-center gap-2"
              >
                <Trash2 className="h-4 w-4" />
                Supprimer la campagne
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Action Modal */}
      {showActionModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Confirmer l'action
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Êtes-vous sûr de vouloir {
                actionType === 'validate' ? 'valider' :
                actionType === 'reject' ? 'rejeter' :
                actionType === 'pause' ? 'mettre en pause' :
                'supprimer'
              } cette campagne ?
            </p>
            
            {(actionType === 'reject' || actionType === 'delete') && (
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Raison {actionType === 'reject' ? 'du rejet' : 'de la suppression'}
                </label>
                <textarea
                  value={actionReason}
                  onChange={(e) => setActionReason(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900"
                  rows={3}
                  placeholder="Expliquez la raison..."
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
                  actionType === 'validate' ? 'bg-green-600 hover:bg-green-700' :
                  actionType === 'reject' ? 'bg-red-600 hover:bg-red-700' :
                  actionType === 'pause' ? 'bg-orange-600 hover:bg-orange-700' :
                  'bg-red-600 hover:bg-red-700'
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