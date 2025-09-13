'use client';

import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import AdminSidebar from '@/components/dashboard/admin/sidebar';
import { Bell, AlertTriangle, Server, Users, Settings } from 'lucide-react';
import Link from 'next/link';

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [systemStatus, setSystemStatus] = useState({
    cpu: 45,
    memory: 62,
    activeUsers: 1234,
    pendingActions: 8
  });
  const [notifications, setNotifications] = useState([
    { id: 1, type: 'warning', message: '3 campagnes en attente de validation', urgent: true },
    { id: 2, type: 'info', message: '12 nouveaux utilisateurs aujourd\'hui', urgent: false },
    { id: 3, type: 'alert', message: '2 tickets support prioritaires', urgent: true }
  ]);
  const [showNotificationDropdown, setShowNotificationDropdown] = useState(false);

  useEffect(() => {
    // Vérifier que l'utilisateur est bien SUPER_ADMIN
    if (isLoading) return;
    
    if (!user || user.role !== 'SUPER_ADMIN') {
      router.push('/auth/signin');
    }
  }, [user, isLoading, router]);

  // Ne pas afficher le contenu si pas admin
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (!user || user.role !== 'SUPER_ADMIN') {
    return null;
  }

  const urgentNotifications = notifications.filter(n => n.urgent).length;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header Admin */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 fixed top-0 left-0 right-0 z-40">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo et titre */}
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                  Clipbox Admin
                </h1>
              </div>
              
              {/* Badge mode Super Admin */}
              <span className="ml-4 px-3 py-1 text-xs font-semibold text-purple-600 bg-purple-100 dark:bg-purple-900/30 dark:text-purple-400 rounded-full">
                SUPER ADMIN
              </span>
            </div>

            {/* Infos système et notifications */}
            <div className="flex items-center space-x-6">
              {/* Statut système */}
              <div className="hidden lg:flex items-center space-x-4 text-sm">
                <div className="flex items-center space-x-2">
                  <Server className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-600 dark:text-gray-400">CPU: {systemStatus.cpu}%</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Users className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-600 dark:text-gray-400">{systemStatus.activeUsers} actifs</span>
                </div>
              </div>

              {/* Settings Icon */}
              <Link
                href="/dashboard/admin/settings"
                className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                <Settings className="h-6 w-6" />
              </Link>

              {/* Notifications urgentes */}
              <div className="relative">
                <button
                  onClick={() => setShowNotificationDropdown(!showNotificationDropdown)}
                  className="relative p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                >
                  <Bell className="h-6 w-6" />
                  {urgentNotifications > 0 && (
                    <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
                      {urgentNotifications}
                    </span>
                  )}
                </button>

                {/* Notifications Dropdown */}
                {showNotificationDropdown && (
                  <div className="absolute right-0 mt-2 w-80 max-w-[calc(100vw-2rem)] bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50 sm:max-w-sm">
                    <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-gray-900 dark:text-white">Notifications urgentes</h3>
                        <span className="text-xs text-red-600 dark:text-red-400">
                          {urgentNotifications} urgentes
                        </span>
                      </div>
                    </div>
                    <div className="max-h-96 overflow-y-auto">
                      {notifications.filter(n => n.urgent).map((notification) => (
                        <div
                          key={notification.id}
                          className="p-4 border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer"
                        >
                          <div className="flex items-start">
                            <AlertTriangle className="h-4 w-4 text-red-600 dark:text-red-400 mt-0.5 mr-2" />
                            <div className="flex-1">
                              <p className="font-medium text-sm text-gray-900 dark:text-white">
                                {notification.message}
                              </p>
                              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                Action requise
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="p-3 border-t border-gray-200 dark:border-gray-700">
                      <Link
                        href="/dashboard/admin/notifications"
                        className="text-sm text-purple-600 dark:text-purple-400 hover:underline"
                      >
                        Voir toutes les notifications
                      </Link>
                    </div>
                  </div>
                )}
              </div>

              {/* Actions en attente */}
              {systemStatus.pendingActions > 0 && (
                <div className="flex items-center space-x-2 px-3 py-1 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
                  <AlertTriangle className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                  <span className="text-sm font-medium text-orange-600 dark:text-orange-400">
                    {systemStatus.pendingActions} actions en attente
                  </span>
                </div>
              )}

              {/* Profil admin */}
              <div className="flex items-center space-x-3">
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {user.name || 'Admin'}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Super Administrateur
                  </p>
                </div>
                <div className="h-10 w-10 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 flex items-center justify-center">
                  <span className="text-white font-semibold">
                    {user.name?.charAt(0) || 'A'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Barre de notifications urgentes */}
        {urgentNotifications > 0 && (
          <div className="bg-red-50 dark:bg-red-900/20 border-t border-red-200 dark:border-red-800 px-4 py-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="h-4 w-4 text-red-600 dark:text-red-400" />
                <span className="text-sm text-red-600 dark:text-red-400">
                  Vous avez {urgentNotifications} notification{urgentNotifications > 1 ? 's' : ''} urgente{urgentNotifications > 1 ? 's' : ''}
                </span>
              </div>
              <button
                onClick={() => window.location.href = '/dashboard/admin/notifications'}
                className="text-sm text-red-600 dark:text-red-400 hover:underline"
              >
                Voir tout
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Layout avec sidebar */}
      <div className="flex h-screen pt-16">
        {/* Sidebar */}
        <AdminSidebar />

        {/* Contenu principal */}
        <main className="flex-1 overflow-y-auto">
          <div className="p-6 lg:p-8">
            {/* Alertes système globales */}
            {notifications.filter(n => n.urgent).map(notification => (
              <div
                key={notification.id}
                className="mb-4 p-4 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg flex items-center justify-between"
              >
                <div className="flex items-center space-x-3">
                  <AlertTriangle className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                  <span className="text-sm font-medium text-orange-800 dark:text-orange-200">
                    {notification.message}
                  </span>
                </div>
                <button
                  onClick={() => {
                    // Navigate based on notification type
                    if (notification.message.includes('campagnes')) {
                      window.location.href = '/dashboard/admin/campaigns?status=pending';
                    } else if (notification.message.includes('tickets support')) {
                      window.location.href = '/dashboard/admin/support';
                    } else {
                      window.location.href = '/dashboard/admin';
                    }
                  }}
                  className="text-sm text-orange-600 dark:text-orange-400 hover:underline"
                >
                  Traiter
                </button>
              </div>
            ))}

            {/* Contenu de la page */}
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}