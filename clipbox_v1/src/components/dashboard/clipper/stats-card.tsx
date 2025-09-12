'use client';

import { ReactNode } from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: ReactNode;
  trend?: {
    value: number;
    label: string;
  };
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'danger';
  loading?: boolean;
}

export function StatsCard({
  title,
  value,
  subtitle,
  icon,
  trend,
  variant = 'default',
  loading = false,
}: StatsCardProps) {
  const getTrendIcon = () => {
    if (!trend) return null;
    
    if (trend.value > 0) {
      return <TrendingUp className="h-4 w-4" />;
    } else if (trend.value < 0) {
      return <TrendingDown className="h-4 w-4" />;
    } else {
      return <Minus className="h-4 w-4" />;
    }
  };

  const getTrendColor = () => {
    if (!trend) return '';
    
    if (trend.value > 0) {
      return 'text-green-600 dark:text-green-400';
    } else if (trend.value < 0) {
      return 'text-red-600 dark:text-red-400';
    } else {
      return 'text-gray-600 dark:text-gray-400';
    }
  };

  const getVariantStyles = () => {
    switch (variant) {
      case 'primary':
        return 'bg-gradient-to-br from-purple-500 to-purple-600 text-white';
      case 'success':
        return 'bg-gradient-to-br from-green-500 to-green-600 text-white';
      case 'warning':
        return 'bg-gradient-to-br from-yellow-500 to-yellow-600 text-white';
      case 'danger':
        return 'bg-gradient-to-br from-red-500 to-red-600 text-white';
      default:
        return 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700';
    }
  };

  const getIconBgStyles = () => {
    if (variant !== 'default') {
      return 'bg-white/20';
    }
    return 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400';
  };

  if (loading) {
    return (
      <div className={`rounded-xl p-6 ${getVariantStyles()}`}>
        <div className="animate-pulse">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gray-300 dark:bg-gray-600 rounded-lg"></div>
            <div className="w-16 h-4 bg-gray-300 dark:bg-gray-600 rounded"></div>
          </div>
          <div className="space-y-2">
            <div className="w-20 h-4 bg-gray-300 dark:bg-gray-600 rounded"></div>
            <div className="w-32 h-8 bg-gray-300 dark:bg-gray-600 rounded"></div>
            <div className="w-24 h-3 bg-gray-300 dark:bg-gray-600 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`rounded-xl p-6 transition-all hover:shadow-lg ${getVariantStyles()}`}>
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-lg ${getIconBgStyles()}`}>
          {icon}
        </div>
        {trend && (
          <div className={`flex items-center space-x-1 text-sm ${getTrendColor()}`}>
            {getTrendIcon()}
            <span className="font-medium">{Math.abs(trend.value)}%</span>
          </div>
        )}
      </div>
      
      <div>
        <p className={`text-sm font-medium ${
          variant !== 'default' ? 'text-white/80' : 'text-gray-600 dark:text-gray-400'
        }`}>
          {title}
        </p>
        <p className={`text-2xl font-bold mt-1 ${
          variant !== 'default' ? 'text-white' : 'text-gray-900 dark:text-white'
        }`}>
          {value}
        </p>
        {subtitle && (
          <p className={`text-xs mt-2 ${
            variant !== 'default' ? 'text-white/70' : 'text-gray-500 dark:text-gray-400'
          }`}>
            {subtitle}
          </p>
        )}
        {trend && (
          <p className={`text-xs mt-2 ${
            variant !== 'default' ? 'text-white/70' : 'text-gray-500 dark:text-gray-400'
          }`}>
            {trend.label}
          </p>
        )}
      </div>
    </div>
  );
}