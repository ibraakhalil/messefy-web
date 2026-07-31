import { useWorkspace } from '@/providers/workspace-provider';
import api from '@/utils/axios';
import { useState } from 'react';
import toast from 'react-hot-toast';
import Button from '../ui/button';
import { useResponsiveDialog } from '../ui/responsive-dialog';

type GeneratedCredentials = {
  email: string;
  password: string;
};

type AddMemberResponse = {
  generatedCredentials: GeneratedCredentials | null;
};

export default function AddMemberForm({ onSuccess }: { onSuccess: () => void }) {
  const [memberType, setMemberType] = useState<'online' | 'offline'>('online');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [generatedCredentials, setGeneratedCredentials] = useState<GeneratedCredentials | null>(null);
  const member = useWorkspace((state) => state.member);
  const workspace = member?.workspace;
  const { close } = useResponsiveDialog();

  const resetForm = () => {
    setEmail('');
    setName('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!workspace?.id) {
      toast.error('Workspace not found');
      return;
    }

    setIsSubmitting(true);
    setGeneratedCredentials(null);

    try {
      const payload =
        memberType === 'offline'
          ? { type: 'offline', name }
          : { type: 'online', email: email.trim().toLowerCase() };

      const { data } = await api.post<AddMemberResponse>(`/members/${workspace.id}`, payload);

      toast.success(memberType === 'offline' ? 'Offline member created' : 'Member added successfully');
      onSuccess();

      if (data.generatedCredentials) {
        setGeneratedCredentials(data.generatedCredentials);
        resetForm();
        return;
      }

      close();
    } catch (err: unknown) {
      const response = (err as { response?: { data?: { error?: string } } }).response;
      const errorMessage = response?.data?.error || 'Failed to add member';

      toast.error(errorMessage);
      console.log(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <p className="text-lg font-semibold text-gray-900 dark:text-white">Add member</p>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Invite an existing user by email, or create an offline member with generated credentials.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-2 rounded-lg bg-gray-100 p-1 dark:bg-gray-800">
        <button
          type="button"
          onClick={() => {
            setMemberType('online');
            setGeneratedCredentials(null);
          }}
          className={`rounded-md px-3 py-2 text-sm font-medium transition ${
            memberType === 'online'
              ? 'bg-white text-gray-900 shadow-sm dark:bg-gray-700 dark:text-white'
              : 'text-gray-600 dark:text-gray-300'
          }`}
        >
          Online member
        </button>
        <button
          type="button"
          onClick={() => {
            setMemberType('offline');
            setGeneratedCredentials(null);
          }}
          className={`rounded-md px-3 py-2 text-sm font-medium transition ${
            memberType === 'offline'
              ? 'bg-white text-gray-900 shadow-sm dark:bg-gray-700 dark:text-white'
              : 'text-gray-600 dark:text-gray-300'
          }`}
        >
          Offline member
        </button>
      </div>

      {memberType === 'online' ? (
        <div>
          <label className="mb-1 block text-sm font-medium">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded border px-3 py-2"
            placeholder="member@example.com"
            required
          />
        </div>
      ) : (
        <div>
          <label className="mb-1 block text-sm font-medium">Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded border px-3 py-2"
            placeholder="Ismail"
            required
          />
        </div>
      )}

      {generatedCredentials && (
        <div className="space-y-2 rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-sm dark:border-emerald-900 dark:bg-emerald-950/30">
          <p className="font-medium text-emerald-900 dark:text-emerald-200">
            Offline member credentials
          </p>
          <p className="text-emerald-800 dark:text-emerald-300">
            Email: <span className="font-semibold">{generatedCredentials.email}</span>
          </p>
          <p className="text-emerald-800 dark:text-emerald-300">
            Password: <span className="font-semibold">{generatedCredentials.password}</span>
          </p>
        </div>
      )}

      <div>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          {memberType === 'offline'
            ? 'Offline members get an auto-generated @mess.com email and default password 12345678.'
            : 'Online members must already have an account in the system.'}
        </p>
      </div>

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={() => close()}>
          Close
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting
            ? 'Saving...'
            : memberType === 'offline'
              ? 'Create Offline Member'
              : 'Add Member'}
        </Button>
      </div>
    </form>
  );
}
