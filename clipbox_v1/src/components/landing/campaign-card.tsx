'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Clock, Users, TrendingUp, DollarSign } from 'lucide-react';

interface CampaignCardProps {
  id: string;
  title: string;
  description: string;
  imageUrl?: string;
  budget: number;
  budgetSpent: number;
  network: 'TIKTOK' | 'INSTAGRAM' | 'YOUTUBE';
  participantsCount: number;
  endDate: Date;
  advertiserName: string;
  advertiserLogo?: string;
}

export default function CampaignCard({
  id,
  title,
  description,
  imageUrl,
  budget,
  budgetSpent,
  network,
  participantsCount,
  endDate,
  advertiserName,
  advertiserLogo,
}: CampaignCardProps) {
  const progressPercentage = (budgetSpent / budget) * 100;
  const remainingBudget = budget - budgetSpent;
  const daysRemaining = Math.ceil((new Date(endDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
  
  const networkColors = {
    TIKTOK: 'bg-black text-white',
    INSTAGRAM: 'bg-gradient-to-r from-purple-500 to-pink-500 text-white',
    YOUTUBE: 'bg-red-600 text-white',
  };

  const networkIcons = {
    TIKTOK: '🎵',
    INSTAGRAM: '📷',
    YOUTUBE: '▶️',
  };

  return (
    <Link href={`/campaigns/${id}`}>
      <div className="group bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden cursor-pointer transform hover:-translate-y-1">
        {/* Image Section */}
        <div className="relative h-48 bg-gradient-to-br from-blue-100 to-green-100 dark:from-gray-700 dark:to-gray-600">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={title}
              fill
              className="object-cover"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-6xl opacity-50">{networkIcons[network]}</div>
            </div>
          )}
          
          {/* Network Badge */}
          <div className={`absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-semibold ${networkColors[network]}`}>
            {network}
          </div>

          {/* Days Remaining Badge */}
          {daysRemaining > 0 && (
            <div className="absolute top-4 right-4 px-3 py-1 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm rounded-full text-xs font-semibold text-gray-700 dark:text-gray-300 flex items-center">
              <Clock className="w-3 h-3 mr-1" />
              {daysRemaining}j restants
            </div>
          )}
        </div>

        {/* Content Section */}
        <div className="p-6">
          {/* Advertiser Info */}
          <div className="flex items-center mb-3">
            {advertiserLogo ? (
              <Image
                src={advertiserLogo}
                alt={advertiserName}
                width={24}
                height={24}
                className="rounded-full mr-2"
              />
            ) : (
              <div className="w-6 h-6 bg-gray-300 dark:bg-gray-600 rounded-full mr-2"></div>
            )}
            <span className="text-sm text-gray-600 dark:text-gray-400">{advertiserName}</span>
          </div>

          {/* Title & Description */}
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-1">
            {title}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
            {description}
          </p>

          {/* Budget Progress */}
          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-600 dark:text-gray-400">Budget</span>
              <span className="text-sm font-semibold text-gray-900 dark:text-white">
                {remainingBudget.toLocaleString('fr-FR')}€ restants
              </span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-500 to-green-500 rounded-full transition-all duration-500"
                style={{ width: `${100 - progressPercentage}%` }}
              />
            </div>
            <div className="flex justify-between items-center mt-1">
              <span className="text-xs text-gray-500 dark:text-gray-500">
                {budgetSpent.toLocaleString('fr-FR')}€ dépensés
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-500">
                {budget.toLocaleString('fr-FR')}€ total
              </span>
            </div>
          </div>

          {/* Stats */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
              <Users className="w-4 h-4 mr-1" />
              <span>{participantsCount} participants</span>
            </div>
            <div className="flex items-center text-sm text-green-600 dark:text-green-400">
              <TrendingUp className="w-4 h-4 mr-1" />
              <span>{((remainingBudget / budget) * 100).toFixed(0)}% disponible</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}