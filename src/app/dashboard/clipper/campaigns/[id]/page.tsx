'use client';

import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Campaign {
  id: string;
  title: string;
  description: string;
  brand: string;
  category: string;
  status: 'active' | 'pending' | 'completed';
  startDate: string;
  endDate: string;
  budget: number;
  remunerationPer1000Views: number;
  requirements: string[];
  tags: string[];
  imageUrl?: string;
}

export default function ClipperCampaignDetailsPage() {
  const params = useParams();
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate fetching campaign data
    const fetchCampaign = async () => {
      try {
        // In a real app, this would be an API call
        const mockCampaign: Campaign = {
          id: params.id as string,
          title: 'Campaign Example',
          description: 'This is a sample campaign description for clippers.',
          brand: 'Brand Name',
          category: 'Technology',
          status: 'active',
          startDate: '2024-01-01',
          endDate: '2024-12-31',
          budget: 10000,
          remunerationPer1000Views: 15,
          requirements: [
            'Minimum 10K followers',
            'High engagement rate',
            'Quality content creation'
          ],
          tags: ['tech', 'innovation', 'product'],
          imageUrl: '/campaign-placeholder.jpg'
        };
        setCampaign(mockCampaign);
      } catch (error) {
        console.error('Error fetching campaign:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCampaign();
  }, [params.id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!campaign) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Campaign not found</h2>
          <Link href="/dashboard/clipper/campaigns" className="text-blue-600 hover:underline">
            Back to campaigns
          </Link>
        </div>
      </div>
    );
  }

  const daysRemaining = Math.ceil(
    (new Date(campaign.endDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
  );

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-6">
        <Link href="/dashboard/clipper/campaigns" className="text-blue-600 hover:underline mb-4 inline-block">
          ← Back to campaigns
        </Link>
        <h1 className="text-3xl font-bold text-gray-800">{campaign.title}</h1>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Campaign Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Campaign Image */}
          {campaign.imageUrl && (
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <img 
                src={campaign.imageUrl} 
                alt={campaign.title}
                className="w-full h-64 object-cover"
              />
            </div>
          )}

          {/* Description */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Description</h2>
            <p className="text-gray-600">{campaign.description}</p>
          </div>

          {/* Requirements */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Requirements</h2>
            <ul className="space-y-2">
              {campaign.requirements.map((req: string, index: number) => (
                <li key={index} className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span className="text-gray-600">{req}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Tags */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Tags</h2>
            <div className="flex flex-wrap gap-2">
              {campaign.tags.map((tag: string, index: number) => (
                <span 
                  key={index}
                  className="px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-sm"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column - Campaign Info & Actions */}
        <div className="space-y-6">
          {/* Campaign Info Card */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Campaign Information</h2>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500">Brand</p>
                <p className="font-semibold">{campaign.brand}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Category</p>
                <p className="font-semibold">{campaign.category}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Status</p>
                <span className={`inline-block px-2 py-1 rounded-full text-xs font-semibold
                  ${campaign.status === 'active' ? 'bg-green-100 text-green-800' : 
                    campaign.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                    'bg-gray-100 text-gray-800'}`}>
                  {campaign.status.toUpperCase()}
                </span>
              </div>
              <div>
                <p className="text-sm text-gray-500">Campaign Period</p>
                <p className="font-semibold">
                  {new Date(campaign.startDate).toLocaleDateString()} - {new Date(campaign.endDate).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>

          {/* Metrics Card */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Metrics</h2>
            <div className="space-y-4">
              <div className="border-b pb-3">
                <p className="text-sm text-gray-500">Jours restants</p>
                <p className="text-2xl font-bold text-blue-600">{daysRemaining > 0 ? daysRemaining : 0}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Budget total</p>
                <p className="text-2xl font-bold text-gray-800">€{campaign.budget.toLocaleString()}</p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <button className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition duration-200 font-semibold mb-3">
              Apply for Campaign
            </button>
            <button className="w-full bg-gray-200 text-gray-800 py-3 px-4 rounded-lg hover:bg-gray-300 transition duration-200 font-semibold">
              Save Campaign
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}