'use client';

import React, { useState, useRef } from 'react';
import { Button } from '@/src/components/ui/button';
import { Input } from '@/src/components/ui/input';
import { Label } from '@/src/components/ui/label';
import { Alert, AlertDescription } from '@/src/components/ui/alert';
import { Upload, X, Image as ImageIcon, Loader2, AlertCircle } from 'lucide-react';
import Image from 'next/image';

interface ImageUploadProps {
  value?: string;
  onChange: (url: string) => void;
  onError?: (error: string) => void;
  accept?: string;
  maxSize?: number; // in MB
  label?: string;
  placeholder?: string;
  required?: boolean;
  className?: string;
}

export function ImageUpload({
  value,
  onChange,
  onError,
  accept = 'image/*',
  maxSize = 5,
  label = 'Image',
  placeholder = 'Upload image or enter URL',
  required = false,
  className = ''
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [urlInput, setUrlInput] = useState(value || '');
  const [uploadMode, setUploadMode] = useState<'upload' | 'url'>('upload');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleError = (errorMessage: string) => {
    setError(errorMessage);
    onError?.(errorMessage);
  };

  const clearError = () => {
    setError(null);
  };

  const validateFile = (file: File): boolean => {
    // Check file type
    if (!file.type.startsWith('image/')) {
      handleError('Please select a valid image file');
      return false;
    }

    // Check file size
    const fileSizeMB = file.size / (1024 * 1024);
    if (fileSizeMB > maxSize) {
      handleError(`File size must be less than ${maxSize}MB`);
      return false;
    }

    return true;
  };

  const uploadToSupabase = async (file: File): Promise<string> => {
    console.log('🔄 Starting upload:', {
      fileName: file.name,
      fileSize: file.size,
      fileType: file.type
    });

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      console.log('📡 Upload response:', {
        status: response.status,
        statusText: response.statusText,
        ok: response.ok
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Upload failed:', {
          status: response.status,
          statusText: response.statusText,
          errorText
        });

        let errorData;
        try {
          errorData = JSON.parse(errorText);
        } catch {
          errorData = { error: errorText || 'Upload failed' };
        }

        throw new Error(errorData.error || `Upload failed with status ${response.status}`);
      }

      const data = await response.json();
      console.log('✅ Upload successful:', data);
      return data.url;
    } catch (error) {
      console.error('🚨 Upload error:', error);
      throw error;
    }
  };

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    clearError();

    if (!validateFile(file)) {
      return;
    }

    setUploading(true);

    try {
      const url = await uploadToSupabase(file);
      onChange(url);
      setUrlInput(url);
    } catch (error) {
      console.error('Upload error:', error);
      handleError(error instanceof Error ? error.message : 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleUrlChange = (url: string) => {
    setUrlInput(url);
    clearError();
  };

  const handleUrlSubmit = () => {
    if (!urlInput.trim()) {
      handleError('Please enter a valid URL');
      return;
    }

    // Basic URL validation
    try {
      new URL(urlInput);
      onChange(urlInput);
      clearError();
    } catch {
      handleError('Please enter a valid URL');
    }
  };

  const handleRemove = () => {
    onChange('');
    setUrlInput('');
    clearError();
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex items-center justify-between">
        <Label className="text-gray-300">
          {label} {required && <span className="text-red-400">*</span>}
        </Label>
        <div className="flex gap-2">
          <Button
            type="button"
            variant={uploadMode === 'upload' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setUploadMode('upload')}
            className="text-xs"
          >
            Upload
          </Button>
          <Button
            type="button"
            variant={uploadMode === 'url' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setUploadMode('url')}
            className="text-xs"
          >
            URL
          </Button>
        </div>
      </div>

      {error && (
        <Alert className="border-red-500/20 bg-red-500/10">
          <AlertCircle className="h-4 w-4 text-red-400" />
          <AlertDescription className="text-red-400">{error}</AlertDescription>
        </Alert>
      )}

      {uploadMode === 'upload' ? (
        <div className="space-y-4">
          <input
            ref={fileInputRef}
            type="file"
            accept={accept}
            onChange={handleFileSelect}
            className="hidden"
          />
          
          <div
            onClick={triggerFileSelect}
            className="border-2 border-dashed border-casino-border-subtle rounded-lg p-6 text-center cursor-pointer hover:border-casino-neon-green/30 transition-colors"
          >
            {uploading ? (
              <div className="flex flex-col items-center gap-2">
                <Loader2 className="h-8 w-8 text-casino-neon-green animate-spin" />
                <p className="text-gray-300">Uploading...</p>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2">
                <Upload className="h-8 w-8 text-gray-400" />
                <p className="text-gray-300">Click to upload or drag and drop</p>
                <p className="text-sm text-gray-500">
                  PNG, JPG, GIF up to {maxSize}MB
                </p>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex gap-2">
            <Input
              type="url"
              value={urlInput}
              onChange={(e) => handleUrlChange(e.target.value)}
              placeholder={placeholder}
              className="bg-casino-dark border-casino-border-subtle text-white"
            />
            <Button
              type="button"
              onClick={handleUrlSubmit}
              className="bg-casino-neon-green text-casino-dark hover:bg-casino-neon-green/80"
            >
              Set URL
            </Button>
          </div>
        </div>
      )}

      {/* Image Preview */}
      {value && (
        <div className="relative">
          <div className="relative w-full h-32 bg-casino-dark border border-casino-border-subtle rounded-lg overflow-hidden">
            <Image
              src={value}
              alt="Preview"
              fill
              className="object-contain"
              onError={() => handleError('Failed to load image')}
            />
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleRemove}
            className="absolute top-2 right-2 h-8 w-8 p-0 border-red-500/30 text-red-400 hover:bg-red-500/10"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}

      {/* Current URL Display */}
      {value && (
        <div className="text-sm text-gray-400 break-all">
          <span className="font-medium">Current URL:</span> {value}
        </div>
      )}
    </div>
  );
}
