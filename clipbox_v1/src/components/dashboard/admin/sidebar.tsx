'use client';

import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import {
  LayoutDashboard,
  Video,
  Shield,
  BarChart3,
  CreditCard,
  Users,
  FileText,
  HeadphonesIcon,
  Settings,
  Menu,
  X,
  AlertCircle,
  Clock,
  CheckCircle,
  Ban,
  LogOut,
  ChevronDown,
  ChevronRight,
  Activity,
  DollarSign,
  UserCheck,
  AlertTriangle,
  TrendingUp,
  Database,
  Globe
} from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';

interface NavItem {
  name: string;
  href: string;
  icon: React.ElementType;
  badge?: number | string;
  badgeColor?: string;
  subItems?: {
    name: string;
    href: string;
    badge?: number;
  }[];
}

export default function AdminSidebar() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  
  // Get the full URL with query parameters
  const fullPath = pathname + (searchParams.toString() ? `?${searchParams.toString()}` : '');

  const navigation: NavItem[] = [
    {
      name: 'Vue d\'ensemble',
      href: '/dashboard/admin',
      icon: LayoutDashboard,
      badge: 'LIVE',
      badgeColor: 'bg-green-500'
    },
    {
      name: 'Campagnes',
      href: '/dashboard/admin/campaigns',
      icon: Video,
      badge: 3,
      badgeColor: 'bg-orange-500',
      subItems: [
        { name: 'Toutes les campagnes', href: '/dashboard/admin/campaigns' },
        { name: 'En attente', href: '/dashboard/admin/campaigns?status=pending', badge: 3 },
        { name: 'Actives', href: '/dashboard/admin/campaigns?status=active' },
        { name: 'Terminées', href: '/dashboard/admin/campaigns?status=completed' }
      ]
    },
    {
      name: 'Modération',
      href: '/dashboard/admin/moderation',
      icon: Shield,
      badge: 12,
      badgeColor: 'bg-red-500',
      subItems: [
        { name: 'File d\'attente', href: '/dashboard/admin/moderation', badge: 12 },
        { name: 'Campagnes', href: '/dashboard/admin/moderation?type=campaigns', badge: 3 },
        { name: 'Clippers', href: '/dashboard/admin/moderation?type=clippers', badge: 5 },
        { name: 'Vidéos', href: '/dashboard/admin/moderation?type=videos', badge: 4 }
      ]
    },
    {
      name: 'Analytics',
      href: '/dashboard/admin/analytics',
      icon: BarChart3,
      subItems: [
        { name: 'Dashboard', href: '/dashboard/admin/analytics' },
        { name: 'Revenus', href: '/dashboard/admin/analytics?view=revenue' },
        { name: 'Utilisateurs', href: '/dashboard/admin/analytics?view=users' },
        { name: 'Performances', href: '/dashboard/admin/analytics?view=performance' }
      ]
    },
    {
      name: 'Paiements',
      href: '/dashboard/admin/payments',
      icon: CreditCard,
      badge: 8,
      badgeColor: 'bg-yellow-500',
      subItems: [
        { name: 'Transactions', href: '/dashboard/admin/payments' },
        { name: 'Retraits', href: '/dashboard/admin/payments?type=withdrawals', badge: 8 },
        { name: 'Rechargements', href: '/dashboard/admin/payments?type=deposits' },
        { name: 'Litiges', href: '/dashboard/admin/payments?type=disputes' }
      ]
    },
    {
      name: 'Utilisateurs',
      href: '/dashboard/admin/users',
      icon: Users,
      subItems: [
        { name: 'Tous les utilisateurs', href: '/dashboard/admin/users' },
        { name: 'Clippers', href: '/dashboard/admin/users?role=clipper' },
        { name: 'Annonceurs', href: '/dashboard/admin/users?role=advertiser' },
        { name: 'Bannis', href: '/dashboard/admin/users?status=banned' }
      ]
    },
    {
      name: 'Logs système',
      href: '/dashboard/admin/logs',
      icon: FileText,
      badge: '!',
      badgeColor: 'bg-purple-500'
    },
    {
      name: 'Support',
      href: '/dashboard/admin/support',
      icon: HeadphonesIcon,
      badge: 15,
      badgeColor: 'bg-blue-500'
    },
    {
      name: 'Paramètres',
      href: '/dashboard/admin/settings',
      icon: Settings
    }
  ];

  const quickStats = [
    { label: 'Utilisateurs actifs', value: '1,234', icon: Activity, trend: '+12%', color: 'text-green-500' },
    { label: 'Revenus du jour', value: '€12,450', icon: DollarSign, trend: '+8%', color: 'text-green-500' },
    { label: 'Taux de conversion', value: '3.2%', icon: TrendingUp, trend: '-2%', color: 'text-red-500' },
    { label: 'Charge serveur', value: '45%', icon: Database, trend: 'Stable', color: 'text-blue-500' }
  ];

  const toggleExpanded = (itemName: string) => {
    setExpandedItems(prev =>
      prev.includes(itemName)
        ? prev.filter(name => name !== itemName)
        : [...prev, itemName]
    );
  };

  const isActive = (href: string) => {
    if (href === '/dashboard/admin') {
      return pathname === href;
    }
    return pathname.startsWith(href);
  };

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="lg:hidden fixed top-20 left-4 z-50 p-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg"
      >
        {isMobileMenuOpen ? (
          <X className="h-6 w-6 text-gray-600 dark:text-gray-400" />
        ) : (
          <Menu className="h-6 w-6 text-gray-600 dark:text-gray-400" />
        )}
      </button>

      {/* Sidebar */}
      <aside
        className={`${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 fixed lg:static inset-y-0 left-0 z-40 w-72 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transition-transform duration-300 ease-in-out overflow-y-auto`}
      >
        <div className="flex flex-col h-full pt-20 lg:pt-0">
          {/* Quick Stats */}
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Statistiques rapides
              </h3>
              <Link
                href="/dashboard/admin/analytics"
                className="text-xs text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300"
              >
                Voir tout →
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {quickStats.map((stat, index) => (
                <div key={index} className="bg-gray-50 dark:bg-gray-900 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-1">
                    <stat.icon className="h-4 w-4 text-gray-400" />
                    <span className={`text-xs font-medium ${stat.color}`}>
                      {stat.trend}
                    </span>
                  </div>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">
                    {stat.value}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-4 space-y-1">
            {navigation.map((item) => (
              <div key={item.name}>
                <div
                  className={`group flex items-center justify-between px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                    isActive(item.href)
                      ? 'bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
                >
                  <Link
                    href={item.href}
                    className="flex items-center flex-1"
                  >
                    <item.icon className="mr-3 h-5 w-5 flex-shrink-0" />
                    <span>{item.name}</span>
                  </Link>
                  
                  <div className="flex items-center">
                    {item.badge && (
                      <span
                        className={`ml-2 px-2 py-0.5 text-xs font-bold text-white rounded-full ${
                          item.badgeColor || 'bg-gray-500'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                    
                    {item.subItems && (
                      <button
                        onClick={() => toggleExpanded(item.name)}
                        className="ml-2 p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded"
                      >
                        {expandedItems.includes(item.name) ? (
                          <ChevronDown className="h-4 w-4" />
                        ) : (
                          <ChevronRight className="h-4 w-4" />
                        )}
                      </button>
                    )}
                  </div>
                </div>

                {/* Sub-items */}
                {item.subItems && expandedItems.includes(item.name) && (
                  <div className="mt-1 ml-8 space-y-1">
                    {item.subItems.map((subItem) => (
                      <Link
                        key={subItem.href}
                        href={subItem.href}
                        className={`group flex items-center justify-between px-3 py-2 text-sm rounded-lg transition-colors ${
                          fullPath === subItem.href
                            ? 'bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400'
                            : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
                        }`}
                      >
                        <span>{subItem.name}</span>
                        {subItem.badge && (
                          <span className="px-2 py-0.5 text-xs font-bold text-white bg-orange-500 rounded-full">
                            {subItem.badge}
                          </span>
                        )}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* System Status */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <div className="bg-gradient-to-r from-purple-500 to-indigo-600 rounded-lg p-4 text-white">
              <div className="flex items-center justify-between mb-2">
                <Globe className="h-5 w-5" />
                <span className="text-xs font-semibold bg-white/20 px-2 py-1 rounded">
                  PRODUCTION
                </span>
              </div>
              <p className="text-sm font-semibold mb-1">Système opérationnel</p>
              <p className="text-xs opacity-90">Tous les services sont actifs</p>
              <div className="mt-3 flex items-center justify-between text-xs">
                <span>Uptime: 99.9%</span>
                <span>v2.1.0</span>
              </div>
            </div>
          </div>

          {/* Logout Button */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={() => logout()}
              className="w-full flex items-center justify-center px-4 py-2 text-sm font-medium text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/30 hover:bg-red-100 dark:hover:bg-red-900/50 rounded-lg transition-colors"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Déconnexion
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile overlay */}
      {isMobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 z-30 bg-black bg-opacity-50"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </>
  );
}