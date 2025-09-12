'use client';

import { useState } from 'react';
import { 
  Settings, 
  DollarSign, 
  Package, 
  Mail, 
  Key, 
  Shield, 
  Power, 
  Database,
  Save,
  Check,
  AlertCircle,
  Globe,
  CreditCard,
  Users,
  FileText,
  Activity,
  Download,
  Upload,
  RefreshCw,
  Zap,
  Server,
  Lock,
  Eye,
  EyeOff,
  ToggleLeft,
  ToggleRight
} from 'lucide-react';

export default function AdminSettingsPage() {
  const [activeTab, setActiveTab] = useState('general');
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [showApiKey, setShowApiKey] = useState<{ [key: string]: boolean }>({});

  // Configuration states
  const [generalConfig, setGeneralConfig] = useState({
    siteName: 'ClipBox',
    siteUrl: 'https://clipbox.com',
    supportEmail: 'support@clipbox.com',
    defaultLanguage: 'fr',
    timezone: 'Europe/Paris',
    registrationEnabled: true,
    emailVerificationRequired: true,
    maxUploadSize: '100',
    allowedFileTypes: 'mp4,mov,avi,webm'
  });

  const [commissionConfig, setCommissionConfig] = useState({
    platformCommission: '20',
    minPayout: '50',
    payoutFrequency: 'weekly',
    vatRate: '20',
    processingFee: '0.5',
    currency: 'EUR',
    autoApprovePayouts: false,
    maxPayoutAmount: '10000'
  });

  const [planLimits, setPlanLimits] = useState({
    free: {
      campaigns: '3',
      clippers: '10',
      storage: '1',
      analytics: false
    },
    starter: {
      campaigns: '10',
      clippers: '50',
      storage: '10',
      analytics: true
    },
    pro: {
      campaigns: '50',
      clippers: '500',
      storage: '100',
      analytics: true
    },
    enterprise: {
      campaigns: 'unlimited',
      clippers: 'unlimited',
      storage: 'unlimited',
      analytics: true
    }
  });

  const [emailConfig, setEmailConfig] = useState({
    provider: 'sendgrid',
    fromEmail: 'noreply@clipbox.com',
    fromName: 'ClipBox',
    replyToEmail: 'support@clipbox.com',
    welcomeEmailEnabled: true,
    campaignNotificationsEnabled: true,
    paymentNotificationsEnabled: true,
    weeklyReportsEnabled: true
  });

  const [apiKeys, setApiKeys] = useState({
    stripe: {
      publishable: 'pk_live_51234567890abcdef',
      secret: 'sk_live_51234567890abcdef',
      webhook: 'whsec_1234567890abcdef'
    },
    veriff: {
      apiKey: 'veriff_api_key_1234567890',
      secret: 'veriff_secret_1234567890'
    },
    sendgrid: {
      apiKey: 'SG.1234567890abcdef'
    },
    aws: {
      accessKey: 'AKIA1234567890',
      secretKey: 'aws_secret_key_1234567890',
      region: 'eu-west-1',
      bucket: 'clipbox-storage'
    }
  });

  const [moderationConfig, setModerationConfig] = useState({
    autoModeration: true,
    profanityFilter: true,
    spamDetection: true,
    minContentLength: '10',
    maxReportsBeforeHide: '5',
    requireManualApproval: false,
    blacklistedWords: 'spam,scam,fake',
    whitelistedDomains: 'youtube.com,tiktok.com,instagram.com'
  });

  const [maintenanceConfig, setMaintenanceConfig] = useState({
    enabled: false,
    message: 'Le site est en maintenance. Nous serons de retour bientôt.',
    allowAdminAccess: true,
    estimatedTime: '2 heures',
    showCountdown: true
  });

  const handleSave = async () => {
    setSaveStatus('saving');
    setTimeout(() => {
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 3000);
    }, 1000);
  };

  const handleExportData = () => {
    console.log('Exporting data...');
  };

  const handleBackup = () => {
    console.log('Creating backup...');
  };

  const toggleApiKeyVisibility = (service: string) => {
    setShowApiKey(prev => ({ ...prev, [service]: !prev[service] }));
  };

  const tabs = [
    { id: 'general', label: 'Configuration générale', icon: Settings },
    { id: 'commission', label: 'Commission & Frais', icon: DollarSign },
    { id: 'plans', label: 'Limites des plans', icon: Package },
    { id: 'email', label: 'Emails transactionnels', icon: Mail },
    { id: 'api', label: 'Clés API', icon: Key },
    { id: 'moderation', label: 'Modération', icon: Shield },
    { id: 'maintenance', label: 'Maintenance', icon: Power },
    { id: 'backup', label: 'Backup & Export', icon: Database }
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Paramètres de la plateforme</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Configurez les paramètres globaux de ClipBox
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
            {/* General Configuration Tab */}
            {activeTab === 'general' && (
              <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                  Configuration générale
                </h2>
                
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Nom du site
                      </label>
                      <input
                        type="text"
                        value={generalConfig.siteName}
                        onChange={(e) => setGeneralConfig({...generalConfig, siteName: e.target.value})}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        URL du site
                      </label>
                      <input
                        type="url"
                        value={generalConfig.siteUrl}
                        onChange={(e) => setGeneralConfig({...generalConfig, siteUrl: e.target.value})}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Email de support
                      </label>
                      <input
                        type="email"
                        value={generalConfig.supportEmail}
                        onChange={(e) => setGeneralConfig({...generalConfig, supportEmail: e.target.value})}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Langue par défaut
                      </label>
                      <select
                        value={generalConfig.defaultLanguage}
                        onChange={(e) => setGeneralConfig({...generalConfig, defaultLanguage: e.target.value})}
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
                        value={generalConfig.timezone}
                        onChange={(e) => setGeneralConfig({...generalConfig, timezone: e.target.value})}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      >
                        <option value="Europe/Paris">Europe/Paris</option>
                        <option value="Europe/London">Europe/London</option>
                        <option value="America/New_York">America/New_York</option>
                        <option value="Asia/Tokyo">Asia/Tokyo</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Taille max upload (MB)
                      </label>
                      <input
                        type="number"
                        value={generalConfig.maxUploadSize}
                        onChange={(e) => setGeneralConfig({...generalConfig, maxUploadSize: e.target.value})}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <label className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">Inscriptions activées</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Permettre aux nouveaux utilisateurs de s'inscrire
                        </p>
                      </div>
                      <button
                        onClick={() => setGeneralConfig({...generalConfig, registrationEnabled: !generalConfig.registrationEnabled})}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          generalConfig.registrationEnabled ? 'bg-purple-600' : 'bg-gray-300 dark:bg-gray-600'
                        }`}
                      >
                        <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          generalConfig.registrationEnabled ? 'translate-x-6' : 'translate-x-1'
                        }`} />
                      </button>
                    </label>

                    <label className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">Vérification email requise</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Les utilisateurs doivent vérifier leur email
                        </p>
                      </div>
                      <button
                        onClick={() => setGeneralConfig({...generalConfig, emailVerificationRequired: !generalConfig.emailVerificationRequired})}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          generalConfig.emailVerificationRequired ? 'bg-purple-600' : 'bg-gray-300 dark:bg-gray-600'
                        }`}
                      >
                        <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          generalConfig.emailVerificationRequired ? 'translate-x-6' : 'translate-x-1'
                        }`} />
                      </button>
                    </label>
                  </div>
                </div>
              </div>
            )}

            {/* Commission & Fees Tab */}
            {activeTab === 'commission' && (
              <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                  Paramètres de commission et frais
                </h2>
                
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Commission plateforme (%)
                      </label>
                      <input
                        type="number"
                        value={commissionConfig.platformCommission}
                        onChange={(e) => setCommissionConfig({...commissionConfig, platformCommission: e.target.value})}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Paiement minimum (€)
                      </label>
                      <input
                        type="number"
                        value={commissionConfig.minPayout}
                        onChange={(e) => setCommissionConfig({...commissionConfig, minPayout: e.target.value})}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Fréquence de paiement
                      </label>
                      <select
                        value={commissionConfig.payoutFrequency}
                        onChange={(e) => setCommissionConfig({...commissionConfig, payoutFrequency: e.target.value})}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      >
                        <option value="daily">Quotidien</option>
                        <option value="weekly">Hebdomadaire</option>
                        <option value="biweekly">Bi-mensuel</option>
                        <option value="monthly">Mensuel</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Taux TVA (%)
                      </label>
                      <input
                        type="number"
                        value={commissionConfig.vatRate}
                        onChange={(e) => setCommissionConfig({...commissionConfig, vatRate: e.target.value})}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Frais de traitement (€)
                      </label>
                      <input
                        type="number"
                        value={commissionConfig.processingFee}
                        onChange={(e) => setCommissionConfig({...commissionConfig, processingFee: e.target.value})}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Paiement maximum (€)
                      </label>
                      <input
                        type="number"
                        value={commissionConfig.maxPayoutAmount}
                        onChange={(e) => setCommissionConfig({...commissionConfig, maxPayoutAmount: e.target.value})}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <label className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">Approbation automatique</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Approuver automatiquement les demandes de paiement
                      </p>
                    </div>
                    <button
                      onClick={() => setCommissionConfig({...commissionConfig, autoApprovePayouts: !commissionConfig.autoApprovePayouts})}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        commissionConfig.autoApprovePayouts ? 'bg-purple-600' : 'bg-gray-300 dark:bg-gray-600'
                      }`}
                    >
                      <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        commissionConfig.autoApprovePayouts ? 'translate-x-6' : 'translate-x-1'
                      }`} />
                    </button>
                  </label>
                </div>
              </div>
            )}

            {/* Plan Limits Tab */}
            {activeTab === 'plans' && (
              <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                  Limites et quotas par plan
                </h2>
                
                <div className="space-y-6">
                  {Object.entries(planLimits).map(([plan, limits]) => (
                    <div key={plan} className="p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4 capitalize">
                        Plan {plan}
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Campagnes max
                          </label>
                          <input
                            type="text"
                            value={limits.campaigns}
                            onChange={(e) => setPlanLimits({
                              ...planLimits,
                              [plan]: { ...limits, campaigns: e.target.value }
                            })}
                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Clippers max
                          </label>
                          <input
                            type="text"
                            value={limits.clippers}
                            onChange={(e) => setPlanLimits({
                              ...planLimits,
                              [plan]: { ...limits, clippers: e.target.value }
                            })}
                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Stockage (GB)
                          </label>
                          <input
                            type="text"
                            value={limits.storage}
                            onChange={(e) => setPlanLimits({
                              ...planLimits,
                              [plan]: { ...limits, storage: e.target.value }
                            })}
                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          />
                        </div>
                        <div className="flex items-center">
                          <label className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              checked={limits.analytics}
                              onChange={(e) => setPlanLimits({
                                ...planLimits,
                                [plan]: { ...limits, analytics: e.target.checked }
                              })}
                              className="w-5 h-5 text-purple-600 rounded focus:ring-purple-500"
                            />
                            <span className="text-gray-700 dark:text-gray-300">Analytics avancés</span>
                          </label>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Email Configuration Tab */}
            {activeTab === 'email' && (
              <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                  Configuration des emails transactionnels
                </h2>
                
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Fournisseur
                      </label>
                      <select
                        value={emailConfig.provider}
                        onChange={(e) => setEmailConfig({...emailConfig, provider: e.target.value})}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      >
                        <option value="sendgrid">SendGrid</option>
                        <option value="mailgun">Mailgun</option>
                        <option value="ses">Amazon SES</option>
                        <option value="smtp">SMTP</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Email expéditeur
                      </label>
                      <input
                        type="email"
                        value={emailConfig.fromEmail}
                        onChange={(e) => setEmailConfig({...emailConfig, fromEmail: e.target.value})}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Nom expéditeur
                      </label>
                      <input
                        type="text"
                        value={emailConfig.fromName}
                        onChange={(e) => setEmailConfig({...emailConfig, fromName: e.target.value})}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Email de réponse
                      </label>
                      <input
                        type="email"
                        value={emailConfig.replyToEmail}
                        onChange={(e) => setEmailConfig({...emailConfig, replyToEmail: e.target.value})}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">Types d'emails</h3>
                    
                    <label className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">Email de bienvenue</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Envoyer un email lors de l'inscription
                        </p>
                      </div>
                      <input
                        type="checkbox"
                        checked={emailConfig.welcomeEmailEnabled}
                        onChange={(e) => setEmailConfig({...emailConfig, welcomeEmailEnabled: e.target.checked})}
                        className="w-5 h-5 text-purple-600 rounded focus:ring-purple-500"
                      />
                    </label>

                    <label className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">Notifications campagnes</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Notifier les changements de statut des campagnes
                        </p>
                      </div>
                      <input
                        type="checkbox"
                        checked={emailConfig.campaignNotificationsEnabled}
                        onChange={(e) => setEmailConfig({...emailConfig, campaignNotificationsEnabled: e.target.checked})}
                        className="w-5 h-5 text-purple-600 rounded focus:ring-purple-500"
                      />
                    </label>

                    <label className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">Notifications paiements</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Envoyer des emails pour les paiements
                        </p>
                      </div>
                      <input
                        type="checkbox"
                        checked={emailConfig.paymentNotificationsEnabled}
                        onChange={(e) => setEmailConfig({...emailConfig, paymentNotificationsEnabled: e.target.checked})}
                        className="w-5 h-5 text-purple-600 rounded focus:ring-purple-500"
                      />
                    </label>

                    <label className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">Rapports hebdomadaires</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Envoyer des rapports de performance
                        </p>
                      </div>
                      <input
                        type="checkbox"
                        checked={emailConfig.weeklyReportsEnabled}
                        onChange={(e) => setEmailConfig({...emailConfig, weeklyReportsEnabled: e.target.checked})}
                        className="w-5 h-5 text-purple-600 rounded focus:ring-purple-500"
                      />
                    </label>
                  </div>
                </div>
              </div>
            )}

            {/* API Keys Tab */}
            {activeTab === 'api' && (
              <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                  Gestion des clés API
                </h2>
                
                <div className="space-y-6">
                  {/* Stripe */}
                  <div className="p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Stripe</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Clé publique
                        </label>
                        <div className="relative">
                          <input
                            type={showApiKey['stripe-public'] ? 'text' : 'password'}
                            value={apiKeys.stripe.publishable}
                            className="w-full px-4 py-2 pr-10 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white font-mono text-sm"
                            readOnly
                          />
                          <button
                            onClick={() => toggleApiKeyVisibility('stripe-public')}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                          >
                            {showApiKey['stripe-public'] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Clé secrète
                        </label>
                        <div className="relative">
                          <input
                            type={showApiKey['stripe-secret'] ? 'text' : 'password'}
                            value={apiKeys.stripe.secret}
                            className="w-full px-4 py-2 pr-10 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white font-mono text-sm"
                            readOnly
                          />
                          <button
                            onClick={() => toggleApiKeyVisibility('stripe-secret')}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                          >
                            {showApiKey['stripe-secret'] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Veriff */}
                  <div className="p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Veriff</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          API Key
                        </label>
                        <div className="relative">
                          <input
                            type={showApiKey['veriff'] ? 'text' : 'password'}
                            value={apiKeys.veriff.apiKey}
                            className="w-full px-4 py-2 pr-10 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white font-mono text-sm"
                            readOnly
                          />
                          <button
                            onClick={() => toggleApiKeyVisibility('veriff')}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                          >
                            {showApiKey['veriff'] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* SendGrid */}
                  <div className="p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">SendGrid</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          API Key
                        </label>
                        <div className="relative">
                          <input
                            type={showApiKey['sendgrid'] ? 'text' : 'password'}
                            value={apiKeys.sendgrid.apiKey}
                            className="w-full px-4 py-2 pr-10 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white font-mono text-sm"
                            readOnly
                          />
                          <button
                            onClick={() => toggleApiKeyVisibility('sendgrid')}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                          >
                            {showApiKey['sendgrid'] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Moderation Tab */}
            {activeTab === 'moderation' && (
              <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                  Paramètres de modération
                </h2>
                
                <div className="space-y-6">
                  <div className="space-y-4">
                    <label className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">Modération automatique</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Activer la modération automatique du contenu
                        </p>
                      </div>
                      <button
                        onClick={() => setModerationConfig({...moderationConfig, autoModeration: !moderationConfig.autoModeration})}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          moderationConfig.autoModeration ? 'bg-purple-600' : 'bg-gray-300 dark:bg-gray-600'
                        }`}
                      >
                        <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          moderationConfig.autoModeration ? 'translate-x-6' : 'translate-x-1'
                        }`} />
                      </button>
                    </label>

                    <label className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">Filtre de vulgarité</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Bloquer le contenu inapproprié
                        </p>
                      </div>
                      <button
                        onClick={() => setModerationConfig({...moderationConfig, profanityFilter: !moderationConfig.profanityFilter})}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          moderationConfig.profanityFilter ? 'bg-purple-600' : 'bg-gray-300 dark:bg-gray-600'
                        }`}
                      >
                        <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          moderationConfig.profanityFilter ? 'translate-x-6' : 'translate-x-1'
                        }`} />
                      </button>
                    </label>

                    <label className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">Détection de spam</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Identifier et bloquer le spam
                        </p>
                      </div>
                      <button
                        onClick={() => setModerationConfig({...moderationConfig, spamDetection: !moderationConfig.spamDetection})}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          moderationConfig.spamDetection ? 'bg-purple-600' : 'bg-gray-300 dark:bg-gray-600'
                        }`}
                      >
                        <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          moderationConfig.spamDetection ? 'translate-x-6' : 'translate-x-1'
                        }`} />
                      </button>
                    </label>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Longueur minimale du contenu
                      </label>
                      <input
                        type="number"
                        value={moderationConfig.minContentLength}
                        onChange={(e) => setModerationConfig({...moderationConfig, minContentLength: e.target.value})}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Signalements avant masquage
                      </label>
                      <input
                        type="number"
                        value={moderationConfig.maxReportsBeforeHide}
                        onChange={(e) => setModerationConfig({...moderationConfig, maxReportsBeforeHide: e.target.value})}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Mots interdits (séparés par des virgules)
                    </label>
                    <textarea
                      value={moderationConfig.blacklistedWords}
                      onChange={(e) => setModerationConfig({...moderationConfig, blacklistedWords: e.target.value})}
                      rows={3}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Maintenance Tab */}
            {activeTab === 'maintenance' && (
              <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                  Mode maintenance
                </h2>
                
                <div className="space-y-6">
                  <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                    <div className="flex items-start gap-3">
                      <AlertCircle className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mt-0.5" />
                      <div>
                        <p className="font-medium text-yellow-900 dark:text-yellow-400">Attention</p>
                        <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-1">
                          L'activation du mode maintenance rendra le site inaccessible aux utilisateurs.
                        </p>
                      </div>
                    </div>
                  </div>

                  <label className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">Activer le mode maintenance</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Le site sera inaccessible sauf pour les admins
                      </p>
                    </div>
                    <button
                      onClick={() => setMaintenanceMode(!maintenanceMode)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        maintenanceMode ? 'bg-red-600' : 'bg-gray-300 dark:bg-gray-600'
                      }`}
                    >
                      <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        maintenanceMode ? 'translate-x-6' : 'translate-x-1'
                      }`} />
                    </button>
                  </label>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Message de maintenance
                    </label>
                    <textarea
                      value={maintenanceConfig.message}
                      onChange={(e) => setMaintenanceConfig({...maintenanceConfig, message: e.target.value})}
                      rows={3}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Durée estimée
                    </label>
                    <input
                      type="text"
                      value={maintenanceConfig.estimatedTime}
                      onChange={(e) => setMaintenanceConfig({...maintenanceConfig, estimatedTime: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Backup & Export Tab */}
            {activeTab === 'backup' && (
              <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                  Backup et export de données
                </h2>
                
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
                      <Database className="w-8 h-8 text-purple-600 mb-3" />
                      <h3 className="font-medium text-gray-900 dark:text-white mb-2">Backup complet</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                        Créer une sauvegarde complète de la base de données
                      </p>
                      <button
                        onClick={handleBackup}
                        className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                      >
                        <RefreshCw className="w-4 h-4 inline mr-2" />
                        Créer un backup
                      </button>
                    </div>

                    <div className="p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
                      <Download className="w-8 h-8 text-purple-600 mb-3" />
                      <h3 className="font-medium text-gray-900 dark:text-white mb-2">Export de données</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                        Exporter toutes les données au format JSON
                      </p>
                      <button
                        onClick={handleExportData}
                        className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                      >
                        <Download className="w-4 h-4 inline mr-2" />
                        Exporter les données
                      </button>
                    </div>
                  </div>

                  <div className="p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
                    <h3 className="font-medium text-gray-900 dark:text-white mb-4">Backups récents</h3>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between py-2">
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">backup_2024_03_15.sql</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">15 Mars 2024 - 2.3 GB</p>
                        </div>
                        <button className="text-purple-600 hover:text-purple-700 dark:text-purple-400">
                          <Download className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="flex items-center justify-between py-2">
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">backup_2024_03_08.sql</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">8 Mars 2024 - 2.1 GB</p>
                        </div>
                        <button className="text-purple-600 hover:text-purple-700 dark:text-purple-400">
                          <Download className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="flex items-center justify-between py-2">
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">backup_2024_03_01.sql</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">1 Mars 2024 - 2.0 GB</p>
                        </div>
                        <button className="text-purple-600 hover:text-purple-700 dark:text-purple-400">
                          <Download className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Save Button */}
          {activeTab !== 'backup' && (
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