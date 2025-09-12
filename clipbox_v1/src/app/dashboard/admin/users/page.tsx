'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  Users,
  Search,
  Filter,
  MoreVertical,
  Eye,
  Ban,
  UserCheck,
  UserX,
  Mail,
  Calendar,
  Shield,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Download,
  ChevronLeft,
  ChevronRight,
  Edit,
  Trash2,
  Key,
  Globe,
  Clock,
  TrendingUp,
  Award,
  DollarSign,
  Video
} from 'lucide-react';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'clipper' | 'advertiser' | 'admin';
  status: 'active' | 'suspended' | 'banned' | 'pending';
  verified: boolean;
  kycStatus: 'verified' | 'pending' | 'rejected' | 'none';
  joinDate: Date;
  lastLogin: Date;
  country: string;
  language: string;
  stats: {
    earnings?: number;
    campaigns?: number;
    submissions?: number;
    views?: number;
    spent?: number;
  };
  violations: number;
}

export default function AdminUsersPage() {
  const searchParams = useSearchParams();
  const roleFilter = searchParams.get('role') || 'all';
  const statusFilter = searchParams.get('status') || 'all';
  
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showActionModal, setShowActionModal] = useState(false);
  const [actionType, setActionType] = useState<'suspend' | 'ban' | 'activate' | 'delete'>('suspend');

  // Mock data
  const mockUsers: User[] = [
    {
      id: '1',
      name: 'Jean Dupont',
      email: 'jean.dupont@email.com',
      role: 'clipper',
      status: 'active',
      verified: true,
      kycStatus: 'verified',
      joinDate: new Date('2023-06-15'),
      lastLogin: new Date(Date.now() - 2 * 60 * 60 * 1000),
      country: 'France',
      language: 'fr',
      stats: {
        earnings: 12500,
        submissions: 145,
        views: 850000
      },
      violations: 0
    },
    {
      id: '2',
      name: 'Nike France',
      email: 'contact@nike.fr',
      role: 'advertiser',
      status: 'active',
      verified: true,
      kycStatus: 'verified',
      joinDate: new Date('2023-01-10'),
      lastLogin: new Date(Date.now() - 24 * 60 * 60 * 1000),
      country: 'France',
      language: 'fr',
      stats: {
        spent: 125000,
        campaigns: 23
      },
      violations: 0
    },
    {
      id: '3',
      name: 'Marie Martin',
      email: 'marie.martin@gmail.com',
      role: 'clipper',
      status: 'suspended',
      verified: false,
      kycStatus: 'pending',
      joinDate: new Date('2024-01-20'),
      lastLogin: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      country: 'Belgique',
      language: 'fr',
      stats: {
        earnings: 450,
        submissions: 12,
        views: 25000
      },
      violations: 2
    },
    {
      id: '4',
      name: 'Tech Startup',
      email: 'hello@techstartup.com',
      role: 'advertiser',
      status: 'pending',
      verified: false,
      kycStatus: 'none',
      joinDate: new Date('2024-02-01'),
      lastLogin: new Date(Date.now() - 1 * 60 * 60 * 1000),
      country: 'France',
      language: 'en',
      stats: {
        spent: 0,
        campaigns: 0
      },
      violations: 0
    },
    {
      id: '5',
      name: 'Spammer User',
      email: 'spam@fake.com',
      role: 'clipper',
      status: 'banned',
      verified: false,
      kycStatus: 'rejected',
      joinDate: new Date('2024-01-15'),
      lastLogin: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      country: 'Unknown',
      language: 'en',
      stats: {
        earnings: 0,
        submissions: 0,
        views: 0
      },
      violations: 5
    }
  ];

  useEffect(() => {
    // Filtrer les utilisateurs
    let filtered = mockUsers;
    
    if (roleFilter !== 'all') {
      filtered = filtered.filter(u => u.role === roleFilter);
    }
    
    if (statusFilter !== 'all') {
      filtered = filtered.filter(u => u.status === statusFilter);
    }
    
    if (searchTerm) {
      filtered = filtered.filter(u =>
        u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setTimeout(() => {
      setUsers(filtered);
      setIsLoading(false);
    }, 500);
  }, [roleFilter, statusFilter, searchTerm]);

  const stats = [
    {
      label: 'Total utilisateurs',
      value: mockUsers.length,
      icon: Users,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100 dark:bg-purple-900/30'
    },
    {
      label: 'Clippers actifs',
      value: mockUsers.filter(u => u.role === 'clipper' && u.status === 'active').length,
      icon: Video,
      color: 'text-green-600',
      bgColor: 'bg-green-100 dark:bg-green-900/30'
    },
    {
      label: 'Annonceurs',
      value: mockUsers.filter(u => u.role === 'advertiser').length,
      icon: DollarSign,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100 dark:bg-blue-900/30'
    },
    {
      label: 'Suspendus/Bannis',
      value: mockUsers.filter(u => u.status === 'suspended' || u.status === 'banned').length,
      icon: Ban,
      color: 'text-red-600',
      bgColor: 'bg-red-100 dark:bg-red-900/30'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'text-green-600 bg-green-100 dark:bg-green-900/30';
      case 'suspended':
        return 'text-orange-600 bg-orange-100 dark:bg-orange-900/30';
      case 'banned':
        return 'text-red-600 bg-red-100 dark:bg-red-900/30';
      case 'pending':
        return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30';
      default:
        return 'text-gray-600 bg-gray-100 dark:bg-gray-900/30';
    }
  };

  const getKycStatusColor = (status: string) => {
    switch (status) {
      case 'verified':
        return 'text-green-600';
      case 'pending':
        return 'text-yellow-600';
      case 'rejected':
        return 'text-red-600';
      default:
        return 'text-gray-400';
    }
  };

  const getRoleBadge = (role: string) => {
    const colors = {
      clipper: 'bg-purple-100 dark:bg-purple-900/30 text-purple-600',
      advertiser: 'bg-blue-100 dark:bg-blue-900/30 text-blue-600',
      admin: 'bg-red-100 dark:bg-red-900/30 text-red-600'
    };
    
    return (
      <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${colors[role as keyof typeof colors]}`}>
        {role === 'clipper' ? 'Clipper' : role === 'advertiser' ? 'Annonceur' : 'Admin'}
      </span>
    );
  };

  const handleUserAction = (user: User, action: 'suspend' | 'ban' | 'activate' | 'delete') => {
    setSelectedUser(user);
    setActionType(action);
    setShowActionModal(true);
  };

  const confirmAction = () => {
    console.log(`Action ${actionType} on user:`, selectedUser);
    setShowActionModal(false);
    setSelectedUser(null);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    }).format(date);
  };

  const formatTimeAgo = (date: Date) => {
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
    if (seconds < 60) return 'Il y a quelques secondes';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `Il y a ${minutes} minute${minutes > 1 ? 's' : ''}`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `Il y a ${hours} heure${hours > 1 ? 's' : ''}`;
    const days = Math.floor(hours / 24);
    return `Il y a ${days} jour${days > 1 ? 's' : ''}`;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Gestion des utilisateurs
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Gérez les comptes utilisateurs et leurs permissions
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center gap-2">
            <Download className="h-4 w-4" />
            Exporter
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {stat.label}
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                  {stat.value}
                </p>
              </div>
              <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                <stat.icon className={`h-6 w-6 ${stat.color}`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Rechercher par nom, email..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
              />
            </div>
          </div>
          
          <div className="flex gap-2">
            <select
              value={roleFilter}
              onChange={(e) => window.location.href = `/dashboard/admin/users?role=${e.target.value}`}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
            >
              <option value="all">Tous les rôles</option>
              <option value="clipper">Clippers</option>
              <option value="advertiser">Annonceurs</option>
              <option value="admin">Admins</option>
            </select>
            
            <select
              value={statusFilter}
              onChange={(e) => window.location.href = `/dashboard/admin/users?status=${e.target.value}`}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
            >
              <option value="all">Tous les statuts</option>
              <option value="active">Actifs</option>
              <option value="suspended">Suspendus</option>
              <option value="banned">Bannis</option>
              <option value="pending">En attente</option>
            </select>
            
            <button className="p-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700">
              <Filter className="h-5 w-5 text-gray-600 dark:text-gray-400" />
            </button>
          </div>
        </div>

        {/* Bulk Actions */}
        {selectedUsers.length > 0 && (
          <div className="mt-4 p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg flex items-center justify-between">
            <span className="text-sm text-purple-600 dark:text-purple-400">
              {selectedUsers.length} utilisateur(s) sélectionné(s)
            </span>
            <div className="flex gap-2">
              <button className="px-3 py-1 text-sm bg-orange-600 text-white rounded hover:bg-orange-700">
                Suspendre
              </button>
              <button className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700">
                Bannir
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Users Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
              <tr>
                <th className="px-6 py-3 text-left">
                  <input
                    type="checkbox"
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedUsers(users.map(u => u.id));
                      } else {
                        setSelectedUsers([]);
                      }
                    }}
                    className="rounded border-gray-300 dark:border-gray-600"
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Utilisateur
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Rôle
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Statut
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  KYC
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Statistiques
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Dernière connexion
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {users.map((user) => (
                <tr
                  key={user.id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-900"
                >
                  <td className="px-6 py-4">
                    <input
                      type="checkbox"
                      checked={selectedUsers.includes(user.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedUsers([...selectedUsers, user.id]);
                        } else {
                          setSelectedUsers(selectedUsers.filter(id => id !== user.id));
                        }
                      }}
                      className="rounded border-gray-300 dark:border-gray-600"
                    />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 flex items-center justify-center">
                        <span className="text-white font-semibold">
                          {user.name.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {user.name}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {user.email}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs text-gray-400">
                            {user.country}
                          </span>
                          {user.verified && (
                            <CheckCircle className="h-3 w-3 text-blue-500" />
                          )}
                          {user.violations > 0 && (
                            <span className="text-xs text-red-600">
                              {user.violations} violation(s)
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {getRoleBadge(user.role)}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(user.status)}`}>
                      {user.status === 'active' && 'Actif'}
                      {user.status === 'suspended' && 'Suspendu'}
                      {user.status === 'banned' && 'Banni'}
                      {user.status === 'pending' && 'En attente'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1">
                      <Shield className={`h-4 w-4 ${getKycStatusColor(user.kycStatus)}`} />
                      <span className={`text-xs ${getKycStatusColor(user.kycStatus)}`}>
                        {user.kycStatus === 'verified' && 'Vérifié'}
                        {user.kycStatus === 'pending' && 'En cours'}
                        {user.kycStatus === 'rejected' && 'Rejeté'}
                        {user.kycStatus === 'none' && 'Non soumis'}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm">
                      {user.role === 'clipper' ? (
                        <div className="space-y-1">
                          <p className="text-gray-900 dark:text-white">
                            €{user.stats.earnings?.toLocaleString() || 0}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {user.stats.submissions} clips • {user.stats.views?.toLocaleString()} vues
                          </p>
                        </div>
                      ) : (
                        <div className="space-y-1">
                          <p className="text-gray-900 dark:text-white">
                            €{user.stats.spent?.toLocaleString() || 0}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {user.stats.campaigns} campagnes
                          </p>
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      <p>{formatTimeAgo(user.lastLogin)}</p>
                      <p className="text-xs">
                        Inscrit le {formatDate(user.joinDate)}
                      </p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          setSelectedUser(user);
                          setShowDetailModal(true);
                        }}
                        className="p-1 text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400"
                        title="Voir détails"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      
                      {user.status === 'active' && (
                        <button
                          onClick={() => handleUserAction(user, 'suspend')}
                          className="p-1 text-orange-600 hover:text-orange-700"
                          title="Suspendre"
                        >
                          <UserX className="h-4 w-4" />
                        </button>
                      )}
                      
                      {(user.status === 'suspended' || user.status === 'banned') && (
                        <button
                          onClick={() => handleUserAction(user, 'activate')}
                          className="p-1 text-green-600 hover:text-green-700"
                          title="Réactiver"
                        >
                          <UserCheck className="h-4 w-4" />
                        </button>
                      )}
                      
                      {user.status !== 'banned' && (
                        <button
                          onClick={() => handleUserAction(user, 'ban')}
                          className="p-1 text-red-600 hover:text-red-700"
                          title="Bannir"
                        >
                          <Ban className="h-4 w-4" />
                        </button>
                      )}
                      
                      <button className="p-1 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
                        <MoreVertical className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Affichage de 1 à {users.length} sur {users.length} utilisateurs
            </p>
            <div className="flex items-center gap-2">
              <button
                disabled={currentPage === 1}
                className="p-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <span className="px-3 py-1 border border-purple-600 bg-purple-50 dark:bg-purple-900/30 text-purple-600 rounded-lg">
                1
              </span>
              <button
                disabled
                className="p-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Action Modal */}
      {showActionModal && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Confirmer l'action
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Êtes-vous sûr de vouloir {
                actionType === 'suspend' ? 'suspendre' :
                actionType === 'ban' ? 'bannir' :
                actionType === 'activate' ? 'réactiver' :
                'supprimer'
              } l'utilisateur "{selectedUser.name}" ?
            </p>
            
            {(actionType === 'suspend' || actionType === 'ban') && (
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Raison
                </label>
                <textarea
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                  rows={3}
                  placeholder="Expliquez la raison..."
                />
              </div>
            )}
            
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowActionModal(false)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
              >
                Annuler
              </button>
              <button
                onClick={confirmAction}
                className={`px-4 py-2 rounded-lg text-white ${
                  actionType === 'activate' ? 'bg-green-600 hover:bg-green-700' :
                  actionType === 'suspend' ? 'bg-orange-600 hover:bg-orange-700' :
                  actionType === 'ban' ? 'bg-red-600 hover:bg-red-700' :
                  'bg-red-600 hover:bg-red-700'
                }`}
              >
                Confirmer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}