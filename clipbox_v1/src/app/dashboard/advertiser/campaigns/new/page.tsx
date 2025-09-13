'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  Info,
  Upload,
  Globe,
  Users,
  DollarSign,
  Calendar,
  Target,
  AlertCircle,
  Check,
  X
} from 'lucide-react';

interface CampaignFormData {
  title: string;
  description: string;
  requirements: string;
  videoUrl: string;
  platform: 'TIKTOK' | 'INSTAGRAM' | 'YOUTUBE';
  budget: number;
  paymentRatio: number;
  duration: number; // in months
  targetCountries: string[];
  targetLanguages: string[];
  maxClippers: number;
}

export default function NewCampaignPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [errors, setErrors] = useState<Partial<Record<keyof CampaignFormData, string>>>({});
  
  const [formData, setFormData] = useState<CampaignFormData>({
    title: '',
    description: '',
    requirements: '',
    videoUrl: '',
    platform: 'TIKTOK',
    budget: 400,
    paymentRatio: 0.10,
    duration: 2,
    targetCountries: [],
    targetLanguages: [],
    maxClippers: 50
  });

  const steps = [
    { id: 1, name: 'Informations', icon: Info },
    { id: 2, name: 'Ciblage', icon: Target },
    { id: 3, name: 'Budget', icon: DollarSign },
    { id: 4, name: 'Révision', icon: Check }
  ];

  const countries = [
    { code: 'FR', name: 'France' },
    { code: 'BE', name: 'Belgique' },
    { code: 'CH', name: 'Suisse' },
    { code: 'CA', name: 'Canada' },
    { code: 'US', name: 'États-Unis' },
    { code: 'GB', name: 'Royaume-Uni' },
    { code: 'DE', name: 'Allemagne' },
    { code: 'ES', name: 'Espagne' },
    { code: 'IT', name: 'Italie' }
  ];

  const languages = [
    { code: 'fr', name: 'Français' },
    { code: 'en', name: 'Anglais' },
    { code: 'es', name: 'Espagnol' },
    { code: 'de', name: 'Allemand' },
    { code: 'it', name: 'Italien' },
    { code: 'pt', name: 'Portugais' },
    { code: 'nl', name: 'Néerlandais' }
  ];

  const validateStep = (step: number): boolean => {
    const newErrors: Partial<Record<keyof CampaignFormData, string>> = {};

    switch (step) {
      case 1:
        if (!formData.title) newErrors.title = 'Le titre est requis';
        if (!formData.description) newErrors.description = 'La description est requise';
        if (!formData.requirements) newErrors.requirements = 'Les requirements sont requis';
        if (!formData.videoUrl) newErrors.videoUrl = 'L\'URL de la vidéo est requise';
        else if (!formData.videoUrl.includes('youtube.com') && !formData.videoUrl.includes('youtu.be')) {
          newErrors.videoUrl = 'L\'URL doit être une vidéo YouTube valide';
        }
        break;
      case 2:
        if (formData.targetCountries.length === 0) {
          newErrors.targetCountries = 'Sélectionnez au moins un pays';
        }
        if (formData.targetLanguages.length === 0) {
          newErrors.targetLanguages = 'Sélectionnez au moins une langue';
        }
        break;
      case 3:
        if (formData.budget < 400) {
          newErrors.budget = 'Le budget minimum est de 400€';
        }
        if (formData.duration < 2) {
          newErrors.duration = 'La durée minimum est de 2 mois';
        }
        if (formData.paymentRatio < 0.10 || formData.paymentRatio > 100) {
          newErrors.paymentRatio = 'Le montant doit être entre 0.10€ et 100€ par 1000 vues';
        }
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleSubmit = async () => {
    if (!validateStep(3)) return;

    setIsSubmitting(true);
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // In real app, would call:
      // const response = await fetch('/api/advertiser/campaigns', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(formData)
      // });

      router.push('/dashboard/advertiser/campaigns');
    } catch (error) {
      console.error('Error creating campaign:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const calculateCostPerClip = () => {
    // Now paymentRatio represents €/1000 views directly
    return formData.paymentRatio;
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-4 sm:mb-6">
        <Link
          href="/dashboard/advertiser/campaigns"
          className="inline-flex items-center text-xs sm:text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 mb-3 sm:mb-4"
        >
          <ArrowLeft className="h-3 w-3 sm:h-4 sm:w-4 mr-1.5 sm:mr-2" />
          Retour aux campagnes
        </Link>
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
          Créer une nouvelle campagne
        </h1>
        <p className="mt-1 text-xs sm:text-sm text-gray-500 dark:text-gray-400">
          Configurez votre campagne publicitaire en quelques étapes
        </p>
      </div>

      {/* Progress Steps - Mobile Optimized */}
      <div className="mb-6 sm:mb-8">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isActive = step.id === currentStep;
            const isCompleted = step.id < currentStep;
            
            return (
              <div key={step.id} className="flex items-center flex-1">
                <div className="relative flex flex-col sm:flex-row items-center">
                  <div
                    className={`
                      w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center flex-shrink-0
                      ${isActive ? 'bg-orange-600 text-white' :
                        isCompleted ? 'bg-green-600 text-white' :
                        'bg-gray-200 dark:bg-gray-700 text-gray-400'}
                    `}
                  >
                    {isCompleted ? (
                      <Check className="h-4 w-4 sm:h-5 sm:w-5" />
                    ) : (
                      <Icon className="h-4 w-4 sm:h-5 sm:w-5" />
                    )}
                  </div>
                  <span
                    className={`
                      mt-1 sm:mt-0 sm:ml-3 text-[10px] sm:text-sm font-medium text-center sm:text-left
                      ${isActive ? 'text-orange-600 dark:text-orange-400' :
                        isCompleted ? 'text-green-600 dark:text-green-400' :
                        'text-gray-500 dark:text-gray-400'}
                    `}
                  >
                    {step.name}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`
                      hidden sm:block flex-1 h-0.5 mx-2 sm:mx-4
                      ${isCompleted ? 'bg-green-600' : 'bg-gray-200 dark:bg-gray-700'}
                    `}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Form Content */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 sm:p-6">
        {/* Step 1: Basic Information */}
        {currentStep === 1 && (
          <div className="space-y-4 sm:space-y-6">
            <h2 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-3 sm:mb-4">
              Informations de base
            </h2>

            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5 sm:mb-2">
                Titre de la campagne *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className={`w-full px-3 sm:px-4 py-2 text-sm sm:text-base border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                  errors.title ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                }`}
                placeholder="Ex: Lancement de notre nouvelle collection"
              />
              {errors.title && (
                <p className="mt-1 text-xs sm:text-sm text-red-500">{errors.title}</p>
              )}
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5 sm:mb-2">
                Description *
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                className={`w-full px-3 sm:px-4 py-2 text-sm sm:text-base border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                  errors.description ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                }`}
                placeholder="Décrivez votre campagne et vos objectifs..."
              />
              {errors.description && (
                <p className="mt-1 text-xs sm:text-sm text-red-500">{errors.description}</p>
              )}
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5 sm:mb-2">
                Requirements pour les clippers *
              </label>
              <textarea
                value={formData.requirements}
                onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
                rows={3}
                className={`w-full px-3 sm:px-4 py-2 text-sm sm:text-base border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                  errors.requirements ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                }`}
                placeholder="Ex: Mentionner notre marque, utiliser le hashtag #NotreMarque..."
              />
              {errors.requirements && (
                <p className="mt-1 text-xs sm:text-sm text-red-500">{errors.requirements}</p>
              )}
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5 sm:mb-2">
                URL de la vidéo YouTube *
              </label>
              <input
                type="url"
                value={formData.videoUrl}
                onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
                className={`w-full px-3 sm:px-4 py-2 text-sm sm:text-base border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                  errors.videoUrl ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                }`}
                placeholder="https://www.youtube.com/watch?v=..."
              />
              {errors.videoUrl && (
                <p className="mt-1 text-xs sm:text-sm text-red-500">{errors.videoUrl}</p>
              )}
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5 sm:mb-2">
                Plateforme cible *
              </label>
              <div className="grid grid-cols-1 xs:grid-cols-3 gap-2 sm:gap-3">
                {['TIKTOK', 'INSTAGRAM', 'YOUTUBE'].map((platform) => (
                  <button
                    key={platform}
                    type="button"
                    onClick={() => setFormData({ ...formData, platform: platform as any })}
                    className={`
                      px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg border-2 font-medium text-xs sm:text-sm transition-colors
                      ${formData.platform === platform
                        ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400'
                        : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
                      }
                    `}
                  >
                    {platform}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Targeting */}
        {currentStep === 2 && (
          <div className="space-y-4 sm:space-y-6">
            <h2 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-3 sm:mb-4">
              Ciblage de l'audience
            </h2>

            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5 sm:mb-2">
                Pays cibles *
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {countries.map((country) => (
                  <label
                    key={country.code}
                    className="flex items-center space-x-1.5 sm:space-x-2 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={formData.targetCountries.includes(country.code)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setFormData({
                            ...formData,
                            targetCountries: [...formData.targetCountries, country.code]
                          });
                        } else {
                          setFormData({
                            ...formData,
                            targetCountries: formData.targetCountries.filter(c => c !== country.code)
                          });
                        }
                      }}
                      className="rounded border-gray-300 text-orange-600 focus:ring-orange-500 w-3.5 h-3.5 sm:w-4 sm:h-4"
                    />
                    <span className="text-xs sm:text-sm text-gray-700 dark:text-gray-300">
                      {country.name}
                    </span>
                  </label>
                ))}
              </div>
              {errors.targetCountries && (
                <p className="mt-1 text-xs sm:text-sm text-red-500">{errors.targetCountries}</p>
              )}
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5 sm:mb-2">
                Langues cibles *
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {languages.map((language) => (
                  <label
                    key={language.code}
                    className="flex items-center space-x-1.5 sm:space-x-2 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={formData.targetLanguages.includes(language.code)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setFormData({
                            ...formData,
                            targetLanguages: [...formData.targetLanguages, language.code]
                          });
                        } else {
                          setFormData({
                            ...formData,
                            targetLanguages: formData.targetLanguages.filter(l => l !== language.code)
                          });
                        }
                      }}
                      className="rounded border-gray-300 text-orange-600 focus:ring-orange-500 w-3.5 h-3.5 sm:w-4 sm:h-4"
                    />
                    <span className="text-xs sm:text-sm text-gray-700 dark:text-gray-300">
                      {language.name}
                    </span>
                  </label>
                ))}
              </div>
              {errors.targetLanguages && (
                <p className="mt-1 text-xs sm:text-sm text-red-500">{errors.targetLanguages}</p>
              )}
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5 sm:mb-2">
                Nombre max de clippers
              </label>
              <input
                type="number"
                value={formData.maxClippers}
                onChange={(e) => setFormData({ ...formData, maxClippers: parseInt(e.target.value) || 0 })}
                className="w-full px-3 sm:px-4 py-2 text-sm sm:text-base border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                min="1"
              />
            </div>
          </div>
        )}

        {/* Step 3: Budget */}
        {currentStep === 3 && (
          <div className="space-y-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Budget et durée
            </h2>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Budget total (€) *
              </label>
              <input
                type="number"
                value={formData.budget}
                onChange={(e) => setFormData({ ...formData, budget: parseInt(e.target.value) || 0 })}
                className={`w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                  errors.budget ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                }`}
                min="400"
                step="50"
              />
              {errors.budget && (
                <p className="mt-1 text-sm text-red-500">{errors.budget}</p>
              )}
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                Budget minimum : 400€
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Ratio de paiement (€/1000 vues) *
              </label>
              <div className="flex items-center space-x-4">
                <input
                  type="range"
                  value={formData.paymentRatio}
                  onChange={(e) => setFormData({ ...formData, paymentRatio: parseFloat(e.target.value) })}
                  className="flex-1"
                  min="0.10"
                  max="100"
                  step="0.05"
                />
                <span className="text-lg font-semibold text-gray-900 dark:text-white w-24 text-right">
                  {formatCurrency(formData.paymentRatio)}
                </span>
              </div>
              {errors.paymentRatio && (
                <p className="mt-1 text-sm text-red-500">{errors.paymentRatio}</p>
              )}
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                Montant payé aux clippers pour 1000 vues (85% du budget après frais)
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Durée de la campagne (mois) *
              </label>
              <input
                type="number"
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) || 0 })}
                className={`w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                  errors.duration ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                }`}
                min="2"
              />
              {errors.duration && (
                <p className="mt-1 text-sm text-red-500">{errors.duration}</p>
              )}
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                Durée minimum : 2 mois
              </p>
            </div>

            {/* Cost Calculation */}
            <div className="bg-orange-50 dark:bg-orange-900/20 rounded-lg p-4">
              <h3 className="text-sm font-medium text-orange-900 dark:text-orange-300 mb-3">
                Estimation des coûts
              </h3>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Budget total</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {formatCurrency(formData.budget)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Budget clippers (85%)</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {formatCurrency(formData.budget * 0.85)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Frais plateforme (15%)</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {formatCurrency(formData.budget * 0.15)}
                  </span>
                </div>
                <div className="pt-2 border-t border-orange-200 dark:border-orange-800">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-orange-900 dark:text-orange-300">
                      Coût estimé par 1000 vues
                    </span>
                    <span className="text-lg font-bold text-orange-600 dark:text-orange-400">
                      {formatCurrency(formData.paymentRatio)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Review */}
        {currentStep === 4 && (
          <div className="space-y-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Révision et confirmation
            </h2>

            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                  Informations de base
                </h3>
                <p className="font-medium text-gray-900 dark:text-white">{formData.title}</p>
                <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">{formData.description}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                  Plateforme : <span className="font-medium">{formData.platform}</span>
                </p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                  Ciblage
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Pays : {formData.targetCountries.join(', ')}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Langues : {formData.targetLanguages.join(', ')}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Max clippers : {formData.maxClippers}
                </p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                  Budget et durée
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Budget total : <span className="font-medium">{formatCurrency(formData.budget)}</span>
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Durée : <span className="font-medium">{formData.duration} mois</span>
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Coût par 1000 vues : <span className="font-medium">{formatCurrency(formData.paymentRatio)}</span>
                </p>
              </div>
            </div>

            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
              <div className="flex">
                <AlertCircle className="h-5 w-5 text-yellow-600 dark:text-yellow-400 mt-0.5" />
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-yellow-800 dark:text-yellow-300">
                    Validation requise
                  </h3>
                  <p className="mt-1 text-sm text-yellow-700 dark:text-yellow-400">
                    Votre campagne sera soumise à validation par notre équipe avant d'être publiée.
                    Ce processus prend généralement 24 à 48 heures.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-gray-200 dark:border-gray-700">
          {currentStep > 1 ? (
            <button
              onClick={handlePrevious}
              className="px-4 sm:px-6 py-2 text-xs sm:text-sm border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              Précédent
            </button>
          ) : (
            <Link
              href="/dashboard/advertiser/campaigns"
              className="px-4 sm:px-6 py-2 text-xs sm:text-sm border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              Annuler
            </Link>
          )}

          {currentStep < 4 ? (
            <button
              onClick={handleNext}
              className="px-4 sm:px-6 py-2 text-xs sm:text-sm bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
            >
              Suivant
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="px-4 sm:px-6 py-2 text-xs sm:text-sm bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Création...' : 'Créer la campagne'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}