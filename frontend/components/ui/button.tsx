import { forwardRef, ButtonHTMLAttributes, ReactNode } from 'react'
import { LucideIcon } from 'lucide-react'
import { cn } from '@/utils/cn'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary'
  isLoading?: boolean
  leftIcon?: LucideIcon
  rightIcon?: LucideIcon
  children: ReactNode
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', isLoading = false, children, disabled, ...props }, ref) => {
    const variants = {
      primary:
        'bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800 focus:ring-blue-500 shadow-sm hover:shadow-md',
      secondary:
        'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 active:bg-gray-100 focus:ring-gray-500 dark:bg-gray-800 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-700',
    }

    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex h-10 cursor-pointer items-center justify-center rounded-md px-3 disabled:cursor-not-allowed disabled:opacity-50',
          variants[variant],
          className,
        )}
        disabled={disabled || isLoading}
        {...props}
      >
        {children}
      </button>
    )
  },
)

Button.displayName = 'Button'

export default Button
