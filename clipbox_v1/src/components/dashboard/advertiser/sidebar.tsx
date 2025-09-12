'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import {
  LayoutDashboard,
  Megaphone,
  PlusCircle,
  Wallet,
  User,
  FileText,
  Settings,
  LogOut,
  X,
  TrendingUp,
  DollarSign,
  CreditCard,
  HelpCircle
} from 'lucide-react';

interface SidebarProps {
  onClose?: () => void;
}

export default function AdvertiserSidebar({ onClose }: SidebarProps) {
  const pathname = usePathname();
  const { logout } = useAuth();

  const navigation = [
    {
      name: 'Vue d\'ensemble',
      href: '/dashboard/advertiser',
      icon: LayoutDashboard,
      current: pathname === '/dashboard/advertiser'
    },
    {
      name: 'Mes Campagnes',
      href: '/dashboard/advertiser/campaigns',
      icon: Megaphone,
      current: pathname.startsWith('/dashboard/advertiser/campaigns')
    },
    {
      name: 'Nouvelle Campagne',
      href: '/dashboard/advertiser/campaigns/new',
      icon: PlusCircle,
      current: pathname === '/dashboard/advertiser/campaigns/new'
    },
    {
      name: 'Balance',
      href: '/dashboard/advertiser/balance',
      icon: Wallet,
      current: pathname === '/dashboard/advertiser/balance'
    },
    {
      name: 'Statistiques',
      href: '/dashboard/advertiser/stats',
      icon: TrendingUp,
      current: pathname === '/dashboard/advertiser/stats'
    },
    {
      name: 'Documents',
      href: '/dashboard/advertiser/documents',
      icon: FileText,
      current: pathname === '/dashboard/advertiser/documents'
    },
    {
      name: 'Profil',
      href: '/dashboard/advertiser/profile',
      icon: User,
      current: pathname === '/dashboard/advertiser/profile'
    },
    {
      name: 'Paramètres',
      href: '/dashboard/advertiser/settings',
      icon: Settings,
      current: pathname === '/dashboard/advertiser/settings'
    },
    {
      name: 'Abonnement',
      href: '/dashboard/advertiser/subscription',
      icon: CreditCard,
      current: pathname === '/dashboard/advertiser/subscription'
    },
    {
      name: 'Support',
      href: '/dashboard/advertiser/support',
      icon: HelpCircle,
      current: pathname === '/dashboard/advertiser/support'
    }
  ];

  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-800">
      {/* Logo and close button */}
      <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200 dark:border-gray-700">
        <Link
          href="/dashboard/advertiser"
          className="flex items-center"
          onClick={onClose}
        >
          <DollarSign className="h-7 w-7 sm:h-8 sm:w-8 text-orange-500 flex-shrink-0" />
          <span className="ml-2 text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
            Clipbox
          </span>
          <span className="ml-1 text-xs text-orange-500 font-semibold hidden sm:inline">
            ADVERTISER
          </span>
        </Link>
        {onClose && (
          <button
            onClick={onClose}
            className="lg:hidden p-2 rounded-md text-gray-400 dark:text-gray-500 hover:text-gray-500 dark:hover:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-orange-500"
            aria-label="Fermer le menu"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600">
        {navigation.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`
                group flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200
                ${
                  item.current
                    ? 'bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 shadow-sm'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white'
                }
              `}
              onClick={onClose}
            >
              <Icon
                className={`
                  mr-3 h-5 w-5 flex-shrink-0 transition-colors
                  ${
                    item.current
                      ? 'text-orange-600 dark:text-orange-400'
                      : 'text-gray-400 group-hover:text-gray-500 dark:group-hover:text-gray-300'
                  }
                `}
              />
              <span className="truncate">{item.name}</span>
              {item.current && (
                <div className="ml-auto w-1.5 h-1.5 bg-orange-600 dark:bg-orange-400 rounded-full"></div>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom section with user info on mobile */}
      <div className="border-t border-gray-200 dark:border-gray-700">
        {/* Mobile only - Quick stats */}
        <div className="lg:hidden px-3 sm:px-4 py-3 bg-gray-50 dark:bg-gray-900/50">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-500 dark:text-gray-400 truncate">Balance</span>
              <span className="text-xs font-semibold text-gray-900 dark:text-white">€5,000</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-500 dark:text-gray-400 truncate">Campagnes actives</span>
              <span className="text-xs font-semibold text-gray-900 dark:text-white">3</span>
            </div>
          </div>
        </div>
        
        {/* Logout button */}
        <div className="p-3 sm:p-4">
          <button
            onClick={() => {
              logout();
              onClose?.();
            }}
            className="w-full group flex items-center justify-center px-2 sm:px-3 py-2 sm:py-2.5 text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400 transition-all duration-200"
          >
            <LogOut className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400 group-hover:text-red-500 dark:group-hover:text-red-400 transition-colors flex-shrink-0" />
            <span className="ml-2 sm:ml-3 truncate">Déconnexion</span>
          </button>
        </div>
      </div>
    </div>
  );
}