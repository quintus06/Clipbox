'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import {
  User,
  Mail,
  Phone,
  Calendar,
  Bell,
  Link2,
  CreditCard,
  Shield,
  Globe,
  Lock,
  Eye,
  EyeOff,
  Trash2,
  Save,
  Check,
  X,
  AlertCircle,
  Smartphone,
  MessageSquare,
  Youtube,
  Instagram,
  DollarSign,
  Building,
  Wallet,
  ChevronRight,
  Camera,
  Plus,
  Clock,
  Crown,
  Sparkles,
  Info,
  Twitter,
  Star,
  FileText,
  Upload,
  CheckCircle,
  XCircle
} from 'lucide-react';

// Type definitions for social accounts
interface SocialAccount {
  id: string;
  username: string;
  handle: string;
  connected: boolean;
  lastSync: string;
  followers?: number;
  status: 'active' | 'inactive' | 'error';
}

interface SocialNetwork {
  id: string;
  name: string;
  icon: any;
  color: string;
  accounts: SocialAccount[];
  maxAccounts: number;
}

// Subscription plan limits
const SUBSCRIPTION_LIMITS = {
  free: { maxAccountsPerNetwork: 1, planName: 'Gratuit', color: 'gray' },
  starter: { maxAccountsPerNetwork: 2, planName: 'Starter', color: 'blue' },
  pro: { maxAccountsPerNetwork: 4, planName: 'Pro', color: 'purple' },
  goat: { maxAccountsPerNetwork: Infinity, planName: 'Goat', color: 'yellow' }
};

export default function ClipperSettingsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('personal');
  const [loadingSocialAccounts, setLoadingSocialAccounts] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Handle tab query parameter and OAuth callbacks
  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab && tabs.some(t => t.id === tab)) {
      setActiveTab(tab);
    }

    // Handle OAuth success/error messages
    const success = searchParams.get('success');
    const error = searchParams.get('error');
    
    if (success) {
      setSuccessMessage(`Compte ${success} connecté avec succès!`);
      setActiveTab('social');
      // Reload social accounts
      loadSocialAccounts();
      // Clear URL parameters
      router.replace('/dashboard/clipper/settings?tab=social');
    }
    
    if (error) {
      setErrorMessage(decodeURIComponent(error));
      setActiveTab('social');
      // Clear URL parameters after showing error
      setTimeout(() => {
        router.replace('/dashboard/clipper/settings?tab=social');
      }, 100);
    }
  }, [searchParams]);

  // Load social accounts from API
  const loadSocialAccounts = async () => {
    if (!user) return;
    
    setLoadingSocialAccounts(true);
    try {
      const response = await fetch('/api/clipper/social-accounts');
      if (response.ok) {
        const data = await response.json();
        // Update social networks with real data
        updateSocialNetworksFromAPI(data.accounts);
      }
    } catch (error) {
      console.error('Error loading social accounts:', error);
    } finally {
      setLoadingSocialAccounts(false);
    }
  };

  // Update social networks state with API data
  const updateSocialNetworksFromAPI = (accounts: any[]) => {
    setSocialNetworks(prev => prev.map(network => {
      const networkAccounts = accounts
        .filter(acc => {
          if (network.id === 'tiktok') return acc.platform === 'TIKTOK';
          if (network.id === 'instagram') return acc.platform === 'INSTAGRAM';
          if (network.id === 'youtube') return acc.platform === 'YOUTUBE';
          if (network.id === 'twitter') return acc.platform === 'TWITTER';
          return false;
        })
        .map(acc => ({
          id: acc.id,
          username: acc.username,
          handle: `@${acc.username}`,
          connected: true,
          lastSync: new Date(acc.lastSync || acc.updatedAt).toLocaleString('fr-FR'),
          followers: acc.followers,
          status: 'active' as const
        }));

      return {
        ...network,
        accounts: networkAccounts
      };
    }));
  };

  // Load social accounts on mount
  useEffect(() => {
    if (user) {
      loadSocialAccounts();
    }
  }, [user]);
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [showConnectModal, setShowConnectModal] = useState<string | null>(null);
  const [connectingAccount, setConnectingAccount] = useState(false);
  
  // Current user's subscription plan (this would come from API/context)
  const [currentSubscription, setCurrentSubscription] = useState<'free' | 'starter' | 'pro' | 'goat'>('pro');
  const subscriptionInfo = SUBSCRIPTION_LIMITS[currentSubscription];

  // KYC state
  const [kycInfo, setKycInfo] = useState({
    documentType: 'id_card',
    frontDocument: null as File | null,
    backDocument: null as File | null,
    verificationStatus: 'pending' as 'pending' | 'verified' | 'rejected',
    submittedAt: null as string | null,
    rejectionReason: ''
  });

  // Form states
  const [personalInfo, setPersonalInfo] = useState({
    firstName: 'Jean',
    lastName: 'Dupont',
    email: 'jean.dupont@example.com',
    phone: '+33 6 12 34 56 78',
    birthDate: '1990-01-15'
  });

  const [notifications, setNotifications] = useState({
    emailCampaigns: true,
    emailPayments: true,
    emailNews: false,
    pushCampaigns: true,
    pushPayments: true,
    pushNews: false,
    smsCampaigns: false,
    smsPayments: true,
    smsNews: false
  });

  // Enhanced social accounts state with multi-account support
  const [socialNetworks, setSocialNetworks] = useState<SocialNetwork[]>([
    {
      id: 'tiktok',
      name: 'TikTok',
      icon: 'TT',
      color: 'black',
      accounts: [
        {
          id: 'tiktok-1',
          username: 'jeandupont',
          handle: '@jeandupont',
          connected: true,
          lastSync: '2024-03-15 14:30',
          followers: 15420,
          status: 'active'
        },
        {
          id: 'tiktok-2',
          username: 'jean_clips',
          handle: '@jean_clips',
          connected: true,
          lastSync: '2024-03-15 12:15',
          followers: 8200,
          status: 'active'
        }
      ],
      maxAccounts: subscriptionInfo.maxAccountsPerNetwork
    },
    {
      id: 'instagram',
      name: 'Instagram',
      icon: Instagram,
      color: 'gradient',
      accounts: [
        {
          id: 'instagram-1',
          username: 'jean.dupont',
          handle: '@jean.dupont',
          connected: true,
          lastSync: '2024-03-15 13:45',
          followers: 23500,
          status: 'active'
        }
      ],
      maxAccounts: subscriptionInfo.maxAccountsPerNetwork
    },
    {
      id: 'youtube',
      name: 'YouTube',
      icon: Youtube,
      color: 'red',
      accounts: [
        {
          id: 'youtube-1',
          username: 'JeanDupont',
          handle: 'JeanDupont',
          connected: true,
          lastSync: '2024-03-15 10:00',
          followers: 45000,
          status: 'active'
        }
      ],
      maxAccounts: subscriptionInfo.maxAccountsPerNetwork
    },
    {
      id: 'twitter',
      name: 'Twitter',
      icon: Twitter,
      color: 'blue',
      accounts: [],
      maxAccounts: subscriptionInfo.maxAccountsPerNetwork
    }
  ]);

  const [paymentMethods, setPaymentMethods] = useState({
    iban: 'FR76 1234 5678 9012 3456 7890 123',
    bic: 'BNPAFRPP',
    paypal: 'jean.dupont@example.com',
    stripe: ''
  });

  const [preferences, setPreferences] = useState({
    language: 'fr',
    timezone: 'Europe/Paris',
    currency: 'EUR'
  });

  const [privacy, setPrivacy] = useState({
    profilePublic: true,
    showStats: true,
    showEarnings: false,
    allowMessages: true
  });

  const handleSave = async () => {
    setSaveStatus('saving');
    setTimeout(() => {
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 3000);
    }, 1000);
  };

  const handleDeleteAccount = () => {
    if (showDeleteConfirm) {
      console.log('Account deletion requested');
    } else {
      setShowDeleteConfirm(true);
    }
  };

  const tabs = [
    { id: 'personal', label: 'Informations personnelles', icon: User },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'social', label: 'Réseaux sociaux', icon: Link2 },
    { id: 'kyc', label: 'Vérification KYC', icon: FileText },
    { id: 'payment', label: 'Paiement', icon: CreditCard },
    { id: 'security', label: 'Sécurité', icon: Shield },
    { id: 'preferences', label: 'Préférences', icon: Globe },
    { id: 'privacy', label: 'Confidentialité', icon: Lock },
    { id: 'danger', label: 'Zone danger', icon: AlertCircle }
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Paramètres</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Gérez vos informations personnelles et vos préférences
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar */}
        <div className="lg:w-64">
          <nav className="space-y-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    activeTab === tab.id
                      ? 'bg-purple-100 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="text-sm font-medium">{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Content */}
        <div className="flex-1">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
            {/* Personal Information Tab */}
            {activeTab === 'personal' && (
              <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                  Informations personnelles
                </h2>
                
                <div className="space-y-6">
                  <div className="flex items-center gap-6">
                    <div className="relative">
                      <div className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-2xl font-bold">
                        JD
                      </div>
                      <button className="absolute bottom-0 right-0 p-2 bg-purple-600 rounded-full text-white hover:bg-purple-700 transition-colors">
                        <Camera className="w-4 h-4" />
                      </button>
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900 dark:text-white">Photo de profil</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">JPG, PNG ou GIF. Max 5MB.</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Prénom
                      </label>
                      <input
                        type="text"
                        value={personalInfo.firstName}
                        onChange={(e) => setPersonalInfo({...personalInfo, firstName: e.target.value})}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Nom
                      </label>
                      <input
                        type="text"
                        value={personalInfo.lastName}
                        onChange={(e) => setPersonalInfo({...personalInfo, lastName: e.target.value})}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Email
                      </label>
                      <input
                        type="email"
                        value={personalInfo.email}
                        onChange={(e) => setPersonalInfo({...personalInfo, email: e.target.value})}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Téléphone
                      </label>
                      <input
                        type="tel"
                        value={personalInfo.phone}
                        onChange={(e) => setPersonalInfo({...personalInfo, phone: e.target.value})}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Date de naissance
                      </label>
                      <input
                        type="date"
                        value={personalInfo.birthDate}
                        onChange={(e) => setPersonalInfo({...personalInfo, birthDate: e.target.value})}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Notifications Tab */}
            {activeTab === 'notifications' && (
              <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                  Préférences de notifications
                </h2>
                
                <div className="space-y-6">
                  <div>
                    <h3 className="flex items-center gap-2 text-lg font-medium text-gray-900 dark:text-white mb-4">
                      <Mail className="w-5 h-5" />
                      Email
                    </h3>
                    <div className="space-y-3">
                      <label className="flex items-center justify-between">
                        <span className="text-gray-700 dark:text-gray-300">Nouvelles campagnes</span>
                        <input
                          type="checkbox"
                          checked={notifications.emailCampaigns}
                          onChange={(e) => setNotifications({...notifications, emailCampaigns: e.target.checked})}
                          className="w-5 h-5 text-purple-600 rounded focus:ring-purple-500"
                        />
                      </label>
                      <label className="flex items-center justify-between">
                        <span className="text-gray-700 dark:text-gray-300">Paiements reçus</span>
                        <input
                          type="checkbox"
                          checked={notifications.emailPayments}
                          onChange={(e) => setNotifications({...notifications, emailPayments: e.target.checked})}
                          className="w-5 h-5 text-purple-600 rounded focus:ring-purple-500"
                        />
                      </label>
                      <label className="flex items-center justify-between">
                        <span className="text-gray-700 dark:text-gray-300">Newsletter</span>
                        <input
                          type="checkbox"
                          checked={notifications.emailNews}
                          onChange={(e) => setNotifications({...notifications, emailNews: e.target.checked})}
                          className="w-5 h-5 text-purple-600 rounded focus:ring-purple-500"
                        />
                      </label>
                    </div>
                  </div>

                  <div>
                    <h3 className="flex items-center gap-2 text-lg font-medium text-gray-900 dark:text-white mb-4">
                      <Smartphone className="w-5 h-5" />
                      Push
                    </h3>
                    <div className="space-y-3">
                      <label className="flex items-center justify-between">
                        <span className="text-gray-700 dark:text-gray-300">Nouvelles campagnes</span>
                        <input
                          type="checkbox"
                          checked={notifications.pushCampaigns}
                          onChange={(e) => setNotifications({...notifications, pushCampaigns: e.target.checked})}
                          className="w-5 h-5 text-purple-600 rounded focus:ring-purple-500"
                        />
                      </label>
                      <label className="flex items-center justify-between">
                        <span className="text-gray-700 dark:text-gray-300">Paiements reçus</span>
                        <input
                          type="checkbox"
                          checked={notifications.pushPayments}
                          onChange={(e) => setNotifications({...notifications, pushPayments: e.target.checked})}
                          className="w-5 h-5 text-purple-600 rounded focus:ring-purple-500"
                        />
                      </label>
                      <label className="flex items-center justify-between">
                        <span className="text-gray-700 dark:text-gray-300">Actualités</span>
                        <input
                          type="checkbox"
                          checked={notifications.pushNews}
                          onChange={(e) => setNotifications({...notifications, pushNews: e.target.checked})}
                          className="w-5 h-5 text-purple-600 rounded focus:ring-purple-500"
                        />
                      </label>
                    </div>
                  </div>

                  <div>
                    <h3 className="flex items-center gap-2 text-lg font-medium text-gray-900 dark:text-white mb-4">
                      <MessageSquare className="w-5 h-5" />
                      SMS
                    </h3>
                    <div className="space-y-3">
                      <label className="flex items-center justify-between">
                        <span className="text-gray-700 dark:text-gray-300">Nouvelles campagnes</span>
                        <input
                          type="checkbox"
                          checked={notifications.smsCampaigns}
                          onChange={(e) => setNotifications({...notifications, smsCampaigns: e.target.checked})}
                          className="w-5 h-5 text-purple-600 rounded focus:ring-purple-500"
                        />
                      </label>
                      <label className="flex items-center justify-between">
                        <span className="text-gray-700 dark:text-gray-300">Paiements reçus</span>
                        <input
                          type="checkbox"
                          checked={notifications.smsPayments}
                          onChange={(e) => setNotifications({...notifications, smsPayments: e.target.checked})}
                          className="w-5 h-5 text-purple-600 rounded focus:ring-purple-500"
                        />
                      </label>
                      <label className="flex items-center justify-between">
                        <span className="text-gray-700 dark:text-gray-300">Actualités</span>
                        <input
                          type="checkbox"
                          checked={notifications.smsNews}
                          onChange={(e) => setNotifications({...notifications, smsNews: e.target.checked})}
                          className="w-5 h-5 text-purple-600 rounded focus:ring-purple-500"
                        />
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Enhanced Social Accounts Tab with Multi-Account Support */}
            {activeTab === 'social' && (
              <div className="p-6">
                {/* Success/Error Messages */}
                {successMessage && (
                  <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                    <p className="text-sm text-green-700 dark:text-green-300">{successMessage}</p>
                    <button
                      onClick={() => setSuccessMessage(null)}
                      className="ml-auto text-green-600 dark:text-green-400 hover:text-green-700"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )}
                
                {errorMessage && (
                  <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-center gap-3">
                    <XCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
                    <p className="text-sm text-red-700 dark:text-red-300">{errorMessage}</p>
                    <button
                      onClick={() => setErrorMessage(null)}
                      className="ml-auto text-red-600 dark:text-red-400 hover:text-red-700"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )}
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                      Comptes réseaux sociaux
                    </h2>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      Gérez vos comptes sur différentes plateformes
                    </p>
                  </div>
                  
                  {/* Subscription Badge */}
                  <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full ${
                    currentSubscription === 'goat' ? 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white' :
                    currentSubscription === 'pro' ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300' :
                    currentSubscription === 'starter' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300' :
                    'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                  }`}>
                    {currentSubscription === 'goat' ? <Crown className="w-4 h-4" /> :
                     currentSubscription === 'pro' ? <Sparkles className="w-4 h-4" /> :
                     <Star className="w-4 h-4" />}
                    <span className="text-sm font-medium">Plan {subscriptionInfo.planName}</span>
                  </div>
                </div>

                {/* Subscription Info Banner */}
                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6">
                  <div className="flex items-start gap-3">
                    <Info className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-blue-900 dark:text-blue-100 mb-1">
                        Limites de votre plan {subscriptionInfo.planName}
                      </p>
                      <p className="text-sm text-blue-700 dark:text-blue-300">
                        {subscriptionInfo.maxAccountsPerNetwork === Infinity
                          ? 'Comptes illimités par réseau social'
                          : `Maximum ${subscriptionInfo.maxAccountsPerNetwork} compte${subscriptionInfo.maxAccountsPerNetwork > 1 ? 's' : ''} par réseau social`}
                      </p>
                      {currentSubscription !== 'goat' && (
                        <button className="text-sm text-blue-600 dark:text-blue-400 hover:underline mt-1 flex items-center gap-1">
                          Augmenter mes limites
                          <ChevronRight className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="space-y-6">
                  {socialNetworks.map((network) => {
                    const canAddMore = network.accounts.length < network.maxAccounts;
                    const IconComponent = network.icon === 'TT' ? null : network.icon;
                    
                    return (
                      <div key={network.id} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
                        {/* Network Header */}
                        <div className="bg-gray-50 dark:bg-gray-900/50 px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              {/* Network Icon */}
                              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                                network.color === 'gradient'
                                  ? 'bg-gradient-to-br from-purple-600 to-pink-600'
                                  : network.color === 'black'
                                  ? 'bg-black'
                                  : network.color === 'red'
                                  ? 'bg-red-600'
                                  : 'bg-blue-500'
                              }`}>
                                {network.icon === 'TT' ? (
                                  <span className="text-white font-bold text-sm">TT</span>
                                ) : (
                                  <IconComponent className="w-6 h-6 text-white" />
                                )}
                              </div>
                              
                              <div>
                                <h3 className="font-medium text-gray-900 dark:text-white">
                                  {network.name}
                                </h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                  {network.accounts.length} / {network.maxAccounts === Infinity ? '∞' : network.maxAccounts} compte{network.accounts.length !== 1 ? 's' : ''} connecté{network.accounts.length !== 1 ? 's' : ''}
                                </p>
                              </div>
                            </div>
                            
                            {/* Add Account Button */}
                            <button
                              onClick={() => {
                                if (canAddMore) {
                                  // Redirect to OAuth authorize endpoint
                                  window.location.href = `/api/auth/${network.id}/authorize`;
                                }
                              }}
                              disabled={!canAddMore}
                              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                                canAddMore
                                  ? 'bg-purple-600 text-white hover:bg-purple-700'
                                  : 'bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'
                              }`}
                            >
                              <Plus className="w-4 h-4" />
                              <span className="text-sm font-medium">Ajouter un compte</span>
                            </button>
                          </div>
                        </div>
                        
                        {/* Connected Accounts List */}
                        <div className="p-6">
                          {network.accounts.length > 0 ? (
                            <div className="space-y-3">
                              {network.accounts.map((account) => (
                                <div key={account.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900/30 rounded-lg">
                                  <div className="flex items-center gap-4">
                                    {/* Account Status Indicator */}
                                    <div className={`w-2 h-2 rounded-full ${
                                      account.status === 'active' ? 'bg-green-500' :
                                      account.status === 'error' ? 'bg-red-500' :
                                      'bg-gray-400'
                                    }`} />
                                    
                                    <div>
                                      <div className="flex items-center gap-2">
                                        <span className="font-medium text-gray-900 dark:text-white">
                                          {account.handle}
                                        </span>
                                        {account.status === 'active' && (
                                          <span className="px-2 py-0.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs rounded-full">
                                            Actif
                                          </span>
                                        )}
                                      </div>
                                      <div className="flex items-center gap-4 mt-1">
                                        <span className="text-sm text-gray-500 dark:text-gray-400">
                                          {account.followers?.toLocaleString()} abonnés
                                        </span>
                                        <span className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1">
                                          <Clock className="w-3 h-3" />
                                          Dernière synchro: {account.lastSync}
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                  
                                  <div className="flex items-center gap-2">
                                    <button className="px-3 py-1.5 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
                                      Resynchroniser
                                    </button>
                                    <button
                                      onClick={async () => {
                                        if (!confirm('Êtes-vous sûr de vouloir déconnecter ce compte ?')) {
                                          return;
                                        }
                                        
                                        try {
                                          const response = await fetch(`/api/auth/${network.id}/disconnect`, {
                                            method: 'POST',
                                          });
                                          
                                          if (response.ok) {
                                            // Remove account from UI
                                            const updatedNetworks = socialNetworks.map(n => {
                                              if (n.id === network.id) {
                                                return {
                                                  ...n,
                                                  accounts: n.accounts.filter(a => a.id !== account.id)
                                                };
                                              }
                                              return n;
                                            });
                                            setSocialNetworks(updatedNetworks);
                                            setSuccessMessage('Compte déconnecté avec succès');
                                          } else {
                                            const error = await response.json();
                                            setErrorMessage(error.error || 'Erreur lors de la déconnexion');
                                          }
                                        } catch (error) {
                                          console.error('Disconnect error:', error);
                                          setErrorMessage('Erreur lors de la déconnexion du compte');
                                        }
                                      }}
                                      className="px-3 py-1.5 text-sm text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition-colors"
                                    >
                                      Déconnecter
                                    </button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="text-center py-8">
                              <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-3">
                                <Link2 className="w-8 h-8 text-gray-400 dark:text-gray-500" />
                              </div>
                              <p className="text-gray-600 dark:text-gray-400 mb-1">
                                Aucun compte {network.name} connecté
                              </p>
                              <p className="text-sm text-gray-500 dark:text-gray-500">
                                Connectez votre premier compte pour commencer
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Upgrade CTA for non-Goat users */}
                {currentSubscription !== 'goat' && (
                  <div className="mt-8 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl p-6 text-white">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-semibold mb-1">
                          Besoin de plus de comptes ?
                        </h3>
                        <p className="text-white/90 text-sm">
                          Passez au plan {currentSubscription === 'pro' ? 'Goat pour des comptes illimités' :
                                         currentSubscription === 'starter' ? 'Pro pour jusqu\'à 4 comptes par réseau' :
                                         'Starter pour doubler vos limites'}
                        </p>
                      </div>
                      <button
                        onClick={() => router.push('/dashboard/clipper/subscription')}
                        className="px-4 py-2 bg-white/20 backdrop-blur rounded-lg hover:bg-white/30 transition-colors flex items-center gap-2"
                      >
                        <Crown className="w-5 h-5" />
                        Upgrader
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* KYC Tab */}
            {activeTab === 'kyc' && (
              <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                  Vérification d'identité (KYC)
                </h2>
                
                {/* Info Banner */}
                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6">
                  <div className="flex items-start gap-3">
                    <Info className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-blue-900 dark:text-blue-100 mb-1">
                        Pourquoi la vérification KYC est-elle nécessaire ?
                      </p>
                      <p className="text-sm text-blue-700 dark:text-blue-300">
                        La vérification d'identité est requise pour garantir la sécurité de la plateforme et se conformer aux réglementations en vigueur. Vos documents sont traités de manière sécurisée et confidentielle.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Verification Status */}
                <div className="mb-6">
                  <div className={`p-4 rounded-lg border-2 ${
                    kycInfo.verificationStatus === 'verified'
                      ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
                      : kycInfo.verificationStatus === 'rejected'
                      ? 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
                      : 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800'
                  }`}>
                    <div className="flex items-center gap-3">
                      {kycInfo.verificationStatus === 'verified' ? (
                        <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
                      ) : kycInfo.verificationStatus === 'rejected' ? (
                        <XCircle className="w-6 h-6 text-red-600 dark:text-red-400" />
                      ) : (
                        <Clock className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
                      )}
                      <div className="flex-1">
                        <p className={`font-medium ${
                          kycInfo.verificationStatus === 'verified'
                            ? 'text-green-900 dark:text-green-100'
                            : kycInfo.verificationStatus === 'rejected'
                            ? 'text-red-900 dark:text-red-100'
                            : 'text-yellow-900 dark:text-yellow-100'
                        }`}>
                          {kycInfo.verificationStatus === 'verified'
                            ? 'Identité vérifiée'
                            : kycInfo.verificationStatus === 'rejected'
                            ? 'Vérification rejetée'
                            : 'En attente de vérification'}
                        </p>
                        <p className={`text-sm ${
                          kycInfo.verificationStatus === 'verified'
                            ? 'text-green-700 dark:text-green-300'
                            : kycInfo.verificationStatus === 'rejected'
                            ? 'text-red-700 dark:text-red-300'
                            : 'text-yellow-700 dark:text-yellow-300'
                        }`}>
                          {kycInfo.verificationStatus === 'verified'
                            ? 'Votre identité a été vérifiée avec succès'
                            : kycInfo.verificationStatus === 'rejected'
                            ? `Raison: ${kycInfo.rejectionReason || 'Documents non conformes'}`
                            : kycInfo.submittedAt
                            ? `Soumis le ${kycInfo.submittedAt} - Vérification en cours`
                            : 'Veuillez soumettre vos documents pour vérification'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* KYC Form */}
                {kycInfo.verificationStatus !== 'verified' && (
                  <div className="space-y-6">
                    {/* Document Type Selection */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Type de document
                      </label>
                      <select
                        value={kycInfo.documentType}
                        onChange={(e) => setKycInfo({...kycInfo, documentType: e.target.value})}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      >
                        <option value="id_card">Carte d'identité</option>
                        <option value="passport">Passeport</option>
                        <option value="driver_license">Permis de conduire</option>
                      </select>
                    </div>

                    {/* Document Upload - Front */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        {kycInfo.documentType === 'passport' ? 'Page du passeport' : 'Recto du document'}
                      </label>
                      <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center hover:border-purple-500 dark:hover:border-purple-400 transition-colors">
                        <input
                          type="file"
                          accept="image/*,.pdf"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) setKycInfo({...kycInfo, frontDocument: file});
                          }}
                          className="hidden"
                          id="front-document"
                        />
                        <label htmlFor="front-document" className="cursor-pointer">
                          <Upload className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                            {kycInfo.frontDocument ? kycInfo.frontDocument.name : 'Cliquez pour télécharger ou glissez-déposez'}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-500">
                            PNG, JPG, PDF jusqu'à 10MB
                          </p>
                        </label>
                      </div>
                    </div>

                    {/* Document Upload - Back (only for ID card and driver's license) */}
                    {kycInfo.documentType !== 'passport' && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Verso du document
                        </label>
                        <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center hover:border-purple-500 dark:hover:border-purple-400 transition-colors">
                          <input
                            type="file"
                            accept="image/*,.pdf"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) setKycInfo({...kycInfo, backDocument: file});
                            }}
                            className="hidden"
                            id="back-document"
                          />
                          <label htmlFor="back-document" className="cursor-pointer">
                            <Upload className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                              {kycInfo.backDocument ? kycInfo.backDocument.name : 'Cliquez pour télécharger ou glissez-déposez'}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-500">
                              PNG, JPG, PDF jusqu'à 10MB
                            </p>
                          </label>
                        </div>
                      </div>
                    )}

                    {/* Submit Button */}
                    <div className="flex justify-end">
                      <button
                        onClick={() => {
                          // Simulate submission
                          setKycInfo({
                            ...kycInfo,
                            verificationStatus: 'pending',
                            submittedAt: new Date().toLocaleDateString('fr-FR')
                          });
                          setSaveStatus('saving');
                          setTimeout(() => {
                            setSaveStatus('saved');
                            setTimeout(() => setSaveStatus('idle'), 3000);
                          }, 1000);
                        }}
                        disabled={!kycInfo.frontDocument || (kycInfo.documentType !== 'passport' && !kycInfo.backDocument)}
                        className="flex items-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <FileText className="w-5 h-5" />
                        Soumettre pour vérification
                      </button>
                    </div>

                    {/* Requirements */}
                    <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-4">
                      <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                        Exigences pour les documents
                      </h4>
                      <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                        <li className="flex items-start gap-2">
                          <Check className="w-4 h-4 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                          <span>Document en cours de validité</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <Check className="w-4 h-4 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                          <span>Photo claire et lisible de l'ensemble du document</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <Check className="w-4 h-4 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                          <span>Toutes les informations doivent être visibles</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <Check className="w-4 h-4 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                          <span>Format accepté: JPG, PNG ou PDF</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Payment Tab */}
            {activeTab === 'payment' && (
              <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                  Préférences de paiement
                </h2>
                
                <div className="space-y-6">
                  <div>
                    <h3 className="flex items-center gap-2 text-lg font-medium text-gray-900 dark:text-white mb-4">
                      <Building className="w-5 h-5" />
                      Virement bancaire
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          IBAN
                        </label>
                        <input
                          type="text"
                          value={paymentMethods.iban}
                          onChange={(e) => setPaymentMethods({...paymentMethods, iban: e.target.value})}
                          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent font-mono"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          BIC/SWIFT
                        </label>
                        <input
                          type="text"
                          value={paymentMethods.bic}
                          onChange={(e) => setPaymentMethods({...paymentMethods, bic: e.target.value})}
                          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent font-mono"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="flex items-center gap-2 text-lg font-medium text-gray-900 dark:text-white mb-4">
                      <Wallet className="w-5 h-5" />
                      PayPal
                    </h3>
                    <input
                      type="email"
                      value={paymentMethods.paypal}
                      onChange={(e) => setPaymentMethods({...paymentMethods, paypal: e.target.value})}
                      placeholder="email@example.com"
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <h3 className="flex items-center gap-2 text-lg font-medium text-gray-900 dark:text-white mb-4">
                      <CreditCard className="w-5 h-5" />
                      Stripe Connect
                    </h3>
                    {paymentMethods.stripe ? (
                      <div className="flex items-center justify-between p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                        <div className="flex items-center gap-3">
                          <Check className="w-5 h-5 text-green-600 dark:text-green-400" />
                          <span className="text-green-700 dark:text-green-300">Compte Stripe connecté</span>
                        </div>
                        <button className="text-red-600 hover:text-red-700 text-sm font-medium">
                          Déconnecter
                        </button>
                      </div>
                    ) : (
                      <button className="w-full py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
                        Connecter Stripe
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Security Tab */}
            {activeTab === 'security' && (
              <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                  Sécurité
                </h2>
                
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                      Changer le mot de passe
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Mot de passe actuel
                        </label>
                        <div className="relative">
                          <input
                            type={showPassword ? 'text' : 'password'}
                            className="w-full px-4 py-2 pr-10 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                          >
                            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                          </button>
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Nouveau mot de passe
                        </label>
                        <div className="relative">
                          <input
                            type={showNewPassword ? 'text' : 'password'}
                            className="w-full px-4 py-2 pr-10 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          />
                          <button
                            type="button"
                            onClick={() => setShowNewPassword(!showNewPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                          >
                            {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                          </button>
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Confirmer le nouveau mot de passe
                        </label>
                        <input
                          type="password"
                          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                      Authentification à deux facteurs (2FA)
                    </h3>
                    <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {twoFactorEnabled ? 'Activée' : 'Désactivée'}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Sécurisez votre compte avec l'authentification à deux facteurs
                        </p>
                      </div>
                      <button
                        onClick={() => setTwoFactorEnabled(!twoFactorEnabled)}
                        className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                          twoFactorEnabled
                            ? 'bg-red-600 text-white hover:bg-red-700'
                            : 'bg-purple-600 text-white hover:bg-purple-700'
                        }`}
                      >
                        {twoFactorEnabled ? 'Désactiver' : 'Activer'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Preferences Tab */}
            {activeTab === 'preferences' && (
              <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                  Préférences
                </h2>
                
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Langue
                    </label>
                    <select
                      value={preferences.language}
                      onChange={(e) => setPreferences({...preferences, language: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    >
                      <option value="fr">Français</option>
                      <option value="en">English</option>
                      <option value="es">Español</option>
                      <option value="de">Deutsch</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Fuseau horaire
                    </label>
                    <select
                      value={preferences.timezone}
                      onChange={(e) => setPreferences({...preferences, timezone: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    >
                      <option value="Europe/Paris">Europe/Paris (UTC+1)</option>
                      <option value="Europe/London">Europe/London (UTC+0)</option>
                      <option value="America/New_York">America/New York (UTC-5)</option>
                      <option value="Asia/Tokyo">Asia/Tokyo (UTC+9)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Devise
                    </label>
                    <select
                      value={preferences.currency}
                      onChange={(e) => setPreferences({...preferences, currency: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    >
                      <option value="EUR">EUR (€)</option>
                      <option value="USD">USD ($)</option>
                      <option value="GBP">GBP (£)</option>
                      <option value="CHF">CHF (Fr.)</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* Privacy Tab */}
            {activeTab === 'privacy' && (
              <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                  Confidentialité
                </h2>
                
                <div className="space-y-6">
                  <div className="space-y-4">
                    <label className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">Profil public</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Permettre aux autres utilisateurs de voir votre profil
                        </p>
                      </div>
                      <input
                        type="checkbox"
                        checked={privacy.profilePublic}
                        onChange={(e) => setPrivacy({...privacy, profilePublic: e.target.checked})}
                        className="w-5 h-5 text-purple-600 rounded focus:ring-purple-500"
                      />
                    </label>

                    <label className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">Afficher les statistiques</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Rendre vos statistiques visibles sur votre profil public
                        </p>
                      </div>
                      <input
                        type="checkbox"
                        checked={privacy.showStats}
                        onChange={(e) => setPrivacy({...privacy, showStats: e.target.checked})}
                        className="w-5 h-5 text-purple-600 rounded focus:ring-purple-500"
                      />
                    </label>

                    <label className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">Afficher les gains</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Montrer vos gains totaux sur votre profil
                        </p>
                      </div>
                      <input
                        type="checkbox"
                        checked={privacy.showEarnings}
                        onChange={(e) => setPrivacy({...privacy, showEarnings: e.target.checked})}
                        className="w-5 h-5 text-purple-600 rounded focus:ring-purple-500"
                      />
                    </label>

                    <label className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">Autoriser les messages</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Permettre aux annonceurs de vous contacter
                        </p>
                      </div>
                      <input
                        type="checkbox"
                        checked={privacy.allowMessages}
                        onChange={(e) => setPrivacy({...privacy, allowMessages: e.target.checked})}
                        className="w-5 h-5 text-purple-600 rounded focus:ring-purple-500"
                      />
                    </label>
                  </div>
                </div>
              </div>
            )}

            {/* Danger Zone Tab */}
            {activeTab === 'danger' && (
              <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                  Zone danger
                </h2>
                
                <div className="space-y-6">
                  <div className="p-4 border-2 border-red-200 dark:border-red-900 rounded-lg bg-red-50 dark:bg-red-900/20">
                    <h3 className="text-lg font-medium text-red-900 dark:text-red-400 mb-2">
                      Supprimer le compte
                    </h3>
                    <p className="text-sm text-red-700 dark:text-red-300 mb-4">
                      Une fois votre compte supprimé, toutes vos données seront définitivement effacées.
                      Cette action est irréversible.
                    </p>
                    {showDeleteConfirm ? (
                      <div className="space-y-4">
                        <p className="text-sm font-medium text-red-900 dark:text-red-400">
                          Êtes-vous sûr de vouloir supprimer votre compte ?
                        </p>
                        <div className="flex gap-3">
                          <button
                            onClick={handleDeleteAccount}
                            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                          >
                            Oui, supprimer mon compte
                          </button>
                          <button
                            onClick={() => setShowDeleteConfirm(false)}
                            className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                          >
                            Annuler
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button
                        onClick={() => setShowDeleteConfirm(true)}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                      >
                        Supprimer mon compte
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Save Button */}
          {activeTab !== 'danger' && (
            <div className="mt-6 flex justify-end">
              <button
                onClick={handleSave}
                disabled={saveStatus === 'saving'}
                className="flex items-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saveStatus === 'saving' ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Enregistrement...
                  </>
                ) : saveStatus === 'saved' ? (
                  <>
                    <Check className="w-5 h-5" />
                    Enregistré
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5" />
                    Enregistrer les modifications
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Connect Account Modal */}
      {showConnectModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                Connecter un compte {socialNetworks.find(n => n.id === showConnectModal)?.name}
              </h3>
              <button
                onClick={() => setShowConnectModal(null)}
                className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Nom d'utilisateur
                </label>
                <input
                  type="text"
                  placeholder={showConnectModal === 'youtube' ? 'Nom de la chaîne' : '@username'}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  Vous serez redirigé vers {socialNetworks.find(n => n.id === showConnectModal)?.name} pour autoriser l'accès à votre compte.
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowConnectModal(null)}
                  className="flex-1 py-3 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  Annuler
                </button>
                <button
                  onClick={() => {
                    setConnectingAccount(true);
                    // Simulate account connection
                    setTimeout(() => {
                      const network = socialNetworks.find(n => n.id === showConnectModal);
                      if (network) {
                        const newAccount: SocialAccount = {
                          id: `${showConnectModal}-${Date.now()}`,
                          username: 'new_account',
                          handle: '@new_account',
                          connected: true,
                          lastSync: new Date().toLocaleString('fr-FR'),
                          followers: Math.floor(Math.random() * 50000),
                          status: 'active'
                        };
                        
                        const updatedNetworks = socialNetworks.map(n => {
                          if (n.id === showConnectModal) {
                            return {
                              ...n,
                              accounts: [...n.accounts, newAccount]
                            };
                          }
                          return n;
                        });
                        setSocialNetworks(updatedNetworks);
                      }
                      setConnectingAccount(false);
                      setShowConnectModal(null);
                    }, 2000);
                  }}
                  disabled={connectingAccount}
                  className="flex-1 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {connectingAccount ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Connexion...
                    </>
                  ) : (
                    <>
                      <Link2 className="w-5 h-5" />
                      Connecter le compte
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