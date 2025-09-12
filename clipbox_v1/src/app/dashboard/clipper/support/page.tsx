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
  X
} from 'lucide-react';
import ChatWidget from '@/components/features/support/ChatWidget';

export default function ClipperSupportPage() {
  const [activeTab, setActiveTab] = useState('faq');
  const [showChatWidget, setShowChatWidget] = useState(false);

  const faqItems = [
    {
      category: 'Paiements',
      questions: [
        { q: 'Quand vais-je recevoir mon paiement ?', a: 'Les paiements sont effectués selon votre plan. Plan Pro : hebdomadaire, Plan Starter : bi-mensuel.' },
        { q: 'Quels sont les moyens de paiement disponibles ?', a: 'Virement bancaire, PayPal et Stripe sont disponibles.' },
        { q: 'Comment modifier mes informations de paiement ?', a: 'Allez dans Paramètres > Paiement pour mettre à jour vos informations.' }
      ]
    },
    {
      category: 'Campagnes',
      questions: [
        { q: 'Comment postuler à une campagne ?', a: 'Cliquez sur "Postuler" sur la page de la campagne et suivez les instructions.' },
        { q: 'Combien de campagnes puis-je faire simultanément ?', a: 'Cela dépend de votre plan. Consultez la page Abonnement pour plus de détails.' },
        { q: 'Comment soumettre mon contenu ?', a: 'Utilisez la page Soumissions pour uploader votre contenu et les liens.' }
      ]
    },
    {
      category: 'Compte',
      questions: [
        { q: 'Comment vérifier mon compte ?', a: 'La vérification se fait via Veriff. Allez dans Paramètres > Sécurité.' },
        { q: 'Comment changer mon plan d\'abonnement ?', a: 'Visitez la page Abonnement et choisissez le plan qui vous convient.' },
        { q: 'Comment supprimer mon compte ?', a: 'Allez dans Paramètres > Zone danger. Attention, cette action est irréversible.' }
      ]
    }
  ];

  const resources = [
    { title: 'Guide du débutant', type: 'PDF', icon: FileText, url: '#' },
    { title: 'Optimiser vos contenus', type: 'Vidéo', icon: Youtube, url: '#' },
    { title: 'Bonnes pratiques ClipBox', type: 'Article', icon: Book, url: '#' },
    { title: 'Tutoriel : Première campagne', type: 'Vidéo', icon: Youtube, url: '#' }
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Aide et Support
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Obtenez de l'aide rapidement ou consultez nos ressources
        </p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <button
          onClick={() => {
            setActiveTab('chat');
            setShowChatWidget(true);
          }}
          className="p-6 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors"
        >
          <MessageCircle className="w-8 h-8 mb-3" />
          <h3 className="font-semibold mb-1">Chat en direct</h3>
          <p className="text-sm opacity-90">Support instantané</p>
        </button>

        <button
          onClick={() => {
            setActiveTab('chat');
            setShowChatWidget(true);
          }}
          className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow"
        >
          <Headphones className="w-8 h-8 mb-3 text-blue-600 dark:text-blue-400" />
          <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Support technique</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">Disponible 24/7</p>
        </button>

        <a
          href="#"
          className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow"
        >
          <Phone className="w-8 h-8 mb-3 text-green-600 dark:text-green-400" />
          <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Appelez-nous</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">+33 1 23 45 67 89</p>
        </a>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 mb-6 border-b border-gray-200 dark:border-gray-700">
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
          FAQ
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
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700" style={{ height: '600px' }}>
          <ChatWidget
            userRole="clipper"
            userId="clipper-user-1"
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
              Support par chat
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Cliquez sur le bouton ci-dessous pour démarrer une conversation avec notre équipe support
            </p>
            <button
              onClick={() => setShowChatWidget(true)}
              className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              Ouvrir le chat
            </button>
          </div>
        </div>
      )}

      {activeTab === 'faq' && (
        <div className="space-y-6">
          {faqItems.map((category, index) => (
            <div key={index} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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