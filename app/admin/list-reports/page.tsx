'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Plus, Edit, Trash2, Search, Calendar, ExternalLink, Shield, Users, AlertTriangle, Loader2, RefreshCw } from 'lucide-react';
import { useAdmin } from '@/src/contexts/AdminContext';

interface CasinoReport {
  id: number;
  casino_name: string;
  status: 'Unlicensed' | 'Scam Indicated' | 'Many Users Reported';
  last_reported: string;
  summary: string;
  url: string;
  created_at: string;
  updated_at: string;
}

interface FormData {
  casino_name: string;
  status: 'Unlicensed' | 'Scam Indicated' | 'Many Users Reported';
  last_reported: string;
  summary: string;
  url: string;
}

const statusConfig = {
  'Unlicensed': {
    color: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    icon: Shield,
    description: 'Operating without proper licensing'
  },
  'Scam Indicated': {
    color: 'bg-red-500/20 text-red-400 border-red-500/30',
    icon: AlertTriangle,
    description: 'Multiple scam indicators reported'
  },
  'Many Users Reported': {
    color: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
    icon: Users,
    description: 'High volume of user complaints'
  }
};

const initialFormData: FormData = {
  casino_name: '',
  status: 'Unlicensed',
  last_reported: new Date().toISOString().split('T')[0],
  summary: '',
  url: ''
};

export default function AdminListReportsPage() {
  const { isAdmin, isLoading: authLoading } = useAdmin();
  const [reports, setReports] = useState<CasinoReport[]>([]);
  const [filteredReports, setFilteredReports] = useState<CasinoReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  
  // Form states
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [editingReport, setEditingReport] = useState<CasinoReport | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  // Fetch reports
  const fetchReports = async () => {
    try {
      setLoading(true);
      console.log('📡 Admin fetching casino reports...');

      const response = await fetch('/api/admin/casino-reports');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      if (result.success) {
        console.log(`✅ Admin loaded ${result.data.length} reports`);
        setReports(result.data);
        setFilteredReports(result.data);
      } else {
        throw new Error(result.error || 'Failed to fetch reports');
      }
    } catch (err) {
      console.error('❌ Error fetching reports:', err);
      alert('Failed to load reports: ' + (err instanceof Error ? err.message : 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!authLoading && isAdmin) {
      fetchReports();

      // Auto-refresh every 30 seconds for admin page
      const interval = setInterval(() => {
        fetchReports();
      }, 30000);

      return () => clearInterval(interval);
    }
  }, [authLoading, isAdmin]);

  // Filter reports
  useEffect(() => {
    let filtered = reports;

    if (searchTerm) {
      filtered = filtered.filter(report =>
        report.casino_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        report.summary.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedStatus !== 'all') {
      filtered = filtered.filter(report => report.status === selectedStatus);
    }

    setFilteredReports(filtered);
  }, [reports, searchTerm, selectedStatus]);

  // Handle create
  const handleCreate = async () => {
    if (isSubmitting) return;

    try {
      setIsSubmitting(true);
      console.log('📝 Creating new casino report...');

      const response = await fetch('/api/admin/casino-reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const result = await response.json();

      if (response.ok && result.success) {
        console.log('✅ Report created successfully');
        setFormData(initialFormData);
        setIsCreateDialogOpen(false);
        await fetchReports();
        alert('Report created successfully!');
      } else {
        throw new Error(result.error || 'Failed to create report');
      }
    } catch (err) {
      console.error('❌ Error creating report:', err);
      alert('Failed to create report: ' + (err instanceof Error ? err.message : 'Unknown error'));
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle edit
  const handleEdit = async () => {
    if (isSubmitting || !editingReport) return;

    try {
      setIsSubmitting(true);
      console.log('📝 Updating casino report:', editingReport.id);

      const response = await fetch(`/api/admin/casino-reports/${editingReport.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const result = await response.json();

      if (response.ok && result.success) {
        console.log('✅ Report updated successfully');
        setFormData(initialFormData);
        setEditingReport(null);
        setIsEditDialogOpen(false);
        await fetchReports();
        alert('Report updated successfully!');
      } else {
        throw new Error(result.error || 'Failed to update report');
      }
    } catch (err) {
      console.error('❌ Error updating report:', err);
      alert('Failed to update report: ' + (err instanceof Error ? err.message : 'Unknown error'));
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle delete
  const handleDelete = async (id: number) => {
    if (deletingId === id) return;

    try {
      setDeletingId(id);
      console.log('🗑️ Deleting casino report:', id);

      const response = await fetch(`/api/admin/casino-reports/${id}`, {
        method: 'DELETE'
      });

      const result = await response.json();

      if (response.ok && result.success) {
        console.log('✅ Report deleted successfully');
        await fetchReports();
        alert('Report deleted successfully!');
      } else {
        throw new Error(result.error || 'Failed to delete report');
      }
    } catch (err) {
      console.error('❌ Error deleting report:', err);
      alert('Failed to delete report: ' + (err instanceof Error ? err.message : 'Unknown error'));
    } finally {
      setDeletingId(null);
    }
  };

  // Open edit dialog
  const openEditDialog = (report: CasinoReport) => {
    setEditingReport(report);
    setFormData({
      casino_name: report.casino_name,
      status: report.status,
      last_reported: report.last_reported,
      summary: report.summary,
      url: report.url
    });
    setIsEditDialogOpen(true);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Show loading state while checking authentication
  if (authLoading) {
    return (
      <div className="min-h-screen bg-casino-dark flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-casino-neon-green mx-auto mb-4"></div>
          <p className="text-gray-400">Checking admin access...</p>
          {/* Debug info for production */}
          <div className="mt-4 text-xs text-gray-500 max-w-md">
            <p>Environment: {process.env.NODE_ENV}</p>
            <p>Auth Loading: {authLoading.toString()}</p>
            <p>Is Admin: {isAdmin.toString()}</p>
          </div>
        </div>
      </div>
    );
  }

  // Show access denied if not admin
  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-casino-dark flex items-center justify-center">
        <Card className="bg-red-500/10 border-red-500/20 max-w-md">
          <CardContent className="p-6 text-center">
            <AlertTriangle className="w-12 h-12 text-red-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-red-400 mb-2">Admin Login Required</h3>
            <p className="text-gray-300 mb-4">Please login with your admin Google account to access this page.</p>
            <Button
              onClick={() => window.location.href = '/auth'}
              className="bg-casino-neon-green text-black hover:bg-casino-neon-green/80"
            >
              Login with Google
            </Button>
            {/* Debug info for production */}
            <div className="mt-4 text-xs text-gray-500">
              <p>Environment: {process.env.NODE_ENV}</p>
              <p>Auth Loading: {authLoading.toString()}</p>
              <p>Is Admin: {isAdmin.toString()}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-casino-dark">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">
              Casino Reports Management
            </h1>
            <p className="text-gray-300">
              Manage community casino safety reports and alerts
            </p>
          </div>
          
          {/* Action Buttons */}
          <div className="flex gap-2 mt-4 md:mt-0">
            <Button
              onClick={fetchReports}
              disabled={loading}
              variant="outline"
              className="border-casino-neon-green/30 text-casino-neon-green hover:bg-casino-neon-green/10"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>

            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-casino-neon-green text-black hover:bg-casino-neon-green/90">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Report
                </Button>
              </DialogTrigger>
            <DialogContent className="bg-casino-card-bg border-gray-700 text-white max-w-2xl">
              <DialogHeader>
                <DialogTitle>Create New Casino Report</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Casino Name</label>
                  <Input
                    value={formData.casino_name}
                    onChange={(e) => setFormData({ ...formData, casino_name: e.target.value })}
                    placeholder="Enter casino name"
                    className="bg-casino-dark border-gray-600 text-white"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Status</label>
                  <Select value={formData.status} onValueChange={(value: any) => setFormData({ ...formData, status: value })}>
                    <SelectTrigger className="bg-casino-dark border-gray-600 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-casino-card-bg border-gray-700">
                      <SelectItem value="Unlicensed">Unlicensed</SelectItem>
                      <SelectItem value="Scam Indicated">Scam Indicated</SelectItem>
                      <SelectItem value="Many Users Reported">Many Users Reported</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Last Reported Date</label>
                  <Input
                    type="date"
                    value={formData.last_reported}
                    onChange={(e) => setFormData({ ...formData, last_reported: e.target.value })}
                    className="bg-casino-dark border-gray-600 text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Summary</label>
                  <Textarea
                    value={formData.summary}
                    onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                    placeholder="Describe the issues with this casino..."
                    rows={4}
                    className="bg-casino-dark border-gray-600 text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">URL (optional)</label>
                  <Input
                    value={formData.url}
                    onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                    placeholder="https://example.com"
                    className="bg-casino-dark border-gray-600 text-white"
                  />
                </div>

                <div className="flex gap-2 pt-4">
                  <Button
                    onClick={handleCreate}
                    disabled={isSubmitting || !formData.casino_name || !formData.summary}
                    className="bg-casino-neon-green text-black hover:bg-casino-neon-green/90"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Creating...
                      </>
                    ) : (
                      'Create Report'
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setFormData(initialFormData);
                      setIsCreateDialogOpen(false);
                    }}
                    className="border-gray-600 text-gray-300 hover:bg-gray-700"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
          </div>
        </div>

        {/* Filters */}
        <div className="mb-6 space-y-4 md:space-y-0 md:flex md:items-center md:gap-4">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search casino names or issues..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-casino-card-bg border-gray-600 text-white placeholder-gray-400"
            />
          </div>

          {/* Status Filter */}
          <div className="flex gap-2 flex-wrap">
            <Button
              variant={selectedStatus === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedStatus('all')}
              className={selectedStatus === 'all' 
                ? 'bg-casino-neon-green text-black' 
                : 'border-gray-600 text-gray-300 hover:bg-gray-700'
              }
            >
              All ({reports.length})
            </Button>
            {Object.entries(statusConfig).map(([status, config]) => {
              const count = reports.filter(r => r.status === status).length;
              return (
                <Button
                  key={status}
                  variant={selectedStatus === status ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedStatus(status)}
                  className={selectedStatus === status 
                    ? 'bg-casino-neon-green text-black' 
                    : 'border-gray-600 text-gray-300 hover:bg-gray-700'
                  }
                >
                  {status} ({count})
                </Button>
              );
            })}
          </div>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-casino-neon-green mx-auto mb-4"></div>
              <p className="text-gray-400">Loading reports...</p>
            </div>
          </div>
        ) : (
          <>
            {/* Results Count */}
            <div className="mb-6">
              <p className="text-gray-400">
                Showing {filteredReports.length} of {reports.length} reports
              </p>
            </div>

            {/* Reports Grid */}
            {filteredReports.length === 0 ? (
              <div className="text-center py-12">
                <AlertTriangle className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-400 mb-2">No Reports Found</h3>
                <p className="text-gray-500">
                  {searchTerm || selectedStatus !== 'all' 
                    ? 'Try adjusting your search or filter criteria.' 
                    : 'No casino reports available. Create the first one!'
                  }
                </p>
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {filteredReports.map((report) => {
                  const config = statusConfig[report.status];
                  const StatusIcon = config.icon;

                  return (
                    <Card key={report.id} className="bg-casino-card-bg border-gray-700 hover:border-casino-neon-green/30 transition-colors">
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <CardTitle className="text-white text-lg font-semibold">
                            {report.casino_name}
                          </CardTitle>
                          <StatusIcon className="w-5 h-5 text-gray-400 flex-shrink-0 ml-2" />
                        </div>
                        <Badge className={`${config.color} w-fit`}>
                          {report.status}
                        </Badge>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <p className="text-gray-300 text-sm leading-relaxed line-clamp-3">
                          {report.summary}
                        </p>
                        
                        <div className="flex items-center text-xs text-gray-400">
                          <Calendar className="w-3 h-3 mr-1" />
                          Last reported: {formatDate(report.last_reported)}
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-2 pt-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => openEditDialog(report)}
                            className="border-blue-500/30 text-blue-400 hover:bg-blue-500/10 flex-1"
                          >
                            <Edit className="w-3 h-3 mr-1" />
                            Edit
                          </Button>
                          
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                size="sm"
                                variant="outline"
                                className="border-red-500/30 text-red-400 hover:bg-red-500/10"
                                disabled={deletingId === report.id}
                              >
                                {deletingId === report.id ? (
                                  <Loader2 className="w-3 h-3 animate-spin" />
                                ) : (
                                  <Trash2 className="w-3 h-3" />
                                )}
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent className="bg-casino-card-bg border-red-500/20 text-white">
                              <AlertDialogHeader>
                                <AlertDialogTitle>Delete Report</AlertDialogTitle>
                                <AlertDialogDescription className="text-gray-300">
                                  Are you sure you want to delete the report for "{report.casino_name}"? This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel className="bg-gray-600 hover:bg-gray-700 text-white border-gray-500">
                                  Cancel
                                </AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDelete(report.id)}
                                  className="bg-red-600 hover:bg-red-700 text-white"
                                >
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>

                        {report.url && report.url !== '#' && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-full border-gray-600 text-gray-300 hover:bg-gray-700 mt-2"
                            onClick={() => window.open(report.url, '_blank')}
                          >
                            <ExternalLink className="w-3 h-3 mr-2" />
                            View Details
                          </Button>
                        )}
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </>
        )}

        {/* Edit Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="bg-casino-card-bg border-gray-700 text-white max-w-2xl">
            <DialogHeader>
              <DialogTitle>Edit Casino Report</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Casino Name</label>
                <Input
                  value={formData.casino_name}
                  onChange={(e) => setFormData({ ...formData, casino_name: e.target.value })}
                  placeholder="Enter casino name"
                  className="bg-casino-dark border-gray-600 text-white"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Status</label>
                <Select value={formData.status} onValueChange={(value: any) => setFormData({ ...formData, status: value })}>
                  <SelectTrigger className="bg-casino-dark border-gray-600 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-casino-card-bg border-gray-700">
                    <SelectItem value="Unlicensed">Unlicensed</SelectItem>
                    <SelectItem value="Scam Indicated">Scam Indicated</SelectItem>
                    <SelectItem value="Many Users Reported">Many Users Reported</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Last Reported Date</label>
                <Input
                  type="date"
                  value={formData.last_reported}
                  onChange={(e) => setFormData({ ...formData, last_reported: e.target.value })}
                  className="bg-casino-dark border-gray-600 text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Summary</label>
                <Textarea
                  value={formData.summary}
                  onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                  placeholder="Describe the issues with this casino..."
                  rows={4}
                  className="bg-casino-dark border-gray-600 text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">URL (optional)</label>
                <Input
                  value={formData.url}
                  onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                  placeholder="https://example.com"
                  className="bg-casino-dark border-gray-600 text-white"
                />
              </div>

              <div className="flex gap-2 pt-4">
                <Button
                  onClick={handleEdit}
                  disabled={isSubmitting || !formData.casino_name || !formData.summary}
                  className="bg-casino-neon-green text-black hover:bg-casino-neon-green/90"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Updating...
                    </>
                  ) : (
                    'Update Report'
                  )}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setFormData(initialFormData);
                    setEditingReport(null);
                    setIsEditDialogOpen(false);
                  }}
                  className="border-gray-600 text-gray-300 hover:bg-gray-700"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
