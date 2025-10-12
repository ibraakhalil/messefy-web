import { Workspace } from '@/types/workspace';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import z from 'zod';
import FormInput from '../ui/form-input';
import { Search, SendIcon, Loader2 } from 'lucide-react';
import Button from '../ui/button';
import api from '@/utils/axios';
import { toast } from 'react-hot-toast';

const formSchema = z.object({
  workspaceId: z.string().min(1, 'Mess code is required'),
  message: z.string().max(200, 'Message cannot exceed 200 characters').optional(),
});

type FormValues = z.infer<typeof formSchema>;

export default function JoinMessModal() {
  const [workspace, setWorkspace] = useState<Workspace | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { workspaceId: '', message: '' },
  });

  const searchWorkspace = async (workspaceId: string) => {
    setIsLoading(true);
    try {
      const { data } = await api.get<Workspace>(`/workspaces/${workspaceId}`);
      setWorkspace(data);
      toast.success('Workspace found!');
    } catch {
      toast.error('Workspace not found');
      setWorkspace(null);
    } finally {
      setIsLoading(false);
    }
  };

  const sendJoinRequest = async (message?: string) => {
    setIsLoading(true);
    try {
      await api.post('/workspaces/invitation', {
        workspaceId: workspace!.id,
        message,
      });
      toast.success('Join request sent successfully!');
      reset();
      setWorkspace(null);
    } catch {
      toast.error('Failed to send request');
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = async (data: FormValues) => {
    if (workspace) {
      await sendJoinRequest(data.message);
    } else {
      await searchWorkspace(data.workspaceId);
    }
  };

  const renderError = (message?: string) =>
    message && <p className="mt-1 text-sm text-red-600">{message}</p>;

  const Label = ({ htmlFor, children }: { htmlFor: string; children: React.ReactNode }) => (
    <label htmlFor={htmlFor} className="mb-2 block text-sm font-medium text-gray-700">
      {children}
    </label>
  );

  return (
    <div>
      <h3 className="mb-4 text-lg font-medium text-gray-900">Join a New Mess</h3>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {!workspace ? (
          <>
            <Label htmlFor="workspaceId">Search by Slug or Mess Code</Label>
            <div className="flex gap-2">
              <FormInput
                id="workspaceId"
                placeholder="Enter mess code (e.g., OFF-2024-001)"
                icon={<Search className="size-5 text-gray-400" />}
                error={errors.workspaceId?.message}
                {...register('workspaceId')}
              />
              <Button type="submit" disabled={isLoading} className="h-11 px-6">
                {isLoading ? (
                  <Loader2 className="size-5 animate-spin" />
                ) : (
                  <Search className="size-5" />
                )}
              </Button>
            </div>
          </>
        ) : (
          <div className="space-y-4 rounded-lg border border-emerald-200 bg-emerald-50 p-4">
            <div>
              <h4 className="text-lg font-medium text-green-700">{workspace.name}</h4>
              <p className="text-subtitle-color text-sm">{workspace.description}</p>
            </div>

            <div>
              <Label htmlFor="message">Message (Optional)</Label>
              <textarea
                id="message"
                rows={3}
                placeholder="Introduce yourself..."
                className="border-border-color bg-card-bg block w-full rounded-md border p-2"
                {...register('message')}
              />
              {renderError(errors.message?.message)}
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700"
            >
              {isLoading ? (
                <Loader2 className="mr-2 size-4 animate-spin" />
              ) : (
                <SendIcon className="mr-2 size-4" />
              )}
              {isLoading ? 'Sending...' : 'Send Join Request'}
            </Button>
          </div>
        )}
      </form>
    </div>
  );
}
