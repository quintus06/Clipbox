'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  User,
  Camera,
  Trophy,
  Star,
  TrendingUp,
  Award,
  Target,
  Calendar,
  MapPin,
  Link2,
  Instagram,
  Youtube,
  Twitter,
  Globe,
  Edit,
  Save,
  Check,
  X,
  BarChart3,
  Users,
  Eye,
  Heart,
  MessageCircle,
  Share2,
  DollarSign,
  Zap,
  FileText,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  ChevronRight
} from 'lucide-react';

export default function ClipperProfilePage() {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');
  
  // KYC status (this would come from API/context)
  const [kycStatus, setKycStatus] = useState<'pending' | 'verified' | 'rejected' | 'not_submitted'>('not_submitted');
  
  const [profile, setProfile] = useState({
    username: '@jeandupont',
    displayName: 'Jean Dupont',
    bio: 'Créateur de contenu passionné | 500K+ followers | Spécialisé dans les reviews tech et lifestyle',
    location: 'Paris, France',
    website: 'https://jeandupont.com',
    joinDate: 'Janvier 2024',
    verified: true,
    level: 'Gold',
    rank: 12,
    totalEarnings: '€15,234',
    monthlyEarnings: '€2,150',
    completedCampaigns: 47,
    successRate: 94,
    avgEngagement: 8.5,
    totalViews: '2.3M',
    totalLikes: '185K',
    totalShares: '42K'
  });

  const [socialLinks, setSocialLinks] = useState({
    tiktok: '@jeandupont',
    instagram: '@jean.dupont',
    youtube: 'JeanDupont',
    twitter: '@jdupont'
  });

  const [achievements, setAchievements] = useState([
    { id: 1, name: 'Premier Clip', icon: Trophy, unlocked: true, date: '15 Jan 2024' },
    { id: 2, name: '10 Campagnes', icon: Target, unlocked: true, date: '28 Fév 2024' },
    { id: 3, name: 'Top Performer', icon: Star, unlocked: true, date: '15 Mar 2024' },
    { id: 4, name: '€10K Gagnés', icon: DollarSign, unlocked: true, date: '01 Avr 2024' },
    { id: 5, name: '50 Campagnes', icon: Award, unlocked: false, progress: 47 },
    { id: 6, name: 'Elite Clipper', icon: Zap, unlocked: false, progress: 80 }
  ]);

  const [stats, setStats] = useState({
    weeklyGrowth: '+12%',
    monthlyGrowth: '+28%',
    bestPerformingCategory: 'Tech',
    avgResponseTime: '2h',
    clientSatisfaction: 4.8
  });

  const handleSave = () => {
    setSaveStatus('saving');
    setTimeout(() => {
      setSaveStatus('saved');
      setIsEditing(false);
      setTimeout(() => setSaveStatus('idle'), 3000);
    }, 1000);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl p-8 mb-6">
        <div className="flex flex-col md:flex-row items-center gap-6">
          <div className="relative">
            <div className="w-32 h-32 rounded-full bg-white p-1">
              <div className="w-full h-full rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-white text-4xl font-bold">
                JD
              </div>
            </div>
            {isEditing && (
              <button className="absolute bottom-0 right-0 p-2 bg-white rounded-full shadow-lg hover:shadow-xl transition-shadow">
                <Camera className="w-5 h-5 text-gray-700" />
              </button>
            )}
            {profile.verified && (
              <div className="absolute -top-2 -right-2 bg-blue-500 rounded-full p-2">
                <Check className="w-4 h-4 text-white" />
              </div>
            )}
          </div>

          <div className="flex-1 text-center md:text-left">
            {isEditing ? (
              <div className="space-y-4">
                <input
                  type="text"
                  value={profile.displayName}
                  onChange={(e) => setProfile({...profile, displayName: e.target.value})}
                  className="text-3xl font-bold bg-white/20 backdrop-blur text-white placeholder-white/70 px-4 py-2 rounded-lg border border-white/30 focus:border-white focus:outline-none"
                />
                <textarea
                  value={profile.bio}
                  onChange={(e) => setProfile({...profile, bio: e.target.value})}
                  rows={2}
                  className="w-full bg-white/20 backdrop-blur text-white placeholder-white/70 px-4 py-2 rounded-lg border border-white/30 focus:border-white focus:outline-none"
                />
              </div>
            ) : (
              <>
                <h1 className="text-3xl font-bold text-white mb-2">{profile.displayName}</h1>
                <p className="text-white/90 mb-4">{profile.bio}</p>
              </>
            )}
            
            <div className="flex flex-wrap gap-4 justify-center md:justify-start text-white/80 text-sm">
              <span className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                {profile.location}
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                Membre depuis {profile.joinDate}
              </span>
              <span className="flex items-center gap-1">
                <Globe className="w-4 h-4" />
                {profile.website}
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="px-6 py-3 bg-white text-purple-600 rounded-lg font-medium hover:bg-gray-100 transition-colors flex items-center gap-2"
              >
                <Edit className="w-5 h-5" />
                Modifier le profil
              </button>
            ) : (
              <div className="flex gap-2">
                <button
                  onClick={handleSave}
                  className="px-6 py-3 bg-white text-purple-600 rounded-lg font-medium hover:bg-gray-100 transition-colors flex items-center gap-2"
                >
                  {saveStatus === 'saving' ? (
                    <div className="w-5 h-5 border-2 border-purple-600 border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Save className="w-5 h-5" />
                  )}
                  Enregistrer
                </button>
                <button
                  onClick={() => setIsEditing(false)}
                  className="px-6 py-3 bg-white/20 backdrop-blur text-white rounded-lg font-medium hover:bg-white/30 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            )}
            <div className="bg-white/20 backdrop-blur rounded-lg px-4 py-2 text-center">
              <div className="text-2xl font-bold text-white">{profile.level}</div>
              <div className="text-xs text-white/80">Rang #{profile.rank}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-2">
            <DollarSign className="w-8 h-8 text-green-500" />
            <span className="text-xs text-green-600 dark:text-green-400 font-medium">
              {stats.monthlyGrowth}
            </span>
          </div>
          <div className="text-2xl font-bold text-gray-900 dark:text-white">
            {profile.totalEarnings}
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400">Gains totaux</p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-2">
            <Target className="w-8 h-8 text-purple-500" />
            <span className="text-xs text-purple-600 dark:text-purple-400 font-medium">
              {profile.successRate}%
            </span>
          </div>
          <div className="text-2xl font-bold text-gray-900 dark:text-white">
            {profile.completedCampaigns}
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400">Campagnes complétées</p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-2">
            <Eye className="w-8 h-8 text-blue-500" />
            <span className="text-xs text-blue-600 dark:text-blue-400 font-medium">
              {stats.weeklyGrowth}
            </span>
          </div>
          <div className="text-2xl font-bold text-gray-900 dark:text-white">
            {profile.totalViews}
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400">Vues totales</p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-2">
            <TrendingUp className="w-8 h-8 text-orange-500" />
            <span className="text-xs text-orange-600 dark:text-orange-400 font-medium">
              {profile.avgEngagement}%
            </span>
          </div>
          <div className="text-2xl font-bold text-gray-900 dark:text-white">
            {profile.totalLikes}
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400">Engagement total</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Social Links */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Réseaux sociaux
            </h2>
            <div className="space-y-3">
              <a href="#" className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-900/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-900 transition-colors">
                <div className="w-10 h-10 bg-black rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">TT</span>
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900 dark:text-white">TikTok</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{socialLinks.tiktok}</p>
                </div>
                <Eye className="w-5 h-5 text-gray-400" />
              </a>

              <a href="#" className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-900/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-900 transition-colors">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-pink-600 rounded-lg flex items-center justify-center">
                  <Instagram className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900 dark:text-white">Instagram</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{socialLinks.instagram}</p>
                </div>
                <Eye className="w-5 h-5 text-gray-400" />
              </a>

              <a href="#" className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-900/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-900 transition-colors">
                <div className="w-10 h-10 bg-red-600 rounded-lg flex items-center justify-center">
                  <Youtube className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900 dark:text-white">YouTube</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{socialLinks.youtube}</p>
                </div>
                <Eye className="w-5 h-5 text-gray-400" />
              </a>

              <a href="#" className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-900/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-900 transition-colors">
                <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                  <Twitter className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900 dark:text-white">Twitter</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{socialLinks.twitter}</p>
                </div>
                <Eye className="w-5 h-5 text-gray-400" />
              </a>
            </div>
          </div>

          {/* KYC Status Card */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 mt-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Vérification KYC
              </h2>
              <FileText className="w-5 h-5 text-gray-400" />
            </div>
            
            <div className={`p-4 rounded-lg border-2 mb-4 ${
              kycStatus === 'verified'
                ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
                : kycStatus === 'rejected'
                ? 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
                : kycStatus === 'pending'
                ? 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800'
                : 'bg-gray-50 dark:bg-gray-900/50 border-gray-200 dark:border-gray-700'
            }`}>
              <div className="flex items-center gap-3">
                {kycStatus === 'verified' ? (
                  <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400 flex-shrink-0" />
                ) : kycStatus === 'rejected' ? (
                  <XCircle className="w-6 h-6 text-red-600 dark:text-red-400 flex-shrink-0" />
                ) : kycStatus === 'pending' ? (
                  <Clock className="w-6 h-6 text-yellow-600 dark:text-yellow-400 flex-shrink-0" />
                ) : (
                  <AlertCircle className="w-6 h-6 text-gray-600 dark:text-gray-400 flex-shrink-0" />
                )}
                <div className="flex-1">
                  <p className={`font-medium text-sm ${
                    kycStatus === 'verified'
                      ? 'text-green-900 dark:text-green-100'
                      : kycStatus === 'rejected'
                      ? 'text-red-900 dark:text-red-100'
                      : kycStatus === 'pending'
                      ? 'text-yellow-900 dark:text-yellow-100'
                      : 'text-gray-900 dark:text-gray-100'
                  }`}>
                    {kycStatus === 'verified'
                      ? 'Identité vérifiée'
                      : kycStatus === 'rejected'
                      ? 'Vérification rejetée'
                      : kycStatus === 'pending'
                      ? 'En attente de vérification'
                      : 'Non vérifié'}
                  </p>
                  <p className={`text-xs mt-0.5 ${
                    kycStatus === 'verified'
                      ? 'text-green-700 dark:text-green-300'
                      : kycStatus === 'rejected'
                      ? 'text-red-700 dark:text-red-300'
                      : kycStatus === 'pending'
                      ? 'text-yellow-700 dark:text-yellow-300'
                      : 'text-gray-700 dark:text-gray-300'
                  }`}>
                    {kycStatus === 'verified'
                      ? 'Votre identité a été vérifiée avec succès'
                      : kycStatus === 'rejected'
                      ? 'Veuillez soumettre de nouveaux documents'
                      : kycStatus === 'pending'
                      ? 'Vérification en cours (24-48h)'
                      : 'Vérifiez votre identité pour débloquer toutes les fonctionnalités'}
                  </p>
                </div>
              </div>
            </div>

            {kycStatus !== 'verified' && (
              <button
                onClick={() => router.push('/dashboard/clipper/settings?tab=kyc')}
                className="w-full py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center gap-2 font-medium"
              >
                <FileText className="w-5 h-5" />
                {kycStatus === 'not_submitted' ? 'Faire valider mon identité' : 'Voir le statut KYC'}
                <ChevronRight className="w-4 h-4" />
              </button>
            )}

            {kycStatus === 'verified' && (
              <div className="flex items-center justify-center gap-2 text-sm text-green-600 dark:text-green-400">
                <Check className="w-4 h-4" />
                <span>Compte vérifié</span>
              </div>
            )}
          </div>

          {/* Performance Stats */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 mt-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Performance
            </h2>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600 dark:text-gray-400">Taux de réussite</span>
                  <span className="font-medium text-gray-900 dark:text-white">{profile.successRate}%</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full"
                    style={{ width: `${profile.successRate}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600 dark:text-gray-400">Engagement moyen</span>
                  <span className="font-medium text-gray-900 dark:text-white">{profile.avgEngagement}%</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-blue-500 to-cyan-500 h-2 rounded-full"
                    style={{ width: `${profile.avgEngagement * 10}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600 dark:text-gray-400">Satisfaction client</span>
                  <span className="font-medium text-gray-900 dark:text-white">{stats.clientSatisfaction}/5</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full"
                    style={{ width: `${(stats.clientSatisfaction / 5) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Achievements */}
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Achievements
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {achievements.map((achievement) => {
                const Icon = achievement.icon;
                return (
                  <div
                    key={achievement.id}
                    className={`p-4 rounded-lg border-2 ${
                      achievement.unlocked
                        ? 'bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border-purple-300 dark:border-purple-700'
                        : 'bg-gray-50 dark:bg-gray-900/50 border-gray-200 dark:border-gray-700'
                    }`}
                  >
                    <div className="flex flex-col items-center text-center">
                      <div className={`p-3 rounded-full mb-2 ${
                        achievement.unlocked
                          ? 'bg-gradient-to-br from-purple-500 to-pink-500'
                          : 'bg-gray-300 dark:bg-gray-700'
                      }`}>
                        <Icon className={`w-6 h-6 ${
                          achievement.unlocked ? 'text-white' : 'text-gray-500 dark:text-gray-400'
                        }`} />
                      </div>
                      <h3 className={`font-medium text-sm ${
                        achievement.unlocked
                          ? 'text-gray-900 dark:text-white'
                          : 'text-gray-500 dark:text-gray-400'
                      }`}>
                        {achievement.name}
                      </h3>
                      {achievement.unlocked ? (
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          {achievement.date}
                        </p>
                      ) : (
                        <div className="w-full mt-2">
                          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1">
                            <div
                              className="bg-purple-500 h-1 rounded-full"
                              style={{ width: `${((achievement.progress || 0) / 50) * 100}%` }}
                            />
                          </div>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            {achievement.progress}/50
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 mt-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Activité récente
            </h2>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2" />
                <div className="flex-1">
                  <p className="text-gray-900 dark:text-white">
                    Campagne <span className="font-medium">"Summer Tech Review"</span> complétée
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Il y a 2 heures</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2" />
                <div className="flex-1">
                  <p className="text-gray-900 dark:text-white">
                    Nouveau record d'engagement : <span className="font-medium">12.5%</span>
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Il y a 5 heures</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-purple-500 rounded-full mt-2" />
                <div className="flex-1">
                  <p className="text-gray-900 dark:text-white">
                    Paiement de <span className="font-medium">€450</span> reçu
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Il y a 1 jour</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2" />
                <div className="flex-1">
                  <p className="text-gray-900 dark:text-white">
                    Achievement <span className="font-medium">"Top Performer"</span> débloqué
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Il y a 3 jours</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}