import React from 'react';
import { Users, Home, Building, MessageSquare, Settings } from 'lucide-react';

interface AdminSidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({ activeTab, setActiveTab }) => {
  const menuItems = [
    { id: 'overview', label: 'Overview', icon: Home },
    { id: 'users', label: 'User Management', icon: Users },
    { id: 'casinos', label: 'Casino Management', icon: Building },
    { id: 'chat', label: 'Chat Monitor', icon: MessageSquare },
  ];

  return (
    <div className="w-64 bg-gray-900 text-white p-6">
      <div className="mb-8">
        <h2 className="text-xl font-bold">Admin Dashboard</h2>
      </div>
      
      <nav className="space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                activeTab === item.id
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-300 hover:bg-gray-800 hover:text-white'
              }`}
            >
              <Icon className="h-5 w-5" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
};
