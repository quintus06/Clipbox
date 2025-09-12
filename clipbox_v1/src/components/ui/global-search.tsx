'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Search, X, Loader2, TrendingUp, Clock, Users, Megaphone, HelpCircle, FileText } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

// Custom debounce function to avoid lodash dependency
function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;
  
  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null;
      func(...args);
    };
    
    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(later, wait);
  };
}

interface SearchResult {
  campaigns: any[];
  users: any[];
  tickets: any[];
}

export default function GlobalSearch() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult>({ campaigns: [], users: [], tickets: [] });
  const [loading, setLoading] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  // Charger les recherches récentes
  useEffect(() => {
    const saved = localStorage.getItem('recentSearches');
    if (saved) {
      setRecentSearches(JSON.parse(saved));
    }
  }, []);

  // Fermer la recherche en cliquant dehors
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Raccourci clavier Ctrl+K ou Cmd+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen(true);
        setTimeout(() => inputRef.current?.focus(), 100);
      }
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Fonction de recherche avec debounce
  const performSearch = useCallback(
    debounce(async (searchQuery: string) => {
      if (searchQuery.length < 2) {
        setResults({ campaigns: [], users: [], tickets: [] });
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const response = await fetch(`/api/search?q=${encodeURIComponent(searchQuery)}`);
        const data = await response.json();
        setResults(data.results || { campaigns: [], users: [], tickets: [] });
      } catch (error) {
        console.error('Search error:', error);
        setResults({ campaigns: [], users: [], tickets: [] });
      } finally {
        setLoading(false);
      }
    }, 300),
    []
  );

  // Gérer le changement de recherche
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    
    if (value.length >= 2) {
      setLoading(true);
      performSearch(value);
    } else {
      setResults({ campaigns: [], users: [], tickets: [] });
      setLoading(false);
    }
  };

  // Sauvegarder la recherche récente
  const saveRecentSearch = (search: string) => {
    const updated = [search, ...recentSearches.filter(s => s !== search)].slice(0, 5);
    setRecentSearches(updated);
    localStorage.setItem('recentSearches', JSON.stringify(updated));
  };

  // Gérer la sélection d'un résultat
  const handleResultClick = (url: string, searchTerm: string) => {
    saveRecentSearch(searchTerm);
    setIsOpen(false);
    setQuery('');
    router.push(url);
  };

  const hasResults = results.campaigns.length > 0 || results.users.length > 0 || results.tickets.length > 0;

  return (
    <>
      {/* Bouton de recherche */}
      <button
        onClick={() => {
          setIsOpen(true);
          setTimeout(() => inputRef.current?.focus(), 100);
        }}
        className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
      >
        <Search className="w-4 h-4" />
        <span className="hidden sm:inline">Rechercher...</span>
        <kbd className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded">
          ⌘K
        </kbd>
      </button>

      {/* Modal de recherche */}
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="min-h-screen px-4 text-center">
            {/* Overlay */}
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" />

            {/* Centrer le modal */}
            <span className="inline-block h-screen align-middle" aria-hidden="true">
              &#8203;
            </span>

            {/* Modal */}
            <div
              ref={searchRef}
              className="inline-block w-full max-w-2xl my-8 text-left align-middle transition-all transform bg-white dark:bg-gray-800 shadow-xl rounded-xl"
            >
              {/* Barre de recherche */}
              <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                <Search className="w-5 h-5 text-gray-400" />
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={handleSearchChange}
                  placeholder="Rechercher des campagnes, utilisateurs, tickets..."
                  className="flex-1 bg-transparent text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none"
                  autoFocus
                />
                {loading && <Loader2 className="w-5 h-5 text-purple-600 animate-spin" />}
                <button
                  onClick={() => {
                    setIsOpen(false);
                    setQuery('');
                  }}
                  className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              {/* Contenu */}
              <div className="max-h-[60vh] overflow-y-auto">
                {/* Recherches récentes */}
                {!query && recentSearches.length > 0 && (
                  <div className="p-4">
                    <h3 className="flex items-center gap-2 text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">
                      <Clock className="w-4 h-4" />
                      Recherches récentes
                    </h3>
                    <div className="space-y-1">
                      {recentSearches.map((search, index) => (
                        <button
                          key={index}
                          onClick={() => {
                            setQuery(search);
                            handleSearchChange({ target: { value: search } } as any);
                          }}
                          className="w-full text-left px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                        >
                          {search}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Suggestions populaires */}
                {!query && !recentSearches.length && (
                  <div className="p-4">
                    <h3 className="flex items-center gap-2 text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">
                      <TrendingUp className="w-4 h-4" />
                      Suggestions
                    </h3>
                    <div className="grid grid-cols-2 gap-2">
                      {['Campagnes actives', 'Top clippers', 'Nouveaux utilisateurs', 'Tickets ouverts'].map((suggestion) => (
                        <button
                          key={suggestion}
                          onClick={() => {
                            setQuery(suggestion);
                            handleSearchChange({ target: { value: suggestion } } as any);
                          }}
                          className="px-3 py-2 text-sm text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
                        >
                          {suggestion}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Résultats de recherche */}
                {query && !loading && hasResults && (
                  <div className="p-4 space-y-4">
                    {/* Campagnes */}
                    {results.campaigns.length > 0 && (
                      <div>
                        <h3 className="flex items-center gap-2 text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                          <Megaphone className="w-4 h-4" />
                          Campagnes
                        </h3>
                        <div className="space-y-1">
                          {results.campaigns.slice(0, 3).map((campaign) => (
                            <button
                              key={campaign.id}
                              onClick={() => handleResultClick(`/dashboard/advertiser/campaigns/${campaign.id}`, query)}
                              className="w-full text-left px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                            >
                              <div className="font-medium text-gray-900 dark:text-white">{campaign.title}</div>
                              <div className="text-sm text-gray-500 dark:text-gray-400">{campaign.brand}</div>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Utilisateurs */}
                    {results.users.length > 0 && (
                      <div>
                        <h3 className="flex items-center gap-2 text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                          <Users className="w-4 h-4" />
                          Utilisateurs
                        </h3>
                        <div className="space-y-1">
                          {results.users.slice(0, 3).map((user) => (
                            <button
                              key={user.id}
                              onClick={() => handleResultClick(`/dashboard/admin/users?id=${user.id}`, query)}
                              className="w-full text-left px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                            >
                              <div className="font-medium text-gray-900 dark:text-white">{user.name}</div>
                              <div className="text-sm text-gray-500 dark:text-gray-400">{user.email} • {user.role}</div>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Tickets */}
                    {results.tickets.length > 0 && (
                      <div>
                        <h3 className="flex items-center gap-2 text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                          <HelpCircle className="w-4 h-4" />
                          Tickets Support
                        </h3>
                        <div className="space-y-1">
                          {results.tickets.slice(0, 3).map((ticket) => (
                            <button
                              key={ticket.id}
                              onClick={() => handleResultClick(`/dashboard/admin/support?ticket=${ticket.id}`, query)}
                              className="w-full text-left px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                            >
                              <div className="font-medium text-gray-900 dark:text-white">{ticket.subject}</div>
                              <div className="text-sm text-gray-500 dark:text-gray-400">{ticket.category} • {ticket.status}</div>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Aucun résultat */}
                {query && !loading && !hasResults && (
                  <div className="p-8 text-center">
                    <FileText className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                    <p className="text-gray-500 dark:text-gray-400">
                      Aucun résultat pour "{query}"
                    </p>
                    <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
                      Essayez avec d'autres mots-clés
                    </p>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="px-4 py-3 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                  <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1">
                      <kbd className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-700 rounded">↑↓</kbd>
                      Naviguer
                    </span>
                    <span className="flex items-center gap-1">
                      <kbd className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-700 rounded">↵</kbd>
                      Sélectionner
                    </span>
                    <span className="flex items-center gap-1">
                      <kbd className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-700 rounded">ESC</kbd>
                      Fermer
                    </span>
                  </div>
                  {query && hasResults && (
                    <Link
                      href={`/search?q=${encodeURIComponent(query)}`}
                      className="text-purple-600 dark:text-purple-400 hover:underline"
                      onClick={() => {
                        saveRecentSearch(query);
                        setIsOpen(false);
                      }}
                    >
                      Voir tous les résultats →
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}