'use client';

import { Shield, Settings, BarChart3 } from 'lucide-react';
import { useAdmin } from '@/src/contexts/AdminContext';
import Link from 'next/link';
import { cn } from '@/src/lib/utils';

interface AdminButtonProps {
  variant?: 'default' | 'compact' | 'icon-only' | 'mobile';
  className?: string;
  onClick?: () => void;
  showText?: boolean;
  href?: string;
}

const AdminButton = ({ 
  variant = 'default', 
  className = '', 
  onClick,
  showText = true,
  href = '/admin'
}: AdminButtonProps) => {
  const { isAdmin, isLoading } = useAdmin();

  // Don't render if not admin or still loading
  if (!isAdmin || isLoading) {
    return null;
  }

  const baseClasses = "transition-all duration-300 flex items-center justify-center font-semibold";
  
  const variantClasses = {
    default: "bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-4 py-2 rounded-lg shadow-lg space-x-2",
    compact: "bg-red-600/10 border border-red-600/30 text-red-400 hover:bg-red-600/20 hover:border-red-600/50 px-3 py-1.5 rounded-md text-sm space-x-1.5",
    'icon-only': "bg-red-600/10 border border-red-600/30 text-red-400 hover:bg-red-600/20 hover:border-red-600/50 p-2 rounded-lg",
    mobile: "w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white py-3 rounded-lg shadow-lg space-x-2"
  };

  const iconSizes = {
    default: "w-4 h-4",
    compact: "w-3.5 h-3.5", 
    'icon-only': "w-4 h-4",
    mobile: "w-4 h-4"
  };

  const textSizes = {
    default: "text-sm",
    compact: "text-xs",
    'icon-only': "",
    mobile: "text-sm"
  };

  const buttonContent = (
    <>
      <Shield className={iconSizes[variant]} />
      {showText && variant !== 'icon-only' && (
        <span className={textSizes[variant]}>
          {variant === 'mobile' ? 'Admin Panel' : 'Admin'}
        </span>
      )}
    </>
  );

  const buttonClasses = cn(
    baseClasses,
    variantClasses[variant],
    className
  );

  if (href) {
    return (
      <Link href={href}>
        <button 
          className={buttonClasses}
          onClick={onClick}
          title="Admin Panel"
        >
          {buttonContent}
        </button>
      </Link>
    );
  }

  return (
    <button 
      className={buttonClasses}
      onClick={onClick}
      title="Admin Panel"
    >
      {buttonContent}
    </button>
  );
};

export default AdminButton;

// Additional admin button variants for specific use cases
export const AdminPanelButton = ({ className = '', onClick }: { className?: string; onClick?: () => void }) => (
  <AdminButton 
    variant="default" 
    className={className} 
    onClick={onClick}
    href="/admin"
  />
);

export const AdminCompactButton = ({ className = '', onClick }: { className?: string; onClick?: () => void }) => (
  <AdminButton 
    variant="compact" 
    className={className} 
    onClick={onClick}
    href="/admin"
  />
);

export const AdminIconButton = ({ className = '', onClick }: { className?: string; onClick?: () => void }) => (
  <AdminButton 
    variant="icon-only" 
    className={className} 
    onClick={onClick}
    showText={false}
    href="/admin"
  />
);

export const AdminMobileButton = ({ className = '', onClick }: { className?: string; onClick?: () => void }) => (
  <AdminButton 
    variant="mobile" 
    className={className} 
    onClick={onClick}
    href="/admin"
  />
);

// Admin dropdown menu component
export const AdminDropdownMenu = ({ onClose }: { onClose?: () => void }) => {
  const { isAdmin } = useAdmin();

  if (!isAdmin) return null;

  const adminMenuItems = [
    {
      href: '/admin',
      icon: BarChart3,
      label: 'Dashboard',
      description: 'Admin overview'
    },
    {
      href: '/admin/casinos',
      icon: Settings,
      label: 'Casino Management',
      description: 'Manage casinos'
    },
    {
      href: '/admin/monitoring',
      icon: Shield,
      label: 'Monitoring',
      description: 'System monitoring'
    }
  ];

  return (
    <div className="bg-casino-card-bg border border-casino-border-subtle rounded-lg shadow-lg p-2 min-w-[200px]">
      <div className="text-xs font-semibold text-red-400 uppercase tracking-wider px-2 py-1 mb-1">
        Admin Panel
      </div>
      {adminMenuItems.map((item) => (
        <Link 
          key={item.href}
          href={item.href}
          onClick={onClose}
          className="flex items-center space-x-3 px-2 py-2 rounded-md hover:bg-red-500/10 transition-colors group"
        >
          <div className="w-8 h-8 rounded-lg bg-red-500/10 flex items-center justify-center group-hover:bg-red-500/20 transition-colors">
            <item.icon className="w-4 h-4 text-red-400" />
          </div>
          <div className="flex-1">
            <div className="text-white text-sm font-medium">{item.label}</div>
            <div className="text-gray-400 text-xs">{item.description}</div>
          </div>
        </Link>
      ))}
    </div>
  );
};
