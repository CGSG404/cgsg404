'use client';

import { useState, useEffect } from 'react';
import SimpleNavbar from '@/src/components/SimpleNavbar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Search, Calendar, ExternalLink, Shield, Users, AlertCircle, RefreshCw } from 'lucide-react';
import MaintenanceWrapper from './MaintenanceWrapper';
import { devConsole } from '@/src/utils/production-console-override';

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

export default function CasinoReportsPage() {
  const [reports, setReports] = useState<CasinoReport[]>([]);
  const [filteredReports, setFilteredReports] = useState<CasinoReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [refreshing, setRefreshing] = useState(false);

  // Debug state changes
  useEffect(() => {
    devConsole.log('🔍 Reports state changed:', reports.length, 'reports');
  }, [reports]);

  useEffect(() => {
    devConsole.log('🔍 FilteredReports state changed:', filteredReports.length, 'filtered reports');
  }, [filteredReports]);

  // Fetch reports function (extracted for reuse)
  const fetchReports = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      devConsole.log('📡 Fetching casino reports...');

      const response = await fetch('/api/casino-reports', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        cache: 'no-store' // Prevent caching issues
      });

      devConsole.log('📡 Response status:', response.status);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      devConsole.log('🔍 API Response:', result);

      if (result.success && result.data) {
        devConsole.log(`✅ Loaded ${result.data.length} reports`);
        devConsole.log('📋 Reports data:', result.data);

        // Force state update with new array reference
        const newReports = [...result.data];
        setReports(newReports);
        setError(null);

        devConsole.log('🔄 State updated with reports:', newReports.length);
      } else {
        devConsole.error('❌ API returned error or no data:', result);
        throw new Error(result.error || 'No data received');
      }
    } catch (err) {
      devConsole.error('❌ Error fetching reports:', err);
      setError(err instanceof Error ? err.message : 'Failed to load reports');
      setReports([]); // Clear reports on error
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Initial fetch and auto-refresh setup
  useEffect(() => {
    // Prevent double execution in React Strict Mode (development)
    let isMounted = true;

    const loadReports = async () => {
      if (isMounted) {
        await fetchReports();
      }
    };

    loadReports();

    // Auto-refresh every 30 seconds (only if component is still mounted)
    const interval = setInterval(() => {
      if (isMounted) {
        fetchReports(true);
      }
    }, 30000);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  // Filter reports based on search and status
  useEffect(() => {
    devConsole.log('🔄 Filtering reports. Total reports:', reports.length);
    devConsole.log('📊 Reports state:', reports);
    let filtered = reports;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(report =>
        report.casino_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        report.summary.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by status
    if (selectedStatus !== 'all') {
      filtered = filtered.filter(report => report.status === selectedStatus);
    }

    setFilteredReports(filtered);
  }, [reports, searchTerm, selectedStatus]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <MaintenanceWrapper>
        <div className="min-h-screen bg-casino-dark">
          <div className="container mx-auto px-4 py-8">
            <div className="flex items-center justify-center min-h-[400px]">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-casino-neon-green mx-auto mb-4"></div>
                <p className="text-gray-400">Loading casino reports...</p>
              </div>
            </div>
          </div>
        </div>
      </MaintenanceWrapper>
    );
  }

  if (error) {
    return (
      <MaintenanceWrapper>
        <div className="min-h-screen bg-casino-dark">
          <div className="container mx-auto px-4 py-8">
            <div className="flex items-center justify-center min-h-[400px]">
              <Card className="bg-red-500/10 border-red-500/20 max-w-md">
                <CardContent className="p-6 text-center">
                  <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-red-400 mb-2">Error Loading Reports</h3>
                  <p className="text-gray-300 mb-4">{error}</p>
                  <Button
                    onClick={() => fetchReports()}
                    variant="outline"
                    className="border-red-500/30 text-red-400 hover:bg-red-500/10"
                  >
                    Try Again
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </MaintenanceWrapper>
    );
  }

  return (
    <MaintenanceWrapper>
      <div className="min-h-screen bg-casino-dark">
        <SimpleNavbar />
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-white mb-4">
              Casino Safety Reports
            </h1>
            <p className="text-gray-300 text-lg max-w-2xl mx-auto">
              Community-driven reports about problematic gambling sites. Stay informed and gamble safely.
            </p>
          </div>

        {/* Filters */}
        <div className="mb-8 space-y-4 md:space-y-0 md:flex md:items-center md:gap-4">
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

          {/* Refresh Button */}
          <Button
            onClick={() => fetchReports(true)}
            disabled={refreshing}
            variant="outline"
            size="sm"
            className="border-casino-neon-green/30 text-casino-neon-green hover:bg-casino-neon-green/10 disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            {refreshing ? 'Refreshing...' : 'Refresh'}
          </Button>

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

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-400">
            Showing {filteredReports.length} of {reports.length} reports
          </p>
        </div>

        {/* Reports Grid */}
        {filteredReports.length === 0 ? (
          <div className="text-center py-12">
            <AlertCircle className="w-16 h-16 text-gray-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-400 mb-2">No Reports Found</h3>
            <p className="text-gray-500">
              {searchTerm || selectedStatus !== 'all' 
                ? 'Try adjusting your search or filter criteria.' 
                : 'No casino reports available at the moment.'
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

                    {report.url && report.url !== '#' && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full border-gray-600 text-gray-300 hover:bg-gray-700"
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

        {/* Footer Info */}
        <div className="mt-12 text-center">
          <Card className="bg-casino-card-bg border-gray-700 max-w-2xl mx-auto">
            <CardContent className="p-6">
              <AlertTriangle className="w-8 h-8 text-yellow-400 mx-auto mb-3" />
              <h3 className="text-lg font-semibold text-white mb-2">Important Notice</h3>
              <p className="text-gray-300 text-sm">
                These reports are community-submitted and should be used as guidance only. 
                Always conduct your own research before engaging with any gambling site.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
      </div>
    </MaintenanceWrapper>
  );
}
