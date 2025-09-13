'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  ArrowLeft,
  Calendar,
  DollarSign,
  Users,
  Globe,
  Star,
  CheckCircle,
  AlertCircle,
  Video,
  Eye,
  Heart,
  Share2,
  TrendingUp,
  Clock,
  Target,
  FileText,
  Award,
  BarChart3,
  UserCheck,
  UserX,
  Upload
} from 'lucide-react';

// Mock data - will be replaced with API calls
const mockCampaign = {
  id: '1',
  title: 'Summer Fashion Collection 2024',
  advertiser: {
    name: 'Fashion Brand Co.',
    verified: true,
    rating: 4.8,
    description: 'Leader dans la mode éco-responsable depuis 2010',
    totalCampaigns: 45,
    successRate: 92,
    directives: 'Montrez les vêtements portés dans un contexte naturel. Focus sur les détails et la qualité. Utilisez des transitions créatives. Mentionnez le code promo SUMMER24.',
  },
  description: 'Créez des clips tendance pour notre nouvelle collection été. Montrez votre style unique et votre créativité! Nous recherchons des créateurs passionnés par la mode qui peuvent mettre en valeur nos pièces de manière authentique.',
  longDescription: `
    Notre nouvelle collection été 2024 s'inspire des tendances streetwear et bohème. 
    Nous recherchons des créateurs de contenu capables de :
    - Créer des vidéos engageantes et créatives
    - Montrer les vêtements dans différents contextes
    - Utiliser des transitions tendance
    - Engager avec leur audience de manière authentique
  `,
  requirements: [
    'Minimum 1000 followers actifs',
    'Contenu mode/lifestyle régulier',
    'Public cible 18-35 ans',
    'Qualité vidéo HD minimum',
    'Engagement rate > 3%'
  ],
  deliverables: [
    '1 vidéo TikTok de 15-30 secondes',
    '1 Reel Instagram de 15-30 secondes',
    'Utilisation des hashtags fournis',
    'Mention @fashionbrandco',
    'Code promo SUMMER24 en description'
  ],
  budget: 10000,
  remainingBudget: 7500,
  pricePerClip: 75,
  remunerationPer1000Views: 15,
  bonusPerformance: 25, // Bonus if video exceeds 10k views
  platforms: ['TIKTOK', 'INSTAGRAM_REELS'],
  languages: ['FR', 'EN'],
  countries: ['FR', 'BE', 'CH'],
  startDate: '2024-02-01',
  endDate: '2024-03-01',
  submissionDeadline: '2024-02-25',
  status: 'ACTIVE',
  tags: ['mode', 'été', 'tendance', 'fashion', 'style'],
  thumbnail: 'https://via.placeholder.com/600x400',
  totalViews: 125000,
  totalSubmissions: 45,
  approvedSubmissions: 38,
  averageViews: 3289,
  topPerformingClip: {
    views: 25000,
    likes: 3400,
    clipperName: '@fashionista',
  },
  isSubscribed: false,
  isEligible: true,
  currentClippers: 23,
  maxClippers: 50,
  examples: [
    { url: 'https://tiktok.com/example1', views: 15000, platform: 'TikTok' },
    { url: 'https://instagram.com/example2', views: 12000, platform: 'Instagram' },
    { url: 'https://tiktok.com/example3', views: 18000, platform: 'TikTok' },
  ],
  faq: [
    {
      question: 'Puis-je soumettre plusieurs vidéos?',
      answer: 'Oui, vous pouvez soumettre jusqu\'à 3 vidéos par campagne.'
    },
    {
      question: 'Quand serai-je payé?',
      answer: 'Les paiements sont effectués dans les 7 jours suivant l\'approbation de votre vidéo.'
    },
    {
      question: 'Puis-je modifier ma vidéo après soumission?',
      answer: 'Vous pouvez modifier votre vidéo tant qu\'elle n\'a pas été approuvée.'
    }
  ]
};

const platformIcons: Record<string, string> = {
  TIKTOK: '📱',
  INSTAGRAM_REELS: '📷',
  YOUTUBE_SHORTS: '📹',
};

export default function CampaignDetailsPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [campaign, setCampaign] = useState(mockCampaign);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);

  useEffect(() => {
    // Simulate loading
    setTimeout(() => setLoading(false), 1000);
  }, []);

  const handleJoinCampaign = () => {
    // API call to join campaign
    setCampaign(prev => ({ ...prev, isSubscribed: true, currentClippers: prev.currentClippers + 1 }));
    setShowJoinModal(false);
  };

  const handleWithdrawCampaign = () => {
    // API call to withdraw from campaign
    setCampaign(prev => ({ ...prev, isSubscribed: false, currentClippers: prev.currentClippers - 1 }));
    setShowWithdrawModal(false);
  };

  const handleSubmitVideo = () => {
    router.push('/dashboard/clipper/submissions/new?campaignId=' + campaign.id);
  };

  const daysRemaining = Math.ceil((new Date(campaign.endDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
  const progressPercentage = ((campaign.budget - campaign.remainingBudget) / campaign.budget) * 100;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link
            href="/dashboard/clipper/campaigns"
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <ArrowLeft className="h-5 w-5 text-gray-600 dark:text-gray-400" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {campaign.title}
            </h1>
            <div className="flex items-center gap-3 mt-1">
              <span className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400">
                {campaign.advertiser.verified && <CheckCircle className="h-4 w-4 text-blue-500" />}
                {campaign.advertiser.name}
              </span>
              <span className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400">
                <Star className="h-4 w-4 text-yellow-500 fill-current" />
                {campaign.advertiser.rating}
              </span>
              {campaign.isSubscribed && (
                <span className="px-2 py-0.5 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 text-xs font-medium rounded-full">
                  Souscrite
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          {campaign.isSubscribed ? (
            <>
              <button
                onClick={handleSubmitVideo}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium flex items-center gap-2"
              >
                <Upload className="h-4 w-4" />
                Soumettre une vidéo
              </button>
              <button
                onClick={() => setShowWithdrawModal(true)}
                className="px-4 py-2 border border-red-300 dark:border-red-600 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors font-medium flex items-center gap-2"
              >
                <UserX className="h-4 w-4" />
                Se retirer
              </button>
            </>
          ) : campaign.isEligible ? (
            <button
              onClick={() => setShowJoinModal(true)}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium flex items-center gap-2"
            >
              <UserCheck className="h-4 w-4" />
              Rejoindre
            </button>
          ) : (
            <div className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 rounded-lg">
              Non éligible pour cette campagne
            </div>
          )}
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Pour 1000 vues</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">€{campaign.remunerationPer1000Views}</p>
            </div>
            <Eye className="h-8 w-8 text-blue-600 dark:text-blue-400" />
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Jours restants</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{daysRemaining}</p>
            </div>
            <Clock className="h-8 w-8 text-yellow-600 dark:text-yellow-400" />
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Clippers</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{campaign.currentClippers}/{campaign.maxClippers}</p>
            </div>
            <Users className="h-8 w-8 text-purple-600 dark:text-purple-400" />
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Vues totales</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{(campaign.totalViews / 1000).toFixed(0)}K</p>
            </div>
            <TrendingUp className="h-8 w-8 text-green-600 dark:text-green-400" />
          </div>
        </div>
      </div>

      {/* Budget Progress */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Progression du budget</h2>
          <span className="text-sm text-gray-600 dark:text-gray-400">
            €{(campaign.budget - campaign.remainingBudget).toLocaleString()} / €{campaign.budget.toLocaleString()}
          </span>
        </div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-purple-500 to-purple-600 rounded-full transition-all duration-500"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
        <div className="flex justify-between mt-2 text-xs text-gray-500 dark:text-gray-400">
          <span>{progressPercentage.toFixed(0)}% utilisé</span>
          <span>€{campaign.remainingBudget.toLocaleString()} restants</span>
        </div>
      </div>

      {/* Advertiser Directives - Highlighted */}
      <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-6">
        <div className="flex items-start">
          <AlertCircle className="h-5 w-5 text-yellow-600 dark:text-yellow-400 mt-0.5 mr-3 flex-shrink-0" />
          <div>
            <h3 className="text-lg font-semibold text-yellow-800 dark:text-yellow-200 mb-2">
              Directives importantes de l'annonceur
            </h3>
            <p className="text-sm text-yellow-700 dark:text-yellow-300">
              {campaign.advertiser.directives}
            </p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="flex space-x-8 px-6" aria-label="Tabs">
            {['overview', 'requirements', 'examples', 'faq'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab
                    ? 'border-purple-600 text-purple-600 dark:text-purple-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              >
                {tab === 'overview' && 'Vue d\'ensemble'}
                {tab === 'requirements' && 'Exigences'}
                {tab === 'examples' && 'Exemples'}
                {tab === 'faq' && 'FAQ'}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Description de la campagne</h3>
                <p className="text-gray-600 dark:text-gray-400 whitespace-pre-line">
                  {campaign.longDescription}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white mb-3">Plateformes</h4>
                  <div className="flex flex-wrap gap-2">
                    {campaign.platforms.map((platform) => (
                      <span
                        key={platform}
                        className="inline-flex items-center gap-1 px-3 py-1.5 bg-gray-100 dark:bg-gray-700 rounded-lg text-sm"
                      >
                        <span className="text-lg">{platformIcons[platform]}</span>
                        <span>{platform.replace('_', ' ')}</span>
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white mb-3">Pays ciblés</h4>
                  <div className="flex flex-wrap gap-2">
                    {campaign.countries.map((country) => (
                      <span
                        key={country}
                        className="inline-flex items-center gap-1 px-3 py-1.5 bg-gray-100 dark:bg-gray-700 rounded-lg text-sm"
                      >
                        <Globe className="h-4 w-4" />
                        <span>{country}</span>
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-3">Tags</h4>
                <div className="flex flex-wrap gap-2">
                  {campaign.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1.5 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-lg text-sm"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <div className="text-center">
                  <p className="text-sm text-gray-600 dark:text-gray-400">Soumissions approuvées</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                    {campaign.approvedSubmissions}/{campaign.totalSubmissions}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-600 dark:text-gray-400">Vues moyennes</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                    {campaign.averageViews.toLocaleString()}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-600 dark:text-gray-400">Top performance</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                    {campaign.topPerformingClip.views.toLocaleString()} vues
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Requirements Tab */}
          {activeTab === 'requirements' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Critères d'éligibilité</h3>
                <ul className="space-y-3">
                  {campaign.requirements.map((req, index) => (
                    <li key={index} className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" />
                      <span className="text-gray-600 dark:text-gray-400">{req}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Livrables attendus</h3>
                <ul className="space-y-3">
                  {campaign.deliverables.map((deliverable, index) => (
                    <li key={index} className="flex items-start">
                      <Target className="h-5 w-5 text-purple-500 mt-0.5 mr-3 flex-shrink-0" />
                      <span className="text-gray-600 dark:text-gray-400">{deliverable}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
                <h4 className="font-medium text-green-800 dark:text-green-400 mb-2">Bonus de performance</h4>
                <p className="text-sm text-green-700 dark:text-green-300">
                  Gagnez €{campaign.bonusPerformance} supplémentaires si votre vidéo dépasse 10 000 vues dans les 7 premiers jours!
                </p>
              </div>
            </div>
          )}

          {/* Examples Tab */}
          {activeTab === 'examples' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Exemples de clips réussis</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {campaign.examples.map((example, index) => (
                  <div key={index} className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                    <div className="aspect-[9/16] bg-gray-200 dark:bg-gray-600 rounded-lg mb-3"></div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">{example.platform}</span>
                      <span className="font-medium text-gray-900 dark:text-white">
                        {(example.views / 1000).toFixed(0)}K vues
                      </span>
                    </div>
                    <a
                      href={example.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-2 block text-center px-3 py-1.5 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-lg hover:bg-purple-200 dark:hover:bg-purple-900/50 transition-colors text-sm"
                    >
                      Voir l'exemple
                    </a>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* FAQ Tab */}
          {activeTab === 'faq' && (
            <div className="space-y-4">
              {campaign.faq.map((item, index) => (
                <div key={index} className="border-b border-gray-200 dark:border-gray-700 pb-4 last:border-0">
                  <h4 className="font-medium text-gray-900 dark:text-white mb-2">{item.question}</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{item.answer}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Join Modal */}
      {showJoinModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Rejoindre la campagne
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              En rejoignant cette campagne, vous vous engagez à respecter les directives de l'annonceur et à soumettre du contenu de qualité.
            </p>
            <div className="flex gap-3">
              <button
                onClick={handleJoinCampaign}
                className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                Confirmer
              </button>
              <button
                onClick={() => setShowJoinModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Withdraw Modal */}
      {showWithdrawModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Se retirer de la campagne
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Êtes-vous sûr de vouloir vous retirer de cette campagne? Vous pourrez la rejoindre à nouveau plus tard si des places sont disponibles.
            </p>
            <div className="flex gap-3">
              <button
                onClick={handleWithdrawCampaign}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Se retirer
              </button>
              <button
                onClick={() => setShowWithdrawModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}