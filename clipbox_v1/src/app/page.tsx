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
  cpm?: number;
}

interface Clipper {
  id: string;
  name: string;
  username: string;
  avatar?: string;
  totalViews: number;
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

// Example campaigns in French
const exampleCampaigns: Campaign[] = [
  {
    id: 'example-1',
    title: 'Promotion Nouvelle Collection Été 2024',
    description: 'Créez des clips courts et dynamiques présentant notre nouvelle collection de vêtements d\'été. Mettez en avant les couleurs vives et le style décontracté.',
    imageUrl: undefined,
    budget: 5000,
    budgetSpent: 1200,
    network: 'TIKTOK',
    participantsCount: 24,
    endDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000), // 15 days from now
    advertiserName: 'Fashion Style Paris',
    advertiserLogo: undefined,
    cpm: 12,
  },
  {
    id: 'example-2',
    title: 'Lancement Application Mobile Gaming',
    description: 'Montrez les fonctionnalités principales de notre nouveau jeu mobile. Créez du contenu engageant avec des moments de gameplay excitants et des réactions authentiques.',
    imageUrl: undefined,
    budget: 8000,
    budgetSpent: 3500,
    network: 'YOUTUBE',
    participantsCount: 42,
    endDate: new Date(Date.now() + 22 * 24 * 60 * 60 * 1000), // 22 days from now
    advertiserName: 'GameTech Studios',
    advertiserLogo: undefined,
    cpm: 8,
  },
  {
    id: 'example-3',
    title: 'Challenge Recette Healthy',
    description: 'Partagez vos recettes saines et équilibrées en utilisant nos produits bio. Montrez le processus de préparation de manière créative et appétissante.',
    imageUrl: undefined,
    budget: 3500,
    budgetSpent: 800,
    network: 'INSTAGRAM',
    participantsCount: 18,
    endDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000), // 10 days from now
    advertiserName: 'Bio & Nature',
    advertiserLogo: undefined,
    cpm: 15,
  },
  {
    id: 'example-4',
    title: 'Tutoriel Maquillage Tendance',
    description: 'Créez des tutoriels maquillage en utilisant notre nouvelle gamme de cosmétiques. Montrez des looks variés adaptés à différentes occasions.',
    imageUrl: undefined,
    budget: 6000,
    budgetSpent: 2100,
    network: 'INSTAGRAM',
    participantsCount: 35,
    endDate: new Date(Date.now() + 18 * 24 * 60 * 60 * 1000), // 18 days from now
    advertiserName: 'Beauté Élégance',
    advertiserLogo: undefined,
    cpm: 18,
  },
  {
    id: 'example-5',
    title: 'Défi Fitness 30 Jours',
    description: 'Documentez votre progression avec nos programmes d\'entraînement. Partagez vos routines quotidiennes, vos résultats et motivez votre communauté.',
    imageUrl: undefined,
    budget: 4500,
    budgetSpent: 1800,
    network: 'TIKTOK',
    participantsCount: 28,
    endDate: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000), // 25 days from now
    advertiserName: 'FitLife Pro',
    advertiserLogo: undefined,
    cpm: 10,
  },
  {
    id: 'example-6',
    title: 'Voyage et Découverte Destinations',
    description: 'Partagez vos expériences de voyage avec nos services. Capturez les moments uniques, les paysages magnifiques et les aventures inoubliables.',
    imageUrl: undefined,
    budget: 7500,
    budgetSpent: 2900,
    network: 'YOUTUBE',
    participantsCount: 31,
    endDate: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000), // 20 days from now
    advertiserName: 'Travel Explorer',
    advertiserLogo: undefined,
    cpm: 9,
  },
];

// Example clippers with realistic data in French
const exampleClippers: Clipper[] = [
  {
    id: 'example-1',
    name: 'Marie Dubois',
    username: 'marie_creative',
    avatar: undefined,
    totalViews: 487500,
    totalClips: 23,
    rating: 4.8,
    rank: 1,
    networks: ['TIKTOK', 'INSTAGRAM'],
  },
  {
    id: 'example-2',
    name: 'Lucas Martin',
    username: 'lucas_clips',
    avatar: undefined,
    totalViews: 356200,
    totalClips: 18,
    rating: 4.7,
    rank: 2,
    networks: ['YOUTUBE', 'TIKTOK'],
  },
  {
    id: 'example-3',
    name: 'Sophie Laurent',
    username: 'sophie_content',
    avatar: undefined,
    totalViews: 298400,
    totalClips: 15,
    rating: 4.6,
    rank: 3,
    networks: ['INSTAGRAM', 'YOUTUBE'],
  },
  {
    id: 'example-4',
    name: 'Thomas Bernard',
    username: 'thomas_creator',
    avatar: undefined,
    totalViews: 245800,
    totalClips: 14,
    rating: 4.5,
    rank: 4,
    networks: ['TIKTOK'],
  },
  {
    id: 'example-5',
    name: 'Emma Petit',
    username: 'emma_videos',
    avatar: undefined,
    totalViews: 198600,
    totalClips: 12,
    rating: 4.4,
    rank: 5,
    networks: ['INSTAGRAM', 'TIKTOK'],
  },
  {
    id: 'example-6',
    name: 'Alexandre Roux',
    username: 'alex_media',
    avatar: undefined,
    totalViews: 167300,
    totalClips: 11,
    rating: 4.3,
    rank: 6,
    networks: ['YOUTUBE'],
  },
  {
    id: 'example-7',
    name: 'Léa Moreau',
    username: 'lea_digital',
    avatar: undefined,
    totalViews: 142500,
    totalClips: 10,
    rating: 4.2,
    rank: 7,
    networks: ['TIKTOK', 'INSTAGRAM'],
  },
  {
    id: 'example-8',
    name: 'Hugo Simon',
    username: 'hugo_shorts',
    avatar: undefined,
    totalViews: 118900,
    totalClips: 9,
    rating: 4.2,
    rank: 8,
    networks: ['YOUTUBE', 'INSTAGRAM'],
  },
  {
    id: 'example-9',
    name: 'Chloé Blanc',
    username: 'chloe_reels',
    avatar: undefined,
    totalViews: 95400,
    totalClips: 8,
    rating: 4.1,
    rank: 9,
    networks: ['INSTAGRAM'],
  },
  {
    id: 'example-10',
    name: 'Nathan Garnier',
    username: 'nathan_viral',
    avatar: undefined,
    totalViews: 78200,
    totalClips: 7,
    rating: 4.0,
    rank: 10,
    networks: ['TIKTOK', 'YOUTUBE'],
  },
];

export default function HomePage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>(exampleCampaigns);
  const [clippers, setClippers] = useState<Clipper[]>(exampleClippers);
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
      if (data.campaigns && data.campaigns.length > 0) {
        setCampaigns(data.campaigns);
      }
      // If no campaigns from API, keep the example campaigns
    } catch (error) {
      console.error('Error fetching campaigns:', error);
      // On error, keep the example campaigns
    } finally {
      setLoadingCampaigns(false);
    }
  };

  const fetchTopClippers = async () => {
    try {
      const response = await fetch('/api/clippers/top?limit=10&period=month');
      const data = await response.json();
      if (data.clippers && data.clippers.length > 0) {
        setClippers(data.clippers);
      }
      // If no clippers from API, keep the example clippers
      if (data.stats) {
        setStats(data.stats);
      }
    } catch (error) {
      console.error('Error fetching top clippers:', error);
      // On error, keep the example clippers
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

        {/* Campaigns Grid */}
        <CampaignsGrid campaigns={campaigns} loading={loadingCampaigns} />

        {/* Stats Section */}
        <StatsSection />

        {/* Top Clippers */}
        <TopClippers clippers={clippers} loading={loadingClippers} />

        {/* CTA Section */}
        <section className="py-16 sm:py-20 bg-gradient-to-r from-blue-600 to-green-600 overflow-hidden">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 sm:mb-6">
              Tu fais déjà des vues ? Maintenant, fais de l’argent avec

            </h2>
            <p className="text-base sm:text-lg md:text-xl text-white/90 mb-6 sm:mb-8 max-w-2xl mx-auto px-4">
              Rejoignez des milliers de créateurs qui gagnent de l’argent en créant du contenu pour les plus grandes marques et influenceurs. 
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
