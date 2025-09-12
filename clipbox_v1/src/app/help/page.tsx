'use client';

import { Search, Book, MessageCircle, FileText, Video, Users, CreditCard, Shield, Settings, HelpCircle } from 'lucide-react';
import Link from 'next/link';

export default function HelpCenterPage() {
  const categories = [
    {
      icon: Book,
      title: "Premiers pas",
      description: "Apprenez les bases pour bien démarrer sur Clipbox",
      articles: [
        "Comment créer un compte",
        "Vérifier votre identité",
        "Configurer votre profil",
        "Comprendre le tableau de bord"
      ],
      color: "blue"
    },
    {
      icon: Video,
      title: "Créateurs",
      description: "Tout ce qu'il faut savoir pour les créateurs de contenu",
      articles: [
        "Participer à une campagne",
        "Soumettre votre contenu",
        "Règles de création",
        "Recevoir vos paiements"
      ],
      color: "purple"
    },
    {
      icon: Users,
      title: "Annonceurs",
      description: "Gérez vos campagnes publicitaires efficacement",
      articles: [
        "Créer une campagne",
        "Définir votre budget",
        "Sélectionner des créateurs",
        "Analyser les performances"
      ],
      color: "green"
    },
    {
      icon: CreditCard,
      title: "Paiements",
      description: "Informations sur les transactions et paiements",
      articles: [
        "Méthodes de paiement acceptées",
        "Calendrier des paiements",
        "Factures et reçus",
        "Résoudre les problèmes de paiement"
      ],
      color: "orange"
    },
    {
      icon: Shield,
      title: "Sécurité",
      description: "Protégez votre compte et vos données",
      articles: [
        "Sécuriser votre compte",
        "Authentification à deux facteurs",
        "Signaler un contenu",
        "Politique de confidentialité"
      ],
      color: "red"
    },
    {
      icon: Settings,
      title: "Paramètres",
      description: "Personnalisez votre expérience Clipbox",
      articles: [
        "Notifications",
        "Préférences de langue",
        "Connexions sociales",
        "Supprimer votre compte"
      ],
      color: "gray"
    }
  ];

  const popularArticles = [
    { title: "Comment créer ma première campagne ?", category: "Annonceurs" },
    { title: "Quand vais-je recevoir mon paiement ?", category: "Paiements" },
    { title: "Comment participer à une campagne ?", category: "Créateurs" },
    { title: "Que faire si j'ai oublié mon mot de passe ?", category: "Sécurité" },
    { title: "Comment contacter le support ?", category: "Support" }
  ];

  const getColorClasses = (color: string) => {
    const colors: { [key: string]: { bg: string; text: string; hover: string } } = {
      blue: { 
        bg: "bg-blue-100 dark:bg-blue-900", 
        text: "text-blue-600 dark:text-blue-400",
        hover: "hover:bg-blue-50 dark:hover:bg-blue-900/50"
      },
      purple: { 
        bg: "bg-purple-100 dark:bg-purple-900", 
        text: "text-purple-600 dark:text-purple-400",
        hover: "hover:bg-purple-50 dark:hover:bg-purple-900/50"
      },
      green: { 
        bg: "bg-green-100 dark:bg-green-900", 
        text: "text-green-600 dark:text-green-400",
        hover: "hover:bg-green-50 dark:hover:bg-green-900/50"
      },
      orange: { 
        bg: "bg-orange-100 dark:bg-orange-900", 
        text: "text-orange-600 dark:text-orange-400",
        hover: "hover:bg-orange-50 dark:hover:bg-orange-900/50"
      },
      red: { 
        bg: "bg-red-100 dark:bg-red-900", 
        text: "text-red-600 dark:text-red-400",
        hover: "hover:bg-red-50 dark:hover:bg-red-900/50"
      },
      gray: { 
        bg: "bg-gray-100 dark:bg-gray-800", 
        text: "text-gray-600 dark:text-gray-400",
        hover: "hover:bg-gray-50 dark:hover:bg-gray-800/50"
      }
    };
    return colors[color] || colors.gray;
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Hero Section avec recherche */}
      <section className="relative py-20 bg-gradient-to-br from-blue-50 to-green-50 dark:from-gray-800 dark:to-gray-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              Centre d'aide
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
              Comment pouvons-nous vous aider aujourd'hui ?
            </p>
            
            {/* Barre de recherche */}
            <div className="relative max-w-2xl mx-auto">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher dans l'aide..."
                className="w-full pl-12 pr-4 py-4 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Articles populaires */}
      <section className="py-12 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              Articles populaires
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {popularArticles.map((article, index) => (
                <Link
                  key={index}
                  href="#"
                  className="p-4 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start space-x-3">
                    <FileText className="w-5 h-5 text-gray-400 mt-0.5" />
                    <div>
                      <h3 className="font-medium text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400">
                        {article.title}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        {article.category}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Catégories d'aide */}
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">
              Parcourir par catégorie
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {categories.map((category, index) => {
                const Icon = category.icon;
                const colors = getColorClasses(category.color);
                return (
                  <div
                    key={index}
                    className={`p-6 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 ${colors.hover} transition-colors cursor-pointer`}
                  >
                    <div className={`w-12 h-12 ${colors.bg} rounded-lg flex items-center justify-center mb-4`}>
                      <Icon className={`w-6 h-6 ${colors.text}`} />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                      {category.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                      {category.description}
                    </p>
                    <ul className="space-y-2">
                      {category.articles.slice(0, 3).map((article, articleIndex) => (
                        <li key={articleIndex}>
                          <Link
                            href="#"
                            className="text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
                          >
                            • {article}
                          </Link>
                        </li>
                      ))}
                    </ul>
                    <Link
                      href="#"
                      className={`inline-block mt-4 text-sm font-medium ${colors.text} hover:underline`}
                    >
                      Voir tous les articles →
                    </Link>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Contact Support */}
      <section className="py-16 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <HelpCircle className="w-16 h-16 text-blue-600 dark:text-blue-400 mx-auto mb-6" />
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Vous ne trouvez pas ce que vous cherchez ?
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
              Notre équipe de support est là pour vous aider
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
              >
                <MessageCircle className="w-5 h-5 mr-2" />
                Contacter le support
              </Link>
              <Link
                href="/faq"
                className="inline-flex items-center justify-center px-6 py-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-white font-semibold rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
              >
                <Book className="w-5 h-5 mr-2" />
                Consulter la FAQ
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}