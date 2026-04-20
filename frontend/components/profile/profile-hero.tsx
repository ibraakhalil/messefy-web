'use client';

import { getCurrentUser } from '@/lib/user-requests';
import { Workspace } from '@/types/workspace';
import { useQuery } from '@tanstack/react-query';
import Image from 'next/image';
import JoinOrCreateMess from './join-create-mess';

interface ProfileHeroProps {
  fallbackUser: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
  workspace?: Workspace;
}

export default function ProfileHero({ fallbackUser, workspace }: ProfileHeroProps) {
  const { data: user } = useQuery({
    queryKey: ['current-user'],
    queryFn: getCurrentUser,
    staleTime: 60_000,
  });

  const displayName = user?.name || fallbackUser.name || 'User';
  const displayEmail = user?.email || fallbackUser.email || '';
  const displayImage = user?.image || fallbackUser.image || '/images/avatar.png';

  return (
    <div className="flex items-center justify-between py-8">
      <div className="flex items-center gap-6">
        <div className="relative">
          <Image
            src={displayImage}
            alt="Profile avatar"
            className="h-20 w-20 rounded-full object-cover"
            width={100}
            height={100}
          />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-gray-900">{displayName}</h2>
          <p className="text-gray-600">{displayEmail}</p>
        </div>
      </div>
      <JoinOrCreateMess workspace={workspace} />
    </div>
  );
}
