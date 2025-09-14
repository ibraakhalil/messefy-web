import * as React from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog'
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer'
import { useMedia } from 'react-use'
import { cn } from '@/utils/cn'

interface ResponsiveDialogContextValue {
  isDesktop: boolean
}

const ResponsiveDialogContext = React.createContext<ResponsiveDialogContextValue | undefined>(
  undefined,
)

const useResponsiveDialog = () => {
  const context = React.useContext(ResponsiveDialogContext)
  if (!context) {
    throw new Error('useResponsiveDialog must be used within ResponsiveDialog')
  }
  return context
}

// Root Component
interface ResponsiveDialogProps {
  children: React.ReactNode
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

const ResponsiveDialog = ({ children, open, onOpenChange }: ResponsiveDialogProps) => {
  const isDesktop = useMedia('(min-width: 768px)')
  const Component = isDesktop ? Dialog : Drawer

  return (
    <ResponsiveDialogContext.Provider value={{ isDesktop }}>
      <Component open={open} onOpenChange={onOpenChange}>
        {children}
      </Component>
    </ResponsiveDialogContext.Provider>
  )
}

// Trigger Component
const ResponsiveDialogTrigger = ({ children }: { children: React.ReactNode }) => {
  const { isDesktop } = useResponsiveDialog()
  const Component = isDesktop ? DialogTrigger : DrawerTrigger
  return <Component>{children}</Component>
}

// Content Component
const ResponsiveDialogContent = ({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) => {
  const { isDesktop } = useResponsiveDialog()
  const Component = isDesktop ? DialogContent : DrawerContent
  return <Component className={cn('max-w-[700px]', className)}>{children}</Component>
}

// Header Component
const ResponsiveDialogHeader = ({ children }: { children: React.ReactNode }) => {
  const { isDesktop } = useResponsiveDialog()
  const Component = isDesktop ? DialogHeader : DrawerHeader
  return <Component>{children}</Component>
}

// Title Component
const ResponsiveDialogTitle = ({ children }: { children: React.ReactNode }) => {
  const { isDesktop } = useResponsiveDialog()
  const Component = isDesktop ? DialogTitle : DrawerTitle
  return <Component>{children}</Component>
}

// Description Component
const ResponsiveDialogDescription = ({ children }: { children: React.ReactNode }) => {
  const { isDesktop } = useResponsiveDialog()
  const Component = isDesktop ? DialogDescription : DrawerDescription
  return <Component>{children}</Component>
}

// Footer Component
const ResponsiveDialogFooter = ({ children }: { children: React.ReactNode }) => {
  const { isDesktop } = useResponsiveDialog()
  const Component = isDesktop ? DialogFooter : DrawerFooter
  return <Component>{children}</Component>
}

// Close Component
const ResponsiveDialogClose = ({ children }: { children: React.ReactNode }) => {
  const { isDesktop } = useResponsiveDialog()
  const Component = isDesktop ? DialogClose : DrawerClose
  return <Component>{children}</Component>
}

// Export compound components
ResponsiveDialog.Trigger = ResponsiveDialogTrigger
ResponsiveDialog.Content = ResponsiveDialogContent
ResponsiveDialog.Header = ResponsiveDialogHeader
ResponsiveDialog.Title = ResponsiveDialogTitle
ResponsiveDialog.Description = ResponsiveDialogDescription
ResponsiveDialog.Footer = ResponsiveDialogFooter
ResponsiveDialog.Close = ResponsiveDialogClose

export { ResponsiveDialog, useResponsiveDialog }
