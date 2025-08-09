'use client';

import { useState, useEffect } from 'react';
import CrudTable from '@/src/components/admin/CrudTable';
import CrudModal from '@/src/components/admin/CrudModal';
import Link from 'next/link';
import { ArrowLeftIcon } from 'lucide-react';

interface HeroBanner {
  id: number;
  title: string;
  subtitle?: string;
  highlight?: string;
  cta_text?: string;
  cta_link?: string;
  image_url: string;
  gradient_class?: string;
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

const columns = [
  {
    key: 'image_url',
    label: 'Image',
    type: 'image' as const,
  },
  {
    key: 'title',
    label: 'Title',
    type: 'text' as const,
  },
  {
    key: 'subtitle',
    label: 'Subtitle',
    type: 'text' as const,
  },
  {
    key: 'highlight',
    label: 'Highlight',
    type: 'text' as const,
  },
  {
    key: 'cta_text',
    label: 'CTA Text',
    type: 'text' as const,
  },
  {
    key: 'display_order',
    label: 'Order',
    type: 'number' as const,
  },
  {
    key: 'is_active',
    label: 'Status',
    type: 'boolean' as const,
  },
];

const formFields = [
  {
    key: 'title',
    label: 'Title',
    type: 'text' as const,
    required: true,
    placeholder: 'Enter banner title',
  },
  {
    key: 'subtitle',
    label: 'Subtitle',
    type: 'text' as const,
    placeholder: 'Enter banner subtitle',
  },
  {
    key: 'highlight',
    label: 'Highlight Text',
    type: 'text' as const,
    placeholder: 'Enter highlight text (e.g., DISCOVER THE BEST CASINOS! 🎰)',
  },
  {
    key: 'image_url',
    label: 'Image URL',
    type: 'url' as const,
    required: true,
    placeholder: 'https://example.com/image.jpg',
  },
  {
    key: 'cta_text',
    label: 'CTA Button Text',
    type: 'text' as const,
    placeholder: 'Get Started',
  },
  {
    key: 'cta_link',
    label: 'CTA Button Link',
    type: 'url' as const,
    placeholder: '/casinos',
  },
  {
    key: 'gradient_class',
    label: 'Gradient Class',
    type: 'select' as const,
    options: [
      { value: 'from-casino-dark to-purple-900', label: 'Purple Gradient' },
      { value: 'from-blue-900 to-purple-900', label: 'Blue to Purple' },
      { value: 'from-green-900 to-blue-900', label: 'Green to Blue' },
      { value: 'from-red-900 to-pink-900', label: 'Red to Pink' },
      { value: 'from-gray-900 to-black', label: 'Gray to Black' },
    ],
  },
  {
    key: 'display_order',
    label: 'Display Order',
    type: 'number' as const,
    placeholder: '0',
  },
  {
    key: 'is_active',
    label: 'Active',
    type: 'boolean' as const,
    placeholder: 'Enable this banner',
  },
];

export default function HeroBannersPage() {
  const [banners, setBanners] = useState<HeroBanner[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState<HeroBanner | null>(null);

  const fetchBanners = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/hero-banners');
      const result = await response.json();
      
      if (response.ok) {
        setBanners(result.data || []);
      } else {
        console.error('Error fetching banners:', result.error);
        alert('Failed to fetch banners: ' + result.error);
      }
    } catch (error) {
      console.error('Error fetching banners:', error);
      alert('Failed to fetch banners');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  const handleAdd = () => {
    setEditingBanner(null);
    setModalOpen(true);
  };

  const handleEdit = (banner: HeroBanner) => {
    setEditingBanner(banner);
    setModalOpen(true);
  };

  const handleDelete = async (banner: HeroBanner) => {
    if (!confirm(`Are you sure you want to delete "${banner.title}"?`)) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/hero-banners/${banner.id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        await fetchBanners();
        alert('Banner deleted successfully');
      } else {
        const result = await response.json();
        alert('Failed to delete banner: ' + result.error);
      }
    } catch (error) {
      console.error('Error deleting banner:', error);
      alert('Failed to delete banner');
    }
  };

  const handleSubmit = async (data: any) => {
    try {
      const url = editingBanner 
        ? `/api/admin/hero-banners/${editingBanner.id}`
        : '/api/admin/hero-banners';
      
      const method = editingBanner ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        await fetchBanners();
        alert(`Banner ${editingBanner ? 'updated' : 'created'} successfully`);
      } else {
        const result = await response.json();
        throw new Error(result.error);
      }
    } catch (error) {
      console.error('Error saving banner:', error);
      throw error;
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center mb-4">
          <Link 
            href="/admin" 
            className="flex items-center text-gray-600 hover:text-gray-900 mr-4"
          >
            <ArrowLeftIcon className="h-4 w-4 mr-1" />
            Back to Dashboard
          </Link>
        </div>
        <h1 className="text-3xl font-bold text-gray-900">Hero Banners</h1>
        <p className="mt-2 text-gray-600">
          Manage the main banner slides displayed on your homepage.
        </p>
      </div>

      {/* Table */}
      <CrudTable
        title="Hero Banners"
        data={banners}
        columns={columns}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
        loading={loading}
      />

      {/* Modal */}
      <CrudModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSubmit}
        title={editingBanner ? 'Edit Hero Banner' : 'Add New Hero Banner'}
        fields={formFields}
        initialData={editingBanner}
      />
    </div>
  );
}