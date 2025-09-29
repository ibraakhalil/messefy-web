import { Toaster } from 'react-hot-toast';
import ThemeProvider from './theme-provider';
import { SessionProvider } from 'next-auth/react';

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <SessionProvider>
        <Toaster />
        {children}
      </SessionProvider>
    </ThemeProvider>
  );
}
