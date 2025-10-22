import { forwardRef, ButtonHTMLAttributes, ReactNode } from 'react';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/utils/cn';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive' | 'link';
  isLoading?: boolean;
  leftIcon?: LucideIcon;
  rightIcon?: LucideIcon;
  children: ReactNode;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', isLoading = false, children, disabled, ...props }, ref) => {
    const variants = {
      primary:
        'bg-gradient-to-r text-center font-semibold text-primary-fg from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700',
      secondary:
        'bg-white text-gray-700 border border-border-color hover:bg-gray-50 active:bg-gray-100 focus:ring-gray-500',
      outline:
        'border border-gray-300 bg-transparent text-gray-700 hover:bg-gray-50 active:bg-gray-100',
      ghost: 'bg-transparent text-gray-700 hover:bg-gray-100 active:bg-gray-200',
      destructive:
        'bg-gradient-to-r from-red-600 to-rose-600 text-white font-semibold hover:from-red-700 hover:to-rose-700',
      link: 'bg-transparent text-emerald-600 underline-offset-4 hover:underline hover:text-emerald-700 h-auto p-0',
    };

    return (
      <button
        ref={ref}
        className={cn(
          'flex h-10 cursor-pointer items-center justify-center gap-2 rounded-md px-3 text-[15px] transition-all duration-200 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-50',
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
