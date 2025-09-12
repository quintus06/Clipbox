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

  // Calcul des prix avec réduction annuelle
  const prices = {
    basic: {
      monthly: 8,
      yearly: Math.round(8 * 12 * 0.8), // 20% de réduction
      yearlyMonthly: Math.round((8 * 12 * 0.8) / 12 * 100) / 100
    },
    pro: {
      monthly: 20,
      yearly: Math.round(20 * 12 * 0.8),
      yearlyMonthly: Math.round((20 * 12 * 0.8) / 12 * 100) / 100
    },
    goat: {
      monthly: 50,
      yearly: Math.round(50 * 12 * 0.8),
      yearlyMonthly: Math.round((50 * 12 * 0.8) / 12 * 100) / 100
    }
  };

  const plans = [
    {
      id: 'basic',
      name: 'Basic',
      icon: <Zap className="w-8 h-8" />,
      description: 'Parfait pour débuter et tester la plateforme',
      price: billingPeriod === 'monthly' ? prices.basic.monthly : prices.basic.yearlyMonthly,
      yearlyPrice: prices.basic.yearly,
      color: 'blue',
      features: [
        '2 connexions réseaux sociaux',
        'Commission 20%',
        'Support email',
        'Analytics de base',
        'Tableau de bord simplifié',
        'Paiements mensuels'
      ],
      limitations: [
        'Pas d\'export de données',
        'Pas d\'analytics avancées',
        'Pas d\'API',
        'Pas de support prioritaire'
      ]
    },
    {
      id: 'pro',
      name: 'Pro',
      icon: <Star className="w-8 h-8" />,
      description: 'Pour les créateurs et marques ambitieux',
      price: billingPeriod === 'monthly' ? prices.pro.monthly : prices.pro.yearlyMonthly,
      yearlyPrice: prices.pro.yearly,
      color: 'green',
      popular: true,
      features: [
        '5 connexions réseaux sociaux',
        'Commission 15%',
        'Support prioritaire',
        'Analytics avancées',
        'Export des données CSV/PDF',
        'Tableau de bord complet',
        'Paiements bi-mensuels',
        'Campagnes illimitées',
        'Statistiques en temps réel'
      ],
      limitations: [
        'Pas d\'API',
        'Pas de badge exclusif'
      ]
    },
    {
      id: 'goat',
      name: 'GOAT',
      icon: <Crown className="w-8 h-8" />,
      description: 'L\'expérience ultime sans aucune limite',
      price: billingPeriod === 'monthly' ? prices.goat.monthly : prices.goat.yearlyMonthly,
      yearlyPrice: prices.goat.yearly,
      color: 'purple',
      features: [
        'Connexions illimitées',
        'Commission 10%',
        'Support dédié 24/7',
        'Analytics complètes',
        'API access complet',
        'Badge exclusif GOAT',
        'Export illimité',
        'Paiements hebdomadaires',
        'Account manager dédié',
        'Formations exclusives',
        'Accès bêta aux nouvelles fonctionnalités',
        'Personnalisation avancée'
      ],
      limitations: []
    }
  ];

  const allFeatures: PlanFeature[] = [
    {
      name: 'Connexions réseaux sociaux',
      basic: '2',
      pro: '5',
      goat: 'Illimitées',
      info: 'Nombre de comptes sociaux que vous pouvez connecter'
    },
    {
      name: 'Commission plateforme',
      basic: '20%',
      pro: '15%',
      goat: '10%',
      info: 'Pourcentage prélevé sur vos gains'
    },
    {
      name: 'Support client',
      basic: 'Email',
      pro: 'Prioritaire',
      goat: 'Dédié 24/7',
      info: 'Niveau d\'assistance disponible'
    },
    {
      name: 'Analytics et rapports',
      basic: 'Basiques',
      pro: 'Avancés',
      goat: 'Complets + IA',
      info: 'Profondeur des analyses disponibles'
    },
    {
      name: 'Export de données',
      basic: false,
      pro: 'CSV/PDF',
      goat: 'Tous formats',
      info: 'Formats d\'export disponibles'
    },
    {
      name: 'Fréquence de paiement',
      basic: 'Mensuelle',
      pro: 'Bi-mensuelle',
      goat: 'Hebdomadaire',
      info: 'Rapidité de versement de vos gains'
    },
    {
      name: 'API Access',
      basic: false,
      pro: false,
      goat: true,
      info: 'Accès programmatique à la plateforme'
    },
    {
      name: 'Badge exclusif',
      basic: false,
      pro: false,
      goat: true,
      info: 'Badge de prestige sur votre profil'
    },
    {
      name: 'Account manager',
      basic: false,
      pro: false,
      goat: true,
      info: 'Gestionnaire de compte personnel'
    },
    {
      name: 'Formations exclusives',
      basic: false,
      pro: false,
      goat: true,
      info: 'Accès à des masterclass et webinaires'
    },
    {
      name: 'Accès bêta',
      basic: false,
      pro: false,
      goat: true,
      info: 'Testez les nouvelles fonctionnalités en avant-première'
    },
    {
      name: 'Campagnes simultanées',
      basic: '3',
      pro: 'Illimitées',
      goat: 'Illimitées',
      info: 'Nombre de campagnes actives en même temps'
    }
  ];

  const getFeatureValue = (value: boolean | string) => {
    if (typeof value === 'boolean') {
      return value ? (
        <Check className="w-5 h-5 text-green-500" />
      ) : (
        <X className="w-5 h-5 text-gray-400" />
      );
    }
    return <span className="text-sm font-medium">{value}</span>;
  };

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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
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

        {/* Detailed Comparison Table */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden mb-16">
          <div className="p-8 bg-gradient-to-r from-blue-500 to-green-500">
            <h2 className="text-3xl font-bold text-white text-center">
              Comparaison détaillée des fonctionnalités
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="text-left p-6 font-semibold text-gray-900 dark:text-white">
                    Fonctionnalité
                  </th>
                  <th className="text-center p-6">
                    <div className="flex flex-col items-center">
                      <Zap className="w-6 h-6 text-blue-500 mb-2" />
                      <span className="font-semibold text-gray-900 dark:text-white">Basic</span>
                      <span className="text-sm text-gray-500 dark:text-gray-400">{prices.basic.monthly}€/mois</span>
                    </div>
                  </th>
                  <th className="text-center p-6">
                    <div className="flex flex-col items-center">
                      <Star className="w-6 h-6 text-green-500 mb-2" />
                      <span className="font-semibold text-gray-900 dark:text-white">Pro</span>
                      <span className="text-sm text-gray-500 dark:text-gray-400">{prices.pro.monthly}€/mois</span>
                    </div>
                  </th>
                  <th className="text-center p-6">
                    <div className="flex flex-col items-center">
                      <Crown className="w-6 h-6 text-purple-500 mb-2" />
                      <span className="font-semibold text-gray-900 dark:text-white">GOAT</span>
                      <span className="text-sm text-gray-500 dark:text-gray-400">{prices.goat.monthly}€/mois</span>
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody>
                {allFeatures.map((feature, index) => (
                  <tr
                    key={index}
                    className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                  >
                    <td className="p-6">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-gray-900 dark:text-white">
                          {feature.name}
                        </span>
                        {feature.info && (
                          <div className="group relative">
                            <Info className="w-4 h-4 text-gray-400 cursor-help" />
                            <div className="absolute left-0 bottom-full mb-2 hidden group-hover:block w-64 p-2 bg-gray-900 text-white text-xs rounded-lg shadow-lg z-10">
                              {feature.info}
                            </div>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="p-6 text-center">
                      {getFeatureValue(feature.basic)}
                    </td>
                    <td className="p-6 text-center">
                      {getFeatureValue(feature.pro)}
                    </td>
                    <td className="p-6 text-center">
                      {getFeatureValue(feature.goat)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
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
            Prêt à booster votre activité ?
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