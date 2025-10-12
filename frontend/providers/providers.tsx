import { Toaster } from 'react-hot-toast';
import ThemeProvider from './theme-provider';
import { SessionProvider } from 'next-auth/react';
import { QueryProviders } from './query-provider';

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <SessionProvider>
        <Toaster />
        <QueryProviders>{children}</QueryProviders>
      </SessionProvider>
    </ThemeProvider>
  );
}
