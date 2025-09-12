'use client';

import { useState } from 'react';
import { Cookie, Shield, BarChart, Megaphone, Settings, Info, Check, X } from 'lucide-react';

export default function CookiesPage() {
  const [preferences, setPreferences] = useState({
    essential: true,
    performance: true,
    marketing: false,
    analytics: true
  });

  const handlePreferenceChange = (type: keyof typeof preferences) => {
    if (type === 'essential') return; // Les cookies essentiels ne peuvent pas être désactivés
    setPreferences(prev => ({
      ...prev,
      [type]: !prev[type]
    }));
  };

  const handleSavePreferences = () => {
    // TODO: Implémenter la sauvegarde des préférences
    console.log('Préférences sauvegardées:', preferences);
    alert('Vos préférences de cookies ont été enregistrées.');
  };

  const cookieCategories = [
    {
      id: 'essential',
      name: 'Cookies essentiels',
      icon: Shield,
      color: 'green',
      required: true,
      description: 'Ces cookies sont nécessaires au fonctionnement du site et ne peuvent pas être désactivés.',
      purposes: [
        'Maintenir votre session de connexion',
        'Mémoriser vos préférences de langue',
        'Assurer la sécurité de votre compte',
        'Prévenir les activités frauduleuses'
      ],
      examples: [
        { name: 'session_id', duration: 'Session', purpose: 'Identifiant de session' },
        { name: 'auth_token', duration: '7 jours', purpose: 'Authentification' },
        { name: 'csrf_token', duration: 'Session', purpose: 'Protection CSRF' }
      ]
    },
    {
      id: 'performance',
      name: 'Cookies de performance',
      icon: BarChart,
      color: 'blue',
      required: false,
      description: 'Ces cookies nous aident à comprendre comment les visiteurs utilisent notre site.',
      purposes: [
        'Analyser les pages les plus visitées',
        'Identifier les erreurs techniques',
        'Mesurer les temps de chargement',
        'Améliorer l\'expérience utilisateur'
      ],
      examples: [
        { name: '_ga', duration: '2 ans', purpose: 'Google Analytics' },
        { name: '_gid', duration: '24 heures', purpose: 'Google Analytics' },
        { name: 'perf_metrics', duration: '30 jours', purpose: 'Métriques de performance' }
      ]
    },
    {
      id: 'marketing',
      name: 'Cookies marketing',
      icon: Megaphone,
      color: 'purple',
      required: false,
      description: 'Ces cookies sont utilisés pour personnaliser les publicités et mesurer leur efficacité.',
      purposes: [
        'Afficher des publicités pertinentes',
        'Limiter le nombre de fois qu\'une publicité est affichée',
        'Mesurer l\'efficacité des campagnes publicitaires',
        'Retargeting sur d\'autres plateformes'
      ],
      examples: [
        { name: 'fbp', duration: '90 jours', purpose: 'Facebook Pixel' },
        { name: 'ads_session', duration: '30 jours', purpose: 'Google Ads' },
        { name: 'li_sugr', duration: '90 jours', purpose: 'LinkedIn Insight' }
      ]
    },
    {
      id: 'analytics',
      name: 'Cookies analytiques',
      icon: Info,
      color: 'orange',
      required: false,
      description: 'Ces cookies nous permettent de comprendre comment vous interagissez avec notre plateforme.',
      purposes: [
        'Comprendre les parcours utilisateurs',
        'Identifier les fonctionnalités populaires',
        'Analyser les taux de conversion',
        'Optimiser l\'interface utilisateur'
      ],
      examples: [
        { name: 'hotjar_id', duration: '365 jours', purpose: 'Hotjar Analytics' },
        { name: 'mixpanel_id', duration: '1 an', purpose: 'Mixpanel Analytics' },
        { name: 'segment_id', duration: '1 an', purpose: 'Segment Analytics' }
      ]
    }
  ];

  const getColorClasses = (color: string) => {
    const colors: { [key: string]: { bg: string; text: string; border: string } } = {
      green: { 
        bg: 'bg-green-50 dark:bg-green-900/20', 
        text: 'text-green-600 dark:text-green-400',
        border: 'border-green-200 dark:border-green-800'
      },
      blue: { 
        bg: 'bg-blue-50 dark:bg-blue-900/20', 
        text: 'text-blue-600 dark:text-blue-400',
        border: 'border-blue-200 dark:border-blue-800'
      },
      purple: { 
        bg: 'bg-purple-50 dark:bg-purple-900/20', 
        text: 'text-purple-600 dark:text-purple-400',
        border: 'border-purple-200 dark:border-purple-800'
      },
      orange: { 
        bg: 'bg-orange-50 dark:bg-orange-900/20', 
        text: 'text-orange-600 dark:text-orange-400',
        border: 'border-orange-200 dark:border-orange-800'
      }
    };
    return colors[color] || colors.blue;
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-blue-50 to-green-50 dark:from-gray-800 dark:to-gray-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <Cookie className="w-16 h-16 text-blue-600 dark:text-blue-400 mx-auto mb-6" />
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              Politique de cookies
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-4">
              Nous utilisons des cookies pour améliorer votre expérience
            </p>
            <p className="text-gray-600 dark:text-gray-400">
              Découvrez comment nous utilisons les cookies et gérez vos préférences
            </p>
          </div>
        </div>
      </section>

      {/* Introduction */}
      <section className="py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Qu'est-ce qu'un cookie ?
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Les cookies sont de petits fichiers texte stockés sur votre appareil lorsque vous visitez 
                notre site web. Ils nous aident à mémoriser vos préférences, à améliorer votre expérience 
                et à comprendre comment vous utilisez notre plateforme.
              </p>
              <p className="text-gray-600 dark:text-gray-300">
                Certains cookies sont essentiels au fonctionnement du site, tandis que d'autres nous aident 
                à personnaliser votre expérience ou à analyser les performances. Vous pouvez contrôler 
                l'utilisation des cookies non essentiels via les paramètres ci-dessous.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Préférences de cookies */}
      <section className="py-12 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">
              Gérer vos préférences
            </h2>
            
            {/* Contrôles rapides */}
            <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-6 mb-8">
              <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Paramètres rapides
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Activez ou désactivez rapidement les catégories de cookies
                  </p>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => setPreferences({
                      essential: true,
                      performance: false,
                      marketing: false,
                      analytics: false
                    })}
                    className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                  >
                    Rejeter tout
                  </button>
                  <button
                    onClick={() => setPreferences({
                      essential: true,
                      performance: true,
                      marketing: true,
                      analytics: true
                    })}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Accepter tout
                  </button>
                </div>
              </div>
            </div>

            {/* Catégories de cookies */}
            <div className="space-y-6">
              {cookieCategories.map((category) => {
                const Icon = category.icon;
                const colors = getColorClasses(category.color);
                const isEnabled = preferences[category.id as keyof typeof preferences];
                
                return (
                  <div key={category.id} className="bg-white dark:bg-gray-900 rounded-lg shadow-lg overflow-hidden">
                    <div className={`p-6 ${colors.bg} border-b ${colors.border}`}>
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-4">
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${colors.text} bg-white dark:bg-gray-800`}>
                            <Icon className="w-6 h-6" />
                          </div>
                          <div className="flex-1">
                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                              {category.name}
                              {category.required && (
                                <span className="ml-2 text-sm font-normal text-gray-500 dark:text-gray-400">
                                  (Toujours actif)
                                </span>
                              )}
                            </h3>
                            <p className="text-gray-600 dark:text-gray-300">
                              {category.description}
                            </p>
                          </div>
                        </div>
                        
                        {/* Toggle switch */}
                        <button
                          onClick={() => handlePreferenceChange(category.id as keyof typeof preferences)}
                          disabled={category.required}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                            category.required 
                              ? 'bg-green-600 cursor-not-allowed opacity-75' 
                              : isEnabled 
                                ? 'bg-blue-600' 
                                : 'bg-gray-300 dark:bg-gray-600'
                          }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                              isEnabled ? 'translate-x-6' : 'translate-x-1'
                            }`}
                          />
                        </button>
                      </div>
                    </div>
                    
                    <div className="p-6">
                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <h4 className="font-medium text-gray-900 dark:text-white mb-3">
                            Objectifs
                          </h4>
                          <ul className="space-y-2">
                            {category.purposes.map((purpose, index) => (
                              <li key={index} className="flex items-start space-x-2">
                                <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                                <span className="text-sm text-gray-600 dark:text-gray-400">
                                  {purpose}
                                </span>
                              </li>
                            ))}
                          </ul>
                        </div>
                        
                        <div>
                          <h4 className="font-medium text-gray-900 dark:text-white mb-3">
                            Exemples de cookies
                          </h4>
                          <div className="space-y-2">
                            {category.examples.map((example, index) => (
                              <div key={index} className="text-sm">
                                <div className="flex justify-between">
                                  <span className="font-mono text-gray-700 dark:text-gray-300">
                                    {example.name}
                                  </span>
                                  <span className="text-gray-500 dark:text-gray-400">
                                    {example.duration}
                                  </span>
                                </div>
                                <p className="text-gray-500 dark:text-gray-400 text-xs mt-1">
                                  {example.purpose}
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Bouton de sauvegarde */}
            <div className="mt-8 text-center">
              <button
                onClick={handleSavePreferences}
                className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center gap-2"
              >
                <Settings className="w-5 h-5" />
                Enregistrer mes préférences
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Informations supplémentaires */}
      <section className="py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                Informations supplémentaires
              </h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    Comment désactiver les cookies dans votre navigateur ?
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-3">
                    Vous pouvez également gérer les cookies directement dans les paramètres de votre navigateur :
                  </p>
                  <ul className="list-disc pl-6 space-y-1 text-gray-600 dark:text-gray-300">
                    <li><a href="https://support.google.com/chrome/answer/95647" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline">Chrome</a></li>
                    <li><a href="https://support.mozilla.org/fr/kb/cookies-informations-sites-enregistrent" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline">Firefox</a></li>
                    <li><a href="https://support.apple.com/fr-fr/guide/safari/sfri11471/mac" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline">Safari</a></li>
                    <li><a href="https://support.microsoft.com/fr-fr/microsoft-edge/supprimer-les-cookies-dans-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline">Edge</a></li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    Impact de la désactivation des cookies
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    La désactivation de certains cookies peut affecter votre expérience sur notre site. 
                    Par exemple, sans cookies essentiels, vous ne pourrez pas vous connecter à votre compte. 
                    Sans cookies de performance, nous ne pourrons pas améliorer notre service en fonction 
                    de vos besoins.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    Mises à jour de cette politique
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Nous pouvons mettre à jour cette politique de cookies de temps en temps. 
                    Toute modification sera publiée sur cette page avec une nouvelle date de 
                    "Dernière mise à jour". Nous vous encourageons à consulter régulièrement 
                    cette page pour rester informé de notre utilisation des cookies.
                  </p>
                </div>
              </div>
            </div>
            
            {/* Contact */}
            <div className="mt-8 bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6 border border-blue-200 dark:border-blue-800">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Des questions sur les cookies ?
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Si vous avez des questions sur notre utilisation des cookies ou sur cette politique, 
                n'hésitez pas à nous contacter.
              </p>
              <a
                href="/contact"
                className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:underline font-medium"
              >
                Contactez notre équipe →
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}