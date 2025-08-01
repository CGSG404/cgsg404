import { ExternalLink } from 'lucide-react';
import { ReactNode } from 'react';

interface LinkButtonProps {
  href: string;
  children: ReactNode;
  className?: string;
  showIcon?: boolean;
  icon?: ReactNode;
  target?: string;
}

export function LinkButton({
  href="https://1playsg.vip/RFONEPLAYSHEN",
  children,
  className = '',
  showIcon = true,
  icon = <ExternalLink className="w-3 h-3 mr-1" />,
  target = '_blank'
}: LinkButtonProps) {
  return (
    <a
      href={href}
      target={target}
      rel="noopener noreferrer"
      className={`text-gray-400 hover:text-casino-neon-green flex items-center text-sm ${className}`}
    >
      {showIcon && icon}
      {children}
    </a>
  );
}
