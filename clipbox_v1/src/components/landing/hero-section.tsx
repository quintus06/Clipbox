'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { ArrowRight, Play, TrendingUp, Users, DollarSign } from 'lucide-react';

export default function HeroSection() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-blue-50 via-white to-green-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-green-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16 relative z-10">
        <div className="text-center max-w-5xl mx-auto">
          {/* Badge */}
          <div
            className={`inline-flex items-center px-4 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-sm font-medium mb-6 transition-all duration-1000 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            <TrendingUp className="w-4 h-4 mr-2" />
            Plus de 1000 créateurs actifs
          </div>

          {/* Main Heading */}
          <h1
            className={`text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 dark:text-white mb-6 transition-all duration-1000 delay-100 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            Boostez votre visibilité,
            <br />
            <span className="bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
              monétisez vos clips !
            </span>
          </h1>

          {/* Subtitle */}
          <p
            className={`text-lg sm:text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto transition-all duration-1000 delay-200 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            Connectez-vous avec les plus grandes marques et influenceurs pour transformer votre créativité en revenus. Clipbox relie ceux qui créent la visibilité et ceux qui en ont besoin.

          </p>

          {/* CTA Buttons */}
          <div
            className={`flex flex-col sm:flex-row gap-4 justify-center mb-12 transition-all duration-1000 delay-300 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            <Link
              href="/auth/signup"
              className="group px-8 py-4 bg-gradient-to-r from-blue-600 to-green-600 text-white rounded-full font-semibold text-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-200 flex items-center justify-center"
            >
              Commencer maintenant
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <button className="group px-8 py-4 bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-2 border-gray-200 dark:border-gray-700 rounded-full font-semibold text-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center justify-center">
              <Play className="mr-2 w-5 h-5" />
              Voir la démo
            </button>
          </div>

          {/* Stats */}
          <div
            className={`grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-3xl mx-auto transition-all duration-1000 delay-400 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <Users className="w-6 h-6 text-blue-600 dark:text-blue-400 mr-2" />
                <span className="text-3xl font-bold text-gray-900 dark:text-white">1000+</span>
              </div>
              <p className="text-gray-600 dark:text-gray-400">Créateurs actifs</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <TrendingUp className="w-6 h-6 text-green-600 dark:text-green-400 mr-2" />
                <span className="text-3xl font-bold text-gray-900 dark:text-white">160+</span>
              </div>
              <p className="text-gray-600 dark:text-gray-400">Campagnes lancées</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <DollarSign className="w-6 h-6 text-purple-600 dark:text-purple-400 mr-2" />
                <span className="text-3xl font-bold text-gray-900 dark:text-white">250k€+</span>
              </div>
              <p className="text-gray-600 dark:text-gray-400">Distribués aux créateurs</p>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-gray-400 dark:border-gray-600 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-gray-400 dark:bg-gray-600 rounded-full mt-2 animate-scroll"></div>
        </div>
      </div>

      <style jsx>{`
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        @keyframes scroll {
          0% {
            transform: translateY(0);
            opacity: 1;
          }
          100% {
            transform: translateY(100%);
            opacity: 0;
          }
        }
        .animate-scroll {
          animation: scroll 1.5s infinite;
        }
      `}</style>
    </section>
  );
}