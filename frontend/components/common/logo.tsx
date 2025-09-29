import Link from 'next/link';
import { BrandIcon } from '../svg/brand-logo';
import { cn } from '@/utils/cn';

export default function Logo({ className }: { className?: string }) {
  return (
    <Link href="/" className={cn('flex items-center gap-3', className)}>
      <BrandIcon className="size-6" />
      <span className="text-2xl font-bold">Mess Mate</span>
    </Link>
  );
}
