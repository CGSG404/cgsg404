'use client';

import React, { useState, useEffect } from 'react';
import { useAdmin } from '@/src/contexts/AdminContext';
import { databaseApi } from '@/src/lib/database-api';
import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/card';
import { Button } from '@/src/components/ui/button';
import { Badge } from '@/src/components/ui/badge';
import { Input } from '@/src/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/src/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/src/components/ui/table';
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
import { Search, Plus, Edit, Trash2, Eye, Star, Shield, Building2, Home, ChevronRight, Filter, Download, RefreshCw } from 'lucide-react';

interface Casino {
  id: number;
  name: string;
  slug: string;
  logo: string;
  rating: number;
  safety_index: string;
  bonus: string;
  is_featured: boolean;
  is_hot: boolean;
  is_new: boolean;
  created_at: string;
  updated_at: string;
}

interface CasinosData {
  casinos: Casino[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export default function CasinoManagementPage() {
  const { isAdmin, isLoading, hasPermission, logActivity } = useAdmin();
  const [casinos, setCasinos] = useState<Casino[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'rating' | 'created_at'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [featuredCount, setFeaturedCount] = useState(0);
  const [hotCount, setHotCount] = useState(0);
  const [newCount, setNewCount] = useState(0);
  const limit = 10;

  const fetchCasinos = async () => {
    try {
      setLoading(true);
      const params = {
        search: searchTerm || undefined,
        sortBy,
        sortOrder,
        limit,
        offset: (currentPage - 1) * limit
      };

      const data = await databaseApi.getCasinosWithPagination(params);
      setCasinos(data.casinos);
      setTotalPages(data.totalPages);
      setTotal(data.total);

      // Calculate stats
      setFeaturedCount(data.casinos.filter(c => c.is_featured).length);
      setHotCount(data.casinos.filter(c => c.is_hot).length);
      setNewCount(data.casinos.filter(c => c.is_new).length);
    } catch (error) {
      console.error('Failed to fetch casinos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async () => {
    try {
      // This would implement CSV export functionality
      console.log('Exporting casinos...');
      // TODO: Implement actual export logic
    } catch (error) {
      console.error('Failed to export casinos:', error);
    }
  };

  useEffect(() => {
    if (isAdmin) {
      fetchCasinos();
    }
  }, [isAdmin, searchTerm, sortBy, sortOrder, currentPage]);

  const handleDelete = async (casino: Casino) => {
    if (!hasPermission('19')) {
      alert('You do not have permission to delete casinos');
      return;
    }

    try {
      await databaseApi.deleteCasino(casino.id);
      await logActivity('casino_deleted', 'casino', casino.id.toString(), { name: casino.name }, 'warning');
      fetchCasinos();
    } catch (error) {
      console.error('Failed to delete casino:', error);
      alert('Failed to delete casino. Please try again.');
    }
  };

  const handleStatusToggle = async (casino: Casino, field: 'is_featured' | 'is_hot' | 'is_new') => {
    if (!hasPermission('18')) {
      alert('You do not have permission to update casinos');
      return;
    }

    try {
      const newValue = !casino[field];
      await databaseApi.updateCasinoStatus(casino.id, { [field]: newValue });
      await logActivity('casino_status_updated', 'casino', casino.id.toString(), { field, value: newValue }, 'info');
      
      setCasinos(prev => prev.map(c => 
        c.id === casino.id ? { ...c, [field]: newValue } : c
      ));
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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-casino-dark via-casino-dark-lighter to-casino-dark flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-casino-neon-green border-t-transparent"></div>
          <p className="text-casino-neon-green font-medium">Loading Casino Management...</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-casino-dark via-casino-dark-lighter to-casino-dark flex items-center justify-center">
        <Card className="bg-casino-card-bg border-red-500/20 max-w-md">
          <CardContent className="p-8 text-center">
            <div className="text-6xl mb-6">🚫</div>
            <h2 className="text-2xl font-bold text-red-400 mb-4">Access Denied</h2>
            <p className="text-gray-300 mb-6">
              You need admin access to manage casinos.
            </p>
            <Button asChild className="bg-red-600 hover:bg-red-700">
              <Link href="/admin">
                Back to Dashboard
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-casino-dark via-casino-dark-lighter to-casino-dark">
      {/* Enhanced Header */}
      <div className="bg-casino-card-bg/50 backdrop-blur-sm border-b border-casino-border-subtle">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <div className="flex items-center space-x-2 py-3 text-sm">
            <Link href="/admin" className="text-gray-400 hover:text-casino-neon-green transition-colors">
              <Home className="h-4 w-4" />
            </Link>
            <ChevronRight className="h-4 w-4 text-gray-500" />
            <Link href="/admin" className="text-gray-400 hover:text-casino-neon-green transition-colors">
              Admin Dashboard
            </Link>
            <ChevronRight className="h-4 w-4 text-gray-500" />
            <span className="text-casino-neon-green font-medium">Casino Management</span>
          </div>

          {/* Main Header */}
          <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center py-6 space-y-4 lg:space-y-0">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-casino-neon-green/10 rounded-lg">
                  <Building2 className="h-8 w-8 text-casino-neon-green" />
                </div>
                <div>
                  <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-casino-neon-green to-casino-neon-purple bg-clip-text text-transparent">
                    Casino Management
                  </h1>
                  <p className="text-gray-300 text-sm lg:text-base">
                    Manage casino listings, bonuses, and content
                  </p>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="flex flex-wrap gap-3 mt-4">
                <Badge variant="outline" className="border-casino-neon-green/30 text-casino-neon-green bg-casino-neon-green/5">
                  <Building2 className="h-3 w-3 mr-1" />
                  {total} Total
                </Badge>
                <Badge variant="outline" className="border-yellow-500/30 text-yellow-400 bg-yellow-500/5">
                  <Star className="h-3 w-3 mr-1" />
                  {featuredCount} Featured
                </Badge>
                <Badge variant="outline" className="border-red-500/30 text-red-400 bg-red-500/5">
                  <Shield className="h-3 w-3 mr-1" />
                  {hotCount} Hot
                </Badge>
                <Badge variant="outline" className="border-blue-500/30 text-blue-400 bg-blue-500/5">
                  <Plus className="h-3 w-3 mr-1" />
                  {newCount} New
                </Badge>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              {/* Quick Search */}
              <div className="relative min-w-[200px]">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Quick search..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-casino-dark/50 border-casino-border-subtle text-white placeholder-gray-400 focus:border-casino-neon-green"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={fetchCasinos}
                  className="border-casino-border-subtle text-gray-300 hover:text-white hover:border-casino-neon-green"
                >
                  <RefreshCw className="h-4 w-4" />
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleExport}
                  className="border-casino-border-subtle text-gray-300 hover:text-white hover:border-casino-neon-green"
                  title="Export to CSV"
                >
                  <Download className="h-4 w-4" />
                </Button>

                {hasPermission('16') && (
                  <Button asChild className="bg-casino-neon-green text-casino-dark hover:bg-casino-neon-green/80">
                    <Link href="/admin/casinos/add" className="flex items-center gap-2">
                      <Plus className="h-4 w-4" />
                      <span className="hidden sm:inline">Add Casino</span>
                    </Link>
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Advanced Filters */}
        <Card className="bg-casino-card-bg border-casino-border-subtle mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-casino-neon-green flex items-center gap-2">
                <Filter className="h-5 w-5" />
                Advanced Filters
              </CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSearchTerm('');
                  setSortBy('name');
                  setSortOrder('asc');
                  setCurrentPage(1);
                }}
                className="text-gray-400 hover:text-white"
              >
                Clear All
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Select value={sortBy} onValueChange={(value: 'name' | 'rating' | 'created_at') => setSortBy(value)}>
                <SelectTrigger className="bg-casino-dark border-casino-border-subtle text-white">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="name">Name</SelectItem>
                  <SelectItem value="rating">Rating</SelectItem>
                  <SelectItem value="created_at">Date Created</SelectItem>
                </SelectContent>
              </Select>

              <Select value={sortOrder} onValueChange={(value: 'asc' | 'desc') => setSortOrder(value)}>
                <SelectTrigger className="bg-casino-dark border-casino-border-subtle text-white">
                  <SelectValue placeholder="Order" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="asc">Ascending</SelectItem>
                  <SelectItem value="desc">Descending</SelectItem>
                </SelectContent>
              </Select>

              <Button
                onClick={fetchCasinos}
                className="bg-casino-neon-purple text-white hover:bg-casino-neon-purple/80 flex items-center gap-2"
              >
                <RefreshCw className="h-4 w-4" />
                Apply Filters
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Casino Table */}
        <Card className="bg-casino-card-bg border-casino-border-subtle">
          <CardHeader>
            <CardTitle className="text-casino-neon-green">Casino List</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-2 border-casino-neon-green border-t-transparent"></div>
              </div>
            ) : casinos.length === 0 ? (
              <div className="text-center py-8 text-gray-400">
                No casinos found. {hasPermission('16') && (
                  <Link href="/admin/casinos/add" className="text-casino-neon-green hover:underline">
                    Add the first casino
                  </Link>
                )}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-casino-border-subtle">
                      <TableHead className="text-gray-300">Casino</TableHead>
                      <TableHead className="text-gray-300">Rating</TableHead>
                      <TableHead className="text-gray-300">Safety</TableHead>
                      <TableHead className="text-gray-300">Status</TableHead>
                      <TableHead className="text-gray-300">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {casinos.map((casino) => (
                      <TableRow key={casino.id} className="border-casino-border-subtle hover:bg-casino-dark/50">
                        <TableCell>
                          <div className="flex items-center space-x-3">
                            <div className="relative w-12 h-12">
                              <Image
                                src={casino.logo}
                                alt={casino.name}
                                fill
                                className="rounded-lg object-cover"
                              />
                            </div>
                            <div>
                              <p className="font-medium text-white">{casino.name}</p>
                              <p className="text-sm text-gray-400">{casino.slug}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-1">
                            <Star className="h-4 w-4 text-yellow-400 fill-current" />
                            <span className="text-white">{casino.rating}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={getSafetyColor(casino.safety_index)}>
                            <Shield className="h-3 w-3 mr-1" />
                            {casino.safety_index}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {casino.is_featured && (
                              <Badge 
                                className="bg-casino-neon-green/20 text-casino-neon-green border-casino-neon-green/30 cursor-pointer"
                                onClick={() => handleStatusToggle(casino, 'is_featured')}
                              >
                                Featured
                              </Badge>
                            )}
                            {casino.is_hot && (
                              <Badge 
                                className="bg-red-500/20 text-red-400 border-red-500/30 cursor-pointer"
                                onClick={() => handleStatusToggle(casino, 'is_hot')}
                              >
                                Hot
                              </Badge>
                            )}
                            {casino.is_new && (
                              <Badge 
                                className="bg-blue-500/20 text-blue-400 border-blue-500/30 cursor-pointer"
                                onClick={() => handleStatusToggle(casino, 'is_new')}
                              >
                                New
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Button asChild size="sm" variant="outline" className="border-casino-border-subtle text-gray-300 hover:text-white">
                              <Link href={`/admin/casinos/${casino.id}`}>
                                <Eye className="h-4 w-4" />
                              </Link>
                            </Button>
                            {hasPermission('18') && (
                              <Button asChild size="sm" variant="outline" className="border-casino-neon-green/30 text-casino-neon-green hover:bg-casino-neon-green/10">
                                <Link href={`/admin/casinos/${casino.id}/edit`}>
                                  <Edit className="h-4 w-4" />
                                </Link>
                              </Button>
                            )}
                            {hasPermission('19') && (
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button size="sm" variant="outline" className="border-red-500/30 text-red-400 hover:bg-red-500/10">
                                    <Trash2 className="h-4 w-4" />
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
                                      onClick={() => handleDelete(casino)}
                                      className="bg-red-600 hover:bg-red-700"
                                    >
                                      Delete
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-6 space-x-2">
            <Button
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              variant="outline"
              className="border-casino-border-subtle text-gray-300 hover:text-white"
            >
              Previous
            </Button>
            <span className="flex items-center px-4 text-gray-300">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              variant="outline"
              className="border-casino-border-subtle text-gray-300 hover:text-white"
            >
              Next
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
