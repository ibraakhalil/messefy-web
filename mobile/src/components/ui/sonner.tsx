import { Toaster as Sonner, type ToasterProps } from 'sonner';

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            'group toast group-[.toaster]:bg-card-bg group-[.toaster]:text-pure-color group-[.toaster]:border-border-color group-[.toaster]:shadow-lg group-[.toaster]:rounded-2xl group-[.toaster]:font-sans text-xs',
          description: 'group-[.toast]:text-subtitle-color',
          actionButton:
            'group-[.toast]:bg-primary group-[.toast]:text-white font-bold',
          cancelButton:
            'group-[.toast]:bg-secondary-bg group-[.toast]:text-pure-color',
          success: 'group-[.toaster]:border-emerald-500/30 text-emerald-800 dark:text-emerald-300',
          error: 'group-[.toaster]:border-rose-500/30 text-rose-800 dark:text-rose-300',
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
