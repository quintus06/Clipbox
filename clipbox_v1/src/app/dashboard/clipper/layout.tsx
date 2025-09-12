'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { ClipperSidebar } from '@/components/dashboard/clipper/sidebar';
import { Bell, Search, Settings, ChevronDown } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export default function ClipperDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isLoading, logout } = useAuth();
  const router = useRouter();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: 'Nouvelle campagne disponible',
      message: 'Une campagne correspondant à votre profil vient d\'être publiée',
      time: 'Il y a 5 min',
      read: false,
    },
    {
      id: 2,
      title: 'Clip approuvé',
      message: 'Votre clip pour "Summer Vibes" a été approuvé',
      time: 'Il y a 2h',
      read: false,
    },
    {
      id: 3,
      title: 'Paiement reçu',
      message: 'Vous avez reçu 45€ pour vos clips approuvés',
      time: 'Hier',
      read: true,
    },
  ]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  // Redirect if not authenticated or not a clipper
  useEffect(() => {
    if (isLoading) return;
    
    if (!user) {
      router.push('/auth/signin?callbackUrl=/dashboard/clipper');
      return;
    }

    // Check if user is a clipper
    if (user.role !== 'CLIPPER') {
      // Redirect to appropriate dashboard based on role
      if (user.role === 'ADVERTISER') {
        router.push('/dashboard/advertiser');
      } else if (user.role === 'SUPER_ADMIN') {
        router.push('/dashboard/admin');
      } else {
        router.push('/');
      }
    }
  }, [user, isLoading, router]);

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  // Don't render anything if not authenticated or not a clipper
  if (!user || user.role !== 'CLIPPER') {
    return null;
  }

  const unreadNotifications = notifications.filter(n => !n.read).length;

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      {/* Sidebar */}
      <ClipperSidebar 
        collapsed={sidebarCollapsed} 
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} 
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              {/* Search Bar */}
              <div className="flex-1 max-w-xl">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Rechercher des campagnes, clips..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Right Section */}
              <div className="flex items-center space-x-4 ml-4">
                {/* Quick Actions */}
                <Link
                  href="/dashboard/clipper/settings"
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <Settings className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                </Link>

                {/* Notifications */}
                <div className="relative">
                  <button
                    onClick={() => setShowNotifications(!showNotifications)}
                    className="relative p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                  >
                    <Bell className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                    {unreadNotifications > 0 && (
                      <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full"></span>
                    )}
                  </button>

                  {/* Notifications Dropdown */}
                  {showNotifications && (
                    <div className="absolute right-0 mt-2 w-80 max-w-[calc(100vw-2rem)] bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50 sm:max-w-sm">
                      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                        <div className="flex items-center justify-between">
                          <h3 className="font-semibold text-gray-900 dark:text-white">Notifications</h3>
                          {unreadNotifications > 0 && (
                            <span className="text-xs text-purple-600 dark:text-purple-400">
                              {unreadNotifications} non lues
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="max-h-96 overflow-y-auto">
                        {notifications.map((notification) => (
                          <div
                            key={notification.id}
                            className={`p-4 border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer ${
                              !notification.read ? 'bg-purple-50/50 dark:bg-purple-900/10' : ''
                            }`}
                          >
                            <div className="flex items-start">
                              <div className="flex-1">
                                <p className="font-medium text-sm text-gray-900 dark:text-white">{notification.title}</p>
                                <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                                  {notification.message}
                                </p>
                                <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
                                  {notification.time}
                                </p>
                              </div>
                              {!notification.read && (
                                <div className="w-2 h-2 bg-purple-600 rounded-full ml-2"></div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="p-3 border-t border-gray-200 dark:border-gray-700">
                        <Link
                          href="/dashboard/clipper/notifications"
                          className="text-sm text-purple-600 dark:text-purple-400 hover:underline"
                        >
                          Voir toutes les notifications
                        </Link>
                      </div>
                    </div>
                  )}
                </div>

                {/* User Menu */}
                <div className="relative">
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center space-x-3 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                  >
                    {user.image ? (
                      <Image
                        src={user.image}
                        alt={user.name || 'User'}
                        width={32}
                        height={32}
                        className="rounded-full"
                      />
                    ) : (
                      <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-blue-600 rounded-full flex items-center justify-center">
                        <span className="text-white font-medium text-sm">
                          {user.name?.charAt(0) || 'U'}
                        </span>
                      </div>
                    )}
                    <ChevronDown className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                  </button>

                  {/* User Dropdown */}
                  {showUserMenu && (
                    <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50">
                      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                        <p className="font-medium text-sm text-gray-900 dark:text-white">{user.name}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          {user.email}
                        </p>
                      </div>
                      <div className="p-2">
                        <Link
                          href="/dashboard/clipper/profile"
                          className="block px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                        >
                          Mon Profil
                        </Link>
                        <Link
                          href="/dashboard/clipper/settings"
                          className="block px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                        >
                          Paramètres
                        </Link>
                        <Link
                          href="/dashboard/clipper/subscription"
                          className="block px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                        >
                          Mon Abonnement
                        </Link>
                        <hr className="my-2 border-gray-200 dark:border-gray-700" />
                        <button
                          onClick={() => logout()}
                          className="block w-full text-left px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"
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

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto">
          <div className="p-4 sm:p-6 lg:p-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}