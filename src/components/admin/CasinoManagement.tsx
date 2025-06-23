
import React from 'react';
import { Star, Edit, Trash2, Eye, AlertTriangle } from 'lucide-react';

export const CasinoManagement: React.FC = () => {
  // TODO: Replace with real casino data from Supabase
  const casinos = [
    { 
      id: 1, 
      name: 'Royal Casino', 
      rating: 4.5, 
      reports: 2, 
      status: 'active',
      addedDate: '2024-01-15',
      image: '/casino-logos/01COMING SOON.png'
    },
    { 
      id: 2, 
      name: 'Golden Palace', 
      rating: 3.8, 
      reports: 0, 
      status: 'active',
      addedDate: '2024-01-20',
      image: '/casino-logos/GE8-logos.jpg'
    },
    { 
      id: 3, 
      name: 'Lucky Stars', 
      rating: 2.1, 
      reports: 5, 
      status: 'under_review',
      addedDate: '2024-01-25',
      image: '/casino-logos/KOI8-logos.png'
    },
  ];

  const handleEditCasino = (casinoId: number) => {
    // TODO: Implement edit casino with Supabase
    console.log('Edit casino:', casinoId);
  };

  const handleDeleteCasino = (casinoId: number) => {
    // TODO: Implement delete casino with Supabase
    console.log('Delete casino:', casinoId);
  };

  const handleViewReports = (casinoId: number) => {
    // TODO: Implement view reports with Supabase
    console.log('View reports for casino:', casinoId);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-white mb-2">Casino Management</h1>
          <p className="text-gray-400">Manage casino listings and reports</p>
        </div>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg">
          Add New Casino
        </button>
      </div>

      <div className="grid gap-6">
        {casinos.map((casino) => (
          <div key={casino.id} className="bg-gray-800 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <img 
                  src={casino.image} 
                  alt={casino.name}
                  className="w-16 h-16 rounded-lg object-cover"
                />
                <div>
                  <h3 className="text-lg font-semibold text-white">{casino.name}</h3>
                  <div className="flex items-center space-x-2 mt-1">
                    <div className="flex items-center">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span className="text-sm text-gray-300 ml-1">{casino.rating}</span>
                    </div>
                    <span className="text-gray-500">•</span>
                    <div className="flex items-center">
                      <AlertTriangle className={`h-4 w-4 ${casino.reports > 0 ? 'text-red-400' : 'text-gray-400'}`} />
                      <span className="text-sm text-gray-300 ml-1">{casino.reports} reports</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${
                  casino.status === 'active' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {casino.status.replace('_', ' ')}
                </span>
                
                <div className="flex space-x-2">
                  {casino.reports > 0 && (
                    <button
                      onClick={() => handleViewReports(casino.id)}
                      className="text-blue-400 hover:text-blue-300 p-2 rounded"
                      title="View Reports"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                  )}
                  <button
                    onClick={() => handleEditCasino(casino.id)}
                    className="text-gray-400 hover:text-gray-300 p-2 rounded"
                    title="Edit Casino"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteCasino(casino.id)}
                    className="text-red-400 hover:text-red-300 p-2 rounded"
                    title="Delete Casino"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
