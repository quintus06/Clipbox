'use client';

import { Shield, Lock, Eye, Database, Globe, UserCheck, AlertCircle, Mail, Cookie } from 'lucide-react';

export default function PrivacyPage() {
  const sections = [
    { id: 'introduction', title: '1. Introduction', icon: Shield },
    { id: 'collecte', title: '2. Données collectées', icon: Database },
    { id: 'utilisation', title: '3. Utilisation des données', icon: Eye },
    { id: 'partage', title: '4. Partage des données', icon: Globe },
    { id: 'securite', title: '5. Sécurité', icon: Lock },
    { id: 'droits', title: '6. Vos droits', icon: UserCheck },
    { id: 'cookies', title: '7. Cookies', icon: Cookie },
    { id: 'mineurs', title: '8. Protection des mineurs', icon: AlertCircle },
    { id: 'modifications', title: '9. Modifications', icon: AlertCircle },
    { id: 'contact', title: '10. Contact', icon: Mail }
  ];

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-blue-50 to-green-50 dark:from-gray-800 dark:to-gray-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <Shield className="w-16 h-16 text-blue-600 dark:text-blue-400 mx-auto mb-6" />
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              Politique de confidentialité
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-4">
              Dernière mise à jour : 10 janvier 2025
            </p>
            <p className="text-gray-600 dark:text-gray-400">
              Votre vie privée est importante pour nous. Cette politique explique comment nous collectons, 
              utilisons et protégeons vos données.
            </p>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-4 gap-8">
            {/* Navigation latérale */}
            <aside className="lg:col-span-1">
              <div className="sticky top-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
                  Navigation rapide
                </h3>
                <nav className="space-y-2">
                  {sections.map((section) => (
                    <button
                      key={section.id}
                      onClick={() => scrollToSection(section.id)}
                      className="w-full text-left px-3 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-50 dark:hover:bg-gray-700 rounded transition-colors"
                    >
                      {section.title}
                    </button>
                  ))}
                </nav>
              </div>
            </aside>

            {/* Contenu principal */}
            <main className="lg:col-span-3 space-y-12">
              {/* Introduction */}
              <section id="introduction" className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <Shield className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  1. Introduction
                </h2>
                <div className="prose prose-gray dark:prose-invert max-w-none">
                  <p className="text-gray-600 dark:text-gray-300">
                    Clipbox SAS (« nous », « notre », « nos ») s'engage à protéger votre vie privée. 
                    Cette politique de confidentialité explique comment nous collectons, utilisons, partageons 
                    et protégeons vos informations personnelles lorsque vous utilisez notre plateforme Clipbox.
                  </p>
                  <p className="text-gray-600 dark:text-gray-300 mt-4">
                    En utilisant Clipbox, vous consentez aux pratiques décrites dans cette politique. 
                    Si vous n'acceptez pas cette politique, veuillez ne pas utiliser notre service.
                  </p>
                </div>
              </section>

              {/* Données collectées */}
              <section id="collecte" className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <Database className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  2. Données que nous collectons
                </h2>
                <div className="space-y-4 text-gray-600 dark:text-gray-300">
                  <h3 className="font-semibold text-gray-900 dark:text-white">2.1 Informations fournies directement</h3>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Informations de compte : nom, email, mot de passe</li>
                    <li>Profil : photo, bio, liens vers réseaux sociaux</li>
                    <li>Informations de paiement : coordonnées bancaires, adresse de facturation</li>
                    <li>Vérification d'identité : documents officiels (pour les paiements)</li>
                    <li>Communications : messages, commentaires, support client</li>
                  </ul>
                  
                  <h3 className="font-semibold text-gray-900 dark:text-white">2.2 Informations collectées automatiquement</h3>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Données de navigation : adresse IP, type de navigateur, pages visitées</li>
                    <li>Données d'appareil : système d'exploitation, identifiants uniques</li>
                    <li>Cookies et technologies similaires</li>
                    <li>Données de performance : temps de chargement, erreurs</li>
                  </ul>
                  
                  <h3 className="font-semibold text-gray-900 dark:text-white">2.3 Informations de tiers</h3>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Réseaux sociaux : si vous connectez vos comptes</li>
                    <li>Services de paiement : confirmations de transaction</li>
                    <li>Partenaires marketing : données d'attribution</li>
                  </ul>
                </div>
              </section>

              {/* Utilisation des données */}
              <section id="utilisation" className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <Eye className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  3. Comment nous utilisons vos données
                </h2>
                <div className="space-y-4 text-gray-600 dark:text-gray-300">
                  <p>Nous utilisons vos informations pour :</p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Fournir et améliorer nos services</li>
                    <li>Créer et gérer votre compte</li>
                    <li>Traiter les paiements et transactions</li>
                    <li>Communiquer avec vous (notifications, support, marketing)</li>
                    <li>Personnaliser votre expérience</li>
                    <li>Analyser l'utilisation et les performances</li>
                    <li>Détecter et prévenir la fraude</li>
                    <li>Respecter nos obligations légales</li>
                    <li>Protéger nos droits et ceux de nos utilisateurs</li>
                  </ul>
                </div>
              </section>

              {/* Partage des données */}
              <section id="partage" className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <Globe className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  4. Partage de vos données
                </h2>
                <div className="space-y-4 text-gray-600 dark:text-gray-300">
                  <p>Nous pouvons partager vos informations avec :</p>
                  
                  <h3 className="font-semibold text-gray-900 dark:text-white">4.1 Autres utilisateurs</h3>
                  <p>
                    Votre profil public (nom, photo, bio) est visible par les autres utilisateurs. 
                    Les annonceurs peuvent voir les statistiques des créateurs (anonymisées).
                  </p>
                  
                  <h3 className="font-semibold text-gray-900 dark:text-white">4.2 Prestataires de services</h3>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Services de paiement (Stripe, PayPal)</li>
                    <li>Hébergement et infrastructure (AWS)</li>
                    <li>Outils d'analyse (Google Analytics)</li>
                    <li>Services de communication (SendGrid)</li>
                  </ul>
                  
                  <h3 className="font-semibold text-gray-900 dark:text-white">4.3 Obligations légales</h3>
                  <p>
                    Nous pouvons divulguer vos informations si requis par la loi, une ordonnance 
                    judiciaire ou une demande gouvernementale légitime.
                  </p>
                  
                  <h3 className="font-semibold text-gray-900 dark:text-white">4.4 Transferts d'entreprise</h3>
                  <p>
                    En cas de fusion, acquisition ou vente d'actifs, vos informations peuvent 
                    être transférées à la nouvelle entité.
                  </p>
                </div>
              </section>

              {/* Sécurité */}
              <section id="securite" className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <Lock className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  5. Sécurité de vos données
                </h2>
                <div className="space-y-4 text-gray-600 dark:text-gray-300">
                  <p>
                    Nous prenons la sécurité de vos données très au sérieux et mettons en œuvre 
                    des mesures techniques et organisationnelles appropriées :
                  </p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Chiffrement SSL/TLS pour toutes les transmissions</li>
                    <li>Chiffrement des données sensibles au repos</li>
                    <li>Accès restreint aux données personnelles</li>
                    <li>Audits de sécurité réguliers</li>
                    <li>Formation du personnel sur la protection des données</li>
                    <li>Authentification à deux facteurs disponible</li>
                  </ul>
                  <p className="mt-4">
                    Malgré nos efforts, aucun système n'est totalement sécurisé. En cas de violation 
                    de données, nous vous informerons conformément à la législation applicable.
                  </p>
                </div>
              </section>

              {/* Droits des utilisateurs */}
              <section id="droits" className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <UserCheck className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  6. Vos droits (RGPD)
                </h2>
                <div className="space-y-4 text-gray-600 dark:text-gray-300">
                  <p>
                    Conformément au Règlement Général sur la Protection des Données (RGPD), 
                    vous disposez des droits suivants :
                  </p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li><strong>Droit d'accès :</strong> Obtenir une copie de vos données personnelles</li>
                    <li><strong>Droit de rectification :</strong> Corriger les données inexactes</li>
                    <li><strong>Droit à l'effacement :</strong> Demander la suppression de vos données</li>
                    <li><strong>Droit à la limitation :</strong> Restreindre le traitement de vos données</li>
                    <li><strong>Droit à la portabilité :</strong> Recevoir vos données dans un format structuré</li>
                    <li><strong>Droit d'opposition :</strong> Vous opposer à certains traitements</li>
                    <li><strong>Droit de retirer le consentement :</strong> À tout moment pour les traitements basés sur le consentement</li>
                  </ul>
                  <p className="mt-4">
                    Pour exercer ces droits, contactez-nous à privacy@clipbox.com. Nous répondrons 
                    dans un délai de 30 jours.
                  </p>
                </div>
              </section>

              {/* Cookies */}
              <section id="cookies" className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <Cookie className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  7. Cookies et technologies similaires
                </h2>
                <div className="space-y-4 text-gray-600 dark:text-gray-300">
                  <p>Nous utilisons des cookies et technologies similaires pour :</p>
                  
                  <h3 className="font-semibold text-gray-900 dark:text-white">Cookies essentiels</h3>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Maintenir votre session de connexion</li>
                    <li>Mémoriser vos préférences de langue</li>
                    <li>Assurer la sécurité de votre compte</li>
                  </ul>
                  
                  <h3 className="font-semibold text-gray-900 dark:text-white">Cookies de performance</h3>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Analyser l'utilisation du site</li>
                    <li>Identifier et corriger les erreurs</li>
                    <li>Améliorer les performances</li>
                  </ul>
                  
                  <h3 className="font-semibold text-gray-900 dark:text-white">Cookies marketing</h3>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Personnaliser les publicités</li>
                    <li>Mesurer l'efficacité des campagnes</li>
                    <li>Retargeting sur d'autres plateformes</li>
                  </ul>
                  
                  <p className="mt-4">
                    Vous pouvez gérer vos préférences de cookies dans les paramètres de votre navigateur 
                    ou via notre centre de préférences de cookies.
                  </p>
                </div>
              </section>

              {/* Protection des mineurs */}
              <section id="mineurs" className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <AlertCircle className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                  8. Protection des mineurs
                </h2>
                <div className="text-gray-600 dark:text-gray-300">
                  <p>
                    Clipbox n'est pas destiné aux personnes de moins de 18 ans. Nous ne collectons 
                    pas sciemment d'informations personnelles de mineurs. Si nous découvrons qu'un 
                    mineur nous a fourni des informations personnelles, nous supprimerons ces 
                    informations immédiatement.
                  </p>
                  <p className="mt-4">
                    Si vous êtes parent ou tuteur et pensez que votre enfant nous a fourni des 
                    informations personnelles, contactez-nous à privacy@clipbox.com.
                  </p>
                </div>
              </section>

              {/* Modifications */}
              <section id="modifications" className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  9. Modifications de cette politique
                </h2>
                <div className="text-gray-600 dark:text-gray-300">
                  <p>
                    Nous pouvons mettre à jour cette politique de confidentialité périodiquement. 
                    Les modifications importantes seront notifiées par email ou via une notification 
                    sur la plateforme. La date de "Dernière mise à jour" en haut de cette page 
                    indique quand cette politique a été révisée pour la dernière fois.
                  </p>
                  <p className="mt-4">
                    Votre utilisation continue de Clipbox après les modifications constitue votre 
                    acceptation de la politique mise à jour.
                  </p>
                </div>
              </section>

              {/* Contact */}
              <section id="contact" className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <Mail className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  10. Nous contacter
                </h2>
                <div className="text-gray-600 dark:text-gray-300">
                  <p>Pour toute question concernant cette politique de confidentialité ou vos données personnelles :</p>
                  <div className="mt-4 space-y-2">
                    <p><strong>Délégué à la protection des données (DPO) :</strong></p>
                    <p>Email : privacy@clipbox.com</p>
                    <p>Téléphone : +33 1 23 45 67 89</p>
                    <p>Adresse : Clipbox SAS, 123 Avenue des Champs-Élysées, 75008 Paris, France</p>
                  </div>
                  <div className="mt-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
                    <p className="text-sm">
                      <strong>Autorité de contrôle :</strong> Vous avez également le droit de déposer 
                      une plainte auprès de la CNIL (Commission Nationale de l'Informatique et des Libertés) 
                      si vous estimez que vos droits ne sont pas respectés.
                    </p>
                  </div>
                </div>
              </section>

              {/* Note finale */}
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6 border border-blue-200 dark:border-blue-800">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Cette politique de confidentialité fait partie intégrante de nos Conditions d'utilisation. 
                  En utilisant Clipbox, vous acceptez à la fois cette politique et nos Conditions d'utilisation.
                </p>
              </div>
            </main>
          </div>
        </div>
      </div>
    </div>
  );
}