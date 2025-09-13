'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp, Search, HelpCircle } from 'lucide-react';
import Link from 'next/link';

interface FAQItem {
  question: string;
  answer: string;
  category: string;
}

export default function FAQPage() {
  const [openItems, setOpenItems] = useState<number[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = [
    'all',
    'Général',
    'Créateurs',
    'Annonceurs',
    'Paiements',
    'Campagnes',
    'Compte',
    'Sécurité'
  ];

  const faqItems: FAQItem[] = [
    // Général
    {
      category: 'Général',
      question: "Qu'est-ce que Clipbox ?",
      answer: "Clipbox est une plateforme innovante qui connecte les marques aux créateurs de contenu pour des campagnes de marketing d'influence. Nous facilitons la collaboration entre annonceurs et créateurs pour produire du contenu viral et authentique sur les réseaux sociaux."
    },
    {
      category: 'Général',
      question: "Y a-t-il une version gratuite ?",
      answer: "Pour les Clippers : Oui, vous pouvez participer à une campagne en version gratuite et recevoir vos paiements mais vous ne pourrez rejoindre qu'une seule campagne jusqu'à votre sortie de cette dernière. Pour les Annonceurs : Oui mais vous ne pourrez créer qu'une campagne et vous disposerez de retours analytics moins avancés."
    },
    {
      category: 'Général',
      question: "Comment fonctionne Clipbox ?",
      answer: "Les annonceurs créent des campagnes avec un brief et un budget défini. Les créateurs peuvent ensuite postuler pour participer à ces campagnes. Une fois sélectionnés, ils créent du contenu selon les directives et sont rémunérés en fonction des performances."
    },

    // Créateurs
    {
      category: 'Créateurs',
      question: "Comment devenir créateur sur Clipbox ?",
      answer: "Pour devenir créateur, inscrivez-vous gratuitement, complétez votre profil avec vos réseaux sociaux et statistiques, puis vérifiez votre identité. Une fois approuvé, vous pouvez commencer à postuler aux campagnes qui vous intéressent."
    },
    {
      category: 'Créateurs',
      question: "Quels sont les critères pour être accepté comme créateur ?",
      answer: "Nous recherchons des créateurs authentiques avec une communauté engagée. Il n'y a pas de minimum d'abonnés strict, mais nous évaluons la qualité du contenu, l'engagement de votre audience et votre adéquation avec notre communauté."
    },
    {
      category: 'Créateurs',
      question: "Comment suis-je rémunéré pour mon contenu ?",
      answer: "La rémunération dépend du type de campagne : paiement fixe, au CPM (coût pour mille vues), ou basé sur les performances. Les détails sont précisés dans chaque campagne. Les paiements sont effectués automatiquement après validation du contenu."
    },
    {
      category: 'Créateurs',
      question: "Puis-je refuser une campagne après avoir été sélectionné ?",
      answer: "Oui, vous pouvez décliner une campagne si elle ne correspond pas à vos valeurs ou votre audience. Cependant, des refus répétés peuvent affecter votre score de fiabilité sur la plateforme."
    },

    // Annonceurs
    {
      category: 'Annonceurs',
      question: "Comment créer ma première campagne ?",
      answer: "Connectez-vous à votre tableau de bord annonceur, cliquez sur 'Nouvelle campagne', définissez vos objectifs, votre budget, votre audience cible et votre brief créatif. Notre équipe peut vous accompagner dans la création de votre première campagne."
    },
    {
      category: 'Annonceurs',
      question: "Quel budget minimum pour une campagne ?",
      answer: "Le budget minimum recommandé est de 500€ pour une campagne test. Cela permet d'obtenir des résultats significatifs avec plusieurs créateurs. Pour des campagnes d'envergure, nous recommandons un budget de 2000€ minimum."
    },
    {
      category: 'Annonceurs',
      question: "Comment sélectionner les bons créateurs ?",
      answer: "Notre algorithme suggère automatiquement les créateurs les plus pertinents selon vos critères. Vous pouvez filtrer par niche, localisation, démographie de l'audience, taux d'engagement et performance passée."
    },
    {
      category: 'Annonceurs',
      question: "Puis-je contrôler le contenu avant publication ?",
      answer: "Oui, vous pouvez demander une validation préalable du contenu. Les créateurs soumettent leur contenu pour approbation avant publication. Vous avez 48h pour valider ou demander des modifications."
    },

    // Paiements
    {
      category: 'Paiements',
      question: "Quels moyens de paiement acceptez-vous ?",
      answer: "Nous acceptons les cartes bancaires (Visa, Mastercard, American Express), les virements SEPA, et PayPal pour les annonceurs. Les créateurs peuvent recevoir leurs paiements par virement bancaire ou PayPal."
    },
    {
      category: 'Paiements',
      question: "Quand les créateurs sont-ils payés ?",
      answer: "Les créateurs sont payés dans les 7 jours suivant la validation de leur contenu. Pour les campagnes basées sur les performances, le paiement est effectué 30 jours après la publication pour comptabiliser les vues."
    },
    {
      category: 'Paiements',
      question: "Y a-t-il des frais cachés ?",
      answer: "Non, tous nos frais sont transparents. Les annonceurs paient une commission de 20% sur le budget de campagne. Les créateurs ne paient aucun frais, ils reçoivent 100% de leur rémunération promise."
    },
    {
      category: 'Paiements',
      question: "Comment obtenir une facture ?",
      answer: "Les factures sont générées automatiquement et disponibles dans votre tableau de bord. Vous pouvez les télécharger à tout moment depuis la section 'Paiements' de votre compte."
    },

    // Campagnes
    {
      category: 'Campagnes',
      question: "Combien de temps dure une campagne ?",
      answer: "La durée d'une campagne est flexible et définie par l'annonceur. En moyenne, une campagne dure entre 2 et 8 semaines. Les campagnes peuvent être prolongées si nécessaire."
    },
    {
      category: 'Campagnes',
      question: "Sur quels réseaux sociaux puis-je lancer des campagnes ?",
      answer: "Clipbox supporte actuellement TikTok, Instagram, YouTube, Twitter et LinkedIn. Nous ajoutons régulièrement de nouvelles plateformes selon la demande."
    },
    {
      category: 'Campagnes',
      question: "Comment mesurer le succès d'une campagne ?",
      answer: "Notre tableau de bord fournit des analytics détaillés : vues, engagement, clics, conversions, ROI. Vous pouvez suivre les performances en temps réel et télécharger des rapports complets."
    },

    // Compte
    {
      category: 'Compte',
      question: "Comment modifier mes informations personnelles ?",
      answer: "Accédez à votre profil depuis le tableau de bord, cliquez sur 'Paramètres' puis 'Informations personnelles'. Vous pouvez y modifier vos coordonnées, mais certaines informations vérifiées nécessitent une nouvelle validation."
    },
    {
      category: 'Compte',
      question: "Puis-je avoir plusieurs comptes ?",
      answer: "Non, chaque utilisateur ne peut avoir qu'un seul compte. Si vous gérez plusieurs marques, utilisez la fonction 'Organisations' pour gérer plusieurs espaces depuis un seul compte."
    },
    {
      category: 'Compte',
      question: "Comment supprimer mon compte ?",
      answer: "Pour supprimer votre compte, allez dans Paramètres > Compte > Supprimer le compte. Attention, cette action est irréversible et toutes vos données seront effacées après 30 jours."
    },

    // Sécurité
    {
      category: 'Sécurité',
      question: "Mes données sont-elles sécurisées ?",
      answer: "Oui, nous utilisons un cryptage SSL de niveau bancaire pour toutes les transmissions. Vos données sont stockées sur des serveurs sécurisés conformes au RGPD. Nous ne partageons jamais vos informations sans votre consentement."
    },
    {
      category: 'Sécurité',
      question: "Comment activer l'authentification à deux facteurs ?",
      answer: "Dans vos paramètres de sécurité, activez l'option '2FA'. Vous pouvez utiliser une application d'authentification (Google Authenticator, Authy) ou recevoir des codes par SMS."
    },
    {
      category: 'Sécurité',
      question: "Que faire si mon compte est compromis ?",
      answer: "Contactez immédiatement notre support à security@clipbox.com. Changez votre mot de passe, vérifiez vos activités récentes et activez l'authentification à deux facteurs pour sécuriser votre compte."
    }
  ];

  const toggleItem = (index: number) => {
    setOpenItems(prev =>
      prev.includes(index)
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  const filteredItems = faqItems.filter(item => {
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesSearch = searchQuery === '' || 
      item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-blue-50 to-green-50 dark:from-gray-800 dark:to-gray-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              Foire Aux Questions
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
              Trouvez rapidement des réponses à vos questions
            </p>
            
            {/* Barre de recherche */}
            <div className="relative max-w-2xl mx-auto">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher une question..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Filtres par catégorie */}
      <section className="py-8 bg-gray-50 dark:bg-gray-800 sticky top-0 z-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-wrap gap-2 justify-center">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-full font-medium transition-colors ${
                    selectedCategory === category
                      ? 'bg-blue-600 text-white'
                      : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600'
                  }`}
                >
                  {category === 'all' ? 'Toutes' : category}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Questions et réponses */}
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            {filteredItems.length === 0 ? (
              <div className="text-center py-12">
                <HelpCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-xl text-gray-600 dark:text-gray-400">
                  Aucune question trouvée pour votre recherche.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredItems.map((item, index) => (
                  <div
                    key={index}
                    className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden"
                  >
                    <button
                      onClick={() => toggleItem(index)}
                      className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                      <div className="flex-1">
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                          {item.question}
                        </h3>
                        <span className="inline-block mt-1 px-2 py-1 text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded">
                          {item.category}
                        </span>
                      </div>
                      {openItems.includes(index) ? (
                        <ChevronUp className="w-5 h-5 text-gray-400" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-gray-400" />
                      )}
                    </button>
                    {openItems.includes(index) && (
                      <div className="px-6 pb-4">
                        <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                          {item.answer}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Section d'aide supplémentaire */}
      <section className="py-16 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Vous avez encore des questions ?
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
              Notre équipe est là pour vous aider
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/contact"
                className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
              >
                Contactez-nous
              </Link>
              <Link
                href="/help"
                className="px-6 py-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-white font-semibold rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
              >
                Centre d'aide
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}