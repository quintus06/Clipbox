'use client';

import { Users, Target, Award, Globe } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-blue-50 to-green-50 dark:from-gray-800 dark:to-gray-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              À propos de Clipbox
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              La plateforme qui révolutionne le marketing d'influence en connectant 
              les marques aux créateurs de contenu les plus talentueux.
            </p>
          </div>
        </div>
      </section>

      {/* Notre Mission */}
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">
              Notre Mission
            </h2>
            <div className="prose prose-lg dark:prose-invert mx-auto">
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Chez Clipbox, nous croyons au pouvoir du contenu authentique. Notre mission est de 
                créer un écosystème où les marques peuvent facilement collaborer avec des créateurs 
                passionnés pour produire des campagnes virales qui touchent vraiment leur audience.
              </p>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Fondée en 2024, Clipbox est née de la volonté de simplifier et d'optimiser les 
                campagnes de marketing d'influence. Nous avons constaté que les marques avaient 
                du mal à trouver les bons créateurs, et que les créateurs cherchaient des 
                opportunités de monétisation authentiques.
              </p>
              <p className="text-gray-600 dark:text-gray-300">
                Notre plateforme résout ces deux problèmes en offrant un espace de rencontre 
                transparent, efficace et équitable pour tous.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Nos Valeurs */}
      <section className="py-16 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-12 text-center">
              Nos Valeurs
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  Communauté
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Nous construisons une communauté forte de créateurs et de marques qui partagent 
                  les mêmes valeurs.
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Target className="w-8 h-8 text-green-600 dark:text-green-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  Transparence
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Des prix clairs, des résultats mesurables et une communication ouverte 
                  à chaque étape.
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Award className="w-8 h-8 text-purple-600 dark:text-purple-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  Excellence
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Nous visons l'excellence dans tout ce que nous faisons, de la technologie 
                  au service client.
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-orange-100 dark:bg-orange-900 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Globe className="w-8 h-8 text-orange-600 dark:text-orange-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  Innovation
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Nous innovons constamment pour offrir les meilleures solutions 
                  à nos utilisateurs.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* L'équipe */}
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">
              Notre Équipe
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 text-center mb-12">
              Une équipe passionnée d'experts en marketing, technologie et création de contenu, 
              unis par la vision de transformer le marketing d'influence.
            </p>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-32 h-32 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full mx-auto mb-4"></div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Jean Dupont
                </h3>
                <p className="text-gray-600 dark:text-gray-400">CEO & Co-fondateur</p>
              </div>
              <div className="text-center">
                <div className="w-32 h-32 bg-gradient-to-br from-green-400 to-green-600 rounded-full mx-auto mb-4"></div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Marie Martin
                </h3>
                <p className="text-gray-600 dark:text-gray-400">CTO & Co-fondatrice</p>
              </div>
              <div className="text-center">
                <div className="w-32 h-32 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full mx-auto mb-4"></div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Pierre Bernard
                </h3>
                <p className="text-gray-600 dark:text-gray-400">CMO</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-green-600">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-white mb-6">
              Rejoignez l'aventure Clipbox
            </h2>
            <p className="text-xl text-white/90 mb-8">
              Que vous soyez une marque à la recherche de visibilité ou un créateur 
              passionné, Clipbox est fait pour vous.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/auth/signup"
                className="px-8 py-3 bg-white text-blue-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors"
              >
                Commencer maintenant
              </a>
              <a
                href="/contact"
                className="px-8 py-3 bg-transparent border-2 border-white text-white font-semibold rounded-lg hover:bg-white/10 transition-colors"
              >
                Nous contacter
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}