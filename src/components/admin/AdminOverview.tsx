
import React from 'react';
import { Users, Building, MessageSquare, AlertTriangle } from 'lucide-react';

export const AdminOverview: React.FC = () => {
  // TODO: Replace with real data from Supabase
  const stats = [
    { label: 'Total Users', value: '1,234', icon: Users, color: 'bg-blue-500' },
    { label: 'Total Casinos', value: '89', icon: Building, color: 'bg-green-500' },
    { label: 'Chat Messages', value: '5,678', icon: MessageSquare, color: 'bg-purple-500' },
    { label: 'Reports', value: '23', icon: AlertTriangle, color: 'bg-red-500' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white mb-2">Dashboard Overview</h1>
        <p className="text-gray-400">Welcome to the admin dashboard</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-gray-800 rounded-lg p-6">
              <div className="flex items-center">
                <div className={`${stat.color} p-3 rounded-lg mr-4`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="text-gray-400 text-sm">{stat.label}</p>
                  <p className="text-2xl font-bold text-white">{stat.value}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* TODO: Add charts and more detailed analytics with Supabase data */}
      <div className="bg-gray-800 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Recent Activity</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between py-2 border-b border-gray-700">
            <span className="text-gray-300">New user registered</span>
            <span className="text-gray-500 text-sm">2 minutes ago</span>
          </div>
          <div className="flex items-center justify-between py-2 border-b border-gray-700">
            <span className="text-gray-300">Casino report submitted</span>
            <span className="text-gray-500 text-sm">15 minutes ago</span>
          </div>
          <div className="flex items-center justify-between py-2 border-b border-gray-700">
            <span className="text-gray-300">New chat message</span>
            <span className="text-gray-500 text-sm">1 hour ago</span>
          </div>
        </div>
      </div>
    </div>
  );
};
