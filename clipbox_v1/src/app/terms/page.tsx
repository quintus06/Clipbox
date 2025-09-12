'use client';

import { FileText, Shield, AlertCircle, Users, CreditCard, Ban, Scale, Mail } from 'lucide-react';

export default function TermsPage() {
  const sections = [
    { id: 'introduction', title: '1. Introduction', icon: FileText },
    { id: 'definitions', title: '2. Définitions', icon: FileText },
    { id: 'inscription', title: '3. Inscription et compte', icon: Users },
    { id: 'utilisation', title: '4. Utilisation de la plateforme', icon: Shield },
    { id: 'campagnes', title: '5. Campagnes publicitaires', icon: CreditCard },
    { id: 'contenu', title: '6. Contenu et propriété intellectuelle', icon: FileText },
    { id: 'paiements', title: '7. Paiements et facturation', icon: CreditCard },
    { id: 'interdictions', title: '8. Interdictions', icon: Ban },
    { id: 'responsabilite', title: '9. Limitation de responsabilité', icon: AlertCircle },
    { id: 'resiliation', title: '10. Résiliation', icon: Ban },
    { id: 'modifications', title: '11. Modifications', icon: FileText },
    { id: 'contact', title: '12. Contact', icon: Mail }
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
            <Scale className="w-16 h-16 text-blue-600 dark:text-blue-400 mx-auto mb-6" />
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              Conditions d'utilisation
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-4">
              Dernière mise à jour : 10 janvier 2025
            </p>
            <p className="text-gray-600 dark:text-gray-400">
              En utilisant Clipbox, vous acceptez ces conditions d'utilisation
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
                  <FileText className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  1. Introduction
                </h2>
                <div className="prose prose-gray dark:prose-invert max-w-none">
                  <p className="text-gray-600 dark:text-gray-300">
                    Bienvenue sur Clipbox ! Ces conditions d'utilisation (« Conditions ») régissent votre utilisation 
                    de notre plateforme de marketing d'influence accessible via notre site web et nos applications mobiles 
                    (collectivement, la « Plateforme »).
                  </p>
                  <p className="text-gray-600 dark:text-gray-300 mt-4">
                    En accédant ou en utilisant Clipbox, vous acceptez d'être lié par ces Conditions. Si vous n'acceptez 
                    pas ces Conditions, veuillez ne pas utiliser notre Plateforme.
                  </p>
                </div>
              </section>

              {/* Définitions */}
              <section id="definitions" className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  2. Définitions
                </h2>
                <div className="space-y-3">
                  <div>
                    <span className="font-semibold text-gray-900 dark:text-white">« Annonceur »</span>
                    <span className="text-gray-600 dark:text-gray-300"> : Toute personne ou entité qui crée et finance des campagnes publicitaires sur la Plateforme.</span>
                  </div>
                  <div>
                    <span className="font-semibold text-gray-900 dark:text-white">« Créateur »</span>
                    <span className="text-gray-600 dark:text-gray-300"> : Toute personne qui crée du contenu pour les campagnes publicitaires.</span>
                  </div>
                  <div>
                    <span className="font-semibold text-gray-900 dark:text-white">« Campagne »</span>
                    <span className="text-gray-600 dark:text-gray-300"> : Un projet publicitaire créé par un Annonceur et exécuté par des Créateurs.</span>
                  </div>
                  <div>
                    <span className="font-semibold text-gray-900 dark:text-white">« Contenu »</span>
                    <span className="text-gray-600 dark:text-gray-300"> : Tout matériel créé et partagé sur la Plateforme, incluant vidéos, images, textes.</span>
                  </div>
                </div>
              </section>

              {/* Inscription et compte */}
              <section id="inscription" className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <Users className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  3. Inscription et compte
                </h2>
                <div className="space-y-4 text-gray-600 dark:text-gray-300">
                  <h3 className="font-semibold text-gray-900 dark:text-white">3.1 Éligibilité</h3>
                  <p>
                    Vous devez avoir au moins 18 ans pour utiliser Clipbox. En créant un compte, vous confirmez 
                    que vous avez l'âge légal requis.
                  </p>
                  
                  <h3 className="font-semibold text-gray-900 dark:text-white">3.2 Informations du compte</h3>
                  <p>
                    Vous vous engagez à fournir des informations exactes, complètes et à jour lors de votre inscription. 
                    Vous êtes responsable de maintenir la confidentialité de vos identifiants de connexion.
                  </p>
                  
                  <h3 className="font-semibold text-gray-900 dark:text-white">3.3 Vérification d'identité</h3>
                  <p>
                    Nous pouvons demander une vérification d'identité pour certaines fonctionnalités, notamment pour 
                    les paiements. Vous acceptez de fournir les documents nécessaires à cette vérification.
                  </p>
                </div>
              </section>

              {/* Utilisation de la plateforme */}
              <section id="utilisation" className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <Shield className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  4. Utilisation de la plateforme
                </h2>
                <div className="space-y-4 text-gray-600 dark:text-gray-300">
                  <p>
                    Vous acceptez d'utiliser Clipbox uniquement à des fins légales et conformément à ces Conditions. 
                    Vous ne devez pas :
                  </p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Violer les lois ou réglementations applicables</li>
                    <li>Usurper l'identité d'une autre personne ou entité</li>
                    <li>Interférer avec le fonctionnement de la Plateforme</li>
                    <li>Collecter des données d'autres utilisateurs sans autorisation</li>
                    <li>Utiliser des bots ou des scripts automatisés sans permission</li>
                  </ul>
                </div>
              </section>

              {/* Campagnes publicitaires */}
              <section id="campagnes" className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  5. Campagnes publicitaires
                </h2>
                <div className="space-y-4 text-gray-600 dark:text-gray-300">
                  <h3 className="font-semibold text-gray-900 dark:text-white">5.1 Pour les Annonceurs</h3>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Vous êtes responsable du contenu de vos campagnes</li>
                    <li>Les campagnes doivent respecter les lois sur la publicité</li>
                    <li>Les paiements sont dus selon les termes convenus</li>
                    <li>Vous accordez à Clipbox une licence pour afficher vos campagnes</li>
                  </ul>
                  
                  <h3 className="font-semibold text-gray-900 dark:text-white">5.2 Pour les Créateurs</h3>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Vous devez respecter les briefs de campagne</li>
                    <li>Le contenu doit être original ou vous devez avoir les droits nécessaires</li>
                    <li>Vous devez divulguer clairement les partenariats publicitaires</li>
                    <li>Les paiements sont effectués selon les conditions de la campagne</li>
                  </ul>
                </div>
              </section>

              {/* Contenu et propriété intellectuelle */}
              <section id="contenu" className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  6. Contenu et propriété intellectuelle
                </h2>
                <div className="space-y-4 text-gray-600 dark:text-gray-300">
                  <p>
                    Vous conservez tous les droits sur le contenu que vous créez et partagez sur Clipbox. 
                    En publiant du contenu, vous accordez à Clipbox une licence mondiale, non exclusive, 
                    libre de redevances pour utiliser, reproduire et afficher ce contenu dans le cadre 
                    de l'exploitation de la Plateforme.
                  </p>
                  <p>
                    Vous garantissez que vous avez tous les droits nécessaires sur le contenu que vous publiez 
                    et qu'il ne viole aucun droit de tiers.
                  </p>
                </div>
              </section>

              {/* Paiements et facturation */}
              <section id="paiements" className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <CreditCard className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  7. Paiements et facturation
                </h2>
                <div className="space-y-4 text-gray-600 dark:text-gray-300">
                  <h3 className="font-semibold text-gray-900 dark:text-white">7.1 Frais de service</h3>
                  <p>
                    Clipbox prélève une commission de 20% sur les budgets de campagne. Cette commission 
                    couvre l'utilisation de la plateforme, le support et les services associés.
                  </p>
                  
                  <h3 className="font-semibold text-gray-900 dark:text-white">7.2 Paiements aux Créateurs</h3>
                  <p>
                    Les paiements aux Créateurs sont effectués selon les termes de chaque campagne. 
                    Clipbox agit comme intermédiaire de paiement mais n'est pas responsable des litiges 
                    entre Annonceurs et Créateurs.
                  </p>
                  
                  <h3 className="font-semibold text-gray-900 dark:text-white">7.3 Taxes</h3>
                  <p>
                    Vous êtes responsable de toutes les taxes applicables à vos activités sur la Plateforme.
                  </p>
                </div>
              </section>

              {/* Interdictions */}
              <section id="interdictions" className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <Ban className="w-6 h-6 text-red-600 dark:text-red-400" />
                  8. Interdictions
                </h2>
                <div className="space-y-4 text-gray-600 dark:text-gray-300">
                  <p>Les contenus et comportements suivants sont strictement interdits :</p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Contenu illégal, diffamatoire ou trompeur</li>
                    <li>Harcèlement, intimidation ou discrimination</li>
                    <li>Violation de la vie privée d'autrui</li>
                    <li>Spam ou sollicitation non désirée</li>
                    <li>Contenu pour adultes ou violent</li>
                    <li>Manipulation des métriques ou fraude</li>
                    <li>Violation des droits de propriété intellectuelle</li>
                  </ul>
                </div>
              </section>

              {/* Limitation de responsabilité */}
              <section id="responsabilite" className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <AlertCircle className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                  9. Limitation de responsabilité
                </h2>
                <div className="space-y-4 text-gray-600 dark:text-gray-300">
                  <p>
                    CLIPBOX EST FOURNI "TEL QUEL" SANS GARANTIE D'AUCUNE SORTE. NOUS NE GARANTISSONS PAS 
                    QUE LA PLATEFORME SERA DISPONIBLE EN PERMANENCE OU SANS ERREUR.
                  </p>
                  <p>
                    Dans la mesure permise par la loi, Clipbox ne sera pas responsable des dommages indirects, 
                    consécutifs ou punitifs résultant de votre utilisation de la Plateforme.
                  </p>
                </div>
              </section>

              {/* Résiliation */}
              <section id="resiliation" className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  10. Résiliation
                </h2>
                <div className="space-y-4 text-gray-600 dark:text-gray-300">
                  <p>
                    Vous pouvez résilier votre compte à tout moment depuis vos paramètres. Clipbox peut 
                    suspendre ou résilier votre compte en cas de violation de ces Conditions.
                  </p>
                  <p>
                    En cas de résiliation, vos obligations de paiement existantes restent dues et les 
                    licences accordées pour le contenu déjà publié restent en vigueur.
                  </p>
                </div>
              </section>

              {/* Modifications */}
              <section id="modifications" className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  11. Modifications
                </h2>
                <div className="text-gray-600 dark:text-gray-300">
                  <p>
                    Nous pouvons modifier ces Conditions à tout moment. Les modifications importantes 
                    seront notifiées par email ou via la Plateforme. Votre utilisation continue après 
                    notification constitue votre acceptation des nouvelles Conditions.
                  </p>
                </div>
              </section>

              {/* Contact */}
              <section id="contact" className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <Mail className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  12. Contact
                </h2>
                <div className="text-gray-600 dark:text-gray-300">
                  <p>Pour toute question concernant ces Conditions d'utilisation, contactez-nous :</p>
                  <div className="mt-4 space-y-2">
                    <p>Email : legal@clipbox.com</p>
                    <p>Adresse : Clipbox SAS, 123 Avenue des Champs-Élysées, 75008 Paris, France</p>
                  </div>
                </div>
              </section>

              {/* Note finale */}
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6 border border-blue-200 dark:border-blue-800">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Ces Conditions d'utilisation ont été rédigées en français et sont régies par le droit français. 
                  Tout litige sera soumis à la compétence exclusive des tribunaux de Paris.
                </p>
              </div>
            </main>
          </div>
        </div>
      </div>
    </div>
  );
}