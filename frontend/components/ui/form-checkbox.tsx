import { cn } from '@/utils/cn';
import { forwardRef, InputHTMLAttributes, ReactNode } from 'react';

interface FormCheckboxProps extends InputHTMLAttributes<HTMLInputElement> {
  label: ReactNode;
  error?: string;
}

const FormCheckbox = forwardRef<HTMLInputElement, FormCheckboxProps>(
  ({ className, label, id, ...props }, ref) => {
    return (
      <div className="w-full">
        <div className="flex items-center gap-2">
          <input
            id={id}
            type="checkbox"
            ref={ref}
            className={cn('size-[18px]', className)}
            {...props}
          />
          <label htmlFor={id} className="text-subtitle-color text-sm">
            {label}
          </label>
        </div>
      </div>
    );
  },
);

FormCheckbox.displayName = 'FormCheckbox';

export default FormCheckbox;
