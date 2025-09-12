'use client';

import { useEffect, useState } from 'react';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import HeroSection from '@/components/landing/hero-section';
import CampaignsGrid from '@/components/landing/campaigns-grid';
import TopClippers from '@/components/landing/top-clippers';
import StatsSection from '@/components/landing/stats-section';

interface Campaign {
  id: string;
  title: string;
  description: string;
  imageUrl?: string;
  budget: number;
  budgetSpent: number;
  network: 'TIKTOK' | 'INSTAGRAM' | 'YOUTUBE';
  participantsCount: number;
  endDate: Date;
  advertiserName: string;
  advertiserLogo?: string;
}

interface Clipper {
  id: string;
  name: string;
  username: string;
  avatar?: string;
  totalEarnings: number;
  totalClips: number;
  rating: number;
  rank: number;
  networks: ('TIKTOK' | 'INSTAGRAM' | 'YOUTUBE')[];
}

interface Stats {
  totalCampaigns: number;
  activeClippers: number;
  totalDistributed: number;
  totalClips: number;
  averageEarnings: number;
  countries: number;
}

export default function HomePage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [clippers, setClippers] = useState<Clipper[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loadingCampaigns, setLoadingCampaigns] = useState(true);
  const [loadingClippers, setLoadingClippers] = useState(true);

  useEffect(() => {
    // Fetch campaigns
    fetchCampaigns();
    // Fetch top clippers
    fetchTopClippers();
  }, []);

  const fetchCampaigns = async () => {
    try {
      const response = await fetch('/api/campaigns/public?limit=6');
      const data = await response.json();
      if (data.campaigns) {
        setCampaigns(data.campaigns);
      }
    } catch (error) {
      console.error('Error fetching campaigns:', error);
    } finally {
      setLoadingCampaigns(false);
    }
  };

  const fetchTopClippers = async () => {
    try {
      const response = await fetch('/api/clippers/top?limit=10&period=month');
      const data = await response.json();
      if (data.clippers) {
        setClippers(data.clippers);
      }
      if (data.stats) {
        setStats(data.stats);
      }
    } catch (error) {
      console.error('Error fetching top clippers:', error);
    } finally {
      setLoadingClippers(false);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 overflow-x-hidden">
      {/* Header */}
      <Header />

      {/* Main Content */}
      <main className="overflow-x-hidden">
        {/* Hero Section */}
        <HeroSection />

        {/* Stats Section */}
        {stats && <StatsSection stats={stats} />}

        {/* Campaigns Grid */}
        <CampaignsGrid campaigns={campaigns} loading={loadingCampaigns} />

        {/* Top Clippers */}
        <TopClippers clippers={clippers} loading={loadingClippers} />

        {/* CTA Section */}
        <section className="py-16 sm:py-20 bg-gradient-to-r from-blue-600 to-green-600 overflow-hidden">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 sm:mb-6">
              Prêt à transformer vos clips en revenus ?
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-white/90 mb-6 sm:mb-8 max-w-2xl mx-auto px-4">
              Rejoignez des milliers de créateurs qui gagnent de l'argent en créant du contenu pour les plus grandes marques.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center px-4">
              <a
                href="/auth/signup"
                className="px-6 sm:px-8 py-3 sm:py-4 bg-white text-blue-600 rounded-full font-semibold text-base sm:text-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-200"
              >
                Créer mon compte gratuitement
              </a>
              <a
                href="/how-it-works"
                className="px-6 sm:px-8 py-3 sm:py-4 bg-transparent border-2 border-white text-white rounded-full font-semibold text-base sm:text-lg hover:bg-white hover:text-blue-600 transition-all duration-200"
              >
                En savoir plus
              </a>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
