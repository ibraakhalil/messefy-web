import { auth } from '@/config/auth';
import PageWrapper from '@/components/common/page-wrapper';
import { ProfileContents } from '@/components/profile/profile-contents';
import Image from 'next/image';
import { getValidWorkspaceMember } from '@/lib/workspace-requests';
import ProfileHeader from '@/components/common/profile-header';
import JoinOrCreateMess from '@/components/profile/join-create-mess';

export default async function ProfilePage() {
  const session = await auth();
  const user = session?.user;
  const member = await getValidWorkspaceMember();
  const userData = { user, workspace: member?.workspace };

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
        <JoinOrCreateMess workspace={userData.workspace} />
      </div>
      <ProfileContents userData={userData} />
    </PageWrapper>
  );
}
