'use client';

import { useState, useEffect } from 'react';
import { Users, TrendingUp, DollarSign, Video, Award, Globe } from 'lucide-react';

interface StatsData {
  totalCampaigns: number;
  activeClippers: number;
  totalDistributed: number;
  totalClips: number;
  averageEarnings: number;
  countries: number;
}

interface StatsSectionProps {
  stats?: StatsData;
}

export default function StatsSection({ 
  stats = {
    totalCampaigns: 500,
    activeClippers: 10000,
    totalDistributed: 2000000,
    totalClips: 50000,
    averageEarnings: 200,
    countries: 15
  }
}: StatsSectionProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [counters, setCounters] = useState({
    totalCampaigns: 0,
    activeClippers: 0,
    totalDistributed: 0,
    totalClips: 0,
    averageEarnings: 0,
    countries: 0
  });

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isVisible) {
          setIsVisible(true);
          animateCounters();
        }
      },
      { threshold: 0.1 }
    );

    const element = document.getElementById('stats-section');
    if (element) {
      observer.observe(element);
    }

    return () => {
      if (element) {
        observer.unobserve(element);
      }
    };
  }, [isVisible]);

  const animateCounters = () => {
    const duration = 2000; // 2 seconds
    const steps = 60;
    const interval = duration / steps;

    let currentStep = 0;
    const timer = setInterval(() => {
      currentStep++;
      const progress = currentStep / steps;
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);

      setCounters({
        totalCampaigns: Math.floor(stats.totalCampaigns * easeOutQuart),
        activeClippers: Math.floor(stats.activeClippers * easeOutQuart),
        totalDistributed: Math.floor(stats.totalDistributed * easeOutQuart),
        totalClips: Math.floor(stats.totalClips * easeOutQuart),
        averageEarnings: Math.floor(stats.averageEarnings * easeOutQuart),
        countries: Math.floor(stats.countries * easeOutQuart)
      });

      if (currentStep >= steps) {
        clearInterval(timer);
        setCounters(stats);
      }
    }, interval);
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(0) + 'K';
    }
    return num.toString();
  };

  const statItems = [
    {
      icon: TrendingUp,
      value: counters.totalCampaigns,
      label: 'Campagnes lancées',
      color: 'from-blue-500 to-cyan-500',
      suffix: '+'
    },
    {
      icon: Users,
      value: counters.activeClippers,
      label: 'Créateurs actifs',
      color: 'from-purple-500 to-pink-500',
      suffix: '+'
    },
    {
      icon: DollarSign,
      value: counters.totalDistributed,
      label: 'Distribués',
      color: 'from-green-500 to-emerald-500',
      suffix: '€',
      format: true
    },
    {
      icon: Video,
      value: counters.totalClips,
      label: 'Clips créés',
      color: 'from-orange-500 to-red-500',
      suffix: '+'
    },
    {
      icon: Award,
      value: counters.averageEarnings,
      label: 'Gains moyens',
      color: 'from-yellow-500 to-orange-500',
      suffix: '€/clip'
    },
    {
      icon: Globe,
      value: counters.countries,
      label: 'Pays actifs',
      color: 'from-indigo-500 to-purple-500',
      suffix: ''
    }
  ];

  return (
    <section id="stats-section" className="py-12 sm:py-16 lg:py-20 bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-8 sm:mb-12 lg:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4 px-2">
            La plateforme qui fait la différence
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto px-2">
            Des chiffres qui parlent d'eux-mêmes. Rejoignez une communauté en pleine croissance.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6 lg:gap-8">
          {statItems.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={index}
                className={`relative group ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                }`}
                style={{ transitionDelay: `${index * 100}ms`, transition: 'all 0.6s ease-out' }}
              >
                <div className="bg-white dark:bg-gray-800 rounded-lg sm:rounded-xl lg:rounded-2xl p-4 sm:p-6 lg:p-8 shadow-md sm:shadow-lg hover:shadow-xl sm:hover:shadow-2xl transition-all duration-300 sm:transform sm:hover:scale-105 relative overflow-hidden h-full">
                  {/* Background Gradient */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-5 group-hover:opacity-10 transition-opacity duration-300`} />
                  
                  {/* Icon */}
                  <div className={`inline-flex p-2 sm:p-2.5 lg:p-3 rounded-lg sm:rounded-xl bg-gradient-to-br ${stat.color} text-white mb-2 sm:mb-3 lg:mb-4 shadow-md sm:shadow-lg`}>
                    <Icon className="w-5 h-5 sm:w-6 sm:h-6 lg:w-8 lg:h-8" />
                  </div>

                  {/* Value */}
                  <div className="mb-1 sm:mb-2">
                    <span className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white block sm:inline">
                      {stat.format ? formatNumber(stat.value) : stat.value.toLocaleString('fr-FR')}
                    </span>
                    <span className="text-sm sm:text-lg md:text-xl lg:text-2xl font-bold text-gray-500 dark:text-gray-400 block sm:inline sm:ml-1">
                      {stat.suffix}
                    </span>
                  </div>

                  {/* Label */}
                  <p className="text-xs sm:text-sm lg:text-base text-gray-600 dark:text-gray-400 font-medium">
                    {stat.label}
                  </p>

                  {/* Decorative Element - Hidden on mobile */}
                  <div className={`hidden sm:block absolute -bottom-2 -right-2 w-16 sm:w-20 lg:w-24 h-16 sm:h-20 lg:h-24 bg-gradient-to-br ${stat.color} opacity-10 rounded-full blur-2xl`} />
                </div>
              </div>
            );
          })}
        </div>

        {/* CTA Section */}
        <div className="mt-8 sm:mt-12 lg:mt-16 text-center px-2 sm:px-0">
          <div className="inline-flex flex-col lg:flex-row gap-3 sm:gap-4 items-center bg-gradient-to-r from-blue-50 to-green-50 dark:from-blue-900/20 dark:to-green-900/20 rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 shadow-md sm:shadow-lg w-full max-w-2xl">
            <div className="text-center lg:text-left">
              <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 dark:text-white mb-1 sm:mb-2">
                Prêt à rejoindre l'aventure ?
              </h3>
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
                Commencez à gagner de l'argent avec vos clips dès aujourd'hui
              </p>
            </div>
            <a
              href="/auth/signup"
              className="px-4 sm:px-6 lg:px-8 py-2.5 sm:py-3 lg:py-4 bg-gradient-to-r from-blue-600 to-green-600 text-white rounded-full font-semibold text-sm sm:text-base lg:text-lg hover:shadow-xl sm:hover:shadow-2xl transform hover:scale-105 transition-all duration-200 whitespace-nowrap"
            >
              Créer mon compte
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}