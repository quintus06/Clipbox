'use client';

import { useState } from 'react';
import { useAuth } from '@/hooks/use-auth';
import {
  User,
  Mail,
  Phone,
  Building,
  Globe,
  MapPin,
  Calendar,
  Camera,
  Save,
  Shield,
  Bell,
  Eye,
  EyeOff,
  Check,
  X,
  Edit2,
  Upload,
  FileText,
  CreditCard,
  Briefcase
} from 'lucide-react';

export default function AdvertiserProfilePage() {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [profileData, setProfileData] = useState({
    name: user?.name || 'Entreprise ABC',
    email: user?.email || 'contact@abc.com',
    phone: '+33 1 23 45 67 89',
    company: 'ABC Corporation',
    website: 'https://www.abc-corp.com',
    location: 'Paris, France',
    bio: 'Leader dans le secteur de la technologie, nous créons des solutions innovantes pour nos clients.',
    vatNumber: 'FR12345678901',
    siret: '123 456 789 00012',
    address: '123 Avenue des Champs-Élysées, 75008 Paris',
    sector: 'Technologie',
    employees: '50-200',
    founded: '2015'
  });

  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    sms: false,
    newsletter: true,
    campaignUpdates: true,
    weeklyReport: true
  });

  const handleSave = () => {
    setIsEditing(false);
    // Ici, vous feriez l'appel API pour sauvegarder les données
  };

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Profil Entreprise
        </h1>
        <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
          Gérez les informations de votre entreprise et vos préférences
        </p>
      </div>

      {/* Profile Card */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 mb-6">
        <div className="p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6">
            <div className="flex items-center gap-4 mb-4 sm:mb-0">
              <div className="relative">
                <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white text-2xl sm:text-3xl font-bold">
                  {profileData.company[0]}
                </div>
                {isEditing && (
                  <button className="absolute bottom-0 right-0 p-2 bg-purple-600 text-white rounded-full hover:bg-purple-700 transition-colors">
                    <Camera className="w-4 h-4" />
                  </button>
                )}
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                  {profileData.company}
                </h2>
                <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
                  {profileData.sector} • {profileData.employees} employés
                </p>
              </div>
            </div>
            <button
              onClick={() => isEditing ? handleSave() : setIsEditing(true)}
              className="w-full sm:w-auto px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center gap-2"
            >
              {isEditing ? (
                <>
                  <Save className="w-4 h-4" />
                  Sauvegarder
                </>
              ) : (
                <>
                  <Edit2 className="w-4 h-4" />
                  Modifier
                </>
              )}
            </button>
          </div>

          {/* Company Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Nom de l'entreprise
              </label>
              <div className="flex items-center gap-2">
                <Building className="w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={profileData.company}
                  onChange={(e) => setProfileData({ ...profileData, company: e.target.value })}
                  disabled={!isEditing}
                  className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:opacity-60"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Email professionnel
              </label>
              <div className="flex items-center gap-2">
                <Mail className="w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  value={profileData.email}
                  onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                  disabled={!isEditing}
                  className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:opacity-60"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Téléphone
              </label>
              <div className="flex items-center gap-2">
                <Phone className="w-5 h-5 text-gray-400" />
                <input
                  type="tel"
                  value={profileData.phone}
                  onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                  disabled={!isEditing}
                  className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:opacity-60"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Site web
              </label>
              <div className="flex items-center gap-2">
                <Globe className="w-5 h-5 text-gray-400" />
                <input
                  type="url"
                  value={profileData.website}
                  onChange={(e) => setProfileData({ ...profileData, website: e.target.value })}
                  disabled={!isEditing}
                  className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:opacity-60"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Numéro TVA
              </label>
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={profileData.vatNumber}
                  onChange={(e) => setProfileData({ ...profileData, vatNumber: e.target.value })}
                  disabled={!isEditing}
                  className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:opacity-60"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                SIRET
              </label>
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={profileData.siret}
                  onChange={(e) => setProfileData({ ...profileData, siret: e.target.value })}
                  disabled={!isEditing}
                  className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:opacity-60"
                />
              </div>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Adresse
              </label>
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={profileData.address}
                  onChange={(e) => setProfileData({ ...profileData, address: e.target.value })}
                  disabled={!isEditing}
                  className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:opacity-60"
                />
              </div>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Description de l'entreprise
              </label>
              <textarea
                value={profileData.bio}
                onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                disabled={!isEditing}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:opacity-60 resize-none"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Notifications Settings */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 mb-6">
        <div className="p-4 sm:p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <Bell className="w-5 h-5" />
            Préférences de notifications
          </h3>
          <div className="space-y-4">
            {Object.entries(notifications).map(([key, value]) => (
              <label key={key} className="flex items-center justify-between cursor-pointer">
                <span className="text-gray-700 dark:text-gray-300">
                  {key === 'email' && 'Notifications par email'}
                  {key === 'push' && 'Notifications push'}
                  {key === 'sms' && 'Notifications SMS'}
                  {key === 'newsletter' && 'Newsletter mensuelle'}
                  {key === 'campaignUpdates' && 'Mises à jour des campagnes'}
                  {key === 'weeklyReport' && 'Rapport hebdomadaire'}
                </span>
                <button
                  onClick={() => setNotifications({ ...notifications, [key]: !value })}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    value ? 'bg-purple-600' : 'bg-gray-300 dark:bg-gray-600'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      value ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* Security Settings */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="p-4 sm:p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Sécurité
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Mot de passe actuel
              </label>
              <div className="flex items-center gap-2">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
                <button
                  onClick={() => setShowPassword(!showPassword)}
                  className="p-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>
            <button className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
              Changer le mot de passe
            </button>
            <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white">
                    Authentification à deux facteurs
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Ajoutez une couche de sécurité supplémentaire
                  </p>
                </div>
                <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
                  Activer
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}