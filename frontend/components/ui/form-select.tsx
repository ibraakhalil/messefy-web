import { forwardRef, SelectHTMLAttributes, ReactNode } from 'react';
import { cn } from '@/utils/cn';

interface FormSelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: ReactNode;
  error?: string;
  options: Array<{ value: string; label: string }>;
}

const FormSelect = forwardRef<HTMLSelectElement, FormSelectProps>(
  ({ className, label, error, options, id, ...props }, ref) => {
    return (
      <div className={cn('w-full space-y-2', className)}>
        {label && (
          <label htmlFor={id} className="text-subtitle-color block text-sm font-medium">
            {label}
          </label>
        )}
        <div className="relative">
          <select
            id={id}
            ref={ref}
            className={cn(
              'border-border-color bg-card-bg text-pure-color block w-full appearance-none rounded-lg border px-4 py-2.5 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 focus:outline-none disabled:bg-muted-bg disabled:opacity-60',
              error && 'border-red-500 focus:border-red-500 focus:ring-red-500/20',
            )}
            {...props}
          >
            {options.map((option) => (
              <option key={option.value} value={option.value} className="bg-card-bg text-pure-color">
                {option.label}
              </option>
            ))}
          </select>
          <div className="text-subtitle-secondary pointer-events-none absolute inset-y-0 right-0 flex items-center px-3">
            <svg
              className="h-4 w-4 fill-current"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
            >
              <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
            </svg>
          </div>
        </div>
        {error && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{error}</p>}
      </div>
    );
  },
);

FormSelect.displayName = 'FormSelect';

export default FormSelect;
