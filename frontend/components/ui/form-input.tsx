import { forwardRef, InputHTMLAttributes, ReactNode } from 'react';
import { cn } from '@/utils/cn';

interface FormInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: ReactNode;
}

const FormInput = forwardRef<HTMLInputElement, FormInputProps>(
  ({ className, label, error, icon, id, ...props }, ref) => {
    return (
      <div className={cn('w-full space-y-2', className)}>
        {label && (
          <label htmlFor={id} className="text-subtitle-color block text-sm font-medium">
            {label}
          </label>
        )}
        <div className="relative">
          {icon && (
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              {icon}
            </div>
          )}
          <input
            id={id}
            ref={ref}
            className={cn(
              'border-border-color bg-card-bg text-pure-color placeholder:text-subtitle-secondary block w-full rounded-lg border px-4 py-2.5 placeholder:text-sm focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 focus:outline-none disabled:bg-muted-bg disabled:opacity-75',
              icon && 'pl-10',
              error && 'border-red-500 focus:border-red-500 focus:ring-red-500/20',
            )}
            {...props}
          />
        </div>
        {error && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{error}</p>}
      </div>
    );
  },
);


FormInput.displayName = 'FormInput';

export default FormInput;
