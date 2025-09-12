'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/hooks/use-auth';
import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { UserMenu } from '@/components/auth/user-menu';

export default function Header() {
  const { user, isLoading, isAuthenticated } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled || isMobileMenuOpen
          ? 'bg-white dark:bg-gray-900 shadow-lg'
          : 'bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm'
      }`}
    >
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-500 to-green-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg sm:text-xl">C</span>
            </div>
            <span className={`text-xl sm:text-2xl font-bold ${
              isScrolled || isMobileMenuOpen ? 'text-gray-900 dark:text-white' : 'text-gray-900 dark:text-white'
            }`}>
              Clipbox
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              href="/how-it-works"
              className={`hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-medium ${
                isScrolled ? 'text-gray-700 dark:text-gray-300' : 'text-gray-800 dark:text-gray-200'
              }`}
            >
              Comment ça marche ?
            </Link>
            <Link
              href="/pricing"
              className={`hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-medium ${
                isScrolled ? 'text-gray-700 dark:text-gray-300' : 'text-gray-800 dark:text-gray-200'
              }`}
            >
              Tarifs
            </Link>
          </div>

          {/* Auth Section */}
          <div className="hidden md:flex items-center space-x-4">
            {isLoading ? (
              <div className="w-32 h-10 bg-gray-200 dark:bg-gray-700 animate-pulse rounded-lg"></div>
            ) : isAuthenticated ? (
              <UserMenu />
            ) : (
              <>
                <Link
                  href="/auth/signin"
                  className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-medium"
                >
                  Connexion
                </Link>
                <Link
                  href="/auth/signup"
                  className="px-6 py-2 bg-gradient-to-r from-blue-500 to-green-500 text-white rounded-full font-medium hover:shadow-lg transform hover:scale-105 transition-all duration-200"
                >
                  S'inscrire
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-2 md:hidden">
            {/* Mobile User Menu if authenticated */}
            {!isLoading && isAuthenticated && (
              <UserMenu />
            )}
            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6 text-gray-700 dark:text-gray-300" />
              ) : (
                <Menu className="w-6 h-6 text-gray-700 dark:text-gray-300" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
            <div className="flex flex-col space-y-4">
              <Link
                href="/how-it-works"
                className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-medium px-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Comment ça marche ?
              </Link>
              <Link
                href="/pricing"
                className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-medium px-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Tarifs
              </Link>
              {!isAuthenticated && (
                <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                  {isLoading ? (
                    <div className="w-full h-10 bg-gray-200 dark:bg-gray-700 animate-pulse rounded-lg"></div>
                  ) : (
                    <div className="flex flex-col space-y-3">
                      <Link
                        href="/auth/signin"
                        className="w-full px-4 py-2 text-center text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors font-medium"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        Connexion
                      </Link>
                      <Link
                        href="/auth/signup"
                        className="w-full px-4 py-2 text-center bg-gradient-to-r from-blue-500 to-green-500 text-white rounded-lg font-medium hover:shadow-lg transition-all duration-200"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        S'inscrire
                      </Link>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}