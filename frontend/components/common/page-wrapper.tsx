import { cn } from '@/utils/cn'
import { ComponentProps, ReactNode } from 'react'

interface PageWrapperProps extends ComponentProps<'main'> {
  children: ReactNode
}

export default function PageWrapper({ children, ...props }: PageWrapperProps) {
  return (
    <main {...props} className={cn('container', props.className)}>
      {children}
    </main>
  )
}
