'use client';

import dynamic from 'next/dynamic';

// Import dynamique pour éviter les problèmes SSR avec localStorage
const AdminChatManager = dynamic(
  () => import('@/components/features/support/AdminChatManager'),
  { 
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    )
  }
);

export default function AdminSupportPage() {
  return <AdminChatManager />;
}