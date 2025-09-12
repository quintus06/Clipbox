'use client';

import { useEffect, useState } from 'react';
import { generateTestTickets, clearTestTickets } from '@/utils/generate-test-tickets';
import { useRouter } from 'next/navigation';

export default function TestAdminChatPage() {
  const router = useRouter();
  const [status, setStatus] = useState<'idle' | 'generating' | 'clearing' | 'done'>('idle');

  const handleGenerateTickets = () => {
    setStatus('generating');
    setTimeout(() => {
      generateTestTickets();
      setStatus('done');
      setTimeout(() => {
        router.push('/dashboard/admin/support');
      }, 1500);
    }, 500);
  };

  const handleClearTickets = () => {
    setStatus('clearing');
    setTimeout(() => {
      clearTestTickets();
      setStatus('done');
      setTimeout(() => setStatus('idle'), 1500);
    }, 500);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Test Admin Chat
        </h1>
        
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Utilisez cette page pour générer des données de test pour le système de chat admin.
        </p>

        <div className="space-y-4">
          <button
            onClick={handleGenerateTickets}
            disabled={status !== 'idle'}
            className="w-full px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {status === 'generating' ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Génération en cours...
              </span>
            ) : status === 'done' ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Tickets générés ! Redirection...
              </span>
            ) : (
              'Générer des tickets de test'
            )}
          </button>

          <button
            onClick={handleClearTickets}
            disabled={status !== 'idle'}
            className="w-full px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {status === 'clearing' ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Suppression en cours...
              </span>
            ) : (
              'Supprimer tous les tickets'
            )}
          </button>

          <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={() => router.push('/dashboard/admin/support')}
              className="w-full px-4 py-2 text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 transition-colors"
            >
              Aller au dashboard admin →
            </button>
          </div>
        </div>

        <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <h3 className="text-sm font-semibold text-blue-900 dark:text-blue-100 mb-2">
            ℹ️ Information
          </h3>
          <p className="text-xs text-blue-700 dark:text-blue-300">
            Les tickets de test incluent différents types de demandes, priorités et statuts pour tester toutes les fonctionnalités du système.
          </p>
        </div>
      </div>
    </div>
  );
}