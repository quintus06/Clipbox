'use client';

import { useState } from 'react';
import {
  MessageCircle,
  Phone,
  Mail,
  FileText,
  Send,
  Search,
  Plus,
  Clock,
  CheckCircle,
  AlertCircle,
  XCircle,
  ChevronRight,
  Paperclip,
  HelpCircle,
  Book,
  Youtube,
  ExternalLink,
  Star,
  ThumbsUp,
  ThumbsDown,
  Filter,
  Calendar,
  User,
  Tag,
  MessageSquare,
  Headphones,
  X,
  Building,
  CreditCard,
  Target,
  BarChart3,
  Users,
  Zap
} from 'lucide-react';
import ChatWidget from '@/components/features/support/ChatWidget';

export default function AdvertiserSupportPage() {
  const [activeTab, setActiveTab] = useState('faq');
  const [showChatWidget, setShowChatWidget] = useState(false);

  const faqItems = [
    {
      category: 'Campagnes',
      questions: [
        { q: 'Comment créer une campagne efficace ?', a: 'Définissez clairement vos objectifs, ciblez le bon public, et créez un brief détaillé pour les créateurs.' },
        { q: 'Combien de temps dure une campagne ?', a: 'La durée moyenne est de 2-4 semaines, mais vous pouvez personnaliser selon vos besoins.' },
        { q: 'Comment sélectionner les meilleurs créateurs ?', a: 'Utilisez nos filtres avancés par niche, engagement, et audience démographique.' },
        { q: 'Puis-je modifier une campagne en cours ?', a: 'Oui, vous pouvez ajuster le budget et les paramètres, mais pas les créateurs déjà acceptés.' }
      ]
    },
    {
      category: 'Facturation',
      questions: [
        { q: 'Quels sont les moyens de paiement acceptés ?', a: 'Carte bancaire, virement SEPA, et PayPal pour les comptes vérifiés.' },
        { q: 'Comment fonctionne la facturation ?', a: 'Vous êtes facturé mensuellement pour votre abonnement et au fur et à mesure pour les campagnes.' },
        { q: 'Puis-je obtenir des factures détaillées ?', a: 'Oui, toutes les factures sont disponibles dans la section Facturation de votre profil.' },
        { q: 'Y a-t-il des frais cachés ?', a: 'Non, tous les frais sont transparents : abonnement + budget campagne + commission plateforme.' }
      ]
    },
    {
      category: 'Analytics',
      questions: [
        { q: 'Quelles métriques sont disponibles ?', a: 'Vues, engagement, clics, conversions, ROI, et analyses démographiques détaillées.' },
        { q: 'Puis-je exporter les données ?', a: 'Oui, export disponible en CSV, Excel et PDF pour tous les plans Business et Enterprise.' },
        { q: 'À quelle fréquence les stats sont-elles mises à jour ?', a: 'En temps réel pour les plans Business et Enterprise, toutes les 6h pour les autres.' },
        { q: 'Comment mesurer le ROI de mes campagnes ?', a: 'Utilisez notre tracker de conversions et connectez vos outils analytics (GA4, Pixel FB).' }
      ]
    },
    {
      category: 'Compte',
      questions: [
        { q: 'Comment vérifier mon entreprise ?', a: 'Uploadez vos documents (SIRET, Kbis) dans la section Documents de votre profil.' },
        { q: 'Puis-je avoir plusieurs utilisateurs ?', a: 'Oui, la gestion multi-utilisateurs est disponible à partir du plan Growth.' },
        { q: 'Comment changer mon plan ?', a: 'Allez dans Abonnement et sélectionnez le nouveau plan. Le changement est immédiat.' },
        { q: 'Que se passe-t-il si j\'annule mon abonnement ?', a: 'Les campagnes actives continuent, mais vous ne pourrez plus en créer de nouvelles.' }
      ]
    }
  ];

  const resources = [
    { title: 'Guide de l\'annonceur', type: 'PDF', icon: FileText, url: '#' },
    { title: 'Webinar : Maximiser votre ROI', type: 'Vidéo', icon: Youtube, url: '#' },
    { title: 'Études de cas clients', type: 'Article', icon: Book, url: '#' },
    { title: 'Template de brief de campagne', type: 'Document', icon: FileText, url: '#' },
    { title: 'Calculateur de budget', type: 'Outil', icon: BarChart3, url: '#' },
    { title: 'Guide du ciblage d\'audience', type: 'PDF', icon: Target, url: '#' }
  ];

  const supportPlans = {
    starter: {
      responseTime: '48h',
      channels: ['Email'],
      priority: 'Standard'
    },
    growth: {
      responseTime: '24h',
      channels: ['Email', 'Chat'],
      priority: 'Prioritaire'
    },
    business: {
      responseTime: '2h',
      channels: ['Email', 'Chat', 'Téléphone'],
      priority: 'VIP',
      accountManager: true
    },
    enterprise: {
      responseTime: 'Immédiat',
      channels: ['Tous canaux', 'Slack dédié'],
      priority: 'Premium',
      accountManager: true,
      dedicatedSupport: true
    }
  };

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Centre d'aide
        </h1>
        <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
          Support dédié pour optimiser vos campagnes
        </p>
      </div>

      {/* Support Level Banner */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl p-4 sm:p-6 mb-6 sm:mb-8 text-white">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 sm:gap-3 mb-2">
              <Zap className="w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0" />
              <span className="text-xs sm:text-sm font-medium opacity-90">VOTRE PLAN SUPPORT</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold mb-1">Business</h2>
            <p className="text-sm sm:text-base opacity-90">
              <span className="block sm:inline">Temps de réponse : 2h</span>
              <span className="hidden sm:inline"> • </span>
              <span className="block sm:inline">Support prioritaire VIP</span>
              <span className="hidden sm:inline"> • </span>
              <span className="block sm:inline">Account Manager dédié</span>
            </p>
          </div>
          <div className="flex">
            <button className="w-full sm:w-auto px-3 sm:px-4 py-2 bg-white/20 backdrop-blur rounded-lg hover:bg-white/30 transition-colors text-sm sm:text-base text-center">
              Contacter mon Account Manager
            </button>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
        <button
          onClick={() => {
            setActiveTab('chat');
            setShowChatWidget(true);
          }}
          className="p-4 sm:p-6 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors"
        >
          <MessageCircle className="w-6 h-6 sm:w-8 sm:h-8 mb-2 sm:mb-3" />
          <h3 className="font-semibold mb-1 text-sm sm:text-base">Chat en direct</h3>
          <p className="text-xs sm:text-sm opacity-90">Support VIP</p>
        </button>

        <button
          onClick={() => {
            setActiveTab('chat');
            setShowChatWidget(true);
          }}
          className="p-4 sm:p-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow"
        >
          <Headphones className="w-6 h-6 sm:w-8 sm:h-8 mb-2 sm:mb-3 text-blue-600 dark:text-blue-400" />
          <h3 className="font-semibold text-gray-900 dark:text-white mb-1 text-sm sm:text-base">Support technique</h3>
          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Disponible 24/7</p>
        </button>

        <a
          href="tel:+33123456789"
          className="p-4 sm:p-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow"
        >
          <Phone className="w-6 h-6 sm:w-8 sm:h-8 mb-2 sm:mb-3 text-green-600 dark:text-green-400" />
          <h3 className="font-semibold text-gray-900 dark:text-white mb-1 text-sm sm:text-base">Ligne directe</h3>
          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">+33 1 23 45 67 89</p>
        </a>

        <a
          href="#"
          className="p-4 sm:p-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow"
        >
          <Calendar className="w-6 h-6 sm:w-8 sm:h-8 mb-2 sm:mb-3 text-orange-600 dark:text-orange-400" />
          <h3 className="font-semibold text-gray-900 dark:text-white mb-1 text-sm sm:text-base">Réserver un call</h3>
          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Avec votre AM</p>
        </a>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 sm:gap-4 mb-6 border-b border-gray-200 dark:border-gray-700 overflow-x-auto">
        <button
          onClick={() => {
            setActiveTab('chat');
            setShowChatWidget(true);
          }}
          className={`pb-3 px-1 font-medium transition-colors relative ${
            activeTab === 'chat'
              ? 'text-purple-600 dark:text-purple-400'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
          }`}
        >
          Chat Support
          {activeTab === 'chat' && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-600 dark:bg-purple-400" />
          )}
        </button>
        <button
          onClick={() => setActiveTab('faq')}
          className={`pb-3 px-1 font-medium transition-colors relative ${
            activeTab === 'faq'
              ? 'text-purple-600 dark:text-purple-400'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
          }`}
        >
          FAQ Business
          {activeTab === 'faq' && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-600 dark:bg-purple-400" />
          )}
        </button>
        <button
          onClick={() => setActiveTab('resources')}
          className={`pb-3 px-1 font-medium transition-colors relative ${
            activeTab === 'resources'
              ? 'text-purple-600 dark:text-purple-400'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
          }`}
        >
          Ressources
          {activeTab === 'resources' && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-600 dark:bg-purple-400" />
          )}
        </button>
      </div>

      {/* Content */}
      {activeTab === 'chat' && showChatWidget && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 h-[400px] sm:h-[500px] lg:h-[600px]">
          <ChatWidget
            userRole="advertiser"
            userId="advertiser-user-1"
            className="h-full"
            onClose={() => {
              setShowChatWidget(false);
              setActiveTab('faq');
            }}
          />
        </div>
      )}

      {activeTab === 'chat' && !showChatWidget && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-8">
          <div className="text-center">
            <MessageCircle className="w-16 h-16 text-purple-600 dark:text-purple-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Support VIP par chat
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              En tant que client Business, vous avez accès à notre support prioritaire.
              Cliquez sur le bouton ci-dessous pour démarrer une conversation avec votre Account Manager.
            </p>
            <button
              onClick={() => setShowChatWidget(true)}
              className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              Ouvrir le chat VIP
            </button>
          </div>
        </div>
      )}

      {activeTab === 'faq' && (
        <div className="space-y-6">
          {faqItems.map((category, index) => (
            <div key={index} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                {category.category === 'Campagnes' && <Target className="w-5 h-5 text-purple-600" />}
                {category.category === 'Facturation' && <CreditCard className="w-5 h-5 text-green-600" />}
                {category.category === 'Analytics' && <BarChart3 className="w-5 h-5 text-blue-600" />}
                {category.category === 'Compte' && <Building className="w-5 h-5 text-orange-600" />}
                {category.category}
              </h2>
              <div className="space-y-4">
                {category.questions.map((item, qIndex) => (
                  <details key={qIndex} className="group">
                    <summary className="flex items-center justify-between cursor-pointer list-none">
                      <span className="font-medium text-gray-900 dark:text-white">
                        {item.q}
                      </span>
                      <ChevronRight className="w-5 h-5 text-gray-400 group-open:rotate-90 transition-transform" />
                    </summary>
                    <p className="mt-3 text-gray-600 dark:text-gray-400">
                      {item.a}
                    </p>
                  </details>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'resources' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {resources.map((resource, index) => {
            const Icon = resource.icon;
            return (
              <a
                key={index}
                href={resource.url}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                    <Icon className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900 dark:text-white mb-1">
                      {resource.title}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {resource.type}
                    </p>
                  </div>
                  <ExternalLink className="w-5 h-5 text-gray-400" />
                </div>
              </a>
            );
          })}
        </div>
      )}
    </div>
  );
}