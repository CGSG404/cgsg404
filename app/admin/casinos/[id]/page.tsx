'use client';

import React, { useState, useEffect } from 'react';
import { useAdmin } from '@/src/contexts/AdminContext';
import { databaseApi } from '@/src/lib/database-api';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/card';
import { Button } from '@/src/components/ui/button';
import { Badge } from '@/src/components/ui/badge';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/src/components/ui/alert-dialog';
import { 
  ArrowLeft, 
  Edit, 
  Trash2, 
  ExternalLink, 
  Star, 
  Shield, 
  Calendar,
  Clock,
  Loader2,
  AlertCircle,
  Building2
} from 'lucide-react';

interface CasinoDetails {
  id: number;
  name: string;
  slug: string;
  logo: string;
  rating: number;
  safety_index: string;
  bonus: string;
  description: string;
  play_url: string;
  is_new: boolean;
  is_hot: boolean;
  is_featured: boolean;
  created_at: string;
  updated_at: string;
  casino_features?: Array<{ feature: string }>;
  casino_badges?: Array<{ badge: string }>;
  casino_links?: Array<{ link_type: string; url: string }>;
}

export default function CasinoDetailPage() {
  const { isAdmin, hasPermission, logActivity } = useAdmin();
  const params = useParams();
  const router = useRouter();
  const [casino, setCasino] = useState<CasinoDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const casinoId = params?.id as string;

  useEffect(() => {
    const fetchCasino = async () => {
      try {
        setLoading(true);
        const casinoData = await databaseApi.getCasino(casinoId);
        if (casinoData) {
          setCasino(casinoData);
        } else {
          setError('Casino not found');
        }
      } catch (error) {
        console.error('Failed to fetch casino:', error);
        setError('Failed to load casino data');
      } finally {
        setLoading(false);
      }
    };

    if (casinoId && isAdmin) {
      fetchCasino();
    }
  }, [casinoId, isAdmin]);

  const handleDelete = async () => {
    if (!casino || !hasPermission('19')) return;

    try {
      await databaseApi.deleteCasino(casino.id);
      await logActivity('casino_deleted', 'casino', casino.id.toString(), { name: casino.name }, 'warning');
      router.push('/admin/casinos');
    } catch (error) {
      console.error('Failed to delete casino:', error);
      alert('Failed to delete casino. Please try again.');
    }
  };

  const handleStatusToggle = async (field: 'is_featured' | 'is_hot' | 'is_new', currentValue: boolean) => {
    if (!hasPermission('18') || !casino) return;

    try {
      await databaseApi.updateCasinoStatus(casino.id, { [field]: !currentValue });
      await logActivity('casino_status_updated', 'casino', casino.id.toString(), { field, value: !currentValue }, 'info');
      setCasino(prev => prev ? { ...prev, [field]: !currentValue } : null);
    } catch (error) {
      console.error('Failed to update casino status:', error);
      alert('Failed to update casino status. Please try again.');
    }
  };

  const getSafetyColor = (safetyIndex: string) => {
    switch (safetyIndex) {
      case 'Very High': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'High': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'Medium': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'Low': return 'bg-red-500/20 text-red-400 border-red-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-casino-dark via-casino-dark-lighter to-casino-dark flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="h-16 w-16 text-casino-neon-green animate-spin" />
          <p className="text-casino-neon-green font-medium">Loading Casino Details...</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-casino-dark via-casino-dark-lighter to-casino-dark flex items-center justify-center">
        <Card className="bg-casino-card-bg border-red-500/20 max-w-md">
          <CardContent className="p-8 text-center">
            <AlertCircle className="h-16 w-16 text-red-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-red-400 mb-4">Access Denied</h2>
            <p className="text-gray-300 mb-6">
              You need admin access to view casino details.
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

  if (error || !casino) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-casino-dark via-casino-dark-lighter to-casino-dark flex items-center justify-center">
        <Card className="bg-casino-card-bg border-red-500/20 max-w-md">
          <CardContent className="p-8 text-center">
            <AlertCircle className="h-16 w-16 text-red-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-red-400 mb-4">Error</h2>
            <p className="text-gray-300 mb-6">{error || 'Casino not found'}</p>
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
            <div className="flex items-center gap-4">
              <div className="relative w-16 h-16">
                <Image
                  src={casino.logo}
                  alt={casino.name}
                  fill
                  className="rounded-lg object-cover"
                />
              </div>
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <Building2 className="h-6 w-6 text-casino-neon-green" />
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-casino-neon-green to-casino-neon-purple bg-clip-text text-transparent">
                    {casino.name}
                  </h1>
                </div>
                <p className="text-gray-300">Casino Details & Management</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Button asChild variant="outline" className="border-casino-border-subtle text-gray-300 hover:text-white">
                <Link href="/admin/casinos" className="flex items-center gap-2">
                  <ArrowLeft className="h-4 w-4" />
                  Back to List
                </Link>
              </Button>
              {hasPermission('18') && (
                <Button asChild className="bg-casino-neon-green text-casino-dark hover:bg-casino-neon-green/80">
                  <Link href={`/admin/casinos/${casino.id}/edit`} className="flex items-center gap-2">
                    <Edit className="h-4 w-4" />
                    Edit
                  </Link>
                </Button>
              )}
              {hasPermission('19') && (
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="outline" className="border-red-500/30 text-red-400 hover:bg-red-500/10">
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent className="bg-casino-card-bg border-casino-border-subtle">
                    <AlertDialogHeader>
                      <AlertDialogTitle className="text-white">Delete Casino</AlertDialogTitle>
                      <AlertDialogDescription className="text-gray-300">
                        Are you sure you want to delete "{casino.name}"? This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel className="bg-casino-dark border-casino-border-subtle text-white hover:bg-casino-dark-lighter">
                        Cancel
                      </AlertDialogCancel>
                      <AlertDialogAction 
                        onClick={handleDelete}
                        className="bg-red-600 hover:bg-red-700"
                      >
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Information */}
            <Card className="bg-casino-card-bg border-casino-border-subtle">
              <CardHeader>
                <CardTitle className="text-casino-neon-green">Basic Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-400">Casino Name</label>
                    <p className="text-white font-semibold">{casino.name}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-400">URL Slug</label>
                    <p className="text-white font-mono">{casino.slug}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-400">Rating</label>
                    <div className="flex items-center gap-2">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span className="text-white font-semibold">{casino.rating}</span>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-400">Safety Index</label>
                    <Badge className={getSafetyColor(casino.safety_index)}>
                      <Shield className="h-3 w-3 mr-1" />
                      {casino.safety_index}
                    </Badge>
                  </div>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-400">Bonus</label>
                  <p className="text-white">{casino.bonus}</p>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-400">Description</label>
                  <p className="text-gray-300 leading-relaxed">{casino.description}</p>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-400">Play URL</label>
                  <div className="flex items-center gap-2">
                    <p className="text-white font-mono text-sm">{casino.play_url}</p>
                    <Button asChild size="sm" variant="outline" className="border-casino-neon-green/30 text-casino-neon-green hover:bg-casino-neon-green/10">
                      <Link href={casino.play_url} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="h-3 w-3" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Timestamps */}
            <Card className="bg-casino-card-bg border-casino-border-subtle">
              <CardHeader>
                <CardTitle className="text-casino-neon-green">Timestamps</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3">
                    <Calendar className="h-5 w-5 text-blue-400" />
                    <div>
                      <label className="text-sm font-medium text-gray-400">Created</label>
                      <p className="text-white">{new Date(casino.created_at).toLocaleString()}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Clock className="h-5 w-5 text-green-400" />
                    <div>
                      <label className="text-sm font-medium text-gray-400">Last Updated</label>
                      <p className="text-white">{new Date(casino.updated_at).toLocaleString()}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Status Flags */}
            <Card className="bg-casino-card-bg border-casino-border-subtle">
              <CardHeader>
                <CardTitle className="text-casino-neon-green">Status Flags</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Featured</span>
                  <Badge 
                    className={`cursor-pointer ${casino.is_featured 
                      ? 'bg-casino-neon-green/20 text-casino-neon-green border-casino-neon-green/30' 
                      : 'bg-gray-500/20 text-gray-400 border-gray-500/30'
                    }`}
                    onClick={() => handleStatusToggle('is_featured', casino.is_featured)}
                  >
                    {casino.is_featured ? 'Yes' : 'No'}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Hot</span>
                  <Badge 
                    className={`cursor-pointer ${casino.is_hot 
                      ? 'bg-red-500/20 text-red-400 border-red-500/30' 
                      : 'bg-gray-500/20 text-gray-400 border-gray-500/30'
                    }`}
                    onClick={() => handleStatusToggle('is_hot', casino.is_hot)}
                  >
                    {casino.is_hot ? 'Yes' : 'No'}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">New</span>
                  <Badge 
                    className={`cursor-pointer ${casino.is_new 
                      ? 'bg-blue-500/20 text-blue-400 border-blue-500/30' 
                      : 'bg-gray-500/20 text-gray-400 border-gray-500/30'
                    }`}
                    onClick={() => handleStatusToggle('is_new', casino.is_new)}
                  >
                    {casino.is_new ? 'Yes' : 'No'}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="bg-casino-card-bg border-casino-border-subtle">
              <CardHeader>
                <CardTitle className="text-casino-neon-green">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button asChild className="w-full bg-casino-neon-green text-casino-dark hover:bg-casino-neon-green/80">
                  <Link href={casino.play_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                    <ExternalLink className="h-4 w-4" />
                    Visit Casino
                  </Link>
                </Button>
                {hasPermission('18') && (
                  <Button asChild variant="outline" className="w-full border-casino-border-subtle text-gray-300 hover:text-white">
                    <Link href={`/admin/casinos/${casino.id}/edit`} className="flex items-center gap-2">
                      <Edit className="h-4 w-4" />
                      Edit Casino
                    </Link>
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
