'use client';

import { useState } from 'react';
import {
  User,
  Bell,
  Shield,
  CreditCard,
  Globe,
  Palette,
  Mail,
  Smartphone,
  Key,
  Building,
  FileText,
  Save,
  AlertTriangle,
  Check,
  X,
  ChevronRight,
  Eye,
  EyeOff,
  Download,
  Upload,
  Trash2
} from 'lucide-react';

export default function AdvertiserSettingsPage() {
  const [activeTab, setActiveTab] = useState('profile');
  const [showPassword, setShowPassword] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');
  
  const [settings, setSettings] = useState({
    profile: {
      companyName: 'Ma Société',
      email: 'contact@masociete.com',
      phone: '+33 1 23 45 67 89',
      website: 'https://masociete.com',
      address: '123 Rue de la Paix, 75001 Paris',
      siret: '123 456 789 00012',
      tva: 'FR12345678901'
    },
    notifications: {
      emailNotifications: true,
      campaignUpdates: true,
      weeklyReports: true,
      monthlyReports: true,
      newClippers: true,
      budgetAlerts: true,
      performanceAlerts: true
    },
    security: {
      twoFactorAuth: false,
      sessionTimeout: '30',
      ipWhitelist: false,
      apiAccess: false
    },
    billing: {
      paymentMethod: 'card',
      autoRecharge: false,
      rechargeThreshold: '100',
      rechargeAmount: '500',
      invoiceEmail: 'comptabilite@masociete.com'
    },
    preferences: {
      language: 'fr',
      timezone: 'Europe/Paris',
      currency: 'EUR',
      dateFormat: 'DD/MM/YYYY',
      theme: 'light'
    }
  });

  const handleSave = () => {
    setSaveStatus('saving');
    setTimeout(() => {
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 2000);
    }, 1000);
  };

  const tabs = [
    { id: 'profile', label: 'Profil entreprise', icon: Building },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Sécurité', icon: Shield },
    { id: 'billing', label: 'Facturation', icon: CreditCard },
    { id: 'preferences', label: 'Préférences', icon: Globe }
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Paramètres
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Gérez les paramètres de votre compte annonceur
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
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
                      ? 'bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{tab.label}</span>
                  {activeTab === tab.id && (
                    <ChevronRight className="w-4 h-4 ml-auto" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Danger Zone */}
          <div className="mt-8 p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
            <h3 className="text-sm font-semibold text-red-800 dark:text-red-400 mb-2">
              Zone danger
            </h3>
            <button className="text-sm text-red-600 dark:text-red-400 hover:underline">
              Supprimer le compte
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  Informations de l'entreprise
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Nom de l'entreprise
                    </label>
                    <input
                      type="text"
                      value={settings.profile.companyName}
                      onChange={(e) => setSettings({
                        ...settings,
                        profile: { ...settings.profile, companyName: e.target.value }
                      })}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Email de contact
                    </label>
                    <input
                      type="email"
                      value={settings.profile.email}
                      onChange={(e) => setSettings({
                        ...settings,
                        profile: { ...settings.profile, email: e.target.value }
                      })}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Téléphone
                    </label>
                    <input
                      type="tel"
                      value={settings.profile.phone}
                      onChange={(e) => setSettings({
                        ...settings,
                        profile: { ...settings.profile, phone: e.target.value }
                      })}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Site web
                    </label>
                    <input
                      type="url"
                      value={settings.profile.website}
                      onChange={(e) => setSettings({
                        ...settings,
                        profile: { ...settings.profile, website: e.target.value }
                      })}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Adresse
                    </label>
                    <input
                      type="text"
                      value={settings.profile.address}
                      onChange={(e) => setSettings({
                        ...settings,
                        profile: { ...settings.profile, address: e.target.value }
                      })}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      SIRET
                    </label>
                    <input
                      type="text"
                      value={settings.profile.siret}
                      onChange={(e) => setSettings({
                        ...settings,
                        profile: { ...settings.profile, siret: e.target.value }
                      })}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Numéro TVA
                    </label>
                    <input
                      type="text"
                      value={settings.profile.tva}
                      onChange={(e) => setSettings({
                        ...settings,
                        profile: { ...settings.profile, tva: e.target.value }
                      })}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Logo Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Logo de l'entreprise
                  </label>
                  <div className="flex items-center gap-4">
                    <div className="w-24 h-24 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                      <Building className="w-12 h-12 text-gray-400" />
                    </div>
                    <div>
                      <button className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors">
                        <Upload className="w-4 h-4 inline mr-2" />
                        Changer le logo
                      </button>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                        PNG, JPG ou GIF. Max 2MB.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Notifications Tab */}
            {activeTab === 'notifications' && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  Préférences de notification
                </h2>

                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
                    <div>
                      <h3 className="font-medium text-gray-900 dark:text-white">
                        Notifications par email
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Recevoir les notifications importantes par email
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.notifications.emailNotifications}
                        onChange={(e) => setSettings({
                          ...settings,
                          notifications: { ...settings.notifications, emailNotifications: e.target.checked }
                        })}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 dark:peer-focus:ring-orange-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-orange-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
                    <div>
                      <h3 className="font-medium text-gray-900 dark:text-white">
                        Mises à jour de campagne
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Notifications sur l'état de vos campagnes
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.notifications.campaignUpdates}
                        onChange={(e) => setSettings({
                          ...settings,
                          notifications: { ...settings.notifications, campaignUpdates: e.target.checked }
                        })}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 dark:peer-focus:ring-orange-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-orange-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
                    <div>
                      <h3 className="font-medium text-gray-900 dark:text-white">
                        Rapports hebdomadaires
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Recevoir un résumé hebdomadaire de vos performances
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.notifications.weeklyReports}
                        onChange={(e) => setSettings({
                          ...settings,
                          notifications: { ...settings.notifications, weeklyReports: e.target.checked }
                        })}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 dark:peer-focus:ring-orange-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-orange-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
                    <div>
                      <h3 className="font-medium text-gray-900 dark:text-white">
                        Alertes de budget
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Être notifié quand le budget atteint certains seuils
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.notifications.budgetAlerts}
                        onChange={(e) => setSettings({
                          ...settings,
                          notifications: { ...settings.notifications, budgetAlerts: e.target.checked }
                        })}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 dark:peer-focus:ring-orange-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-orange-600"></div>
                    </label>
                  </div>
                </div>
              </div>
            )}

            {/* Security Tab */}
            {activeTab === 'security' && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  Paramètres de sécurité
                </h2>

                <div className="space-y-6">
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-white mb-4">
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
                            className="w-full px-3 py-2 pr-10 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                          />
                          <button
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                          >
                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Nouveau mot de passe
                        </label>
                        <input
                          type="password"
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Confirmer le nouveau mot de passe
                        </label>
                        <input
                          type="password"
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                    <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
                      <div>
                        <h3 className="font-medium text-gray-900 dark:text-white">
                          Authentification à deux facteurs
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Ajouter une couche de sécurité supplémentaire
                        </p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={settings.security.twoFactorAuth}
                          onChange={(e) => setSettings({
                            ...settings,
                            security: { ...settings.security, twoFactorAuth: e.target.checked }
                          })}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 dark:peer-focus:ring-orange-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-orange-600"></div>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Billing Tab */}
            {activeTab === 'billing' && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  Paramètres de facturation
                </h2>

                <div className="space-y-6">
                  {/* Payment Method */}
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-white mb-4">
                      Méthode de paiement
                    </h3>
                    <div className="space-y-3">
                      <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <CreditCard className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                            <div>
                              <p className="font-medium text-gray-900 dark:text-white">
                                Carte bancaire •••• 4242
                              </p>
                              <p className="text-sm text-gray-500 dark:text-gray-400">
                                Expire 12/2025
                              </p>
                            </div>
                          </div>
                          <button className="text-sm text-orange-600 dark:text-orange-400 hover:underline">
                            Modifier
                          </button>
                        </div>
                      </div>
                      <button className="w-full p-3 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg text-gray-600 dark:text-gray-400 hover:border-orange-500 hover:text-orange-600 dark:hover:text-orange-400 transition-colors">
                        + Ajouter une méthode de paiement
                      </button>
                    </div>
                  </div>

                  {/* Auto Recharge */}
                  <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                    <h3 className="font-medium text-gray-900 dark:text-white mb-4">
                      Recharge automatique
                    </h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
                        <div>
                          <h4 className="font-medium text-gray-900 dark:text-white">
                            Activer la recharge automatique
                          </h4>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            Rechargez automatiquement votre compte quand le solde est bas
                          </p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={settings.billing.autoRecharge}
                            onChange={(e) => setSettings({
                              ...settings,
                              billing: { ...settings.billing, autoRecharge: e.target.checked }
                            })}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 dark:peer-focus:ring-orange-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-orange-600"></div>
                        </label>
                      </div>

                      {settings.billing.autoRecharge && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                              Seuil de déclenchement
                            </label>
                            <div className="relative">
                              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">€</span>
                              <input
                                type="number"
                                value={settings.billing.rechargeThreshold}
                                onChange={(e) => setSettings({
                                  ...settings,
                                  billing: { ...settings.billing, rechargeThreshold: e.target.value }
                                })}
                                className="w-full pl-8 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                              />
                            </div>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                              Montant de la recharge
                            </label>
                            <div className="relative">
                              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">€</span>
                              <input
                                type="number"
                                value={settings.billing.rechargeAmount}
                                onChange={(e) => setSettings({
                                  ...settings,
                                  billing: { ...settings.billing, rechargeAmount: e.target.value }
                                })}
                                className="w-full pl-8 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                              />
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Invoice Settings */}
                  <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                    <h3 className="font-medium text-gray-900 dark:text-white mb-4">
                      Paramètres de facturation
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Email pour les factures
                        </label>
                        <input
                          type="email"
                          value={settings.billing.invoiceEmail}
                          onChange={(e) => setSettings({
                            ...settings,
                            billing: { ...settings.billing, invoiceEmail: e.target.value }
                          })}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Billing History */}
                  <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-medium text-gray-900 dark:text-white">
                        Historique de facturation
                      </h3>
                      <button className="text-sm text-orange-600 dark:text-orange-400 hover:underline flex items-center gap-1">
                        <Download className="w-4 h-4" />
                        Télécharger tout
                      </button>
                    </div>
                    <div className="space-y-3">
                      {[
                        { date: '15 Mars 2024', amount: '€299.00', status: 'Payée', invoice: 'INV-2024-003' },
                        { date: '15 Février 2024', amount: '€299.00', status: 'Payée', invoice: 'INV-2024-002' },
                        { date: '15 Janvier 2024', amount: '€299.00', status: 'Payée', invoice: 'INV-2024-001' },
                      ].map((item, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
                          <div>
                            <p className="font-medium text-gray-900 dark:text-white">{item.invoice}</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">{item.date}</p>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="font-medium text-gray-900 dark:text-white">{item.amount}</span>
                            <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs rounded-full">
                              {item.status}
                            </span>
                            <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                              <Download className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Preferences Tab */}
            {activeTab === 'preferences' && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  Préférences générales
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Langue
                    </label>
                    <select
                      value={settings.preferences.language}
                      onChange={(e) => setSettings({
                        ...settings,
                        preferences: { ...settings.preferences, language: e.target.value }
                      })}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent"
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
                      value={settings.preferences.timezone}
                      onChange={(e) => setSettings({
                        ...settings,
                        preferences: { ...settings.preferences, timezone: e.target.value }
                      })}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    >
                      <option value="Europe/Paris">Europe/Paris</option>
                      <option value="Europe/London">Europe/London</option>
                      <option value="America/New_York">America/New York</option>
                      <option value="Asia/Tokyo">Asia/Tokyo</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Devise
                    </label>
                    <select
                      value={settings.preferences.currency}
                      onChange={(e) => setSettings({
                        ...settings,
                        preferences: { ...settings.preferences, currency: e.target.value }
                      })}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    >
                      <option value="EUR">EUR (€)</option>
                      <option value="USD">USD ($)</option>
                      <option value="GBP">GBP (£)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Format de date
                    </label>
                    <select
                      value={settings.preferences.dateFormat}
                      onChange={(e) => setSettings({
                        ...settings,
                        preferences: { ...settings.preferences, dateFormat: e.target.value }
                      })}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    >
                      <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                      <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                      <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* Save Button */}
            <div className="mt-8 flex items-center justify-end gap-4">
              {saveStatus === 'saved' && (
                <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
                  <Check className="w-5 h-5" />
                  <span className="text-sm font-medium">Modifications enregistrées</span>
                </div>
              )}
              <button
                onClick={handleSave}
                disabled={saveStatus === 'saving'}
                className="px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {saveStatus === 'saving' ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Enregistrement...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    Enregistrer les modifications
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}