'use client';

import { useState } from 'react';
import Link from 'next/link';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import { 
  Play, 
  DollarSign, 
  Users, 
  TrendingUp, 
  CheckCircle, 
  ArrowRight,
  Zap,
  Shield,
  Award,
  BarChart3,
  Smartphone,
  Video,
  Target,
  Rocket,
  ChevronDown,
  ChevronUp,
  UserCheck,
  FileCheck,
  CreditCard,
  Share2
} from 'lucide-react';

interface FAQItem {
  question: string;
  answer: string;
}

export default function HowItWorksPage() {
  const [activeTab, setActiveTab] = useState<'clipper' | 'advertiser'>('clipper');
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);

  const clipperSteps = [
    {
      icon: <UserCheck className="w-6 h-6" />,
      title: "1. Inscription gratuite",
      description: "Créez votre compte en quelques secondes et complétez votre profil créateur"
    },
    {
      icon: <Target className="w-6 h-6" />,
      title: "2. Choisissez vos campagnes",
      description: "Parcourez les campagnes disponibles et sélectionnez celles qui correspondent à votre audience"
    },
    {
      icon: <Video className="w-6 h-6" />,
      title: "3. Créez du contenu",
      description: "Produisez des clips créatifs selon les guidelines de l'annonceur"
    },
    {
      icon: <Share2 className="w-6 h-6" />,
      title: "4. Publiez et partagez",
      description: "Diffusez votre contenu sur vos réseaux sociaux et engagez votre communauté"
    },
    {
      icon: <DollarSign className="w-6 h-6" />,
      title: "5. Gagnez de l'argent",
      description: "Recevez vos paiements directement sur votre compte selon vos performances"
    }
  ];

  const advertiserSteps = [
    {
      icon: <FileCheck className="w-6 h-6" />,
      title: "1. Créez votre compte gratuitement",
      description: "Créez votre compte en quelques secondes et complétez votre profil annonceur"
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "2. Créez votre campagne",
      description: "Sélectionnez votre contenu à promouvoir, paramétrez vous-même la rémunération des clippers"
    },
    {
      icon: <CreditCard className="w-6 h-6" />,
      title: "3. Rechargez votre balance",
      description: "Rechargez votre balance pour paramétrer le budget de votre campagne"
    },
    {
      icon: <BarChart3 className="w-6 h-6" />,
      title: "4. Suivez les performances",
      description: "Accédez à des analytics détaillées en temps réel"
    },
    {
      icon: <TrendingUp className="w-6 h-6" />,
      title: "5. Optimisez vos résultats",
      description: "Ajustez votre stratégie basée sur les données pour maximiser votre ROI"
    }
  ];

  const clipperBenefits = [
    {
      icon: <DollarSign className="w-8 h-8" />,
      title: "Revenus garantis",
      description: "Gagnez de l'argent pour chaque contenu créé pour chaque 1000 vues"
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Paiements sécurisés",
      description: "Recevez vos paiements rapidement et en toute sécurité"
    },
    {
      icon: <Award className="w-8 h-8" />,
      title: "Liberté créative",
      description: "Exprimez votre créativité tout en respectant les guidelines des annonceurs"
    },
    {
      icon: <Rocket className="w-8 h-8" />,
      title: "Croissance garantie",
      description: "Ne perdez plus de temps à chercher du contenu à clipper monétisables sans risques sur les droits d'auteurs"
    }
  ];

  const advertiserBenefits = [
    {
      icon: <Target className="w-8 h-8" />,
      title: "Ciblage optimisé",
      description: "Ne perdez plus de temps et d'argent à cause d'un ciblage mal paramétré"
    },
    {
      icon: <BarChart3 className="w-8 h-8" />,
      title: "ROI mesurable",
      description: "Suivez chaque euro investi avec nos outils d'analytics avancés"
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: "Développement rapide",
      description: "Développez votre audience, votre visibilité et vos conversions rapidement en passant de la mise en ligne à la diffusion en 48h et grâce aux actions des clippers"
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Créateurs vérifiés",
      description: "Travaillez avec des créateurs authentiques et engagés"
    }
  ];

  const faqItems: FAQItem[] = [
    {
      question: "Comment sont sélectionnés les créateurs ?",
      answer: "Tous nos créateurs passent par un processus de vérification incluant l'analyse de leur audience, leur taux d'engagement et la qualité de leur contenu. Nous nous assurons qu'ils correspondent aux valeurs de Clipbox et des marques partenaires."
    },
    {
      question: "Quels sont les modes de paiement disponibles ?",
      answer: "Les créateurs peuvent recevoir leurs paiements par virement bancaire, PayPal ou Stripe. Les paiements sont effectués automatiquement une fois la campagne validée, généralement sous 7 jours ouvrés."
    },
    {
      question: "Quel est le montant minimum pour lancer une campagne ?",
      answer: "Il n'y a pas de montant minimum fixe. Cependant, nous recommandons un budget d'au moins 1000€ pour obtenir des résultats significatifs. Le budget dépend de vos objectifs et du nombre de créateurs souhaités."
    },
    {
      question: "Comment sont calculées les commissions ?",
      answer: "Les commissions varient selon votre plan d'abonnement : 20% pour le plan Basic, 15% pour le plan Pro, et 10% pour le plan GOAT. Ces commissions sont prélevées sur les paiements aux créateurs."
    },
    {
      question: "Puis-je annuler une campagne en cours ?",
      answer: "Oui, vous pouvez annuler une campagne à tout moment avant sa date de fin. Les fonds non utilisés seront crédités sur votre compte pour une utilisation future. Les contenus déjà créés et validés restent payés aux créateurs."
    },
    {
      question: "Comment garantissez-vous la qualité du contenu ?",
      answer: "Chaque contenu est soumis à validation avant publication. Vous pouvez demander des modifications si nécessaire. Nos créateurs sont formés pour respecter les guidelines et produire du contenu de qualité professionnelle."
    },
    {
      question: "Quelle est la durée moyenne d'une campagne ?",
      answer: "La durée moyenne est de 2 à 4 semaines, mais cela peut varier selon vos objectifs. Vous pouvez créer des campagnes flash de 48h ou des campagnes longue durée sur plusieurs mois."
    },
    {
      question: "Les créateurs peuvent-ils travailler avec plusieurs marques ?",
      answer: "Oui, les créateurs peuvent participer à plusieurs campagnes simultanément, tant qu'il n'y a pas de conflit d'intérêt direct (marques concurrentes). Nous veillons à maintenir l'authenticité et la crédibilité."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <Header />
      
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Comment ça marche ?
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Découvrez comment Clipbox révolutionne la collaboration entre marques, influenceurs et clippers
          </p>
        </div>

        {/* Tab Selector */}
        <div className="flex justify-center mb-12">
          <div className="bg-white dark:bg-gray-800 rounded-full shadow-lg p-1 flex">
            <button
              onClick={() => setActiveTab('clipper')}
              className={`px-6 py-3 rounded-full font-medium transition-all duration-200 ${
                activeTab === 'clipper'
                  ? 'bg-gradient-to-r from-blue-500 to-green-500 text-white'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              Je suis Clipper
            </button>
            <button
              onClick={() => setActiveTab('advertiser')}
              className={`px-6 py-3 rounded-full font-medium transition-all duration-200 ${
                activeTab === 'advertiser'
                  ? 'bg-gradient-to-r from-blue-500 to-green-500 text-white'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              Je suis Annonceur
            </button>
          </div>
        </div>

        {/* Content based on active tab */}
        {activeTab === 'clipper' ? (
          <>
            {/* Clipper Journey */}
            <div className="mb-16">
              <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
                Votre parcours créateur en 5 étapes
              </h2>
              
              <div className="relative">
                {/* Connection Line */}
                <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500 to-green-500 transform -translate-y-1/2"></div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-8">
                  {clipperSteps.map((step, index) => (
                    <div key={index} className="relative">
                      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-green-500 rounded-full flex items-center justify-center text-white mb-4 mx-auto">
                          {step.icon}
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 text-center">
                          {step.title}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400 text-sm text-center">
                          {step.description}
                        </p>
                      </div>
                      {index < clipperSteps.length - 1 && (
                        <ArrowRight className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2 text-gray-400 dark:text-gray-600 w-6 h-6 z-10" />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Clipper Benefits */}
            <div className="mb-16">
              <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
                Pourquoi rejoindre Clipbox ?
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {clipperBenefits.map((benefit, index) => (
                  <div key={index} className="text-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500/10 to-green-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <div className="text-blue-600 dark:text-blue-400">
                        {benefit.icon}
                      </div>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                      {benefit.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      {benefit.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Clipper CTA */}
            <div className="bg-gradient-to-r from-blue-500 to-green-500 rounded-2xl p-8 md:p-12 text-center text-white mb-16">
              <h2 className="text-3xl font-bold mb-4">
                Prêt à monétiser votre créativité ?
              </h2>
              <p className="text-xl mb-8 opacity-90">
                Rejoignez des milliers de créateurs qui gagnent déjà de l'argent avec Clipbox
              </p>
              <Link
                href="/auth/signup"
                className="inline-block px-8 py-4 bg-white text-blue-600 rounded-full font-bold text-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
              >
                Commencer gratuitement
              </Link>
            </div>
          </>
        ) : (
          <>
            {/* Advertiser Journey */}
            <div className="mb-16">
              <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
                Lancez votre campagne en 5 étapes
              </h2>
              
              <div className="relative">
                {/* Connection Line */}
                <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500 to-green-500 transform -translate-y-1/2"></div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-8">
                  {advertiserSteps.map((step, index) => (
                    <div key={index} className="relative">
                      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-green-500 rounded-full flex items-center justify-center text-white mb-4 mx-auto">
                          {step.icon}
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 text-center">
                          {step.title}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400 text-sm text-center">
                          {step.description}
                        </p>
                      </div>
                      {index < advertiserSteps.length - 1 && (
                        <ArrowRight className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2 text-gray-400 dark:text-gray-600 w-6 h-6 z-10" />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Advertiser Benefits */}
            <div className="mb-16">
              <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
                Pourquoi choisir Clipbox ?
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {advertiserBenefits.map((benefit, index) => (
                  <div key={index} className="text-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500/10 to-green-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <div className="text-blue-600 dark:text-blue-400">
                        {benefit.icon}
                      </div>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                      {benefit.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      {benefit.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Advertiser CTA */}
            <div className="bg-gradient-to-r from-blue-500 to-green-500 rounded-2xl p-8 md:p-12 text-center text-white mb-16">
              <h2 className="text-3xl font-bold mb-4">
                Prêt à booster votre visibilité ?
              </h2>
              <p className="text-xl mb-8 opacity-90">
                Lancez votre première campagne et atteignez des millions de personnes
              </p>
              <Link
                href="/auth/signup"
                className="inline-block px-8 py-4 bg-white text-blue-600 rounded-full font-bold text-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
              >
                Créer ma campagne
              </Link>
            </div>
          </>
        )}

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-8 text-center shadow-lg">
            <div className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-green-500 mb-2">
              10K+
            </div>
            <p className="text-gray-600 dark:text-gray-400">Créateurs actifs</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-8 text-center shadow-lg">
            <div className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-green-500 mb-2">
              150+
            </div>
            <p className="text-gray-600 dark:text-gray-400">Marques partenaires</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-8 text-center shadow-lg">
            <div className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-green-500 mb-2">
              250k€
            </div>
            <p className="text-gray-600 dark:text-gray-400">Versés aux créateurs</p>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
            Questions fréquentes
          </h2>
          
          <div className="space-y-4">
            {faqItems.map((item, index) => (
              <div
                key={index}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden"
              >
                <button
                  onClick={() => setOpenFAQ(openFAQ === index ? null : index)}
                  className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {item.question}
                  </span>
                  {openFAQ === index ? (
                    <ChevronUp className="w-5 h-5 text-gray-500 flex-shrink-0" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-500 flex-shrink-0" />
                  )}
                </button>
                {openFAQ === index && (
                  <div className="px-6 pb-4">
                    <p className="text-gray-600 dark:text-gray-400">
                      {item.answer}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Final CTA */}
        <div className="text-center mt-16">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Encore des questions ?
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
            Notre équipe est là pour vous aider
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact"
              className="px-8 py-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-2 border-gray-300 dark:border-gray-600 rounded-full font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              Nous contacter
            </Link>
            <Link
              href="/help"
              className="px-8 py-3 bg-gradient-to-r from-blue-500 to-green-500 text-white rounded-full font-medium hover:shadow-lg transform hover:scale-105 transition-all duration-200"
            >
              Centre d'aide
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}