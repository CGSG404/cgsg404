// CGSG404 Homepage Content Management Component
// Unified admin interface for all homepage content
// Replaces complex casino admin with focused homepage management

'use client'

import React, { useState } from 'react'
import { useHomepage } from '@/hooks/useHomepage'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader2, Plus, Edit, Trash2, Save, X, AlertCircle, CheckCircle } from 'lucide-react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'

interface BannerFormData {
  title: string
  subtitle?: string
  highlight?: string
  cta_text?: string
  cta_link?: string
  image_url?: string
  gradient_class?: string
  display_order: number
}

interface StatisticFormData {
  key: string
  value: string
  label: string
  icon?: string
  order: number
}

interface FeatureFormData {
  title: string
  description?: string
  icon?: string
  color_class?: string
  order: number
}

const HomepageManager: React.FC = () => {
  const {
    banners,
    statistics,
    features,
    content,
    maintenance,
    isLoading,
    error,
    createBanner,
    updateBanner,
    deleteBanner,
    updateStatistic,
    createFeature,
    updateFeature,
    deleteFeature,
    updatePageContent,
    refreshData,
    clearError
  } = useHomepage()

  const [activeTab, setActiveTab] = useState('banners')
  const [editingItem, setEditingItem] = useState<any>(null)
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [formData, setFormData] = useState<any>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Form handlers
  const handleInputChange = (field: string, value: any) => {
    setFormData((prev: any) => ({ ...prev, [field]: value }))
  }

  const resetForm = () => {
    setFormData({})
    setEditingItem(null)
    setShowCreateDialog(false)
  }

  const handleSubmit = async (type: string) => {
    if (!formData || isSubmitting) return

    setIsSubmitting(true)
    try {
      if (editingItem) {
        // Update existing item
        switch (type) {
          case 'banner':
            await updateBanner(editingItem.id, formData)
            break
          case 'feature':
            await updateFeature(editingItem.id, formData)
            break
          case 'statistic':
            await updateStatistic(formData)
            break
        }
      } else {
        // Create new item
        switch (type) {
          case 'banner':
            await createBanner(formData as BannerFormData)
            break
          case 'feature':
            await createFeature(formData as FeatureFormData)
            break
          case 'statistic':
            await updateStatistic(formData as StatisticFormData)
            break
        }
      }
      resetForm()
    } catch (error) {
      console.error(`Error ${editingItem ? 'updating' : 'creating'} ${type}:`, error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async (type: string, id: number) => {
    if (!confirm(`Are you sure you want to delete this ${type}?`)) return

    try {
      switch (type) {
        case 'banner':
          await deleteBanner(id)
          break
        case 'feature':
          await deleteFeature(id)
          break
      }
    } catch (error) {
      console.error(`Error deleting ${type}:`, error)
    }
  }

  const startEdit = (item: any) => {
    setEditingItem(item)
    setFormData({ ...item })
    setShowCreateDialog(true)
  }

  // Banner Form Component
  const BannerForm = () => (
    <div className="space-y-4">
      <div>
        <Label htmlFor="title">Title *</Label>
        <Input
          id="title"
          value={formData.title || ''}
          onChange={(e) => handleInputChange('title', e.target.value)}
          placeholder="Enter banner title"
        />
      </div>
      <div>
        <Label htmlFor="subtitle">Subtitle</Label>
        <Input
          id="subtitle"
          value={formData.subtitle || ''}
          onChange={(e) => handleInputChange('subtitle', e.target.value)}
          placeholder="Enter banner subtitle"
        />
      </div>
      <div>
        <Label htmlFor="highlight">Highlight Text</Label>
        <Input
          id="highlight"
          value={formData.highlight || ''}
          onChange={(e) => handleInputChange('highlight', e.target.value)}
          placeholder="Enter highlight text"
        />
      </div>
      <div>
        <Label htmlFor="cta_text">CTA Text</Label>
        <Input
          id="cta_text"
          value={formData.cta_text || ''}
          onChange={(e) => handleInputChange('cta_text', e.target.value)}
          placeholder="Enter call-to-action text"
        />
      </div>
      <div>
        <Label htmlFor="cta_link">CTA Link</Label>
        <Input
          id="cta_link"
          value={formData.cta_link || ''}
          onChange={(e) => handleInputChange('cta_link', e.target.value)}
          placeholder="Enter call-to-action link"
        />
      </div>
      <div>
        <Label htmlFor="image_url">Image URL</Label>
        <Input
          id="image_url"
          value={formData.image_url || ''}
          onChange={(e) => handleInputChange('image_url', e.target.value)}
          placeholder="Enter image URL"
        />
      </div>
      <div>
        <Label htmlFor="gradient_class">Gradient Class</Label>
        <Input
          id="gradient_class"
          value={formData.gradient_class || ''}
          onChange={(e) => handleInputChange('gradient_class', e.target.value)}
          placeholder="Enter CSS gradient class"
        />
      </div>
      <div>
        <Label htmlFor="display_order">Display Order *</Label>
        <Input
          id="display_order"
          type="number"
          value={formData.display_order || 0}
          onChange={(e) => handleInputChange('display_order', parseInt(e.target.value))}
          placeholder="Enter display order"
        />
      </div>
    </div>
  )

  // Feature Form Component
  const FeatureForm = () => (
    <div className="space-y-4">
      <div>
        <Label htmlFor="title">Title *</Label>
        <Input
          id="title"
          value={formData.title || ''}
          onChange={(e) => handleInputChange('title', e.target.value)}
          placeholder="Enter feature title"
        />
      </div>
      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description || ''}
          onChange={(e) => handleInputChange('description', e.target.value)}
          placeholder="Enter feature description"
        />
      </div>
      <div>
        <Label htmlFor="icon">Icon</Label>
        <Input
          id="icon"
          value={formData.icon || ''}
          onChange={(e) => handleInputChange('icon', e.target.value)}
          placeholder="Enter icon name or class"
        />
      </div>
      <div>
        <Label htmlFor="color_class">Color Class</Label>
        <Input
          id="color_class"
          value={formData.color_class || ''}
          onChange={(e) => handleInputChange('color_class', e.target.value)}
          placeholder="Enter CSS color class"
        />
      </div>
      <div>
        <Label htmlFor="order">Order *</Label>
        <Input
          id="order"
          type="number"
          value={formData.order || 0}
          onChange={(e) => handleInputChange('order', parseInt(e.target.value))}
          placeholder="Enter display order"
        />
      </div>
    </div>
  )

  // Statistic Form Component
  const StatisticForm = () => (
    <div className="space-y-4">
      <div>
        <Label htmlFor="key">Key *</Label>
        <Input
          id="key"
          value={formData.key || ''}
          onChange={(e) => handleInputChange('key', e.target.value)}
          placeholder="Enter statistic key"
        />
      </div>
      <div>
        <Label htmlFor="value">Value *</Label>
        <Input
          id="value"
          value={formData.value || ''}
          onChange={(e) => handleInputChange('value', e.target.value)}
          placeholder="Enter statistic value"
        />
      </div>
      <div>
        <Label htmlFor="label">Label *</Label>
        <Input
          id="label"
          value={formData.label || ''}
          onChange={(e) => handleInputChange('label', e.target.value)}
          placeholder="Enter statistic label"
        />
      </div>
      <div>
        <Label htmlFor="icon">Icon</Label>
        <Input
          id="icon"
          value={formData.icon || ''}
          onChange={(e) => handleInputChange('icon', e.target.value)}
          placeholder="Enter icon name or class"
        />
      </div>
      <div>
        <Label htmlFor="order">Order *</Label>
        <Input
          id="order"
          type="number"
          value={formData.order || 0}
          onChange={(e) => handleInputChange('order', parseInt(e.target.value))}
          placeholder="Enter display order"
        />
      </div>
    </div>
  )

  if (isLoading && !banners.length) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading homepage data...</span>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Homepage Manager</h1>
          <p className="text-muted-foreground">Manage all homepage content and settings</p>
        </div>
        <Button onClick={refreshData} variant="outline">
          Refresh Data
        </Button>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {error}
            <Button
              variant="ghost"
              size="sm"
              onClick={clearError}
              className="ml-2"
            >
              Dismiss
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {maintenance?.is_maintenance && (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Maintenance mode is active: {maintenance.message}
          </AlertDescription>
        </Alert>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="banners">Banners ({banners.length})</TabsTrigger>
          <TabsTrigger value="statistics">Statistics ({statistics.length})</TabsTrigger>
          <TabsTrigger value="features">Features ({features.length})</TabsTrigger>
          <TabsTrigger value="content">Content</TabsTrigger>
        </TabsList>

        {/* Banners Tab */}
        <TabsContent value="banners" className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Hero Banners</h2>
            <Dialog open={showCreateDialog && activeTab === 'banners'} onOpenChange={setShowCreateDialog}>
              <DialogTrigger asChild>
                <Button onClick={() => { setActiveTab('banners'); setEditingItem(null); setFormData({}); }}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Banner
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>{editingItem ? 'Edit Banner' : 'Create New Banner'}</DialogTitle>
                  <DialogDescription>
                    {editingItem ? 'Update banner information' : 'Add a new banner to the homepage'}
                  </DialogDescription>
                </DialogHeader>
                <BannerForm />
                <div className="flex justify-end space-x-2 pt-4">
                  <Button variant="outline" onClick={resetForm}>
                    Cancel
                  </Button>
                  <Button 
                    onClick={() => handleSubmit('banner')}
                    disabled={isSubmitting || !formData.title}
                  >
                    {isSubmitting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                    {editingItem ? 'Update' : 'Create'}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid gap-4">
            {banners.map((banner) => (
              <Card key={banner.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>{banner.title}</CardTitle>
                      {banner.subtitle && (
                        <CardDescription>{banner.subtitle}</CardDescription>
                      )}
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant="secondary">Order: {banner.display_order}</Badge>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => startEdit(banner)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete('banner', banner.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    {banner.highlight && (
                      <div>
                        <span className="font-medium">Highlight:</span> {banner.highlight}
                      </div>
                    )}
                    {banner.cta_text && (
                      <div>
                        <span className="font-medium">CTA:</span> {banner.cta_text}
                      </div>
                    )}
                    {banner.cta_link && (
                      <div>
                        <span className="font-medium">Link:</span> {banner.cta_link}
                      </div>
                    )}
                    {banner.gradient_class && (
                      <div>
                        <span className="font-medium">Gradient:</span> {banner.gradient_class}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Statistics Tab */}
        <TabsContent value="statistics" className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Site Statistics</h2>
            <Dialog open={showCreateDialog && activeTab === 'statistics'} onOpenChange={setShowCreateDialog}>
              <DialogTrigger asChild>
                <Button onClick={() => { setActiveTab('statistics'); setEditingItem(null); setFormData({}); }}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Statistic
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Update Statistic</DialogTitle>
                  <DialogDescription>
                    Update site statistics displayed on homepage
                  </DialogDescription>
                </DialogHeader>
                <StatisticForm />
                <div className="flex justify-end space-x-2 pt-4">
                  <Button variant="outline" onClick={resetForm}>
                    Cancel
                  </Button>
                  <Button 
                    onClick={() => handleSubmit('statistic')}
                    disabled={isSubmitting || !formData.key || !formData.value || !formData.label}
                  >
                    {isSubmitting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                    Update
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {statistics.map((stat) => (
              <Card key={stat.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{stat.label}</CardTitle>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => startEdit(stat)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">Key: {stat.key}</div>
                  {stat.icon && (
                    <div className="text-sm text-muted-foreground">Icon: {stat.icon}</div>
                  )}
                  <Badge variant="outline" className="mt-2">Order: {stat.order}</Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Features Tab */}
        <TabsContent value="features" className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Site Features</h2>
            <Dialog open={showCreateDialog && activeTab === 'features'} onOpenChange={setShowCreateDialog}>
              <DialogTrigger asChild>
                <Button onClick={() => { setActiveTab('features'); setEditingItem(null); setFormData({}); }}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Feature
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>{editingItem ? 'Edit Feature' : 'Create New Feature'}</DialogTitle>
                  <DialogDescription>
                    {editingItem ? 'Update feature information' : 'Add a new feature to the homepage'}
                  </DialogDescription>
                </DialogHeader>
                <FeatureForm />
                <div className="flex justify-end space-x-2 pt-4">
                  <Button variant="outline" onClick={resetForm}>
                    Cancel
                  </Button>
                  <Button 
                    onClick={() => handleSubmit('feature')}
                    disabled={isSubmitting || !formData.title}
                  >
                    {isSubmitting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                    {editingItem ? 'Update' : 'Create'}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {features.map((feature) => (
              <Card key={feature.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>{feature.title}</CardTitle>
                      {feature.description && (
                        <CardDescription>{feature.description}</CardDescription>
                      )}
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant="secondary">Order: {feature.order}</Badge>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => startEdit(feature)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete('feature', feature.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    {feature.icon && (
                      <div>
                        <span className="font-medium">Icon:</span> {feature.icon}
                      </div>
                    )}
                    {feature.color_class && (
                      <div>
                        <span className="font-medium">Color:</span> {feature.color_class}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Content Tab */}
        <TabsContent value="content" className="space-y-4">
          <h2 className="text-xl font-semibold">Page Content</h2>
          <div className="grid gap-4">
            {Object.entries(content).map(([key, value]) => (
              <Card key={key}>
                <CardHeader>
                  <CardTitle className="text-lg">{key}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-sm">{value}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default HomepageManager