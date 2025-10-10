import { cn } from '@/utils/cn';
import { BrandIcon } from '../svg/brand-logo';
import { Links } from '../links';

export default function Logo({ className }: { className?: string }) {
  return (
    <Links.Home className={cn('flex items-center gap-3', className)}>
      <BrandIcon className="size-6" />
      <span className="text-2xl font-bold">Mess Mate</span>
    </Links.Home>
  );
}
