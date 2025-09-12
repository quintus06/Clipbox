'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import {
  Home,
  Video,
  FileVideo,
  BarChart3,
  Wallet,
  User,
  CreditCard,
  Menu,
  X,
  LogOut,
  Bell,
  Settings,
  HelpCircle,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  DollarSign,
  Clock,
  CheckCircle,
} from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import Image from 'next/image';

interface SidebarProps {
  collapsed?: boolean;
  onToggle?: () => void;
}

const menuItems = [
  {
    title: 'Tableau de bord',
    href: '/dashboard/clipper',
    icon: Home,
    badge: null,
  },
  {
    title: 'Campagnes',
    href: '/dashboard/clipper/campaigns',
    icon: Video,
    badge: 'new',
  },
  {
    title: 'Mes Soumissions',
    href: '/dashboard/clipper/submissions',
    icon: FileVideo,
    badge: null,
  },
  {
    title: 'Statistiques',
    href: '/dashboard/clipper/stats',
    icon: BarChart3,
    badge: null,
  },
  {
    title: 'Paiements',
    href: '/dashboard/clipper/payments',
    icon: Wallet,
    badge: null,
  },
  {
    title: 'Mon Profil',
    href: '/dashboard/clipper/profile',
    icon: User,
    badge: null,
  },
  {
    title: 'Abonnement',
    href: '/dashboard/clipper/subscription',
    icon: CreditCard,
    badge: null,
  },
];

const bottomMenuItems = [
  {
    title: 'Paramètres',
    href: '/dashboard/clipper/settings',
    icon: Settings,
  },
  {
    title: 'Aide & Support',
    href: '/dashboard/clipper/support',
    icon: HelpCircle,
  },
];

export function ClipperSidebar({ collapsed = false, onToggle }: SidebarProps) {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (href: string) => {
    if (href === '/dashboard/clipper') {
      return pathname === href;
    }
    return pathname.startsWith(href);
  };

  const handleSignOut = async () => {
    await logout();
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg"
      >
        {mobileMenuOpen ? <X className="h-6 w-6 text-gray-700 dark:text-gray-300" /> : <Menu className="h-6 w-6 text-gray-700 dark:text-gray-300" />}
      </button>

      {/* Mobile Overlay */}
      {mobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed lg:sticky top-0 left-0 z-40 h-screen
          ${collapsed ? 'w-20' : 'w-64'}
          ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          transition-all duration-300 ease-in-out
          bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800
        `}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800">
            {!collapsed && (
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">C</span>
                </div>
                <div>
                  <h2 className="font-bold text-lg text-gray-900 dark:text-white">Clipbox</h2>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Dashboard Clipper</p>
                </div>
              </div>
            )}
            <button
              onClick={onToggle}
              className="hidden lg:block p-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
            >
              {collapsed ? <ChevronRight className="h-5 w-5 text-gray-600 dark:text-gray-400" /> : <ChevronLeft className="h-5 w-5 text-gray-600 dark:text-gray-400" />}
            </button>
          </div>

          {/* User Info */}
          {user && (
            <div className={`p-4 border-b border-gray-200 dark:border-gray-800 ${collapsed ? 'px-2' : ''}`}>
              <div className={`flex items-center ${collapsed ? 'justify-center' : 'space-x-3'}`}>
                <div className="relative">
                  {user.image ? (
                    <Image
                      src={user.image}
                      alt={user.name || 'User'}
                      width={40}
                      height={40}
                      className="rounded-full"
                    />
                  ) : (
                    <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center">
                      <User className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                    </div>
                  )}
                  <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-gray-900" />
                </div>
                {!collapsed && (
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{user.name || 'Clipper'}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user.email}</p>
                  </div>
                )}
              </div>

              {/* Quick Stats */}
              {!collapsed && (
                <div className="mt-4 grid grid-cols-3 gap-2">
                  <div className="text-center">
                    <p className="text-xs text-gray-500 dark:text-gray-400">Gains</p>
                    <p className="text-sm font-bold text-gray-900 dark:text-white">€245</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-gray-500 dark:text-gray-400">Clips</p>
                    <p className="text-sm font-bold text-gray-900 dark:text-white">12</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-gray-500 dark:text-gray-400">Vues</p>
                    <p className="text-sm font-bold text-gray-900 dark:text-white">45K</p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto p-4">
            <ul className="space-y-1">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.href);
                
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={`
                        flex items-center justify-between px-3 py-2.5 rounded-lg transition-all
                        ${active 
                          ? 'bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400' 
                          : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300'
                        }
                        ${collapsed ? 'justify-center' : ''}
                      `}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <div className={`flex items-center ${collapsed ? '' : 'space-x-3'}`}>
                        <Icon className={`h-5 w-5 ${active ? 'text-purple-600 dark:text-purple-400' : ''}`} />
                        {!collapsed && <span className="font-medium">{item.title}</span>}
                      </div>
                      {!collapsed && item.badge && (
                        <span className={`
                          px-2 py-0.5 text-xs font-medium rounded-full
                          ${item.badge === 'new' 
                            ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                            : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400'
                          }
                        `}>
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>

            {/* Separator */}
            <div className="my-4 border-t border-gray-200 dark:border-gray-800" />

            {/* Bottom Menu */}
            <ul className="space-y-1">
              {bottomMenuItems.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.href);
                
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={`
                        flex items-center px-3 py-2.5 rounded-lg transition-all
                        ${active 
                          ? 'bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400' 
                          : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300'
                        }
                        ${collapsed ? 'justify-center' : 'space-x-3'}
                      `}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <Icon className={`h-5 w-5 ${active ? 'text-purple-600 dark:text-purple-400' : ''}`} />
                      {!collapsed && <span className="font-medium">{item.title}</span>}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-800">
            <button
              onClick={handleSignOut}
              className={`
                w-full flex items-center px-3 py-2.5 rounded-lg transition-all
                hover:bg-red-50 dark:hover:bg-red-900/20 text-gray-700 dark:text-gray-300
                hover:text-red-600 dark:hover:text-red-400
                ${collapsed ? 'justify-center' : 'space-x-3'}
              `}
            >
              <LogOut className="h-5 w-5" />
              {!collapsed && <span className="font-medium">Déconnexion</span>}
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}