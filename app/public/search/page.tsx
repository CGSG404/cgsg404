import { Suspense } from 'react';
import SearchResults from './SearchResults';



export default function SearchPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">Search Results</h1>
          <p className="text-gray-300">Find what you're looking for across our platform</p>
        </div>
        
        <Suspense fallback={
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
          </div>
        }>
          <SearchResults />
        </Suspense>
      </div>
    </div>
  )
} 