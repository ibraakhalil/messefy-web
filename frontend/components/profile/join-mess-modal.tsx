/* eslint-disable @typescript-eslint/no-unused-expressions */
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
import { useResponsiveDialog } from '../ui/responsive-dialog';
import { useMutation, useQueryClient } from '@tanstack/react-query';

const formSchema = z.object({
  workspaceId: z.string().min(1, 'Mess code is required'),
  message: z.string().max(200).optional(),
});

type FormValues = z.infer<typeof formSchema>;

export default function JoinMessModal() {
  const [workspace, setWorkspace] = useState<Workspace | null>(null);
  const { close } = useResponsiveDialog();
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
  });

  const searchMutation = useMutation({
    mutationFn: (id: string) => api.get<Workspace>(`/workspaces/${id}`),
    onSuccess: ({ data }) => {
      setWorkspace(data);
      toast.success('Workspace found!');
    },
    onError: () => toast.error('Workspace not found'),
  });

  const joinMutation = useMutation({
    mutationFn: (data: { workspaceId: string; message?: string }) =>
      api.post('/workspaces/invitation', data),
    onSuccess: () => {
      toast.success('Join request sent!');
      queryClient.invalidateQueries({ queryKey: ['invitation'] });
      reset();
      setWorkspace(null);
      close();
    },
    onError: () => toast.error('Failed to send request'),
  });

  const onSubmit = (data: FormValues) => {
    workspace
      ? joinMutation.mutate({ workspaceId: workspace.id, message: data.message })
      : searchMutation.mutate(data.workspaceId);
  };

  const isLoading = searchMutation.isPending || joinMutation.isPending;

  return (
    <div>
      <h3 className="mb-4 text-lg font-medium text-gray-900">Join a New Mess</h3>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {!workspace ? (
          <>
            <label className="block text-sm font-medium text-gray-700">
              Search by Slug or Mess Code
            </label>
            <div className="flex gap-2">
              <FormInput
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
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Message (Optional)
              </label>
              <textarea
                rows={3}
                placeholder="Introduce yourself..."
                className="border-border-color bg-card-bg block w-full rounded-md border p-2"
                {...register('message')}
              />
              {errors.message && (
                <p className="mt-1 text-sm text-red-600">{errors.message.message}</p>
              )}
            </div>
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 size-4 animate-spin" /> Sending...
                </>
              ) : (
                <>
                  <SendIcon className="mr-2 size-4" /> Send Join Request
                </>
              )}
            </Button>
          </div>
        )}
      </form>
    </div>
  );
}
