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
  Download
} from 'lucide-react';

export default function ClipperSubscriptionPage() {
  const [selectedPlan, setSelectedPlan] = useState('pro');
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showManageModal, setShowManageModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showDowngradeWarning, setShowDowngradeWarning] = useState(false);
  const [expandedPlans, setExpandedPlans] = useState<Record<string, boolean>>({});
  
  const currentPlan = {
    name: 'Pro',
    price: '€27',
    nextBilling: '15 Avril 2024',
    status: 'active'
  };

  const plans = [
    {
      id: 'free',
      name: 'Gratuit',
      price: { monthly: 0, yearly: 0 },
      description: 'Pour débuter sur ClipBox',
      color: 'gray',
      features: [
        { name: '5 campagnes en simultané', included: true },
        { name: 'Maximum 1 compte par réseau social', included: true },
        { name: 'Maximum 4 vidéos par campagne', included: true },
        { name: 'Commission de 15%', included: true },
        { name: 'Retraits instantanés', included: true },
        { name: 'Support par email', included: true },
        { name: 'Statistiques de base', included: true },
        { name: 'Profil public basique', included: true },
        { name: 'Accès prioritaire aux campagnes', included: false },
        { name: 'Badge vérifié', included: false },
        { name: 'Analytics avancés', included: false },
        { name: 'Support prioritaire', included: false },
        { name: 'Formations exclusives', included: false },
        { name: 'Outils de création IA', included: false }
      ]
    },
    {
      id: 'starter',
      name: 'Starter',
      price: { monthly: 14, yearly: 140 },
      description: 'Pour les créateurs réguliers',
      color: 'blue',
      badge: null,
      features: [
        { name: '10 campagnes en simultané', included: true },
        { name: 'Maximum 2 comptes par réseau social', included: true },
        { name: 'Maximum 6 vidéos par campagne', included: true },
        { name: 'Commission réduite (15%)', included: true },
        { name: 'Retraits instantanés', included: true },
        { name: 'Support par email et chat', included: true },
        { name: 'Statistiques détaillées', included: true },
        { name: 'Profil public personnalisé', included: true },
        { name: 'Accès prioritaire aux campagnes', included: true },
        { name: 'Badge vérifié', included: false },
        { name: 'Analytics avancés', included: false },
        { name: 'Support prioritaire', included: false },
        { name: 'Formations exclusives', included: false },
        { name: 'Outils de création IA', included: false }
      ]
    },
    {
      id: 'pro',
      name: 'Pro',
      price: { monthly: 27, yearly: 270 },
      description: 'Pour les créateurs professionnels',
      color: 'purple',
      badge: 'Populaire',
      features: [
        { name: 'Campagnes illimitées', included: true },
        { name: 'Maximum 2 comptes par réseau social', included: true },
        { name: 'Maximum 10 vidéos par campagne', included: true },
        { name: 'Commission réduite (10%)', included: true },
        { name: 'Accès aux contenus premium', included: true },
        { name: 'Retraits instantanés', included: true },
        { name: 'Support prioritaire', included: true },
        { name: 'Analytics complets', included: true },
        { name: 'Profil premium avec portfolio', included: true },
        { name: 'Accès prioritaire aux campagnes', included: true },
        { name: 'Badge vérifié Pro', included: true },
        { name: 'Analytics avancés avec IA', included: true },
        { name: 'Formations exclusives', included: true },
        { name: 'Outils de création IA', included: false }
      ]
    },
    {
      id: 'goat',
      name: 'Goat',
      price: { monthly: 49, yearly: 490 },
      description: 'Pour les top créateurs',
      color: 'yellow',
      badge: 'Exclusif',
      features: [
        { name: 'Campagnes illimitées', included: true },
        { name: 'Comptes illimités par réseau social', included: true },
        { name: 'Vidéos illimitées par campagne', included: true },
        { name: 'Commission minimale (5%)', included: true },
        { name: 'Accès aux contenus premium', included: true },
        { name: 'Retraits instantanés', included: true },
        { name: 'Support prioritaire 24/7', included: true },
        { name: 'Analytics prédictifs avec IA', included: true },
        { name: 'Accès VIP aux campagnes premium', included: true },
        { name: 'Badge Goat exclusif', included: true },
        { name: 'Tableau de bord personnalisé', included: true },
        { name: 'Masterclass mensuelles', included: true },
        { name: 'Suite complète d\'outils IA', included: true }
      ]
    }
  ];

  const benefits = [
    {
      icon: TrendingUp,
      title: 'Augmentez vos revenus',
      description: 'Commissions réduites et accès prioritaire aux meilleures campagnes'
    },
    {
      icon: Shield,
      title: 'Protection garantie',
      description: 'Paiements sécurisés et protection contre les litiges'
    },
    {
      icon: Headphones,
      title: 'Support premium',
      description: 'Assistance dédiée pour maximiser votre succès'
    },
    {
      icon: Sparkles,
      title: 'Outils exclusifs',
      description: 'Accès à des fonctionnalités avancées et outils IA'
    }
  ];

  const handleUpgrade = (planId: string) => {
    const currentPlanIndex = plans.findIndex(p => p.name === currentPlan.name);
    const newPlanIndex = plans.findIndex(p => p.id === planId);
    
    if (newPlanIndex < currentPlanIndex) {
      setSelectedPlan(planId);
      setShowDowngradeWarning(true);
    } else {
      setSelectedPlan(planId);
      setShowPaymentModal(true);
    }
  };

  const calculateSavings = (monthly: number, yearly: number) => {
    const yearlySavings = (monthly * 12) - yearly;
    return yearlySavings > 0 ? Math.round((yearlySavings / (monthly * 12)) * 100) : 0;
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Abonnement
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Choisissez le plan qui correspond à vos ambitions
        </p>
      </div>

      {/* Important Notice */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4 mb-6">
        <div className="flex items-start gap-3">
          <Info className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-blue-900 dark:text-blue-100 mb-1">
              Aucun engagement, aucune contrainte
            </p>
            <p className="text-sm text-blue-700 dark:text-blue-300">
              Tous nos abonnements sont sans engagement. Vous pouvez changer de plan, mettre en pause ou annuler à tout moment.
              Votre liberté est notre priorité.
            </p>
          </div>
        </div>
      </div>

      {/* Current Plan */}
      {currentPlan.status === 'active' && (
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl p-6 mb-8 text-white">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <Crown className="w-6 h-6" />
                <span className="text-sm font-medium opacity-90">PLAN ACTUEL</span>
              </div>
              <h2 className="text-2xl font-bold mb-1">{currentPlan.name}</h2>
              <p className="opacity-90">
                {currentPlan.price}/mois • Prochain paiement le {currentPlan.nextBilling}
              </p>
            </div>
            <button
              onClick={() => setShowManageModal(true)}
              className="px-4 py-2 bg-white/20 backdrop-blur rounded-lg hover:bg-white/30 transition-colors"
            >
              Gérer l'abonnement
            </button>
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

      {/* Plans Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {plans.map((plan) => {
          const price = billingCycle === 'monthly' ? plan.price.monthly : plan.price.yearly / 12;
          const isCurrentPlan = plan.name === currentPlan.name;
          const savings = calculateSavings(plan.price.monthly, plan.price.yearly);
          const showAllFeatures = expandedPlans[plan.id] || false;
          const displayFeatures = showAllFeatures ? plan.features : plan.features.slice(0, 6);
          
          return (
            <div
              key={plan.id}
              className={`relative bg-white dark:bg-gray-800 rounded-xl shadow-sm border-2 transition-all hover:shadow-lg ${
                plan.id === 'pro'
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
                
                <div className="mb-6">
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-bold text-gray-900 dark:text-white">
                      €{Math.floor(price)}
                    </span>
                    <span className="text-gray-600 dark:text-gray-400">/mois</span>
                  </div>
                  {billingCycle === 'yearly' && plan.price.monthly > 0 && (
                    <p className="text-sm text-green-600 dark:text-green-400 mt-1">
                      Économisez {savings}% par an
                    </p>
                  )}
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
                      plan.id === 'pro'
                        ? 'bg-purple-600 text-white hover:bg-purple-700'
                        : 'bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-100'
                    }`}
                  >
                    {plan.price.monthly === 0 ? 'Utiliser ce plan' : 'Choisir ce plan'}
                  </button>
                )}

                <div className="mt-6 space-y-3">
                  {displayFeatures.map((feature, index) => (
                    <div key={index} className="flex items-start gap-2">
                      {feature.included ? (
                        <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                      ) : (
                        <X className="w-5 h-5 text-gray-300 dark:text-gray-600 flex-shrink-0 mt-0.5" />
                      )}
                      <span className={`text-sm ${
                        feature.included
                          ? 'text-gray-700 dark:text-gray-300'
                          : 'text-gray-400 dark:text-gray-600'
                      }`}>
                        {feature.name}
                      </span>
                    </div>
                  ))}
                  
                  {plan.features.length > 6 && (
                    <button
                      onClick={() => setExpandedPlans(prev => ({ ...prev, [plan.id]: !prev[plan.id] }))}
                      className="text-sm text-purple-600 dark:text-purple-400 hover:underline flex items-center gap-1"
                    >
                      {showAllFeatures ? 'Voir moins' : 'Voir toutes les fonctionnalités'}
                      <ChevronRight className={`w-4 h-4 transition-transform ${showAllFeatures ? 'rotate-90' : ''}`} />
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Benefits Section */}
      <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl p-8 mb-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
          Pourquoi passer à un plan premium ?
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

      {/* FAQ Section */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          Questions fréquentes
        </h2>
        <div className="space-y-6">
          <div>
            <h3 className="font-medium text-gray-900 dark:text-white mb-2 flex items-center gap-2">
              <Info className="w-5 h-5 text-purple-600" />
              Puis-je changer de plan à tout moment ?
            </h3>
            <p className="text-gray-600 dark:text-gray-400 ml-7">
              Oui, vous pouvez upgrader ou downgrader votre plan à tout moment sans engagement. Les changements prennent effet immédiatement.
              Attention : lors d'un downgrade, les limites du nouveau plan s'appliquent automatiquement (campagnes, comptes sociaux, vidéos).
            </p>
          </div>
          <div>
            <h3 className="font-medium text-gray-900 dark:text-white mb-2 flex items-center gap-2">
              <Info className="w-5 h-5 text-purple-600" />
              Comment fonctionnent les commissions réduites ?
            </h3>
            <p className="text-gray-600 dark:text-gray-400 ml-7">
              Avec un plan premium, ClipBox prélève une commission plus faible sur vos gains. Par exemple, avec le plan Goat, vous gardez 95% de vos revenus au lieu de 80% avec le plan gratuit.
            </p>
          </div>
          <div>
            <h3 className="font-medium text-gray-900 dark:text-white mb-2 flex items-center gap-2">
              <Info className="w-5 h-5 text-purple-600" />
              Quels moyens de paiement acceptez-vous ?
            </h3>
            <p className="text-gray-600 dark:text-gray-400 ml-7">
              Nous acceptons toutes les cartes de crédit/débit principales (Visa, Mastercard, American Express), PayPal, et les virements SEPA pour les paiements annuels.
            </p>
          </div>
          <div>
            <h3 className="font-medium text-gray-900 dark:text-white mb-2 flex items-center gap-2">
              <Info className="w-5 h-5 text-purple-600" />
              Que se passe-t-il lors d'un downgrade ?
            </h3>
            <p className="text-gray-600 dark:text-gray-400 ml-7">
              Lors d'un downgrade, les limites du nouveau plan s'appliquent immédiatement. Les campagnes excédentaires sont mises en pause par date de soumission (les plus récentes d'abord),
              et les comptes sociaux excédentaires sont automatiquement déconnectés. Vos données restent sauvegardées et seront réactivées si vous upgradez à nouveau.
            </p>
          </div>
        </div>
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
                  <Download className="w-5 h-5" />
                  Télécharger les factures
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
                  <strong>Ce que vous perdrez avec le plan {currentPlan.name} :</strong>
                </p>
                <ul className="text-sm text-yellow-700 dark:text-yellow-400 mt-2 space-y-1">
                  {currentPlan.name === 'Pro' && (
                    <>
                      <li>• 8 campagnes simultanées (retour à 1)</li>
                      <li>• Commission de 10% (retour à 20%)</li>
                      <li>• Retraits instantanés (retour à bi-mensuel)</li>
                      <li>• Maximum 4 comptes par réseau (retour à 1)</li>
                      <li>• Support prioritaire</li>
                    </>
                  )}
                  {currentPlan.name === 'Starter' && (
                    <>
                      <li>• 3 campagnes simultanées (retour à 1)</li>
                      <li>• Commission de 15% (retour à 20%)</li>
                      <li>• Retrait hebdomadaire (retour à bi-mensuel)</li>
                      <li>• Maximum 2 comptes par réseau (retour à 1)</li>
                    </>
                  )}
                  {currentPlan.name === 'Goat' && (
                    <>
                      <li>• Campagnes illimitées (retour à 1)</li>
                      <li>• Commission de 5% (retour à 20%)</li>
                      <li>• Comptes illimités (retour à 1 par réseau)</li>
                      <li>• Support prioritaire 24/7</li>
                      <li>• Account manager dédié</li>
                    </>
                  )}
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
                  <option value="too-expensive">Trop cher</option>
                  <option value="not-enough-campaigns">Pas assez de campagnes</option>
                  <option value="switching-platform">Je change de plateforme</option>
                  <option value="temporary">Pause temporaire</option>
                  <option value="other">Autre</option>
                </select>
              </div>
              <textarea
                placeholder="Dites-nous comment nous pouvons nous améliorer..."
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

      {/* Payment Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                Confirmer l'abonnement
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
                <span className="text-gray-600 dark:text-gray-400">Plan sélectionné</span>
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

            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Numéro de carte
                </label>
                <input
                  type="text"
                  placeholder="1234 5678 9012 3456"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Date d'expiration
                  </label>
                  <input
                    type="text"
                    placeholder="MM/AA"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    CVV
                  </label>
                  <input
                    type="text"
                    placeholder="123"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-start gap-2 mb-6">
              <Lock className="w-4 h-4 text-gray-500 mt-0.5" />
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Vos informations de paiement sont sécurisées et cryptées. Vous pouvez annuler votre abonnement à tout moment.
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowPaymentModal(false)}
                className="flex-1 py-3 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Annuler
              </button>
              <button className="flex-1 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center gap-2">
                <CreditCard className="w-5 h-5" />
                Confirmer le paiement
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Downgrade Warning Modal */}
      {showDowngradeWarning && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                Attention : Downgrade de plan
              </h3>
              <button
                onClick={() => setShowDowngradeWarning(false)}
                className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mb-6">
              <div className="flex items-center justify-center w-16 h-16 bg-yellow-100 dark:bg-yellow-900/20 rounded-full mx-auto mb-4">
                <AlertCircle className="w-8 h-8 text-yellow-600 dark:text-yellow-400" />
              </div>
              <p className="text-gray-700 dark:text-gray-300 text-center mb-4">
                Vous êtes sur le point de passer à un plan inférieur. Des limitations seront appliquées automatiquement.
              </p>
              <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-4">
                <p className="text-sm font-medium text-yellow-800 dark:text-yellow-300 mb-2">
                  Limitations qui seront appliquées :
                </p>
                <ul className="text-sm text-yellow-700 dark:text-yellow-400 space-y-1">
                  <li>• Les campagnes excédentaires seront mises en pause (par date de soumission)</li>
                  <li>• Les comptes sociaux excédentaires seront déconnectés automatiquement</li>
                  <li>• Les vidéos excédentaires ne pourront plus être soumises</li>
                  <li>• La commission sera ajustée selon le nouveau plan</li>
                  <li>• Les délais de retrait seront modifiés</li>
                </ul>
                <p className="text-sm text-yellow-700 dark:text-yellow-400 mt-2">
                  <strong>Note :</strong> Vos données restent sauvegardées et seront réactivées si vous upgradez à nouveau.
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowDowngradeWarning(false)}
                className="flex-1 py-3 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={() => {
                  setShowDowngradeWarning(false);
                  setShowPaymentModal(true);
                }}
                className="flex-1 py-3 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
              >
                Continuer le downgrade
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}