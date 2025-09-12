'use client';

import { useState } from 'react';
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
  Camera
} from 'lucide-react';

export default function ClipperSettingsPage() {
  const [activeTab, setActiveTab] = useState('personal');
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');

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

  const [socialAccounts, setSocialAccounts] = useState({
    tiktok: '@jeandupont',
    instagram: '@jean.dupont',
    youtube: 'JeanDupont'
  });

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

            {/* Social Accounts Tab */}
            {activeTab === 'social' && (
              <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                  Comptes réseaux sociaux
                </h2>
                
                <div className="space-y-6">
                  <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-black rounded-lg flex items-center justify-center">
                          <span className="text-white font-bold text-sm">TT</span>
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-900 dark:text-white">TikTok</h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400">Connecté</p>
                        </div>
                      </div>
                      <button className="text-red-600 hover:text-red-700 text-sm font-medium">
                        Déconnecter
                      </button>
                    </div>
                    <input
                      type="text"
                      value={socialAccounts.tiktok}
                      onChange={(e) => setSocialAccounts({...socialAccounts, tiktok: e.target.value})}
                      placeholder="@username"
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>

                  <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-pink-600 rounded-lg flex items-center justify-center">
                          <Instagram className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-900 dark:text-white">Instagram</h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400">Connecté</p>
                        </div>
                      </div>
                      <button className="text-red-600 hover:text-red-700 text-sm font-medium">
                        Déconnecter
                      </button>
                    </div>
                    <input
                      type="text"
                      value={socialAccounts.instagram}
                      onChange={(e) => setSocialAccounts({...socialAccounts, instagram: e.target.value})}
                      placeholder="@username"
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>

                  <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-red-600 rounded-lg flex items-center justify-center">
                          <Youtube className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-900 dark:text-white">YouTube</h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400">Connecté</p>
                        </div>
                      </div>
                      <button className="text-red-600 hover:text-red-700 text-sm font-medium">
                        Déconnecter
                      </button>
                    </div>
                    <input
                      type="text"
                      value={socialAccounts.youtube}
                      onChange={(e) => setSocialAccounts({...socialAccounts, youtube: e.target.value})}
                      placeholder="Channel name"
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>

                  <button className="w-full py-3 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg text-gray-600 dark:text-gray-400 hover:border-purple-500 hover:text-purple-600 dark:hover:text-purple-400 transition-colors">
                    + Ajouter un autre réseau social
                  </button>
                </div>
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
    </div>
  );
}