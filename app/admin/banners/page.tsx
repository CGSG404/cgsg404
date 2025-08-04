'use client';

import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/src/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/card';
import { Input } from '@/src/components/ui/input';
import { Textarea } from '@/src/components/ui/textarea';
import { Label } from '@/src/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/src/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/src/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/src/components/ui/alert-dialog';
import { useToast } from '@/src/hooks/use-toast';

interface Banner {
  id: number;
  title: string;
  subtitle: string;
  highlight: string;
  cta_text: string;
  cta_link: string;
  image_url: string;
  gradient_class: string;
  page_type: string;
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

interface BannerFormData {
  title: string;
  subtitle: string;
  highlight: string;
  cta_text: string;
  cta_link: string;
  image_url: string;
  gradient_class: string;
  page_type: string;
  display_order: number;
  is_active: boolean;
}

export default function AdminBannersPage() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null);
  const [formData, setFormData] = useState<BannerFormData>({
    title: '',
    subtitle: '',
    highlight: '',
    cta_text: '',
    cta_link: '',
    image_url: '',
    gradient_class: 'from-casino-dark to-purple-900',
    page_type: 'home',
    display_order: 0,
    is_active: true
  });
  const { toast } = useToast();

  // Fetch banners
  const fetchBanners = async () => {
    try {
      const response = await fetch('/api/admin/banners');
      const data = await response.json();
      setBanners(data.banners || []);
    } catch (error) {
      console.error('Error fetching banners:', error);
      toast({
        title: "Error",
        description: "Failed to fetch banners",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const url = editingBanner 
        ? `/api/admin/banners?id=${editingBanner.id}`
        : '/api/admin/banners';
      
      const method = editingBanner ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        toast({
          title: "Success",
          description: editingBanner 
            ? "Banner updated successfully" 
            : "Banner created successfully"
        });
        setIsDialogOpen(false);
        setEditingBanner(null);
        resetForm();
        fetchBanners();
      } else {
        throw new Error(data.error || 'Failed to save banner');
      }
    } catch (error) {
      console.error('Error saving banner:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to save banner",
        variant: "destructive"
      });
    }
  };

  // Handle delete
  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(`/api/admin/banners?id=${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: "Banner deleted successfully"
        });
        fetchBanners();
      } else {
        throw new Error('Failed to delete banner');
      }
    } catch (error) {
      console.error('Error deleting banner:', error);
      toast({
        title: "Error",
        description: "Failed to delete banner",
        variant: "destructive"
      });
    }
  };

  // Handle toggle active status
  const handleToggleActive = async (banner: Banner) => {
    try {
      const response = await fetch(`/api/admin/banners?id=${banner.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...banner,
          is_active: !banner.is_active
        }),
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: `Banner ${banner.is_active ? 'deactivated' : 'activated'} successfully`
        });
        fetchBanners();
      } else {
        throw new Error('Failed to update banner status');
      }
    } catch (error) {
      console.error('Error updating banner status:', error);
      toast({
        title: "Error",
        description: "Failed to update banner status",
        variant: "destructive"
      });
    }
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      title: '',
      subtitle: '',
      highlight: '',
      cta_text: '',
      cta_link: '',
      image_url: '',
      gradient_class: 'from-casino-dark to-purple-900',
      page_type: 'home',
      display_order: 0,
      is_active: true
    });
  };

  // Edit banner
  const handleEdit = (banner: Banner) => {
    setEditingBanner(banner);
    setFormData({
      title: banner.title,
      subtitle: banner.subtitle,
      highlight: banner.highlight,
      cta_text: banner.cta_text,
      cta_link: banner.cta_link,
      image_url: banner.image_url,
      gradient_class: banner.gradient_class,
      page_type: banner.page_type,
      display_order: banner.display_order,
      is_active: banner.is_active
    });
    setIsDialogOpen(true);
  };

  // Create new banner
  const handleCreate = () => {
    setEditingBanner(null);
    resetForm();
    setIsDialogOpen(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-casino-neon-green"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-white">Banner Management</h1>
        <Button onClick={handleCreate} className="bg-casino-neon-green text-casino-dark hover:bg-casino-neon-green-dark">
          <Plus className="w-4 h-4 mr-2" />
          Add Banner
        </Button>
      </div>

      <div className="grid gap-6">
        {banners.map((banner) => (
          <Card key={banner.id} className="bg-casino-card-bg border-casino-border-subtle">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-white">{banner.title}</CardTitle>
                  <p className="text-gray-400 text-sm">{banner.subtitle}</p>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleToggleActive(banner)}
                    className={banner.is_active ? 'text-green-500' : 'text-gray-500'}
                  >
                    {banner.is_active ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(banner)}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="outline" size="sm" className="text-red-500">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Banner</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete "{banner.title}"? This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleDelete(banner.id)}>
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="text-gray-400">Page:</span>
                  <p className="text-white">{banner.page_type}</p>
                </div>
                <div>
                  <span className="text-gray-400">Order:</span>
                  <p className="text-white">{banner.display_order}</p>
                </div>
                <div>
                  <span className="text-gray-400">Status:</span>
                  <p className={`${banner.is_active ? 'text-green-500' : 'text-red-500'}`}>
                    {banner.is_active ? 'Active' : 'Inactive'}
                  </p>
                </div>
                <div>
                  <span className="text-gray-400">Updated:</span>
                  <p className="text-white text-xs">
                    {new Date(banner.updated_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Create/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="bg-casino-card-bg border-casino-border-subtle max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-white">
              {editingBanner ? 'Edit Banner' : 'Create New Banner'}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="title" className="text-white">Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  required
                  className="bg-casino-dark border-casino-border-subtle text-white"
                />
              </div>
              <div>
                <Label htmlFor="subtitle" className="text-white">Subtitle</Label>
                <Input
                  id="subtitle"
                  value={formData.subtitle}
                  onChange={(e) => setFormData({...formData, subtitle: e.target.value})}
                  className="bg-casino-dark border-casino-border-subtle text-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="highlight" className="text-white">Highlight</Label>
                <Input
                  id="highlight"
                  value={formData.highlight}
                  onChange={(e) => setFormData({...formData, highlight: e.target.value})}
                  className="bg-casino-dark border-casino-border-subtle text-white"
                />
              </div>
              <div>
                <Label htmlFor="cta_text" className="text-white">CTA Text</Label>
                <Input
                  id="cta_text"
                  value={formData.cta_text}
                  onChange={(e) => setFormData({...formData, cta_text: e.target.value})}
                  className="bg-casino-dark border-casino-border-subtle text-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="cta_link" className="text-white">CTA Link</Label>
                <Input
                  id="cta_link"
                  value={formData.cta_link}
                  onChange={(e) => setFormData({...formData, cta_link: e.target.value})}
                  className="bg-casino-dark border-casino-border-subtle text-white"
                />
              </div>
              <div>
                <Label htmlFor="image_url" className="text-white">Image URL *</Label>
                <Input
                  id="image_url"
                  value={formData.image_url}
                  onChange={(e) => setFormData({...formData, image_url: e.target.value})}
                  required
                  className="bg-casino-dark border-casino-border-subtle text-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="page_type" className="text-white">Page Type</Label>
                <Select
                  value={formData.page_type}
                  onValueChange={(value) => setFormData({...formData, page_type: value})}
                >
                  <SelectTrigger className="bg-casino-dark border-casino-border-subtle text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="home">Home</SelectItem>
                    <SelectItem value="casinos">Casinos</SelectItem>
                    <SelectItem value="reviews">Reviews</SelectItem>
                    <SelectItem value="guide">Guide</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="display_order" className="text-white">Display Order</Label>
                <Input
                  id="display_order"
                  type="number"
                  value={formData.display_order}
                  onChange={(e) => setFormData({...formData, display_order: parseInt(e.target.value)})}
                  className="bg-casino-dark border-casino-border-subtle text-white"
                />
              </div>
              <div>
                <Label htmlFor="gradient_class" className="text-white">Gradient Class</Label>
                <Input
                  id="gradient_class"
                  value={formData.gradient_class}
                  onChange={(e) => setFormData({...formData, gradient_class: e.target.value})}
                  className="bg-casino-dark border-casino-border-subtle text-white"
                />
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="is_active"
                checked={formData.is_active}
                onChange={(e) => setFormData({...formData, is_active: e.target.checked})}
                className="rounded border-casino-border-subtle"
              />
              <Label htmlFor="is_active" className="text-white">Active</Label>
            </div>

            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" className="bg-casino-neon-green text-casino-dark hover:bg-casino-neon-green-dark">
                {editingBanner ? 'Update Banner' : 'Create Banner'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
} 