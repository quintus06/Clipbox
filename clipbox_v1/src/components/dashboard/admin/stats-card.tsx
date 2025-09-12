'use client';

import { ArrowUpRight, ArrowDownRight, TrendingUp } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string | number;
  change?: number;
  changeLabel?: string;
  icon: React.ElementType;
  color?: string;
  bgColor?: string;
  trend?: 'up' | 'down' | 'stable';
  onClick?: () => void;
}

export default function StatsCard({
  title,
  value,
  change,
  changeLabel,
  icon: Icon,
  color = 'text-purple-600',
  bgColor = 'bg-purple-100 dark:bg-purple-900/30',
  trend = 'stable',
  onClick
}: StatsCardProps) {
  const getTrendIcon = () => {
    if (!change) return null;
    
    if (trend === 'up' || change > 0) {
      return <ArrowUpRight className="h-4 w-4 mr-1" />;
    } else if (trend === 'down' || change < 0) {
      return <ArrowDownRight className="h-4 w-4 mr-1" />;
    }
    return <TrendingUp className="h-4 w-4 mr-1" />;
  };

  const getTrendColor = () => {
    if (!change) return 'text-gray-500';
    
    if (trend === 'up' || change > 0) {
      return 'text-green-600';
    } else if (trend === 'down' || change < 0) {
      return 'text-red-600';
    }
    return 'text-gray-500';
  };

  return (
    <div 
      className={`bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 ${
        onClick ? 'cursor-pointer hover:shadow-md transition-shadow' : ''
      }`}
      onClick={onClick}
    >
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-lg ${bgColor}`}>
          <Icon className={`h-6 w-6 ${color}`} />
        </div>
        {change !== undefined && (
          <div className={`flex items-center text-sm font-medium ${getTrendColor()}`}>
            {getTrendIcon()}
            {Math.abs(change)}%
          </div>
        )}
      </div>
      
      <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
        {value}
      </h3>
      
      <p className="text-sm text-gray-500 dark:text-gray-400">
        {title}
      </p>
      
      {changeLabel && (
        <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">
          {changeLabel}
        </p>
      )}
    </div>
  );
}