'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Trophy, TrendingUp, Video, Star, Medal, Award } from 'lucide-react';
import { useState, useEffect } from 'react';

interface Clipper {
  id: string;
  name: string;
  username: string;
  avatar?: string;
  totalEarnings: number;
  totalClips: number;
  rating: number;
  rank: number;
  networks: ('TIKTOK' | 'INSTAGRAM' | 'YOUTUBE')[];
}

interface TopClippersProps {
  clippers: Clipper[];
  loading?: boolean;
}

export default function TopClippers({ clippers: initialClippers, loading = false }: TopClippersProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    const element = document.getElementById('top-clippers');
    if (element) {
      observer.observe(element);
    }

    return () => {
      if (element) {
        observer.unobserve(element);
      }
    };
  }, []);

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="w-6 h-6 text-yellow-500" />;
      case 2:
        return <Medal className="w-6 h-6 text-gray-400" />;
      case 3:
        return <Award className="w-6 h-6 text-orange-600" />;
      default:
        return <span className="text-lg font-bold text-gray-600 dark:text-gray-400">#{rank}</span>;
    }
  };

  const getRankBadgeColor = (rank: number) => {
    switch (rank) {
      case 1:
        return 'bg-gradient-to-r from-yellow-400 to-yellow-600';
      case 2:
        return 'bg-gradient-to-r from-gray-300 to-gray-500';
      case 3:
        return 'bg-gradient-to-r from-orange-400 to-orange-600';
      default:
        return 'bg-gray-200 dark:bg-gray-700';
    }
  };

  const ClipperSkeleton = () => (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-4 flex items-center space-x-4 animate-pulse">
      <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
      <div className="flex-1">
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-32 mb-2"></div>
        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
      </div>
      <div className="text-right">
        <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-20 mb-1"></div>
        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
      </div>
    </div>
  );

  return (
    <section id="top-clippers" className="py-12 sm:py-16 bg-white dark:bg-gray-800 overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
          {/* Left Column - Top 3 Featured */}
          <div>
            <div className="text-center lg:text-left mb-6 sm:mb-8">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4">
                Top Clippers du mois
              </h2>
              <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400">
                Les créateurs les plus performants de notre plateforme
              </p>
            </div>

            {loading ? (
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <ClipperSkeleton key={i} />
                ))}
              </div>
            ) : (
              <div className="space-y-4 sm:space-y-6">
                {initialClippers.slice(0, 3).map((clipper, index) => (
                  <div
                    key={clipper.id}
                    className={`relative bg-gradient-to-r ${
                      index === 0
                        ? 'from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 border-2 border-yellow-400 dark:border-yellow-600'
                        : 'from-white to-gray-50 dark:from-gray-800 dark:to-gray-900'
                    } rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg hover:shadow-xl transition-all duration-300 ${
                      isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'
                    }`}
                    style={{ transitionDelay: `${index * 100}ms` }}
                  >
                    {/* Rank Badge */}
                    <div className={`absolute -top-2 -left-2 sm:-top-3 sm:-left-3 w-10 h-10 sm:w-12 sm:h-12 ${getRankBadgeColor(index + 1)} rounded-full flex items-center justify-center shadow-lg`}>
                      {index < 3 ? (
                        <div className="scale-75 sm:scale-100">
                          {getRankIcon(index + 1)}
                        </div>
                      ) : (
                        <span className="text-sm sm:text-base font-bold text-white">#{index + 1}</span>
                      )}
                    </div>

                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
                      {/* Avatar */}
                      <div className="relative flex-shrink-0">
                        {clipper.avatar ? (
                          <Image
                            src={clipper.avatar}
                            alt={clipper.name}
                            width={60}
                            height={60}
                            className="w-14 h-14 sm:w-16 md:w-20 sm:h-16 md:h-20 rounded-full border-3 sm:border-4 border-white dark:border-gray-700 shadow-md"
                          />
                        ) : (
                          <div className="w-14 h-14 sm:w-16 md:w-20 sm:h-16 md:h-20 bg-gradient-to-br from-blue-400 to-green-400 rounded-full flex items-center justify-center text-white text-lg sm:text-xl md:text-2xl font-bold border-3 sm:border-4 border-white dark:border-gray-700 shadow-md">
                            {clipper.name.charAt(0).toUpperCase()}
                          </div>
                        )}
                        {index === 0 && (
                          <div className="absolute -bottom-1 -right-1 sm:-bottom-2 sm:-right-2 bg-yellow-500 text-white text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full font-bold whitespace-nowrap">
                            👑 Leader
                          </div>
                        )}
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <h3 className="text-base sm:text-lg md:text-xl font-bold text-gray-900 dark:text-white truncate">
                          {clipper.name}
                        </h3>
                        <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 truncate">
                          @{clipper.username}
                        </p>
                        <div className="flex flex-wrap items-center gap-2 sm:gap-4 mt-1 sm:mt-2">
                          <div className="flex items-center gap-1">
                            <Video className="w-3 h-3 sm:w-4 sm:h-4 text-gray-500 flex-shrink-0" />
                            <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 whitespace-nowrap">
                              {clipper.totalClips} clips
                            </span>
                          </div>
                          <div className="flex items-center gap-0.5 sm:gap-1">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-2.5 h-2.5 sm:w-3 sm:h-3 ${
                                  i < Math.floor(clipper.rating)
                                    ? 'text-yellow-500 fill-current'
                                    : 'text-gray-300 dark:text-gray-600'
                                }`}
                              />
                            ))}
                            <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 ml-1">
                              {clipper.rating.toFixed(1)}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Earnings */}
                      <div className="text-right flex-shrink-0">
                        <div className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 dark:text-white">
                          {clipper.totalEarnings.toLocaleString('fr-FR')}€
                        </div>
                        <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">gains totaux</div>
                      </div>
                    </div>

                    {/* Networks */}
                    <div className="flex flex-wrap gap-1.5 sm:gap-2 mt-3 sm:mt-4">
                      {clipper.networks.map((network) => (
                        <span
                          key={network}
                          className={`text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full ${
                            network === 'TIKTOK'
                              ? 'bg-black text-white'
                              : network === 'INSTAGRAM'
                              ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                              : 'bg-red-600 text-white'
                          }`}
                        >
                          {network.replace('_', ' ')}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right Column - Rest of Top 10 */}
          <div className="mt-8 lg:mt-0">
            <div className="bg-gray-50 dark:bg-gray-900 rounded-xl sm:rounded-2xl p-4 sm:p-6">
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-4 sm:mb-6 flex items-center">
                <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-green-500" />
                Classement complet
              </h3>

              {loading ? (
                <div className="space-y-3">
                  {[...Array(7)].map((_, i) => (
                    <ClipperSkeleton key={i} />
                  ))}
                </div>
              ) : (
                <div className="space-y-2 sm:space-y-3">
                  {initialClippers.slice(3, 10).map((clipper, index) => (
                    <Link
                      key={clipper.id}
                      href={`/clippers/${clipper.username}`}
                      className={`flex items-center gap-2 sm:gap-3 p-2 sm:p-3 rounded-lg hover:bg-white dark:hover:bg-gray-800 transition-all duration-300 group ${
                        isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'
                      }`}
                      style={{ transitionDelay: `${(index + 3) * 50}ms` }}
                    >
                      {/* Rank */}
                      <div className="w-6 sm:w-8 text-center flex-shrink-0">
                        <span className="text-sm sm:text-lg font-bold text-gray-600 dark:text-gray-400">
                          {index + 4}
                        </span>
                      </div>

                      {/* Avatar */}
                      <div className="flex-shrink-0">
                        {clipper.avatar ? (
                          <Image
                            src={clipper.avatar}
                            alt={clipper.name}
                            width={32}
                            height={32}
                            className="w-8 h-8 sm:w-10 sm:h-10 rounded-full"
                          />
                        ) : (
                          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-400 to-green-400 rounded-full flex items-center justify-center text-white text-xs sm:text-sm font-bold">
                            {clipper.name.charAt(0).toUpperCase()}
                          </div>
                        )}
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-sm sm:text-base text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 truncate">
                          {clipper.name}
                        </p>
                        <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                          {clipper.totalClips} clips
                        </p>
                      </div>

                      {/* Earnings */}
                      <div className="text-right flex-shrink-0">
                        <p className="font-bold text-sm sm:text-base text-gray-900 dark:text-white">
                          {clipper.totalEarnings.toLocaleString('fr-FR')}€
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              )}

              {/* View All Button */}
              <div className="mt-4 sm:mt-6 text-center">
                <Link
                  href="/leaderboard"
                  className="inline-flex items-center text-sm sm:text-base text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium"
                >
                  Voir tout le classement
                  <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4 ml-1 sm:ml-2" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}