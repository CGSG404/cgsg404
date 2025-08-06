// Global gtag types for Google Analytics
declare global {
  interface Window {
    gtag?: (
      command: 'config' | 'event' | 'js' | 'set',
      targetId: string | Date,
      config?: Record<string, string | number | boolean | undefined>
    ) => void;
    dataLayer?: any[];
  }
}

export {};