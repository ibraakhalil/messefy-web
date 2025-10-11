import { auth } from '@/config/auth';
import PageWrapper from '@/components/common/page-wrapper';
import { ProfileContents } from '@/components/profile/profile-contents';
import Button from '@/components/ui/button';
import { Plus, UserPlus } from 'lucide-react';
import Image from 'next/image';
import { getWorkspaceByUser } from '@/lib/workspace-requests';
import ProfileHeader from '@/components/common/app-header';
import { Links } from '@/components/links';

export default async function ProfilePage() {
  const session = await auth();
  const user = session?.user;
  const workspace = await getWorkspaceByUser();
  const userData = { user, workspace };

  return (
    <PageWrapper>
      <ProfileHeader userData={userData} />
      <div className="flex items-center justify-between py-8">
        <div className="flex items-center gap-6">
          <div className="relative">
            <Image
              src={user?.image || '/images/avatar.png'}
              alt="Profile avatar"
              className="h-20 w-20 rounded-full object-cover"
              width={100}
              height={100}
            />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">{user?.name}</h2>
            <p className="text-gray-600">{user?.email}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Links.CreateMess>
            <Button variant="secondary" className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Create Mess
            </Button>
          </Links.CreateMess>
          <span> Or</span>
          <Button className="flex items-center gap-2">
            <UserPlus className="h-4 w-4" />
            Join Mess
          </Button>
        </div>
      </div>
      <ProfileContents />
    </PageWrapper>
  );
}
