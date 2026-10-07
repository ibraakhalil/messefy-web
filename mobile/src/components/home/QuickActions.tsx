import React from 'react';
import { Utensils, DollarSign, ReceiptText, Users } from 'lucide-react';

interface QuickActionsProps {
  onActionClick: (action: string) => void;
}

export const QuickActions: React.FC<QuickActionsProps> = ({ onActionClick }) => {
  const actions = [
    {
      id: 'meal-entry',
      label: 'মিল এন্ট্রি',
      desc: 'দৈনিক মিল সংখ্যা',
      icon: Utensils,
      bg: 'bg-orange-500/10 text-orange-600 dark:text-orange-400',
      border: 'border-orange-500/20',
    },
    {
      id: 'deposit',
      label: 'টাকা জমা',
      desc: 'ডিপোজিট এন্ট্রি',
      icon: DollarSign,
      bg: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
      border: 'border-emerald-500/20',
    },
    {
      id: 'expense',
      label: 'বাজার খরচ',
      desc: 'খরচের হিসাব',
      icon: ReceiptText,
      bg: 'bg-rose-500/10 text-rose-600 dark:text-rose-400',
      border: 'border-rose-500/20',
    },
    {
      id: 'members',
      label: 'সদস্য তালিকা',
      desc: 'ব্যালেন্স ও ডিউ',
      icon: Users,
      bg: 'bg-blue-500/10 text-blue-600 dark:text-blue-400',
      border: 'border-blue-500/20',
    },
  ];

  return (
    <div className="space-y-2">
      <h2 className="text-xs font-semibold text-subtitle-color uppercase tracking-wider px-1">
        কুইক অ্যাকশন
      </h2>
      <div className="grid grid-cols-4 gap-2">
        {actions.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => onActionClick(item.id)}
              className="group flex flex-col items-center rounded-xl border border-border-color bg-card-bg p-2.5 text-center shadow-2xs transition active:scale-95 hover:bg-secondary-bg"
            >
              <div
                className={`flex size-10 items-center justify-center rounded-xl ${item.bg} transition group-hover:scale-105`}
              >
                <Icon className="size-5" />
              </div>
              <span className="mt-1.5 text-xs font-semibold text-pure-color leading-tight">
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
