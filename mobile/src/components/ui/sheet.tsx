import * as React from 'react';
import * as SheetPrimitive from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

const Sheet = SheetPrimitive.Root;

const SheetTrigger = SheetPrimitive.Trigger;

const SheetClose = SheetPrimitive.Close;

const SheetPortal = SheetPrimitive.Portal;

const SheetOverlay = React.forwardRef<
  React.ElementRef<typeof SheetPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof SheetPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <SheetPrimitive.Overlay
    ref={ref}
    className={cn(
      'fixed inset-0 z-[100] bg-black/70 backdrop-blur-xs sheet-overlay-anim',
      'data-[state=open]:animate-drawer-fade data-[state=closed]:animate-drawer-fade-out',
      className
    )}
    {...props}
  />
));
SheetOverlay.displayName = SheetPrimitive.Overlay.displayName;

interface SheetContentProps
  extends React.ComponentPropsWithoutRef<typeof SheetPrimitive.Content> {
  side?: 'top' | 'bottom' | 'left' | 'right';
  showClose?: boolean;
}

const SheetContent = React.forwardRef<
  React.ElementRef<typeof SheetPrimitive.Content>,
  SheetContentProps
>(({ side = 'left', className, children, showClose = true, ...props }, ref) => (
  <SheetPortal>
    <SheetOverlay />
    <SheetPrimitive.Content
      ref={ref}
      className={cn(
        'fixed z-[101] flex flex-col justify-between bg-white dark:bg-[#0c1412] text-pure-color border-border-color shadow-2xl transition ease-in-out',
        side === 'left' &&
          'inset-y-0 left-0 h-full w-72 max-w-[85vw] border-r sheet-left-anim data-[state=open]:animate-drawer-slide data-[state=closed]:animate-drawer-slide-out pt-[calc(env(safe-area-inset-top,0px)+0.5rem)] pb-[calc(env(safe-area-inset-bottom,0px)+0.5rem)]',
        side === 'right' &&
          'inset-y-0 right-0 h-full w-72 max-w-[85vw] border-l data-[state=open]:animate-drawer-slide data-[state=closed]:animate-drawer-slide-out pt-[calc(env(safe-area-inset-top,0px)+0.5rem)] pb-[calc(env(safe-area-inset-bottom,0px)+0.5rem)]',
        side === 'top' &&
          'inset-x-0 top-0 border-b pt-[calc(env(safe-area-inset-top,0px)+0.5rem)]',
        side === 'bottom' &&
          'inset-x-0 bottom-0 border-t pb-[calc(env(safe-area-inset-bottom,0px)+0.5rem)]',
        className
      )}
      {...props}
    >
      {children}
      {showClose && (
        <SheetPrimitive.Close
          aria-label="মেনু বন্ধ করুন"
          className="absolute right-3.5 top-3.5 size-8 rounded-full bg-secondary-bg hover:bg-card-shade flex items-center justify-center text-subtitle-color hover:text-pure-color transition active:scale-90 focus:outline-hidden"
        >
          <X className="size-4" />
          <span className="sr-only">বন্ধ করুন</span>
        </SheetPrimitive.Close>
      )}
    </SheetPrimitive.Content>
  </SheetPortal>
));
SheetContent.displayName = SheetPrimitive.Content.displayName;

const SheetHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn('flex flex-col space-y-1.5', className)}
    {...props}
  />
);
SheetHeader.displayName = 'SheetHeader';

const SheetFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn('flex flex-col-reverse sm:flex-row sm:justify-end', className)}
    {...props}
  />
);
SheetFooter.displayName = 'SheetFooter';

const SheetTitle = React.forwardRef<
  React.ElementRef<typeof SheetPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof SheetPrimitive.Title>
>(({ className, ...props }, ref) => (
  <SheetPrimitive.Title
    ref={ref}
    className={cn('text-sm font-bold text-pure-color', className)}
    {...props}
  />
));
SheetTitle.displayName = SheetPrimitive.Title.displayName;

const SheetDescription = React.forwardRef<
  React.ElementRef<typeof SheetPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof SheetPrimitive.Description>
>(({ className, ...props }, ref) => (
  <SheetPrimitive.Description
    ref={ref}
    className={cn('text-[10px] text-subtitle-color', className)}
    {...props}
  />
));
SheetDescription.displayName = SheetPrimitive.Description.displayName;

export {
  Sheet,
  SheetPortal,
  SheetOverlay,
  SheetTrigger,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetFooter,
  SheetTitle,
  SheetDescription,
};
