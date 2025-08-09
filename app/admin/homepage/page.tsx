'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/src/components/ui/card';
import { Button } from '@/src/components/ui/button';
import { Badge } from '@/src/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/src/components/ui/tabs';
import { Plus, Edit, Trash2, Eye, EyeOff } from 'lucide-react';
import { useToast } from '@/src/hooks/use-toast';
import { HomepageContentModal } from '@/src/components/admin/HomepageContentModal';

interface HomepageContent {
  id: number;
  [key: string]: any;
}

interface HomepageData {
  heroSlider?: HomepageContent[];
  bannerInfo?: HomepageContent[];
  faq?: HomepageContent[];
  logoSlider?: HomepageContent[];
  chartData?: HomepageContent[];
  ticker?: HomepageContent[];
  heroSection?: HomepageContent;
}

export default function HomepageManagement() {
  const [data, setData] = useState<HomepageData>({});
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedComponent, setSelectedComponent] = useState<string>('');
  const [selectedItem, setSelectedItem] = useState<HomepageContent | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/homepage');
      const result = await response.json();
      
      if (result.success) {
        setData(result.data);
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error('Error fetching homepage data:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch homepage data',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = (component: string) => {
    setSelectedComponent(component);
    setSelectedItem(null);
    setIsEditing(false);
    setModalOpen(true);
  };

  const handleEdit = (component: string, item: HomepageContent) => {
    setSelectedComponent(component);
    setSelectedItem(item);
    setIsEditing(true);
    setModalOpen(true);
  };

  const handleDelete = async (component: string, id: number) => {
    if (!confirm('Are you sure you want to delete this item?')) return;

    try {
      const response = await fetch(`/api/admin/homepage/${component}/${id}`, {
        method: 'DELETE',
      });
      
      const result = await response.json();
      
      if (result.success) {
        toast({
          title: 'Success',
          description: 'Item deleted successfully',
        });
        fetchData();
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error('Error deleting item:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete item',
        variant: 'destructive',
      });
    }
  };

  const handleToggleActive = async (component: string, item: HomepageContent) => {
    try {
      const response = await fetch(`/api/admin/homepage/${component}/${item.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...item,
          is_active: !item.is_active,
        }),
      });
      
      const result = await response.json();
      
      if (result.success) {
        toast({
          title: 'Success',
          description: `Item ${item.is_active ? 'deactivated' : 'activated'} successfully`,
        });
        fetchData();
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error('Error toggling item status:', error);
      toast({
        title: 'Error',
        description: 'Failed to update item status',
        variant: 'destructive',
      });
    }
  };

  const handleModalSave = () => {
    setModalOpen(false);
    fetchData();
  };

  const renderItemCard = (item: HomepageContent, component: string) => {
    return (
      <Card key={item.id} className="mb-4">
        <CardContent className="p-4">
          <div className="flex justify-between items-start mb-2">
            <div className="flex-1">
              <h4 className="font-semibold">
                {item.name || item.title || item.question || item.text || `Item ${item.id}`}
              </h4>
              {item.description && (
                <p className="text-sm text-gray-600 mt-1">{item.description}</p>
              )}
              {item.answer && (
                <p className="text-sm text-gray-600 mt-1">{item.answer}</p>
              )}
            </div>
            <div className="flex items-center gap-2 ml-4">
              <Badge variant={item.is_active ? 'default' : 'secondary'}>
                {item.is_active ? 'Active' : 'Inactive'}
              </Badge>
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleToggleActive(component, item)}
              >
                {item.is_active ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleEdit(component, item)}
              >
                <Edit className="w-4 h-4" />
              </Button>
              <Button
                size="sm"
                variant="destructive"
                onClick={() => handleDelete(component, item.id)}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
          <div className="text-xs text-gray-500">
            Order: {item.display_order || 0}
            {item.type && ` | Type: ${item.type}`}
            {item.section_type && ` | Section: ${item.section_type}`}
          </div>
        </CardContent>
      </Card>
    );
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Homepage Content Management</h1>
        <p className="text-gray-600">Manage all homepage components and their content</p>
      </div>

      <Tabs defaultValue="hero-slider" className="space-y-6">
        <TabsList className="grid w-full grid-cols-7">
          <TabsTrigger value="hero-slider">Hero Slider</TabsTrigger>
          <TabsTrigger value="banner-info">Banner Info</TabsTrigger>
          <TabsTrigger value="faq">FAQ</TabsTrigger>
          <TabsTrigger value="logo-slider">Logo Slider</TabsTrigger>
          <TabsTrigger value="chart">Chart Data</TabsTrigger>
          <TabsTrigger value="ticker">Ticker</TabsTrigger>
          <TabsTrigger value="hero-section">Hero Section</TabsTrigger>
        </TabsList>

        <TabsContent value="hero-slider">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Hero Slider Casinos</CardTitle>
                  <CardDescription>Manage casino cards in the hero slider</CardDescription>
                </div>
                <Button onClick={() => handleCreate('hero-slider')}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Casino
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {data.heroSlider?.map(item => renderItemCard(item, 'hero-slider'))}
              {!data.heroSlider?.length && (
                <p className="text-center text-gray-500 py-8">No casino cards found</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="banner-info">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Banner Info Content</CardTitle>
                  <CardDescription>Manage features and statistics</CardDescription>
                </div>
                <Button onClick={() => handleCreate('banner-info')}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Content
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {data.bannerInfo?.map(item => renderItemCard(item, 'banner-info'))}
              {!data.bannerInfo?.length && (
                <p className="text-center text-gray-500 py-8">No banner content found</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="faq">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>FAQ Items</CardTitle>
                  <CardDescription>Manage frequently asked questions</CardDescription>
                </div>
                <Button onClick={() => handleCreate('faq')}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add FAQ
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {data.faq?.map(item => renderItemCard(item, 'faq'))}
              {!data.faq?.length && (
                <p className="text-center text-gray-500 py-8">No FAQ items found</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="logo-slider">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Logo Slider Items</CardTitle>
                  <CardDescription>Manage trust badges and certifications</CardDescription>
                </div>
                <Button onClick={() => handleCreate('logo-slider')}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Logo
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {data.logoSlider?.map(item => renderItemCard(item, 'logo-slider'))}
              {!data.logoSlider?.length && (
                <p className="text-center text-gray-500 py-8">No logo items found</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="chart">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Chart Data</CardTitle>
                  <CardDescription>Manage analytics chart data</CardDescription>
                </div>
                <Button onClick={() => handleCreate('chart')}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Data Point
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {data.chartData?.map(item => renderItemCard(item, 'chart'))}
              {!data.chartData?.length && (
                <p className="text-center text-gray-500 py-8">No chart data found</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ticker">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Ticker Items</CardTitle>
                  <CardDescription>Manage running text ticker content</CardDescription>
                </div>
                <Button onClick={() => handleCreate('ticker')}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Ticker Item
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {data.ticker?.map(item => renderItemCard(item, 'ticker'))}
              {!data.ticker?.length && (
                <p className="text-center text-gray-500 py-8">No ticker items found</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="hero-section">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Hero Section Content</CardTitle>
                  <CardDescription>Manage main hero section content</CardDescription>
                </div>
                <Button onClick={() => handleCreate('hero-section')}>
                  <Plus className="w-4 h-4 mr-2" />
                  {data.heroSection ? 'Edit Content' : 'Add Content'}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {data.heroSection ? (
                renderItemCard(data.heroSection, 'hero-section')
              ) : (
                <p className="text-center text-gray-500 py-8">No hero section content found</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <HomepageContentModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        component={selectedComponent}
        item={selectedItem}
        isEditing={isEditing}
        onSave={handleModalSave}
      />
    </div>
  );
}