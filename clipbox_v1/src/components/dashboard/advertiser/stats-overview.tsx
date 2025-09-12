'use client';

import { ReactNode } from 'react';
import { LucideIcon, ArrowUp, ArrowDown } from 'lucide-react';
import Link from 'next/link';

interface StatsOverviewProps {
  title: string;
  value: string | number;
  total?: number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  color: 'orange' | 'blue' | 'green' | 'purple' | 'red' | 'yellow';
  action?: {
    label: string;
    href: string;
  };
}

export default function StatsOverview({
  title,
  value,
  total,
  subtitle,
  icon: Icon,
  trend,
  color,
  action
}: StatsOverviewProps) {
  const colorClasses = {
    orange: {
      bg: 'bg-orange-50 dark:bg-orange-900/20',
      icon: 'text-orange-600 dark:text-orange-400',
      trend: 'text-orange-600 dark:text-orange-400'
    },
    blue: {
      bg: 'bg-blue-50 dark:bg-blue-900/20',
      icon: 'text-blue-600 dark:text-blue-400',
      trend: 'text-blue-600 dark:text-blue-400'
    },
    green: {
      bg: 'bg-green-50 dark:bg-green-900/20',
      icon: 'text-green-600 dark:text-green-400',
      trend: 'text-green-600 dark:text-green-400'
    },
    purple: {
      bg: 'bg-purple-50 dark:bg-purple-900/20',
      icon: 'text-purple-600 dark:text-purple-400',
      trend: 'text-purple-600 dark:text-purple-400'
    },
    red: {
      bg: 'bg-red-50 dark:bg-red-900/20',
      icon: 'text-red-600 dark:text-red-400',
      trend: 'text-red-600 dark:text-red-400'
    },
    yellow: {
      bg: 'bg-yellow-50 dark:bg-yellow-900/20',
      icon: 'text-yellow-600 dark:text-yellow-400',
      trend: 'text-yellow-600 dark:text-yellow-400'
    }
  };

  const colors = colorClasses[color];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 sm:p-6 h-full flex flex-col">
      <div className="flex items-center justify-between mb-3 sm:mb-4">
        <div className={`p-2 sm:p-3 rounded-lg ${colors.bg}`}>
          <Icon className={`h-5 w-5 sm:h-6 sm:w-6 ${colors.icon}`} />
        </div>
        {trend && (
          <div className="flex items-center space-x-1">
            {trend.isPositive ? (
              <ArrowUp className="h-3 w-3 sm:h-4 sm:w-4 text-green-500" />
            ) : (
              <ArrowDown className="h-3 w-3 sm:h-4 sm:w-4 text-red-500" />
            )}
            <span className={`text-xs sm:text-sm font-medium ${trend.isPositive ? 'text-green-500' : 'text-red-500'}`}>
              {trend.value}%
            </span>
          </div>
        )}
      </div>

      <div className="flex-1">
        <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-1 truncate">{title}</p>
        <div className="flex items-baseline space-x-1 sm:space-x-2">
          <p className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white truncate">
            {value}
          </p>
          {total && (
            <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
              / {total}
            </span>
          )}
        </div>
        {subtitle && (
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 truncate">
            {subtitle}
          </p>
        )}
      </div>

      {action && (
        <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-gray-200 dark:border-gray-700">
          <Link
            href={action.href}
            className={`text-xs sm:text-sm font-medium ${colors.icon} hover:underline inline-flex items-center`}
          >
            <span className="truncate">{action.label}</span>
            <span className="ml-1">→</span>
          </Link>
        </div>
      )}
    </div>
  );
}