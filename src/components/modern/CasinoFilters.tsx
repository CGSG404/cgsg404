'use client';

import React, { useState, useCallback, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  X, 
  ChevronDown, 
  Star, 
  Shield, 
  Gift,
  SlidersHorizontal,
  RotateCcw
} from 'lucide-react';
import { Button } from '@/src/components/ui/button';
import { Input } from '@/src/components/ui/input';
import { Badge } from '@/src/components/ui/badge';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/src/components/ui/select';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/src/components/ui/popover';
import { Checkbox } from '@/src/components/ui/checkbox';
import { Slider } from '@/src/components/ui/slider';

// Types
export interface FilterOptions {
  search: string;
  safetyIndex: string[];
  minRating: number;
  maxRating: number;
  features: string[];
  badges: string[];
  sortBy: 'name' | 'rating' | 'safety' | 'newest' | 'featured';
  sortOrder: 'asc' | 'desc';
  showFeaturedOnly: boolean;
  showNewOnly: boolean;
  showHotOnly: boolean;
}

interface CasinoFiltersProps {
  filters: FilterOptions;
  onFiltersChange: (filters: FilterOptions) => void;
  availableFeatures: string[];
  availableBadges: string[];
  totalResults: number;
  isLoading?: boolean;
}

const defaultFilters: FilterOptions = {
  search: '',
  safetyIndex: [],
  minRating: 0,
  maxRating: 5,
  features: [],
  badges: [],
  sortBy: 'featured',
  sortOrder: 'desc',
  showFeaturedOnly: false,
  showNewOnly: false,
  showHotOnly: false,
};

const safetyIndexOptions = [
  { value: 'Very High', label: 'Very High', color: 'bg-emerald-500' },
  { value: 'High', label: 'High', color: 'bg-blue-500' },
  { value: 'Medium', label: 'Medium', color: 'bg-amber-500' },
  { value: 'Low', label: 'Low', color: 'bg-red-500' },
];

const sortOptions = [
  { value: 'featured', label: 'Featured First' },
  { value: 'rating', label: 'Rating' },
  { value: 'safety', label: 'Safety Index' },
  { value: 'name', label: 'Name' },
  { value: 'newest', label: 'Newest' },
];

const CasinoFilters: React.FC<CasinoFiltersProps> = ({
  filters,
  onFiltersChange,
  availableFeatures,
  availableBadges,
  totalResults,
  isLoading = false
}) => {
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);
  const [searchValue, setSearchValue] = useState(filters.search);

  // Debounced search
  const handleSearchChange = useCallback((value: string) => {
    setSearchValue(value);
    const timeoutId = setTimeout(() => {
      onFiltersChange({ ...filters, search: value });
    }, 300);
    return () => clearTimeout(timeoutId);
  }, [filters, onFiltersChange]);

  // Filter update handlers
  const updateFilter = useCallback((key: keyof FilterOptions, value: FilterOptions[keyof FilterOptions]) => {
    onFiltersChange({ ...filters, [key]: value });
  }, [filters, onFiltersChange]);

  const toggleArrayFilter = useCallback((key: 'safetyIndex' | 'features' | 'badges', value: string) => {
    const currentArray = filters[key] as string[];
    const newArray = currentArray.includes(value)
      ? currentArray.filter(item => item !== value)
      : [...currentArray, value];
    updateFilter(key, newArray);
  }, [filters, updateFilter]);

  const resetFilters = useCallback(() => {
    setSearchValue('');
    onFiltersChange(defaultFilters);
  }, [onFiltersChange]);

  // Active filters count
  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (filters.search) count++;
    if (filters.safetyIndex.length > 0) count++;
    if (filters.minRating > 0 || filters.maxRating < 5) count++;
    if (filters.features.length > 0) count++;
    if (filters.badges.length > 0) count++;
    if (filters.showFeaturedOnly) count++;
    if (filters.showNewOnly) count++;
    if (filters.showHotOnly) count++;
    return count;
  }, [filters]);

  return (
    <div className="space-y-4">
      {/* Search and Quick Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
          <Input
            placeholder="Search casinos..."
            value={searchValue}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="pl-10 bg-slate-800 border-slate-600 text-white placeholder-slate-400 focus:border-casino-neon-green"
            disabled={isLoading}
          />
          {searchValue && (
            <Button
              size="sm"
              variant="ghost"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 w-6 h-6 p-0 text-slate-400 hover:text-white"
              onClick={() => handleSearchChange('')}
            >
              <X className="w-4 h-4" />
            </Button>
          )}
        </div>

        {/* Sort */}
        <div className="flex gap-2">
          <Select
            value={filters.sortBy}
            onValueChange={(value) => updateFilter('sortBy', value)}
            disabled={isLoading}
          >
            <SelectTrigger className="w-40 bg-slate-800 border-slate-600 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-slate-800 border-slate-600">
              {sortOptions.map((option) => (
                <SelectItem key={option.value} value={option.value} className="text-white hover:bg-slate-700">
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button
            variant="outline"
            size="sm"
            onClick={() => updateFilter('sortOrder', filters.sortOrder === 'asc' ? 'desc' : 'asc')}
            className="border-slate-600 text-slate-300 hover:bg-slate-700"
            disabled={isLoading}
          >
            {filters.sortOrder === 'asc' ? '↑' : '↓'}
          </Button>
        </div>

        {/* Advanced Filters Toggle */}
        <Popover open={isAdvancedOpen} onOpenChange={setIsAdvancedOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="border-slate-600 text-slate-300 hover:bg-slate-700 relative"
              disabled={isLoading}
            >
              <SlidersHorizontal className="w-4 h-4 mr-2" />
              Filters
              {activeFiltersCount > 0 && (
                <Badge className="absolute -top-2 -right-2 bg-casino-neon-green text-casino-dark text-xs w-5 h-5 rounded-full p-0 flex items-center justify-center">
                  {activeFiltersCount}
                </Badge>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80 bg-slate-800 border-slate-600 p-6" align="end">
            <div className="space-y-6">
              {/* Header */}
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-white">Advanced Filters</h3>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={resetFilters}
                  className="text-slate-400 hover:text-white"
                >
                  <RotateCcw className="w-4 h-4 mr-1" />
                  Reset
                </Button>
              </div>

              {/* Quick Toggles */}
              <div className="space-y-3">
                <h4 className="text-sm font-medium text-slate-300">Quick Filters</h4>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="featured"
                      checked={filters.showFeaturedOnly}
                      onCheckedChange={(checked) => updateFilter('showFeaturedOnly', checked)}
                    />
                    <label htmlFor="featured" className="text-sm text-slate-300">
                      Featured only
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="new"
                      checked={filters.showNewOnly}
                      onCheckedChange={(checked) => updateFilter('showNewOnly', checked)}
                    />
                    <label htmlFor="new" className="text-sm text-slate-300">
                      New casinos only
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="hot"
                      checked={filters.showHotOnly}
                      onCheckedChange={(checked) => updateFilter('showHotOnly', checked)}
                    />
                    <label htmlFor="hot" className="text-sm text-slate-300">
                      Hot casinos only
                    </label>
                  </div>
                </div>
              </div>

              {/* Rating Range */}
              <div className="space-y-3">
                <h4 className="text-sm font-medium text-slate-300 flex items-center gap-2">
                  <Star className="w-4 h-4" />
                  Rating Range
                </h4>
                <div className="px-2">
                  <Slider
                    value={[filters.minRating, filters.maxRating]}
                    onValueChange={([min, max]) => {
                      updateFilter('minRating', min);
                      updateFilter('maxRating', max);
                    }}
                    max={5}
                    min={0}
                    step={0.1}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-slate-400 mt-1">
                    <span>{filters.minRating.toFixed(1)}</span>
                    <span>{filters.maxRating.toFixed(1)}</span>
                  </div>
                </div>
              </div>

              {/* Safety Index */}
              <div className="space-y-3">
                <h4 className="text-sm font-medium text-slate-300 flex items-center gap-2">
                  <Shield className="w-4 h-4" />
                  Safety Index
                </h4>
                <div className="space-y-2">
                  {safetyIndexOptions.map((option) => (
                    <div key={option.value} className="flex items-center space-x-2">
                      <Checkbox
                        id={`safety-${option.value}`}
                        checked={filters.safetyIndex.includes(option.value)}
                        onCheckedChange={() => toggleArrayFilter('safetyIndex', option.value)}
                      />
                      <label htmlFor={`safety-${option.value}`} className="text-sm text-slate-300 flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full ${option.color}`} />
                        {option.label}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Features */}
              {availableFeatures.length > 0 && (
                <div className="space-y-3">
                  <h4 className="text-sm font-medium text-slate-300 flex items-center gap-2">
                    <Gift className="w-4 h-4" />
                    Features
                  </h4>
                  <div className="max-h-32 overflow-y-auto space-y-2">
                    {availableFeatures.map((feature) => (
                      <div key={feature} className="flex items-center space-x-2">
                        <Checkbox
                          id={`feature-${feature}`}
                          checked={filters.features.includes(feature)}
                          onCheckedChange={() => toggleArrayFilter('features', feature)}
                        />
                        <label htmlFor={`feature-${feature}`} className="text-sm text-slate-300">
                          {feature}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Badges */}
              {availableBadges.length > 0 && (
                <div className="space-y-3">
                  <h4 className="text-sm font-medium text-slate-300">Badges</h4>
                  <div className="max-h-32 overflow-y-auto space-y-2">
                    {availableBadges.map((badge) => (
                      <div key={badge} className="flex items-center space-x-2">
                        <Checkbox
                          id={`badge-${badge}`}
                          checked={filters.badges.includes(badge)}
                          onCheckedChange={() => toggleArrayFilter('badges', badge)}
                        />
                        <label htmlFor={`badge-${badge}`} className="text-sm text-slate-300">
                          {badge}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </PopoverContent>
        </Popover>
      </div>

      {/* Active Filters */}
      {activeFiltersCount > 0 && (
        <div className="flex flex-wrap gap-2 items-center">
          <span className="text-sm text-slate-400">Active filters:</span>
          
          {filters.search && (
            <Badge variant="secondary" className="bg-slate-700 text-slate-300">
              Search: {filters.search}
              <Button
                size="sm"
                variant="ghost"
                className="w-4 h-4 p-0 ml-1 hover:bg-slate-600"
                onClick={() => handleSearchChange('')}
              >
                <X className="w-3 h-3" />
              </Button>
            </Badge>
          )}

          {filters.safetyIndex.map((safety) => (
            <Badge key={safety} variant="secondary" className="bg-slate-700 text-slate-300">
              Safety: {safety}
              <Button
                size="sm"
                variant="ghost"
                className="w-4 h-4 p-0 ml-1 hover:bg-slate-600"
                onClick={() => toggleArrayFilter('safetyIndex', safety)}
              >
                <X className="w-3 h-3" />
              </Button>
            </Badge>
          ))}

          {(filters.minRating > 0 || filters.maxRating < 5) && (
            <Badge variant="secondary" className="bg-slate-700 text-slate-300">
              Rating: {filters.minRating.toFixed(1)}-{filters.maxRating.toFixed(1)}
              <Button
                size="sm"
                variant="ghost"
                className="w-4 h-4 p-0 ml-1 hover:bg-slate-600"
                onClick={() => {
                  updateFilter('minRating', 0);
                  updateFilter('maxRating', 5);
                }}
              >
                <X className="w-3 h-3" />
              </Button>
            </Badge>
          )}

          {filters.showFeaturedOnly && (
            <Badge variant="secondary" className="bg-slate-700 text-slate-300">
              Featured Only
              <Button
                size="sm"
                variant="ghost"
                className="w-4 h-4 p-0 ml-1 hover:bg-slate-600"
                onClick={() => updateFilter('showFeaturedOnly', false)}
              >
                <X className="w-3 h-3" />
              </Button>
            </Badge>
          )}

          <Button
            size="sm"
            variant="ghost"
            onClick={resetFilters}
            className="text-slate-400 hover:text-white ml-2"
          >
            Clear all
          </Button>
        </div>
      )}

      {/* Results Count */}
      <div className="flex items-center justify-between text-sm text-slate-400">
        <span>
          {isLoading ? 'Loading...' : `${totalResults} casino${totalResults !== 1 ? 's' : ''} found`}
        </span>
        {activeFiltersCount > 0 && (
          <span>{activeFiltersCount} filter{activeFiltersCount !== 1 ? 's' : ''} active</span>
        )}
      </div>
    </div>
  );
};

export default CasinoFilters;