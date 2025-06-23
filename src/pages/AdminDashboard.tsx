
import React from 'react';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { AdminOverview } from '@/components/admin/AdminOverview';
import { UserManagement } from '@/components/admin/UserManagement';
import { CasinoManagement } from '@/components/admin/CasinoManagement';
import { ChatMonitor } from '@/components/admin/ChatMonitor';
import { useState } from 'react';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');

  // TODO: Add role-based access control with Supabase
  // Check if user has admin role before rendering dashboard

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return <AdminOverview />;
      case 'users':
        return <UserManagement />;
      case 'casinos':
        return <CasinoManagement />;
      case 'chat':
        return <ChatMonitor />;
      default:
        return <AdminOverview />;
    }
  };

  return (
    <div className="min-h-screen bg-casino-dark flex">
      <AdminSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="flex-1 p-6">
        {renderContent()}
      </main>
    </div>
  );
};

export default AdminDashboard;
