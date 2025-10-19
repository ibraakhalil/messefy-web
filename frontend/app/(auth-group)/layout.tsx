import { WorkspaceMemberProvider } from '@/providers/workspace-provider';
import { getValidWorkspaceMember } from '@/lib/workspace-requests';

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const member = await getValidWorkspaceMember();

  return <WorkspaceMemberProvider member={member ?? null}>{children}</WorkspaceMemberProvider>;
}
