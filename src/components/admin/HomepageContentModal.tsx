'use client';

import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/src/components/ui/dialog';
import { Button } from '@/src/components/ui/button';
import { Input } from '@/src/components/ui/input';
import { Label } from '@/src/components/ui/label';
import { Textarea } from '@/src/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/src/components/ui/select';
import { Switch } from '@/src/components/ui/switch';
import { useToast } from '@/src/hooks/use-toast';

interface HomepageContentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  component: string;
  item: any;
  isEditing: boolean;
  onSave: () => void;
}

interface FormField {
  name: string;
  label: string;
  type: 'text' | 'textarea' | 'number' | 'select' | 'url' | 'switch';
  required?: boolean;
  options?: { value: string; label: string }[];
  placeholder?: string;
}

const componentFields: Record<string, FormField[]> = {
  'hero-slider': [
    { name: 'name', label: 'Casino Name', type: 'text', required: true },
    { name: 'rating', label: 'Rating', type: 'number', required: true, placeholder: '4.8' },
    { name: 'bonus', label: 'Bonus Text', type: 'text', required: true },
    { name: 'safety_index', label: 'Safety Index', type: 'number', required: true, placeholder: '90' },
    { name: 'url', label: 'Casino URL', type: 'url', required: true },
    { name: 'logo_url', label: 'Logo URL', type: 'url' },
    { name: 'display_order', label: 'Display Order', type: 'number', placeholder: '0' },
    { name: 'is_active', label: 'Active', type: 'switch' },
  ],
  'banner-info': [
    {
      name: 'section_type',
      label: 'Section Type',
      type: 'select',
      required: true,
      options: [
        { value: 'feature', label: 'Feature' },
        { value: 'statistic', label: 'Statistic' },
      ],
    },
    { name: 'title', label: 'Title', type: 'text', required: true },
    { name: 'description', label: 'Description', type: 'textarea' },
    { name: 'value', label: 'Value (for statistics)', type: 'text', placeholder: '500+' },
    { name: 'icon_name', label: 'Icon Name', type: 'text', placeholder: 'Shield' },
    { name: 'display_order', label: 'Display Order', type: 'number', placeholder: '0' },
    { name: 'is_active', label: 'Active', type: 'switch' },
  ],
  'faq': [
    { name: 'question', label: 'Question', type: 'textarea', required: true },
    { name: 'answer', label: 'Answer', type: 'textarea', required: true },
    { name: 'display_order', label: 'Display Order', type: 'number', placeholder: '0' },
    { name: 'is_active', label: 'Active', type: 'switch' },
  ],
  'logo-slider': [
    { name: 'name', label: 'Logo Name', type: 'text', required: true },
    { name: 'logo_url', label: 'Logo URL', type: 'url', required: true },
    { name: 'alt_text', label: 'Alt Text', type: 'text' },
    { name: 'website_url', label: 'Website URL', type: 'url' },
    { name: 'display_order', label: 'Display Order', type: 'number', placeholder: '0' },
    { name: 'is_active', label: 'Active', type: 'switch' },
  ],
  'chart': [
    {
      name: 'chart_type',
      label: 'Chart Type',
      type: 'select',
      required: true,
      options: [
        { value: 'review_timeline', label: 'Review Timeline' },
        { value: 'safety_distribution', label: 'Safety Distribution' },
      ],
    },
    { name: 'data_key', label: 'Data Key', type: 'text', required: true, placeholder: 'Jan or Very High' },
    { name: 'data_value', label: 'Data Value', type: 'number', required: true },
    { name: 'display_order', label: 'Display Order', type: 'number', placeholder: '0' },
    { name: 'is_active', label: 'Active', type: 'switch' },
  ],
  'ticker': [
    { name: 'text', label: 'Ticker Text', type: 'textarea', required: true },
    { name: 'highlight', label: 'Highlight Text', type: 'text' },
    {
      name: 'type',
      label: 'Type',
      type: 'select',
      required: true,
      options: [
        { value: 'bonus', label: 'Bonus' },
        { value: 'news', label: 'News' },
        { value: 'promo', label: 'Promo' },
        { value: 'winner', label: 'Winner' },
        { value: 'update', label: 'Update' },
        { value: 'vip', label: 'VIP' },
        { value: 'tournament', label: 'Tournament' },
      ],
    },
    { name: 'link_url', label: 'Link URL', type: 'url' },
    { name: 'display_order', label: 'Display Order', type: 'number', placeholder: '0' },
    { name: 'is_active', label: 'Active', type: 'switch' },
  ],
  'hero-section': [
    { name: 'title', label: 'Title', type: 'text', required: true },
    { name: 'subtitle', label: 'Subtitle', type: 'text' },
    { name: 'description', label: 'Description', type: 'textarea' },
    { name: 'cta_text', label: 'CTA Text', type: 'text' },
    { name: 'cta_url', label: 'CTA URL', type: 'url' },
    { name: 'background_image_url', label: 'Background Image URL', type: 'url' },
    { name: 'is_active', label: 'Active', type: 'switch' },
  ],
};

export function HomepageContentModal({
  open,
  onOpenChange,
  component,
  item,
  isEditing,
  onSave,
}: HomepageContentModalProps) {
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const fields = componentFields[component] || [];

  useEffect(() => {
    if (open) {
      if (isEditing && item) {
        setFormData(item);
      } else {
        // Initialize with default values
        const defaultData: Record<string, any> = {
          display_order: 0,
          is_active: true,
        };
        
        // Set component-specific defaults
        if (component === 'banner-info') {
          defaultData.section_type = 'feature';
        } else if (component === 'chart') {
          defaultData.chart_type = 'review_timeline';
        } else if (component === 'ticker') {
          defaultData.type = 'bonus';
        }
        
        setFormData(defaultData);
      }
    }
  }, [open, isEditing, item, component]);

  const handleInputChange = (name: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const url = isEditing
        ? `/api/admin/homepage/${component}/${item.id}`
        : `/api/admin/homepage`;
      
      const method = isEditing ? 'PUT' : 'POST';
      const body = isEditing
        ? JSON.stringify(formData)
        : JSON.stringify({ component, data: formData });

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body,
      });

      const result = await response.json();

      if (result.success) {
        toast({
          title: 'Success',
          description: `Item ${isEditing ? 'updated' : 'created'} successfully`,
        });
        onSave();
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error('Error saving item:', error);
      toast({
        title: 'Error',
        description: `Failed to ${isEditing ? 'update' : 'create'} item`,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const renderField = (field: FormField) => {
    const value = formData[field.name] || '';

    switch (field.type) {
      case 'textarea':
        return (
          <Textarea
            id={field.name}
            value={value}
            onChange={(e) => handleInputChange(field.name, e.target.value)}
            placeholder={field.placeholder}
            required={field.required}
          />
        );

      case 'number':
        return (
          <Input
            id={field.name}
            type="number"
            value={value}
            onChange={(e) => handleInputChange(field.name, parseFloat(e.target.value) || 0)}
            placeholder={field.placeholder}
            required={field.required}
            step={field.name === 'rating' ? '0.1' : '1'}
            min={field.name === 'rating' ? '0' : undefined}
            max={field.name === 'rating' ? '5' : field.name === 'safety_index' ? '100' : undefined}
          />
        );

      case 'select':
        return (
          <Select
            value={value}
            onValueChange={(newValue) => handleInputChange(field.name, newValue)}
            required={field.required}
          >
            <SelectTrigger>
              <SelectValue placeholder={`Select ${field.label.toLowerCase()}`} />
            </SelectTrigger>
            <SelectContent>
              {field.options?.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );

      case 'switch':
        return (
          <Switch
            checked={value}
            onCheckedChange={(checked) => handleInputChange(field.name, checked)}
          />
        );

      default:
        return (
          <Input
            id={field.name}
            type={field.type}
            value={value}
            onChange={(e) => handleInputChange(field.name, e.target.value)}
            placeholder={field.placeholder}
            required={field.required}
          />
        );
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? 'Edit' : 'Create'} {component.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())} Item
          </DialogTitle>
          <DialogDescription>
            {isEditing ? 'Update the item details below.' : 'Fill in the details to create a new item.'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {fields.map((field) => (
            <div key={field.name} className="space-y-2">
              <Label htmlFor={field.name}>
                {field.label}
                {field.required && <span className="text-red-500 ml-1">*</span>}
              </Label>
              {renderField(field)}
            </div>
          ))}

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Saving...' : isEditing ? 'Update' : 'Create'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}