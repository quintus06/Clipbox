'use client';

import { useAuth } from '@/hooks/use-auth';
import { redirect } from 'next/navigation';
import { ReactNode, useState, useEffect, useRef } from 'react';
import { Menu, X, DollarSign, User, FileText, Settings, Bell, ChevronDown } from 'lucide-react';
import AdvertiserSidebar from '@/components/dashboard/advertiser/sidebar';
import BalanceWidget from '@/components/dashboard/advertiser/balance-widget';
import Link from 'next/link';
import Image from 'next/image';

interface AdvertiserLayoutProps {
  children: ReactNode;
}

export default function AdvertiserLayout({ children }: AdvertiserLayoutProps) {
  const { user, isLoading, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: 'Campagne approuvée',
      message: 'Votre campagne "Summer Collection" a été approuvée',
      time: 'Il y a 5 min',
      read: false,
    },
    {
      id: 2,
      title: 'Nouveau clipper',
      message: '5 nouveaux clippers ont postulé à votre campagne',
      time: 'Il y a 2h',
      read: false,
    },
    {
      id: 3,
      title: 'Rapport disponible',
      message: 'Le rapport mensuel de vos campagnes est prêt',
      time: 'Hier',
      read: true,
    },
  ]);

  const unreadNotifications = notifications.filter(n => !n.read).length;
  const notificationRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Redirect if not authenticated or not an advertiser
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (!user || user.role !== 'ADVERTISER') {
    redirect('/auth/signin');
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex overflow-x-hidden">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar - Fixed on desktop, overlay on mobile */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-800 transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <AdvertiserSidebar onClose={() => setSidebarOpen(false)} />
      </aside>

      {/* Main content wrapper */}
      <div className="flex-1 flex flex-col min-w-0 overflow-x-hidden">
        {/* Header */}
        <header className="sticky top-0 z-30 bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              {/* Left side - Mobile menu button and title */}
              <div className="flex items-center">
                <button
                  type="button"
                  className="lg:hidden p-2 rounded-md text-gray-400 dark:text-gray-500 hover:text-gray-500 dark:hover:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-orange-500"
                  onClick={() => setSidebarOpen(true)}
                >
                  <span className="sr-only">Ouvrir le menu</span>
                  <Menu className="h-6 w-6" />
                </button>
                <h1 className="ml-2 lg:ml-0 text-lg sm:text-xl font-semibold text-gray-900 dark:text-white truncate">
                  Dashboard Annonceur
                </h1>
              </div>

              {/* Right side items */}
              <div className="flex items-center space-x-1 sm:space-x-3">
                {/* Balance Widget - Hidden on small mobile */}
                <div className="hidden sm:block">
                  <BalanceWidget />
                </div>

                {/* Settings Icon */}
                <Link
                  href="/dashboard/advertiser/settings"
                  className="p-1.5 sm:p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <Settings className="h-4 w-4 sm:h-5 sm:w-5 text-gray-600 dark:text-gray-400" />
                </Link>

                {/* Notifications */}
                <div className="relative" ref={notificationRef}>
                  <button
                    onClick={() => setShowNotifications(!showNotifications)}
                    className="relative p-1.5 sm:p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500"
                  >
                    <Bell className="h-4 w-4 sm:h-5 sm:w-5 text-gray-600 dark:text-gray-400" />
                    {unreadNotifications > 0 && (
                      <span className="absolute top-0.5 right-0.5 sm:top-1 sm:right-1 h-2 w-2 bg-red-500 rounded-full"></span>
                    )}
                  </button>

                  {/* Notifications Dropdown */}
                  {showNotifications && (
                    <div className="absolute right-0 mt-2 w-72 sm:w-80 max-w-[calc(100vw-2rem)] bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50">
                      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                        <div className="flex items-center justify-between">
                          <h3 className="font-semibold text-gray-900 dark:text-white">Notifications</h3>
                          {unreadNotifications > 0 && (
                            <span className="text-xs text-orange-600 dark:text-orange-400">
                              {unreadNotifications} non lues
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="max-h-64 sm:max-h-96 overflow-y-auto">
                        {notifications.map((notification) => (
                          <div
                            key={notification.id}
                            className={`p-3 sm:p-4 border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer ${
                              !notification.read ? 'bg-orange-50/50 dark:bg-orange-900/10' : ''
                            }`}
                            onClick={() => {
                              // Mark as read logic here
                              setShowNotifications(false);
                            }}
                          >
                            <div className="flex items-start">
                              <div className="flex-1 min-w-0">
                                <p className="font-medium text-sm text-gray-900 dark:text-white truncate">{notification.title}</p>
                                <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
                                  {notification.message}
                                </p>
                                <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
                                  {notification.time}
                                </p>
                              </div>
                              {!notification.read && (
                                <div className="w-2 h-2 bg-orange-600 rounded-full ml-2 flex-shrink-0"></div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="p-3 border-t border-gray-200 dark:border-gray-700">
                        <Link
                          href="/dashboard/advertiser/notifications"
                          className="text-sm text-orange-600 dark:text-orange-400 hover:underline"
                          onClick={() => setShowNotifications(false)}
                        >
                          Voir toutes les notifications
                        </Link>
                      </div>
                    </div>
                  )}
                </div>

                {/* User Menu */}
                <div className="relative" ref={userMenuRef}>
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center space-x-1 sm:space-x-2 p-1 sm:p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                  >
                    {user.image ? (
                      <Image
                        src={user.image}
                        alt={user.name || 'User'}
                        width={32}
                        height={32}
                        className="w-7 h-7 sm:w-8 sm:h-8 rounded-full"
                      />
                    ) : (
                      <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center">
                        <span className="text-white font-medium text-xs sm:text-sm">
                          {user.name?.charAt(0) || 'U'}
                        </span>
                      </div>
                    )}
                    <ChevronDown className="h-3 w-3 sm:h-4 sm:w-4 text-gray-600 dark:text-gray-400" />
                  </button>

                  {/* User Dropdown */}
                  {showUserMenu && (
                    <div className="absolute right-0 mt-2 w-48 sm:w-56 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50">
                      <div className="p-3 sm:p-4 border-b border-gray-200 dark:border-gray-700">
                        <p className="font-medium text-xs sm:text-sm text-gray-900 dark:text-white truncate">{user.name}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 truncate">
                          {user.email}
                        </p>
                      </div>
                      <div className="p-2">
                        <Link
                          href="/dashboard/advertiser/profile"
                          className="block px-2.5 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                          onClick={() => setShowUserMenu(false)}
                        >
                          Mon Profil
                        </Link>
                        <Link
                          href="/dashboard/advertiser/settings"
                          className="block px-2.5 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                          onClick={() => setShowUserMenu(false)}
                        >
                          Paramètres
                        </Link>
                        <Link
                          href="/dashboard/advertiser/subscription"
                          className="block px-2.5 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                          onClick={() => setShowUserMenu(false)}
                        >
                          Mon Abonnement
                        </Link>
                        <hr className="my-1.5 sm:my-2 border-gray-200 dark:border-gray-700" />
                        <button
                          onClick={() => logout()}
                          className="block w-full text-left px-2.5 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"
                        >
                          Déconnexion
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-x-hidden">
          <div className="py-4 sm:py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}