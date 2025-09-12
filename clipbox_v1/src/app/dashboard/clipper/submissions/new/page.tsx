'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { 
  ArrowLeft,
  ArrowRight,
  Check,
  Upload,
  Video,
  Users,
  Calendar,
  DollarSign,
  Eye,
  Heart,
  MessageSquare,
  Share2,
  Clock,
  AlertCircle,
  CheckCircle,
  Instagram,
  Youtube,
  Smartphone,
  ExternalLink,
  Plus,
  X
} from 'lucide-react';

// Mock data - will be replaced with API calls
const mockJoinedCampaigns = [
  {
    id: '1',
    title: 'Summer Fashion Collection 2024',
    advertiser: 'Fashion Brand Co.',
    pricePerClip: 75,
    remunerationPer1000Views: 15,
    platforms: ['TIKTOK', 'INSTAGRAM_REELS'],
    endDate: '2024-03-01',
    thumbnail: 'https://via.placeholder.com/150',
    directives: 'Montrez les vêtements portés dans un contexte naturel. Focus sur les détails et la qualité.',
  },
  {
    id: '2',
    title: 'Tech Review - Smartphone Pro Max',
    advertiser: 'TechCorp',
    pricePerClip: 100,
    remunerationPer1000Views: 20,
    platforms: ['YOUTUBE_SHORTS', 'TIKTOK'],
    endDate: '2024-02-25',
    thumbnail: 'https://via.placeholder.com/150',
    directives: 'Unboxing obligatoire. Testez la caméra en conditions réelles.',
  },
  {
    id: '4',
    title: 'Beauty Tutorial - Maquillage Naturel',
    advertiser: 'Beauty Essentials',
    pricePerClip: 60,
    remunerationPer1000Views: 12,
    platforms: ['INSTAGRAM_REELS', 'YOUTUBE_SHORTS'],
    endDate: '2024-03-15',
    thumbnail: 'https://via.placeholder.com/150',
    directives: 'Tutoriel étape par étape. Lumière naturelle préférée.',
  },
];

const mockAccounts = [
  {
    id: '1',
    platform: 'TIKTOK',
    username: '@fashionista_paris',
    followers: 15420,
    verified: true,
    profilePic: 'https://via.placeholder.com/100',
    engagementRate: 4.2,
  },
  {
    id: '2',
    platform: 'INSTAGRAM',
    username: '@style_influencer',
    followers: 8930,
    verified: false,
    profilePic: 'https://via.placeholder.com/100',
    engagementRate: 3.8,
  },
  {
    id: '3',
    platform: 'YOUTUBE',
    username: 'TechReviewer',
    followers: 25600,
    verified: true,
    profilePic: 'https://via.placeholder.com/100',
    engagementRate: 5.1,
  },
];

const mockRecentVideos = [
  {
    id: '1',
    title: 'Summer Outfit Ideas 2024',
    platform: 'TIKTOK',
    url: 'https://tiktok.com/@user/video/123',
    thumbnail: 'https://via.placeholder.com/200x300',
    views: 12500,
    likes: 890,
    comments: 45,
    shares: 23,
    publishedAt: '2024-01-28T10:30:00',
    duration: '0:28',
  },
  {
    id: '2',
    title: 'Get Ready With Me - Date Night',
    platform: 'INSTAGRAM_REELS',
    url: 'https://instagram.com/reel/abc123',
    thumbnail: 'https://via.placeholder.com/200x300',
    views: 8900,
    likes: 567,
    comments: 34,
    shares: 12,
    publishedAt: '2024-01-27T15:45:00',
    duration: '0:45',
  },
  {
    id: '3',
    title: 'Tech Unboxing - New Gadgets',
    platform: 'YOUTUBE_SHORTS',
    url: 'https://youtube.com/shorts/xyz789',
    thumbnail: 'https://via.placeholder.com/200x300',
    views: 5600,
    likes: 234,
    comments: 18,
    shares: 8,
    publishedAt: '2024-01-26T12:00:00',
    duration: '0:59',
  },
  {
    id: '4',
    title: 'Makeup Tutorial - Natural Look',
    platform: 'TIKTOK',
    url: 'https://tiktok.com/@user/video/456',
    thumbnail: 'https://via.placeholder.com/200x300',
    views: 18900,
    likes: 1234,
    comments: 67,
    shares: 45,
    publishedAt: '2024-01-25T09:15:00',
    duration: '0:32',
  },
];

const platformIcons: Record<string, any> = {
  TIKTOK: Smartphone,
  INSTAGRAM: Instagram,
  INSTAGRAM_REELS: Instagram,
  YOUTUBE: Youtube,
  YOUTUBE_SHORTS: Youtube,
};

export default function NewSubmissionPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const preselectedCampaignId = searchParams.get('campaignId');
  
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedCampaign, setSelectedCampaign] = useState<any>(null);
  const [selectedAccount, setSelectedAccount] = useState<any>(null);
  const [selectedVideo, setSelectedVideo] = useState<any>(null);
  const [videoUrl, setVideoUrl] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  useEffect(() => {
    // If a campaign ID is provided in the URL, preselect it
    if (preselectedCampaignId) {
      const campaign = mockJoinedCampaigns.find(c => c.id === preselectedCampaignId);
      if (campaign) {
        setSelectedCampaign(campaign);
        setCurrentStep(2);
      }
    }
  }, [preselectedCampaignId]);

  const handleNextStep = () => {
    if (currentStep === 1 && !selectedCampaign) {
      alert('Veuillez sélectionner une campagne');
      return;
    }
    if (currentStep === 2 && !selectedAccount) {
      alert('Veuillez sélectionner un compte');
      return;
    }
    if (currentStep === 3 && !selectedVideo && !videoUrl) {
      alert('Veuillez sélectionner une vidéo ou entrer une URL');
      return;
    }
    
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    } else {
      handleSubmit();
    }
  };

  const handlePreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    setLoading(false);
    setShowSuccessModal(true);
  };

  const handleSuccessClose = () => {
    router.push('/dashboard/clipper/submissions');
  };

  // Filter accounts based on selected campaign platforms
  const filteredAccounts = selectedCampaign
    ? mockAccounts.filter(account => {
        const platformMap: Record<string, string[]> = {
          'TIKTOK': ['TIKTOK'],
          'INSTAGRAM': ['INSTAGRAM_REELS'],
          'YOUTUBE': ['YOUTUBE_SHORTS'],
        };
        return selectedCampaign.platforms.some((p: string) => 
          platformMap[account.platform]?.includes(p)
        );
      })
    : [];

  // Filter videos based on selected account
  const filteredVideos = selectedAccount
    ? mockRecentVideos.filter(video => {
        const platformMap: Record<string, string> = {
          'TIKTOK': 'TIKTOK',
          'INSTAGRAM_REELS': 'INSTAGRAM',
          'YOUTUBE_SHORTS': 'YOUTUBE',
        };
        return platformMap[video.platform] === selectedAccount.platform;
      })
    : [];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link
            href="/dashboard/clipper/submissions"
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <ArrowLeft className="h-5 w-5 text-gray-600 dark:text-gray-400" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Nouvelle soumission
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Soumettez votre vidéo en 3 étapes simples
            </p>
          </div>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          {[1, 2, 3].map((step) => (
            <div key={step} className="flex items-center">
              <div className="flex flex-col items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-medium transition-colors ${
                    currentStep >= step
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
                  }`}
                >
                  {currentStep > step ? <Check className="h-5 w-5" /> : step}
                </div>
                <span className="mt-2 text-xs text-gray-600 dark:text-gray-400">
                  {step === 1 && 'Campagne'}
                  {step === 2 && 'Compte'}
                  {step === 3 && 'Vidéo'}
                </span>
              </div>
              {step < 3 && (
                <div
                  className={`w-full max-w-[100px] h-0.5 mx-4 transition-colors ${
                    currentStep > step
                      ? 'bg-purple-600'
                      : 'bg-gray-200 dark:bg-gray-700'
                  }`}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Step Content */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
        {/* Step 1: Select Campaign */}
        {currentStep === 1 && (
          <div className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Étape 1: Sélectionnez une campagne
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
              Choisissez parmi vos campagnes actives
            </p>
            
            <div className="space-y-4">
              {mockJoinedCampaigns.map((campaign) => (
                <div
                  key={campaign.id}
                  onClick={() => setSelectedCampaign(campaign)}
                  className={`p-4 border rounded-lg cursor-pointer transition-all ${
                    selectedCampaign?.id === campaign.id
                      ? 'border-purple-600 bg-purple-50 dark:bg-purple-900/20'
                      : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div className="w-20 h-20 bg-gray-200 dark:bg-gray-700 rounded-lg flex-shrink-0"></div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-medium text-gray-900 dark:text-white">
                            {campaign.title}
                          </h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                            {campaign.advertiser}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-gray-900 dark:text-white">
                            €{campaign.pricePerClip}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            par clip
                          </p>
                        </div>
                      </div>
                      
                      <div className="mt-3 flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                        <span className="flex items-center gap-1">
                          <DollarSign className="h-3 w-3" />
                          €{campaign.remunerationPer1000Views}/1000 vues
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          Jusqu'au {new Date(campaign.endDate).toLocaleDateString('fr-FR')}
                        </span>
                      </div>
                      
                      <div className="mt-2 flex flex-wrap gap-2">
                        {campaign.platforms.map((platform: string) => (
                          <span
                            key={platform}
                            className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-xs"
                          >
                            {platform.replace('_', ' ')}
                          </span>
                        ))}
                      </div>
                    </div>
                    {selectedCampaign?.id === campaign.id && (
                      <CheckCircle className="h-5 w-5 text-purple-600 flex-shrink-0" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Step 2: Select Account */}
        {currentStep === 2 && (
          <div className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Étape 2: Sélectionnez un compte
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
              Choisissez le compte sur lequel vous avez publié la vidéo
            </p>

            {selectedCampaign && (
              <div className="mb-6 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                <p className="text-sm font-medium text-purple-800 dark:text-purple-200 mb-1">
                  Campagne sélectionnée:
                </p>
                <p className="text-sm text-purple-700 dark:text-purple-300">
                  {selectedCampaign.title}
                </p>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredAccounts.length > 0 ? (
                filteredAccounts.map((account) => {
                  const Icon = platformIcons[account.platform];
                  return (
                    <div
                      key={account.id}
                      onClick={() => setSelectedAccount(account)}
                      className={`p-4 border rounded-lg cursor-pointer transition-all ${
                        selectedAccount?.id === account.id
                          ? 'border-purple-600 bg-purple-50 dark:bg-purple-900/20'
                          : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center">
                          <Icon className="h-6 w-6 text-gray-600 dark:text-gray-400" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h3 className="font-medium text-gray-900 dark:text-white">
                              {account.username}
                            </h3>
                            {account.verified && (
                              <CheckCircle className="h-4 w-4 text-blue-500" />
                            )}
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {account.followers.toLocaleString()} followers
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-500">
                            Engagement: {account.engagementRate}%
                          </p>
                        </div>
                        {selectedAccount?.id === account.id && (
                          <CheckCircle className="h-5 w-5 text-purple-600" />
                        )}
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="col-span-2 text-center py-8">
                  <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-600 dark:text-gray-400">
                    Aucun compte compatible trouvé pour cette campagne
                  </p>
                  <Link
                    href="/dashboard/clipper/profile#accounts"
                    className="mt-4 inline-flex items-center text-sm text-purple-600 dark:text-purple-400 hover:underline"
                  >
                    Ajouter un compte
                    <ArrowRight className="ml-1 h-4 w-4" />
                  </Link>
                </div>
              )}
            </div>

            <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                💡 Astuce: Assurez-vous d'avoir connecté tous vos comptes sociaux dans votre profil pour voir toutes les options disponibles.
              </p>
            </div>
          </div>
        )}

        {/* Step 3: Select Video */}
        {currentStep === 3 && (
          <div className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Étape 3: Sélectionnez votre vidéo
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
              Choisissez parmi vos vidéos récentes ou entrez l'URL manuellement
            </p>

            {selectedCampaign && selectedAccount && (
              <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                  <p className="text-sm font-medium text-purple-800 dark:text-purple-200 mb-1">
                    Campagne:
                  </p>
                  <p className="text-sm text-purple-700 dark:text-purple-300">
                    {selectedCampaign.title}
                  </p>
                </div>
                <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                  <p className="text-sm font-medium text-purple-800 dark:text-purple-200 mb-1">
                    Compte:
                  </p>
                  <p className="text-sm text-purple-700 dark:text-purple-300">
                    {selectedAccount.username}
                  </p>
                </div>
              </div>
            )}

            {/* Advertiser Directives Reminder */}
            <div className="mb-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
              <p className="text-sm font-medium text-yellow-800 dark:text-yellow-200 mb-1">
                📋 Rappel des directives:
              </p>
              <p className="text-sm text-yellow-700 dark:text-yellow-300">
                {selectedCampaign?.directives}
              </p>
            </div>

            {/* Recent Videos */}
            <div className="mb-6">
              <h3 className="font-medium text-gray-900 dark:text-white mb-3">
                Vidéos récentes
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {filteredVideos.map((video) => (
                  <div
                    key={video.id}
                    onClick={() => {
                      setSelectedVideo(video);
                      setVideoUrl(video.url);
                    }}
                    className={`cursor-pointer rounded-lg overflow-hidden border-2 transition-all ${
                      selectedVideo?.id === video.id
                        ? 'border-purple-600'
                        : 'border-transparent hover:border-gray-300 dark:hover:border-gray-600'
                    }`}
                  >
                    <div className="aspect-[9/16] bg-gray-200 dark:bg-gray-700 relative">
                      {/* Video thumbnail */}
                      <div className="absolute bottom-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                        {video.duration}
                      </div>
                      {selectedVideo?.id === video.id && (
                        <div className="absolute inset-0 bg-purple-600/20 flex items-center justify-center">
                          <CheckCircle className="h-8 w-8 text-white" />
                        </div>
                      )}
                    </div>
                    <div className="p-2">
                      <p className="text-xs font-medium text-gray-900 dark:text-white line-clamp-1">
                        {video.title}
                      </p>
                      <div className="mt-1 flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                        <span className="flex items-center gap-0.5">
                          <Eye className="h-3 w-3" />
                          {(video.views / 1000).toFixed(1)}K
                        </span>
                        <span className="flex items-center gap-0.5">
                          <Heart className="h-3 w-3" />
                          {video.likes}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Manual URL Input */}
            <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
              <h3 className="font-medium text-gray-900 dark:text-white mb-3">
                Ou entrez l'URL manuellement
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    URL de la vidéo
                  </label>
                  <input
                    type="url"
                    value={videoUrl}
                    onChange={(e) => {
                      setVideoUrl(e.target.value);
                      setSelectedVideo(null);
                    }}
                    placeholder="https://tiktok.com/@username/video/..."
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Description (optionnel)
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={3}
                    placeholder="Ajoutez une description ou des notes pour l'annonceur..."
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="p-6 border-t border-gray-200 dark:border-gray-700">
          <div className="flex justify-between">
            <button
              onClick={handlePreviousStep}
              disabled={currentStep === 1}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                currentStep === 1
                  ? 'bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              Précédent
            </button>
            <button
              onClick={handleNextStep}
              disabled={loading}
              className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Soumission...
                </>
              ) : currentStep === 3 ? (
                <>
                  Soumettre
                  <Upload className="h-4 w-4" />
                </>
              ) : (
                <>
                  Suivant
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Vidéo soumise avec succès!
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
                Votre vidéo a été soumise pour révision. Vous recevrez une notification une fois qu'elle sera approuvée.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={handleSuccessClose}
                  className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                >
                  Voir mes soumissions
                </button>
                <button
                  onClick={() => {
                    setShowSuccessModal(false);
                    setCurrentStep(1);
                    setSelectedCampaign(null);
                    setSelectedAccount(null);
                    setSelectedVideo(null);
                    setVideoUrl('');
                    setDescription('');
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  Nouvelle soumission
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}