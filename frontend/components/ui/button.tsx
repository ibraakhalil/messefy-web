import { forwardRef, ButtonHTMLAttributes, ReactNode } from 'react';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/utils/cn';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary';
  isLoading?: boolean;
  leftIcon?: LucideIcon;
  rightIcon?: LucideIcon;
  children: ReactNode;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', isLoading = false, children, disabled, ...props }, ref) => {
    const variants = {
      primary:
        'bg-gradient-to-r text-center font-semibold text-primary-fg from-emerald-600 to-teal-600 ',
      secondary:
        'bg-white text-gray-700 border border-border-color hover:bg-gray-50 active:bg-gray-100 focus:ring-gray-500 ',
    };

    return (
      <button
        ref={ref}
        className={cn(
          'flex h-10 cursor-pointer items-center justify-center gap-2 rounded-md px-3 text-[15px] hover:shadow-md disabled:cursor-not-allowed disabled:opacity-50',
          variants[variant],
          className,
        )}
        disabled={disabled || isLoading}
        {...props}
      >
        {children}
      </button>
    );
  },
);

Button.displayName = 'Button';

export default Button;
