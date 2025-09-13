'use client';

import { useState } from 'react';
import Link from 'next/link';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import { 
  Check, 
  X, 
  Star, 
  Zap, 
  Crown,
  Shield,
  Users,
  BarChart3,
  Headphones,
  Download,
  Key,
  Award,
  TrendingUp,
  CreditCard,
  Info
} from 'lucide-react';

interface PlanFeature {
  name: string;
  basic: boolean | string;
  pro: boolean | string;
  goat: boolean | string;
  info?: string;
}

export default function PricingPage() {
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>('monthly');
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [userType, setUserType] = useState<'clipper' | 'advertiser'>('clipper');

  // Prix pour les Clippers (depuis le dashboard)
  const clipperPrices = {
    free: {
      monthly: 0,
      yearly: 0,
      yearlyMonthly: 0
    },
    starter: {
      monthly: 14,
      yearly: 140,
      yearlyMonthly: Math.round((140) / 12 * 100) / 100
    },
    pro: {
      monthly: 27,
      yearly: 270,
      yearlyMonthly: Math.round((270) / 12 * 100) / 100
    },
    goat: {
      monthly: 49,
      yearly: 490,
      yearlyMonthly: Math.round((490) / 12 * 100) / 100
    }
  };

  // Prix pour les Annonceurs
  const advertiserPrices = {
    free: {
      monthly: 0,
      yearly: 0,
      yearlyMonthly: 0
    },
    starter: {
      monthly: 59,
      yearly: Math.round(59 * 12 * 0.8),
      yearlyMonthly: Math.round((59 * 12 * 0.8) / 12 * 100) / 100
    },
    growth: {
      monthly: 110,
      yearly: Math.round(110 * 12 * 0.8),
      yearlyMonthly: Math.round((110 * 12 * 0.8) / 12 * 100) / 100
    },
    business: {
      monthly: 199,
      yearly: Math.round(199 * 12 * 0.8),
      yearlyMonthly: Math.round((199 * 12 * 0.8) / 12 * 100) / 100
    }
  };

  // Plans pour les Clippers
  const clipperPlans = [
    {
      id: 'free',
      name: 'Gratuit',
      icon: <Zap className="w-8 h-8" />,
      description: 'Pour débuter sur ClipBox',
      price: billingPeriod === 'monthly' ? clipperPrices.free.monthly : clipperPrices.free.yearlyMonthly,
      yearlyPrice: clipperPrices.free.yearly,
      color: 'gray',
      features: [
        '1 campagne simultanée',
        'Maximum 1 compte par réseau social',
        'Maximum 2 vidéos par campagne',
        'Commission de 20%',
        'Retrait bi-mensuel',
        'Support par email',
        'Statistiques de base',
        'Profil public basique'
      ],
      limitations: [
        'Pas d\'accès prioritaire aux campagnes',
        'Pas de badge vérifié',
        'Pas d\'analytics avancés',
        'Pas de support prioritaire'
      ]
    },
    {
      id: 'starter',
      name: 'Starter',
      icon: <Star className="w-8 h-8" />,
      description: 'Pour les créateurs réguliers',
      price: billingPeriod === 'monthly' ? clipperPrices.starter.monthly : clipperPrices.starter.yearlyMonthly,
      yearlyPrice: clipperPrices.starter.yearly,
      color: 'blue',
      features: [
        '3 campagnes simultanées',
        'Maximum 2 comptes par réseau social',
        'Maximum 6 vidéos par campagne',
        'Commission réduite (15%)',
        'Retrait hebdomadaire',
        'Support par email et chat',
        'Statistiques détaillées',
        'Profil public personnalisé',
        'Accès prioritaire aux campagnes'
      ],
      limitations: [
        'Pas de badge vérifié',
        'Pas d\'analytics avancés',
        'Pas de formations exclusives'
      ]
    },
    {
      id: 'pro',
      name: 'Pro',
      icon: <Crown className="w-8 h-8" />,
      description: 'Pour les créateurs professionnels',
      price: billingPeriod === 'monthly' ? clipperPrices.pro.monthly : clipperPrices.pro.yearlyMonthly,
      yearlyPrice: clipperPrices.pro.yearly,
      color: 'purple',
      popular: true,
      features: [
        '8 campagnes simultanées',
        'Campagnes illimitées au total',
        'Maximum 4 comptes par réseau social',
        'Maximum 10 vidéos par campagne',
        'Commission réduite (10%)',
        'Retraits instantanés',
        'Support prioritaire',
        'Analytics complets',
        'Profil premium avec portfolio',
        'Badge vérifié Pro',
        'Analytics avancés avec IA',
        'Formations exclusives'
      ],
      limitations: [
        'Pas d\'outils de création IA'
      ]
    },
    {
      id: 'goat',
      name: 'Goat',
      icon: <Award className="w-8 h-8" />,
      description: 'Pour les top créateurs',
      price: billingPeriod === 'monthly' ? clipperPrices.goat.monthly : clipperPrices.goat.yearlyMonthly,
      yearlyPrice: clipperPrices.goat.yearly,
      color: 'yellow',
      features: [
        'Campagnes illimitées',
        'Comptes illimités par réseau social',
        'Vidéos illimitées par campagne',
        'Commission minimale (5%)',
        'Retraits instantanés',
        'Support prioritaire 24/7',
        'Account manager dédié',
        'Analytics prédictifs avec IA',
        'Page de marque personnalisée',
        'Accès VIP aux campagnes premium',
        'Badge Goat exclusif',
        'Tableau de bord personnalisé',
        'Masterclass mensuelles',
        'Suite complète d\'outils IA'
      ],
      limitations: []
    }
  ];

  // Plans pour les Annonceurs
  const advertiserPlans = [
    {
      id: 'free',
      name: 'Gratuit',
      icon: <Zap className="w-8 h-8" />,
      description: 'Pour tester la plateforme',
      price: billingPeriod === 'monthly' ? advertiserPrices.free.monthly : advertiserPrices.free.yearlyMonthly,
      yearlyPrice: advertiserPrices.free.yearly,
      color: 'gray',
      features: [
        '1 campagne max',
        'Retour analytics tous les 3 jours',
        '20 clippers max',
        'Budget 2k€',
        'Support mail'
      ],
      limitations: [
        'Pas de support prioritaire',
        'Pas d\'exports de données',
        'Analytics limités'
      ]
    },
    {
      id: 'starter',
      name: 'Starter',
      icon: <Star className="w-8 h-8" />,
      description: 'Pour les petites entreprises',
      price: billingPeriod === 'monthly' ? advertiserPrices.starter.monthly : advertiserPrices.starter.yearlyMonthly,
      yearlyPrice: advertiserPrices.starter.yearly,
      color: 'blue',
      features: [
        '5 campagnes max',
        'Support prioritaire',
        'Budget max 8K€ par mois',
        'Retour analytics performances clippers toutes les 48h',
        '30 clippers max',
        'Analytics et rapports : basiques'
      ],
      limitations: [
        'Pas d\'export de données analytics',
        'Pas d\'accès beta',
        'Pas d\'account manager'
      ]
    },
    {
      id: 'growth',
      name: 'Growth',
      icon: <TrendingUp className="w-8 h-8" />,
      description: 'Pour les entreprises en croissance',
      price: billingPeriod === 'monthly' ? advertiserPrices.growth.monthly : advertiserPrices.growth.yearlyMonthly,
      yearlyPrice: advertiserPrices.growth.yearly,
      color: 'green',
      popular: true,
      features: [
        '10 campagnes max',
        'Support prioritaire',
        'Budget max 25k€ par mois',
        'Retour analytics performances clippers en 24h',
        'Clippers illimités',
        'Analytics et rapports : avancés',
        'Exports données analytics : CSV / PDF'
      ],
      limitations: [
        'Pas d\'accès beta',
        'Pas d\'account manager',
        'Frais de services standards'
      ]
    },
    {
      id: 'business',
      name: 'Business',
      icon: <Crown className="w-8 h-8" />,
      description: 'Pour les grandes entreprises',
      price: billingPeriod === 'monthly' ? advertiserPrices.business.monthly : advertiserPrices.business.yearlyMonthly,
      yearlyPrice: advertiserPrices.business.yearly,
      color: 'purple',
      features: [
        'Campagnes illimitées',
        'Réduction des frais de services à 10%',
        'Support dédié 24/7',
        'Budget illimité',
        'Retour analytics performances clippers en temps réel',
        'Clippers illimités',
        'Analytics et rapports : complet avec IA',
        'Exports données analytics : tout format',
        'Accès beta',
        'Account manager'
      ],
      limitations: []
    }
  ];

  const plans = userType === 'clipper' ? clipperPlans : advertiserPlans;


  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <Header />
      
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Choisissez votre plan
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto mb-8">
            Des tarifs transparents adaptés à vos besoins, sans frais cachés
          </p>

          {/* User Type Toggle */}
          <div className="flex justify-center mb-8">
            <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-1 flex">
              <button
                onClick={() => setUserType('clipper')}
                className={`px-6 py-3 rounded-md transition-colors font-medium ${
                  userType === 'clipper'
                    ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                    : 'text-gray-600 dark:text-gray-400'
                }`}
              >
                Je suis Clipper
              </button>
              <button
                onClick={() => setUserType('advertiser')}
                className={`px-6 py-3 rounded-md transition-colors font-medium ${
                  userType === 'advertiser'
                    ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                    : 'text-gray-600 dark:text-gray-400'
                }`}
              >
                Je suis Annonceur
              </button>
            </div>
          </div>

          {/* Billing Toggle */}
          <div className="flex items-center justify-center gap-4">
            <span className={`text-lg ${billingPeriod === 'monthly' ? 'text-gray-900 dark:text-white font-semibold' : 'text-gray-500 dark:text-gray-400'}`}>
              Mensuel
            </span>
            <button
              onClick={() => setBillingPeriod(billingPeriod === 'monthly' ? 'yearly' : 'monthly')}
              className="relative w-16 h-8 bg-gray-200 dark:bg-gray-700 rounded-full transition-colors"
            >
              <div className={`absolute top-1 w-6 h-6 bg-gradient-to-r from-blue-500 to-green-500 rounded-full transition-transform ${
                billingPeriod === 'yearly' ? 'translate-x-8' : 'translate-x-1'
              }`}></div>
            </button>
            <span className={`text-lg ${billingPeriod === 'yearly' ? 'text-gray-900 dark:text-white font-semibold' : 'text-gray-500 dark:text-gray-400'}`}>
              Annuel
            </span>
            <span className="ml-2 px-3 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 text-sm font-semibold rounded-full">
              -20%
            </span>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className={`grid grid-cols-1 ${userType === 'clipper' ? 'md:grid-cols-4' : 'md:grid-cols-4'} gap-8 mb-16`}>
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`relative bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden transform hover:scale-105 transition-all duration-200 ${
                plan.popular ? 'ring-2 ring-green-500' : ''
              }`}
              onMouseEnter={() => setSelectedPlan(plan.id)}
              onMouseLeave={() => setSelectedPlan(null)}
            >
              {plan.popular && (
                <div className="absolute top-0 right-0 bg-gradient-to-r from-green-500 to-blue-500 text-white px-4 py-1 rounded-bl-lg text-sm font-semibold">
                  Plus populaire
                </div>
              )}

              <div className="p-8">
                <div className={`w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br ${
                  plan.color === 'blue' ? 'from-blue-400 to-blue-600' :
                  plan.color === 'green' ? 'from-green-400 to-green-600' :
                  'from-purple-400 to-purple-600'
                } flex items-center justify-center text-white`}>
                  {plan.icon}
                </div>

                <h3 className="text-2xl font-bold text-gray-900 dark:text-white text-center mb-2">
                  {plan.name}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-center mb-6">
                  {plan.description}
                </p>

                <div className="text-center mb-6">
                  <div className="flex items-end justify-center">
                    <span className="text-4xl font-bold text-gray-900 dark:text-white">
                      {plan.price}€
                    </span>
                    <span className="text-gray-500 dark:text-gray-400 ml-2 mb-1">
                      /mois
                    </span>
                  </div>
                  {billingPeriod === 'yearly' && (
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                      Facturé {plan.yearlyPrice}€ par an
                    </p>
                  )}
                </div>

                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700 dark:text-gray-300 text-sm">
                        {feature}
                      </span>
                    </li>
                  ))}
                  {plan.limitations.map((limitation, index) => (
                    <li key={index} className="flex items-start opacity-60">
                      <X className="w-5 h-5 text-gray-400 mr-3 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-500 dark:text-gray-500 text-sm line-through">
                        {limitation}
                      </span>
                    </li>
                  ))}
                </ul>

                <Link
                  href={`/auth/signup?plan=${plan.id}`}
                  className={`block w-full text-center px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${
                    plan.popular
                      ? 'bg-gradient-to-r from-blue-500 to-green-500 text-white hover:shadow-lg transform hover:scale-105'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  Commencer avec {plan.name}
                </Link>
              </div>
            </div>
          ))}
        </div>


        {/* Trust Badges */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-16">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
              <Shield className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
              Paiement sécurisé
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Transactions 100% sécurisées avec Stripe
            </p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
              <CreditCard className="w-8 h-8 text-green-600 dark:text-green-400" />
            </div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
              Sans engagement
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Annulez à tout moment sans frais
            </p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center">
              <TrendingUp className="w-8 h-8 text-purple-600 dark:text-purple-400" />
            </div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
              Évolutif
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Changez de plan quand vous voulez
            </p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-orange-100 dark:bg-orange-900 rounded-full flex items-center justify-center">
              <Headphones className="w-8 h-8 text-orange-600 dark:text-orange-400" />
            </div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
              Support réactif
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Une équipe dédiée pour vous aider
            </p>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="max-w-4xl mx-auto mb-16">
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-8">
            Questions fréquentes sur les tarifs
          </h2>
          
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                Puis-je changer de plan à tout moment ?
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Oui, vous pouvez upgrader ou downgrader votre plan à tout moment. Les changements prennent effet immédiatement et sont calculés au prorata.
              </p>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                Y a-t-il une période d'essai gratuite ?
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Nous offrons une garantie satisfait ou remboursé de 14 jours sur tous nos plans. Si vous n'êtes pas satisfait, nous vous remboursons intégralement.
              </p>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                Comment fonctionne la réduction annuelle ?
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                En choisissant le paiement annuel, vous bénéficiez de 20% de réduction, soit 2,4 mois gratuits par an. Le paiement est effectué en une fois pour toute l'année.
              </p>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                Les prix sont-ils HT ou TTC ?
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Tous les prix affichés sont TTC (toutes taxes comprises). Il n'y a aucun frais caché ou supplémentaire.
              </p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-blue-500 to-green-500 rounded-2xl p-8 md:p-12 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">
            Prêts à transformer vos clips en revenus ?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Rejoignez des milliers d'utilisateurs satisfaits et commencez dès aujourd'hui
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/auth/signup"
              className="px-8 py-4 bg-white text-blue-600 rounded-full font-bold text-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
            >
              Commencer maintenant
            </Link>
            <Link
              href="/contact"
              className="px-8 py-4 bg-transparent border-2 border-white text-white rounded-full font-bold text-lg hover:bg-white hover:text-blue-600 transition-all duration-200"
            >
              Nous contacter
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}