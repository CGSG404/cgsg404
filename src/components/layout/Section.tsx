import React from 'react';
import { cn } from '@/src/lib/utils';
import Container from './Container';

interface SectionProps {
  children: React.ReactNode;
  className?: string;
  as?: keyof JSX.IntrinsicElements;
  container?: boolean;
  containerMaxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '7xl' | 'full';
  containerPadding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  background?: 'transparent' | 'dark' | 'darker' | 'card' | 'gradient';
}

const Section: React.FC<SectionProps> = ({
  children,
  className = '',
  as: Component = 'section',
  container = true,
  containerMaxWidth = '7xl',
  containerPadding = 'md',
  padding = 'lg',
  background = 'transparent',
}) => {
  const paddingClasses = {
    none: '',
    sm: 'py-8',
    md: 'py-12',
    lg: 'py-16 sm:py-20',
    xl: 'py-20 sm:py-24',
    '2xl': 'py-24 sm:py-32',
  };

  const backgroundClasses = {
    transparent: '',
    dark: 'bg-casino-dark',
    darker: 'bg-casino-darker',
    card: 'bg-casino-card-bg',
    gradient: 'bg-gradient-to-br from-casino-dark via-casino-darker to-casino-dark',
  };

  const content = container ? (
    <Container maxWidth={containerMaxWidth} padding={containerPadding}>
      {children}
    </Container>
  ) : (
    children
  );

  return (
    <Component
      className={cn(
        'relative',
        paddingClasses[padding],
        backgroundClasses[background],
        className
      )}
    >
      {content}
    </Component>
  );
};

export default Section;