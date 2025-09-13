'use client';

import { useState } from 'react';
import { 
  CreditCard,
  Check,
  X,
  Star,
  Zap,
  Crown,
  TrendingUp,
  Users,
  BarChart3,
  Shield,
  Headphones,
  Gift,
  ArrowRight,
  Info,
  Calendar,
  DollarSign,
  Sparkles,
  Lock,
  Unlock,
  ChevronRight,
  AlertCircle,
  CheckCircle,
  Rocket,
  Target,
  Globe,
  Award,
  Megaphone,
  Eye,
  FileText,
  Download,
  Building
} from 'lucide-react';

export default function AdvertiserSubscriptionPage() {
  const [selectedPlan, setSelectedPlan] = useState('business');
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [showManageModal, setShowManageModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  
  const currentPlan = {
    name: 'Business',
    price: '€299',
    nextBilling: '15 Avril 2024',
    status: 'active',
    usage: {
      campaigns: { used: 12, limit: 50 },
      budget: { used: 4500, limit: 10000 },
      clippers: { used: 234, limit: 500 }
    }
  };

  const plans = [
    {
      id: 'starter',
      name: 'Starter',
      price: { monthly: 59, yearly: 590 },
      description: 'Pour tester ClipBox',
      color: 'gray',
      features: [
        { name: '5 campagnes max', included: true },
        { name: 'Support prioritaire', included: true },
        { name: 'Budget max 10K par mois', included: true },
        { name: 'Retour analytics performances clippers toutes les 24h', included: true },
        { name: 'Ciblage géographique', included: false },
        { name: 'A/B testing', included: false },
        { name: 'API access', included: false },
        { name: 'Account manager dédié', included: false },
        { name: 'Campagnes prioritaires', included: false },
        { name: 'Formation personnalisée', included: false }
      ],
      limits: {
        campaigns: 5,
        budget: '10K'
      }
    },
    {
      id: 'growth',
      name: 'Growth',
      price: { monthly: 110, yearly: 1100 },
      description: 'Pour les entreprises en croissance',
      color: 'blue',
      badge: null,
      features: [
        { name: '10 campagnes max', included: true },
        { name: 'Support prioritaire', included: true },
        { name: 'Budget max 30K par mois', included: true },
        { name: 'Retour analytics performances clippers en temps réel', included: true },
        { name: 'Ciblage géographique', included: true },
        { name: 'A/B testing basique', included: true },
        { name: 'API access limité', included: false },
        { name: 'Account manager dédié', included: false },
        { name: 'Campagnes prioritaires', included: false },
        { name: 'Formation personnalisée', included: false }
      ],
      limits: {
        campaigns: 10,
        budget: '30K'
      }
    },
    {
      id: 'business',
      name: 'Business',
      price: { monthly: 199, yearly: 1990 },
      description: 'Pour les marques établies',
      color: 'purple',
      badge: 'Populaire',
      features: [
        { name: 'Campagnes illimitées', included: true },
        { name: 'Réduction des frais de services (création de campagnes) à 10%', included: true },
        { name: 'Support dédié 24/7', included: true },
        { name: 'Budget illimité', included: true },
        { name: 'Retour analytics performances clippers en temps réel', included: true },
        { name: 'Ciblage avancé multi-critères', included: true },
        { name: 'A/B testing avancé', included: true },
        { name: 'API access complet', included: true },
        { name: 'Account manager dédié', included: true },
        { name: 'Campagnes prioritaires', included: true },
        { name: 'Formation personnalisée', included: true }
      ],
      limits: {
        campaigns: 'Illimité',
        budget: 'Illimité'
      }
    }
  ];

  const benefits = [
    {
      icon: Rocket,
      title: 'Lancez plus de campagnes',
      description: 'Augmentez votre visibilité en lançant plusieurs campagnes simultanées et en déléguant la création de contenu promotionnels'
    },
    {
      icon: Target,
      title: 'Ciblage précis',
      description: 'Trouvez les créateurs parfaits pour votre cible'
    },
    {
      icon: BarChart3,
      title: 'Analytics',
      description: 'Optimisez vos campagnes avec des insights détaillés en possédant un visuel complet sur les performances des clippers'
    },
    {
      icon: Shield,
      title: 'Support prioritaire',
      description: 'Assistance dédiée pour maximiser votre ROI'
    }
  ];

  const invoices = [
    { id: 'INV-2024-003', date: '15 Mars 2024', amount: '€299.00', status: 'paid' },
    { id: 'INV-2024-002', date: '15 Février 2024', amount: '€299.00', status: 'paid' },
    { id: 'INV-2024-001', date: '15 Janvier 2024', amount: '€299.00', status: 'paid' }
  ];

  const handleUpgrade = (planId: string) => {
    setSelectedPlan(planId);
    setShowPaymentModal(true);
  };

  const calculateSavings = (monthly: number, yearly: number) => {
    const yearlySavings = (monthly * 12) - yearly;
    return yearlySavings > 0 ? Math.round((yearlySavings / (monthly * 12)) * 100) : 0;
  };

  return (
    <div className="p-4 sm:p-6 w-full max-w-7xl mx-auto overflow-x-hidden">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Abonnement
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Gérez votre abonnement et augmentez vos limites
        </p>
      </div>

      {/* Current Plan & Usage */}
      {currentPlan.status === 'active' && (
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl p-4 sm:p-6 mb-8 text-white">
          <div className="flex flex-col gap-6">
            <div>
              <div className="flex items-center gap-2 sm:gap-3 mb-2">
                <Crown className="w-5 h-5 sm:w-6 sm:h-6" />
                <span className="text-xs sm:text-sm font-medium opacity-90">PLAN ACTUEL</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold mb-1">{currentPlan.name}</h2>
              <p className="text-sm sm:text-base opacity-90">
                <span className="block sm:inline">{currentPlan.price}/mois</span>
                <span className="hidden sm:inline"> • </span>
                <span className="block sm:inline text-xs sm:text-base">Prochain paiement le {currentPlan.nextBilling}</span>
              </p>
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 mt-4">
                <button
                  onClick={() => setShowManageModal(true)}
                  className="px-3 sm:px-4 py-2 bg-white/20 backdrop-blur rounded-lg hover:bg-white/30 transition-colors text-sm sm:text-base"
                >
                  Gérer la facturation *
                </button>
                <button
                  onClick={() => setShowInvoiceModal(true)}
                  className="px-3 sm:px-4 py-2 bg-white/20 backdrop-blur rounded-lg hover:bg-white/30 transition-colors flex items-center justify-center gap-2 text-sm sm:text-base"
                >
                  <FileText className="w-4 h-4" />
                  Factures
                </button>
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
              <div className="bg-white/20 backdrop-blur rounded-lg p-3 sm:p-4">
                <div className="flex sm:block items-center justify-between">
                  <div className="text-xs sm:text-sm opacity-90 order-2 sm:order-none">Campagnes</div>
                  <div className="text-lg sm:text-2xl font-bold order-1 sm:order-none">{currentPlan.usage.campaigns.used}/{currentPlan.usage.campaigns.limit}</div>
                </div>
                <div className="w-full bg-white/30 rounded-full h-1 mt-2">
                  <div
                    className="bg-white h-1 rounded-full"
                    style={{ width: `${(currentPlan.usage.campaigns.used / currentPlan.usage.campaigns.limit) * 100}%` }}
                  />
                </div>
              </div>
              <div className="bg-white/20 backdrop-blur rounded-lg p-3 sm:p-4">
                <div className="flex sm:block items-center justify-between">
                  <div className="text-xs sm:text-sm opacity-90 order-2 sm:order-none">Budget</div>
                  <div className="text-lg sm:text-2xl font-bold order-1 sm:order-none">
                    <span className="text-sm sm:text-2xl">€{currentPlan.usage.budget.used}</span>
                    <span className="text-xs sm:text-base">/€{currentPlan.usage.budget.limit}</span>
                  </div>
                </div>
                <div className="w-full bg-white/30 rounded-full h-1 mt-2">
                  <div
                    className="bg-white h-1 rounded-full"
                    style={{ width: `${(currentPlan.usage.budget.used / currentPlan.usage.budget.limit) * 100}%` }}
                  />
                </div>
              </div>
              <div className="bg-white/20 backdrop-blur rounded-lg p-3 sm:p-4">
                <div className="flex sm:block items-center justify-between">
                  <div className="text-xs sm:text-sm opacity-90 order-2 sm:order-none">Clippers</div>
                  <div className="text-lg sm:text-2xl font-bold order-1 sm:order-none">{currentPlan.usage.clippers.used}/{currentPlan.usage.clippers.limit}</div>
                </div>
                <div className="w-full bg-white/30 rounded-full h-1 mt-2">
                  <div
                    className="bg-white h-1 rounded-full"
                    style={{ width: `${(currentPlan.usage.clippers.used / currentPlan.usage.clippers.limit) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Billing Toggle */}
      <div className="flex justify-center mb-8">
        <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-1 flex">
          <button
            onClick={() => setBillingCycle('monthly')}
            className={`px-6 py-2 rounded-md transition-colors ${
              billingCycle === 'monthly'
                ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                : 'text-gray-600 dark:text-gray-400'
            }`}
          >
            Mensuel
          </button>
          <button
            onClick={() => setBillingCycle('yearly')}
            className={`px-6 py-2 rounded-md transition-colors flex items-center gap-2 ${
              billingCycle === 'yearly'
                ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                : 'text-gray-600 dark:text-gray-400'
            }`}
          >
            Annuel
            <span className="px-2 py-0.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs rounded-full">
              -20%
            </span>
          </button>
        </div>
      </div>

      {/* Note about billing */}
      <div className="text-center mb-4">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          * Les abonnements sont prélevés d'avance pour le mois suivant
        </p>
      </div>

      {/* Plans Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-12 overflow-x-hidden">
        {plans.map((plan) => {
          const price = billingCycle === 'monthly' ? plan.price.monthly : plan.price.yearly / 12;
          const isCurrentPlan = plan.name === currentPlan.name;
          const savings = calculateSavings(plan.price.monthly, plan.price.yearly);
          
          return (
            <div
              key={plan.id}
              className={`relative bg-white dark:bg-gray-800 rounded-xl shadow-sm border-2 transition-all hover:shadow-lg ${
                plan.id === 'business'
                  ? 'border-purple-500 transform scale-105'
                  : 'border-gray-200 dark:border-gray-700'
              }`}
            >
              {plan.badge && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                    plan.badge === 'Populaire'
                      ? 'bg-purple-600 text-white'
                      : 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white'
                  }`}>
                    {plan.badge}
                  </span>
                </div>
              )}

              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  {plan.name}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  {plan.description}
                </p>
                
                <div className="mb-4">
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-bold text-gray-900 dark:text-white">
                      €{Math.floor(price)}
                    </span>
                    <span className="text-gray-600 dark:text-gray-400">/mois</span>
                  </div>
                  {billingCycle === 'yearly' && (
                    <p className="text-sm text-green-600 dark:text-green-400 mt-1">
                      Économisez {savings}% par an
                    </p>
                  )}
                </div>

                {/* Plan Limits */}
                <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-3 mb-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Campagnes</span>
                    <span className="font-medium text-gray-900 dark:text-white">{plan.limits.campaigns}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Budget</span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {typeof plan.limits.budget === 'number' ? `€${plan.limits.budget}` : `€${plan.limits.budget}`}
                    </span>
                  </div>
                </div>

                {isCurrentPlan ? (
                  <button
                    disabled
                    className="w-full py-3 bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 rounded-lg font-medium cursor-not-allowed"
                  >
                    Plan actuel
                  </button>
                ) : (
                  <button
                    onClick={() => handleUpgrade(plan.id)}
                    className={`w-full py-3 rounded-lg font-medium transition-colors ${
                      plan.id === 'business'
                        ? 'bg-purple-600 text-white hover:bg-purple-700'
                        : 'bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-100'
                    }`}
                  >
                    Choisir ce plan
                  </button>
                )}

                <div className="mt-4 space-y-2">
                  {plan.features.slice(0, 5).map((feature, index) => (
                    <div key={index} className="flex items-start gap-2">
                      {feature.included ? (
                        <Check className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                      ) : (
                        <X className="w-4 h-4 text-gray-300 dark:text-gray-600 flex-shrink-0 mt-0.5" />
                      )}
                      <span className={`text-xs ${
                        feature.included
                          ? 'text-gray-700 dark:text-gray-300'
                          : 'text-gray-400 dark:text-gray-600'
                      }`}>
                        {feature.name}
                      </span>
                    </div>
                  ))}
                  
                  {plan.features.length > 5 && (
                    <button className="text-xs text-purple-600 dark:text-purple-400 hover:underline flex items-center gap-1 mt-2">
                      Voir plus
                      <ChevronRight className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Benefits Section */}
      <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl p-4 sm:p-8 mb-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
          Développez votre présence avec le bon plan
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon;
            return (
              <div key={index} className="text-center">
                <div className="w-12 h-12 bg-white dark:bg-gray-800 rounded-lg flex items-center justify-center mx-auto mb-3 shadow-sm">
                  <Icon className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                </div>
                <h3 className="font-medium text-gray-900 dark:text-white mb-1">
                  {benefit.title}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {benefit.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Enterprise CTA */}
      <div className="bg-gray-900 dark:bg-gray-800 rounded-xl p-4 sm:p-8 text-center mb-12">
        <Building className="w-12 h-12 text-purple-400 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-white mb-2">
          Besoin d'une solution sur mesure ?
        </h2>
        <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
          Notre équipe Enterprise peut créer un plan personnalisé adapté aux besoins spécifiques de votre entreprise avec des fonctionnalités exclusives et un support dédié.
        </p>
        <button className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
          Contacter l'équipe Enterprise
        </button>
      </div>

      {/* Manage Subscription Modal */}
      {showManageModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                Gérer votre abonnement
              </h3>
              <button
                onClick={() => setShowManageModal(false)}
                className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-600 dark:text-gray-400">Plan actuel</span>
                  <span className="font-medium text-gray-900 dark:text-white">{currentPlan.name}</span>
                </div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-600 dark:text-gray-400">Prix</span>
                  <span className="font-medium text-gray-900 dark:text-white">{currentPlan.price}/mois</span>
                </div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-600 dark:text-gray-400">Statut</span>
                  <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs rounded-full">
                    Actif
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Prochain paiement</span>
                  <span className="font-medium text-gray-900 dark:text-white">{currentPlan.nextBilling}</span>
                </div>
              </div>

              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                <h4 className="font-medium text-blue-900 dark:text-blue-300 mb-2">Utilisation actuelle</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-blue-700 dark:text-blue-400">Campagnes actives</span>
                    <span className="font-medium text-blue-900 dark:text-blue-300">
                      {currentPlan.usage.campaigns.used}/{currentPlan.usage.campaigns.limit}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-blue-700 dark:text-blue-400">Budget utilisé</span>
                    <span className="font-medium text-blue-900 dark:text-blue-300">
                      €{currentPlan.usage.budget.used}/€{currentPlan.usage.budget.limit}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-blue-700 dark:text-blue-400">Clippers actifs</span>
                    <span className="font-medium text-blue-900 dark:text-blue-300">
                      {currentPlan.usage.clippers.used}/{currentPlan.usage.clippers.limit}
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <button className="w-full py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center gap-2">
                  <CreditCard className="w-5 h-5" />
                  Mettre à jour le moyen de paiement
                </button>
                <button className="w-full py-3 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center justify-center gap-2">
                  <Calendar className="w-5 h-5" />
                  Changer la fréquence de facturation
                </button>
                <button className="w-full py-3 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center justify-center gap-2">
                  <Building className="w-5 h-5" />
                  Mettre à jour les informations de facturation
                </button>
                <button
                  onClick={() => {
                    setShowManageModal(false);
                    setShowCancelModal(true);
                  }}
                  className="w-full py-3 border border-red-300 dark:border-red-600 rounded-lg text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                >
                  Annuler l'abonnement
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Cancel Subscription Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                Annuler l'abonnement
              </h3>
              <button
                onClick={() => setShowCancelModal(false)}
                className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mb-6">
              <div className="flex items-center justify-center w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full mx-auto mb-4">
                <AlertCircle className="w-8 h-8 text-red-600 dark:text-red-400" />
              </div>
              <p className="text-gray-700 dark:text-gray-300 text-center mb-4">
                Êtes-vous sûr de vouloir annuler votre abonnement {currentPlan.name} ?
              </p>
              <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-4">
                <p className="text-sm text-yellow-800 dark:text-yellow-300">
                  <strong>Impact sur vos campagnes :</strong>
                </p>
                <ul className="text-sm text-yellow-700 dark:text-yellow-400 mt-2 space-y-1">
                  <li>• Les campagnes actives seront mises en pause</li>
                  <li>• Vous perdrez l'accès aux analytics avancés</li>
                  <li>• Le support prioritaire ne sera plus disponible</li>
                  <li>• Les limites du plan gratuit s'appliqueront</li>
                </ul>
              </div>
            </div>

            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Raison de l'annulation (optionnel)
                </label>
                <select className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent">
                  <option value="">Sélectionnez une raison</option>
                  <option value="too-expensive">Trop cher pour notre budget</option>
                  <option value="not-enough-roi">ROI insuffisant</option>
                  <option value="switching-platform">Changement de stratégie marketing</option>
                  <option value="temporary">Pause temporaire des campagnes</option>
                  <option value="features">Fonctionnalités manquantes</option>
                  <option value="other">Autre</option>
                </select>
              </div>
              <textarea
                placeholder="Vos suggestions pour améliorer notre service..."
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowCancelModal(false)}
                className="flex-1 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                Garder mon abonnement
              </button>
              <button className="flex-1 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
                Confirmer l'annulation
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Invoice Modal */}
      {showInvoiceModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-2xl max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                Historique des factures
              </h3>
              <button
                onClick={() => setShowInvoiceModal(false)}
                className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              {invoices.map((invoice) => (
                <div key={invoice.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">{invoice.id}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{invoice.date}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="font-medium text-gray-900 dark:text-white">{invoice.amount}</span>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      invoice.status === 'paid'
                        ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                        : 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400'
                    }`}>
                      {invoice.status === 'paid' ? 'Payée' : 'En attente'}
                    </span>
                    <button className="text-purple-600 hover:text-purple-700 dark:text-purple-400">
                      <Download className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Payment Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                Confirmer le changement de plan
              </h3>
              <button
                onClick={() => setShowPaymentModal(false)}
                className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-4 mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-600 dark:text-gray-400">Nouveau plan</span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {plans.find(p => p.id === selectedPlan)?.name}
                </span>
              </div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-600 dark:text-gray-400">Facturation</span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {billingCycle === 'monthly' ? 'Mensuelle' : 'Annuelle'}
                </span>
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-gray-200 dark:border-gray-700">
                <span className="font-medium text-gray-900 dark:text-white">Total</span>
                <span className="text-xl font-bold text-gray-900 dark:text-white">
                  €{billingCycle === 'monthly' 
                    ? plans.find(p => p.id === selectedPlan)?.price.monthly 
                    : Math.floor((plans.find(p => p.id === selectedPlan)?.price.yearly || 0) / 12)
                  }/mois
                </span>
              </div>
            </div>

            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 mb-6">
              <div className="flex items-start gap-3">
                <Info className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" />
                <div>
                  <p className="text-sm text-blue-900 dark:text-blue-300">
                    Le changement de plan prendra effet immédiatement. La différence de prix sera calculée au prorata.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowPaymentModal(false)}
                className="flex-1 py-3 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Annuler
              </button>
              <button className="flex-1 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
                Confirmer le changement
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}