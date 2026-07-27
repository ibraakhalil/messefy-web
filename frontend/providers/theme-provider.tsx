'use client';

import { ThemeProvider as ThmProvider } from 'next-themes';
import { ComponentProps } from 'react';

export default function ThemeProvider({ children, ...props }: ComponentProps<typeof ThmProvider>) {
  return (
    <ThmProvider
      attribute="class"
      defaultTheme="light"
      enableSystem
      disableTransitionOnChange
      {...props}
    >
      {children}
    </ThmProvider>
  );
}


