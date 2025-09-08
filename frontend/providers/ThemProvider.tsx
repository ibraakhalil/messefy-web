import { ThemeProvider as ThmProvider } from 'next-themes'

export default function ThemeProvider({ children, ...props }: { children: React.ReactNode }) {
  return (
    <ThmProvider
      defaultTheme="dark"
      disableTransitionOnChange
      enableColorScheme
      attribute="class"
      enableSystem
      {...props}
    >
      {children}
    </ThmProvider>
  )
}
