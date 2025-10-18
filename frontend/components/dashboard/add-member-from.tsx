import { useWorkspace } from '@/providers/workspace-provider';
import api from '@/utils/axios';
import { useState } from 'react';
import toast from 'react-hot-toast';
import Button from '../ui/button';
import { useResponsiveDialog } from '../ui/responsive-dialog';

export default function AddMemberForm({ onSuccess }: { onSuccess: (email: string) => void }) {
  const [email, setEmail] = useState('');
  const { workspace } = useWorkspace();
  const { close } = useResponsiveDialog();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    api
      .get(`/members/${workspace?.id}/${email}`)
      .then(() => {
        toast.success('Member added successfully');
        close();
        onSuccess(email);
      })
      .catch((err) => {
        toast.error(err.response.data.error);
        console.log(err.response.data);
      });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="mb-1 block text-sm font-medium">Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full rounded border px-3 py-2"
          required
        />
      </div>
      <Button type="submit">Add Member</Button>
    </form>
  );
}
