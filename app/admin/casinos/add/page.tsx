'use client';

import React, { useState } from 'react';
import { useAdmin } from '@/src/contexts/AdminContext';
import { databaseApi } from '@/src/lib/database-api';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/card';
import { Button } from '@/src/components/ui/button';
import { Input } from '@/src/components/ui/input';
import { Textarea } from '@/src/components/ui/textarea';
import { Label } from '@/src/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/src/components/ui/select';
import { Checkbox } from '@/src/components/ui/checkbox';
import { Alert, AlertDescription } from '@/src/components/ui/alert';
import { ImageUpload } from '@/src/components/ui/image-upload';
import { ArrowLeft, Save, AlertCircle, Plus, Building2 } from 'lucide-react';

interface CasinoFormData {
  name: string;
  slug: string;
  logo: string;
  rating: number;
  safety_index: 'Low' | 'Medium' | 'High' | 'Very High';
  bonus: string;
  description: string;
  play_url: string;
  is_new: boolean;
  is_hot: boolean;
  is_featured: boolean;
}

export default function AddCasinoPage() {
  const { isAdmin, hasPermission, logActivity } = useAdmin();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const [formData, setFormData] = useState<CasinoFormData>({
    name: '',
    slug: '',
    logo: '',
    rating: 0,
    safety_index: 'Medium',
    bonus: '',
    description: '',
    play_url: '',
    is_new: false,
    is_hot: false,
    is_featured: false,
  });

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else if (name === 'rating') {
      setFormData(prev => ({ ...prev, [name]: parseFloat(value) || 0 }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
      
      // Auto-generate slug when name changes
      if (name === 'name') {
        setFormData(prev => ({ ...prev, slug: generateSlug(value) }));
      }
    }
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleCheckboxChange = (name: string, checked: boolean) => {
    setFormData(prev => ({ ...prev, [name]: checked }));
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Casino name is required';
    }

    if (!formData.slug.trim()) {
      newErrors.slug = 'Slug is required';
    } else if (!/^[a-z0-9-]+$/.test(formData.slug)) {
      newErrors.slug = 'Slug can only contain lowercase letters, numbers, and hyphens';
    }

    if (!formData.logo.trim()) {
      newErrors.logo = 'Logo URL is required';
    }

    if (formData.rating < 0 || formData.rating > 5) {
      newErrors.rating = 'Rating must be between 0 and 5';
    }

    if (!formData.bonus.trim()) {
      newErrors.bonus = 'Bonus description is required';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }

    if (!formData.play_url.trim()) {
      newErrors.play_url = 'Play URL is required';
    } else {
      try {
        new URL(formData.play_url);
      } catch {
        newErrors.play_url = 'Please enter a valid URL';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      const newCasino = await databaseApi.createCasino(formData);
      
      await logActivity(
        'casino_created',
        'casino',
        newCasino.id.toString(),
        { name: formData.name, slug: formData.slug },
        'info'
      );

      router.push('/admin/casinos');
    } catch (error) {
      console.error('Failed to create casino:', error);
      setErrors({ submit: 'Failed to create casino. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  if (!isAdmin || !hasPermission('16')) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-casino-dark via-casino-dark-lighter to-casino-dark flex items-center justify-center">
        <Card className="bg-casino-card-bg border-red-500/20 max-w-md">
          <CardContent className="p-8 text-center">
            <div className="text-6xl mb-6">🚫</div>
            <h2 className="text-2xl font-bold text-red-400 mb-4">Access Denied</h2>
            <p className="text-gray-300 mb-6">
              You need permission to create casinos.
            </p>
            <Button asChild className="bg-red-600 hover:bg-red-700">
              <Link href="/admin/casinos">
                Back to Casino List
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-casino-dark via-casino-dark-lighter to-casino-dark">
      {/* Header */}
      <div className="bg-casino-card-bg/50 backdrop-blur-sm border-b border-casino-border-subtle">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <Plus className="h-8 w-8 text-casino-neon-green" />
                <h1 className="text-4xl font-bold bg-gradient-to-r from-casino-neon-green to-casino-neon-purple bg-clip-text text-transparent">
                  Add New Casino
                </h1>
              </div>
              <p className="text-gray-300 mt-2">
                Create a new casino listing with all details
              </p>
            </div>
            <Button asChild variant="outline" className="border-casino-border-subtle text-gray-300 hover:text-white">
              <Link href="/admin/casinos" className="flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back to List
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form onSubmit={handleSubmit}>
          <Card className="bg-casino-card-bg border-casino-border-subtle">
            <CardHeader>
              <CardTitle className="text-casino-neon-green">Casino Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {errors.submit && (
                <Alert className="border-red-500/20 bg-red-500/10">
                  <AlertCircle className="h-4 w-4 text-red-400" />
                  <AlertDescription className="text-red-400">
                    {errors.submit}
                  </AlertDescription>
                </Alert>
              )}

              {/* Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-gray-300">Casino Name *</Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className={`bg-casino-dark border-casino-border-subtle text-white ${
                      errors.name ? 'border-red-500' : ''
                    }`}
                    placeholder="Enter casino name"
                  />
                  {errors.name && <p className="text-sm text-red-400">{errors.name}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="slug" className="text-gray-300">URL Slug *</Label>
                  <Input
                    id="slug"
                    name="slug"
                    value={formData.slug}
                    onChange={handleInputChange}
                    className={`bg-casino-dark border-casino-border-subtle text-white ${
                      errors.slug ? 'border-red-500' : ''
                    }`}
                    placeholder="casino-name-slug"
                  />
                  {errors.slug && <p className="text-sm text-red-400">{errors.slug}</p>}
                </div>

                <div className="space-y-2">
                  <ImageUpload
                    label="Casino Logo"
                    value={formData.logo}
                    onChange={(url) => setFormData(prev => ({ ...prev, logo: url }))}
                    onError={(error) => setErrors(prev => ({ ...prev, logo: error }))}
                    required
                    maxSize={5}
                    placeholder="Upload casino logo or enter URL"
                  />
                  {errors.logo && <p className="text-sm text-red-400">{errors.logo}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="play_url" className="text-gray-300">Play URL *</Label>
                  <Input
                    id="play_url"
                    name="play_url"
                    value={formData.play_url}
                    onChange={handleInputChange}
                    className={`bg-casino-dark border-casino-border-subtle text-white ${
                      errors.play_url ? 'border-red-500' : ''
                    }`}
                    placeholder="https://casino.com/play"
                  />
                  {errors.play_url && <p className="text-sm text-red-400">{errors.play_url}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="rating" className="text-gray-300">Rating (0-5) *</Label>
                  <Input
                    id="rating"
                    name="rating"
                    type="number"
                    min="0"
                    max="5"
                    step="0.1"
                    value={formData.rating}
                    onChange={handleInputChange}
                    className={`bg-casino-dark border-casino-border-subtle text-white ${
                      errors.rating ? 'border-red-500' : ''
                    }`}
                    placeholder="4.5"
                  />
                  {errors.rating && <p className="text-sm text-red-400">{errors.rating}</p>}
                </div>

                <div className="space-y-2">
                  <Label className="text-gray-300">Safety Index *</Label>
                  <Select value={formData.safety_index} onValueChange={(value) => handleSelectChange('safety_index', value)}>
                    <SelectTrigger className="bg-casino-dark border-casino-border-subtle text-white">
                      <SelectValue placeholder="Select safety index" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Low">Low</SelectItem>
                      <SelectItem value="Medium">Medium</SelectItem>
                      <SelectItem value="High">High</SelectItem>
                      <SelectItem value="Very High">Very High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Bonus and Description */}
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="bonus" className="text-gray-300">Bonus Description *</Label>
                  <Input
                    id="bonus"
                    name="bonus"
                    value={formData.bonus}
                    onChange={handleInputChange}
                    className={`bg-casino-dark border-casino-border-subtle text-white ${
                      errors.bonus ? 'border-red-500' : ''
                    }`}
                    placeholder="100% up to $500 + 200 Free Spins"
                  />
                  {errors.bonus && <p className="text-sm text-red-400">{errors.bonus}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description" className="text-gray-300">Description *</Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    className={`bg-casino-dark border-casino-border-subtle text-white min-h-[100px] ${
                      errors.description ? 'border-red-500' : ''
                    }`}
                    placeholder="Detailed description of the casino..."
                  />
                  {errors.description && <p className="text-sm text-red-400">{errors.description}</p>}
                </div>
              </div>

              {/* Status Flags */}
              <div className="space-y-4">
                <Label className="text-gray-300">Status Flags</Label>
                <div className="flex flex-wrap gap-6">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="is_featured"
                      checked={formData.is_featured}
                      onCheckedChange={(checked) => handleCheckboxChange('is_featured', checked as boolean)}
                    />
                    <Label htmlFor="is_featured" className="text-gray-300">Featured Casino</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="is_hot"
                      checked={formData.is_hot}
                      onCheckedChange={(checked) => handleCheckboxChange('is_hot', checked as boolean)}
                    />
                    <Label htmlFor="is_hot" className="text-gray-300">Hot Casino</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="is_new"
                      checked={formData.is_new}
                      onCheckedChange={(checked) => handleCheckboxChange('is_new', checked as boolean)}
                    />
                    <Label htmlFor="is_new" className="text-gray-300">New Casino</Label>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex justify-end space-x-4 pt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push('/admin/casinos')}
                  className="border-casino-border-subtle text-gray-300 hover:text-white"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={loading}
                  className="bg-casino-neon-green text-casino-dark hover:bg-casino-neon-green/80"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-casino-dark border-t-transparent mr-2"></div>
                      Creating...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Create Casino
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </form>
      </div>
    </div>
  );
}
