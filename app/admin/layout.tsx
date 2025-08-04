import { Metadata } from 'next';
import Link from 'next/link';
import { Home, Settings, Database, FileText, Upload, Monitor, BarChart3, Image } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Admin Panel | CGSG',
  description: 'Content Management System for CGSG',
};

const adminMenuItems = [
  { href: '/admin', label: 'Dashboard', icon: Home },
  { href: '/admin/banners', label: 'Banners', icon: Image },
  { href: '/admin/casinos', label: 'Casinos', icon: BarChart3 },
  { href: '/admin/content', label: 'Content', icon: FileText },
  { href: '/admin/database', label: 'Database', icon: Database },
  { href: '/admin/file-upload', label: 'File Upload', icon: Upload },
  { href: '/admin/monitoring', label: 'Monitoring', icon: Monitor },
  { href: '/admin/maintenance', label: 'Maintenance', icon: Settings },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-casino-dark flex">
      {/* Sidebar */}
      <div className="w-64 bg-casino-card-bg border-r border-casino-border-subtle">
        <div className="p-6">
          <h1 className="text-xl font-bold text-white mb-6">CGSG Admin</h1>
          <nav className="space-y-2">
            {adminMenuItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center space-x-3 px-4 py-2 text-gray-300 hover:text-white hover:bg-casino-dark rounded-lg transition-colors"
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        {children}
      </div>
    </div>
  );
}
