import React from 'react';
import { WifiOff, Wifi } from 'lucide-react';
import { useNetworkStatus } from '@/hooks/use-network-status';

export const OfflineBanner: React.FC = () => {
  const { isOnline, wasOffline } = useNetworkStatus();

  if (isOnline && !wasOffline) {
    return null;
  }

  if (!isOnline) {
    return (
      <div className="sticky top-0 z-50 flex items-center justify-center gap-2 bg-amber-500/90 text-white dark:bg-amber-600/90 px-3 py-1.5 text-xs font-semibold backdrop-blur-md transition-all shadow-sm">
        <WifiOff className="size-3.5 shrink-0 animate-pulse" />
        <span>ইন্টারনেট সংযোগ নেই। মেসের ডাটা ক্যাশ থেকে প্রদর্শিত হচ্ছে।</span>
      </div>
    );
  }

  return (
    <div className="sticky top-0 z-50 flex items-center justify-center gap-2 bg-primary text-white px-3 py-1.5 text-xs font-semibold backdrop-blur-md transition-all shadow-xs animate-in fade-in slide-in-from-top duration-300">
      <Wifi className="size-3.5 shrink-0" />
      <span>ইন্টারনেট সংযোগ পুনরায় সক্রিয় হয়েছে!</span>
    </div>
  );
};
