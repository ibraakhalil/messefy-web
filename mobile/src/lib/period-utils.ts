const BANGLA_MONTHS = [
  'জানুয়ারি',
  'ফেব্রুয়ারি',
  'মার্চ',
  'এপ্রিল',
  'মে',
  'জুন',
  'জুলাই',
  'আগস্ট',
  'সেপ্টেম্বর',
  'অক্টোবর',
  'নভেম্বর',
  'ডিসেম্বর',
];

export function getBanglaPeriodName(year: number, month: number): string {
  const monthName = BANGLA_MONTHS[month - 1] || `${month}ম মাস`;
  return `${monthName} ${year}`;
}

export function getDaysRemainingInPeriod(year: number, month: number): number {
  const now = new Date();
  const lastDay = new Date(year, month, 0); // Last day of that month
  const diffMs = lastDay.getTime() - now.getTime();
  return Math.max(0, Math.ceil(diffMs / (1000 * 60 * 60 * 24)));
}

export function formatTimeAgo(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));

  if (diffMinutes < 60) {
    return diffMinutes <= 1 ? 'এইমাত্র' : `${diffMinutes} মিনিট আগে`;
  }

  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) {
    return `${diffHours} ঘণ্টা আগে`;
  }

  const diffDays = Math.floor(diffHours / 24);
  if (diffDays === 1) return 'গতকাল';
  if (diffDays < 7) return `${diffDays} দিন আগে`;

  return date.toLocaleDateString('bn-BD', { day: 'numeric', month: 'short' });
}
