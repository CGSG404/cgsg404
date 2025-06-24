import '@testing-library/jest-dom/vitest';
import { afterEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';

// Mock global window object
const mockWindow = {
  ResizeObserver: class ResizeObserverStub {
    observe() {}
    unobserve() {}
    disconnect() {}
  },
  matchMedia: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  }),
  IntersectionObserver: class IntersectionObserverStub {
    root = null;
    rootMargin = '';
    thresholds = [];
    
    constructor() {}
    
    observe() {}
    unobserve() {}
    disconnect() {}
    takeRecords() { return []; }
  }
};

// Override global window object
Object.defineProperty(global, 'window', {
  value: mockWindow,
  writable: true,
});

// Add cleanup after each test
afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});