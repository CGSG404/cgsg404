import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import App from './App';

// Mock komponen yang di-lazy load
vi.mock('@/pages/Index', () => ({
  default: () => <div data-testid="index-page">Index Page</div>,
}));

// Membuat wrapper untuk test
describe('App', () => {
  // Setup QueryClient
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: 0,
      },
    },
  });

  it('renders without crashing', () => {
    render(
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    );
    
    // Cek apakah elemen dengan testid="app" ada di dokumen
    const appElement = screen.getByTestId('app');
    expect(appElement).toBeInTheDocument();
    
    // Cek apakah halaman index dirender
    const indexPage = screen.getByTestId('index-page');
    expect(indexPage).toBeInTheDocument();
  });
});
