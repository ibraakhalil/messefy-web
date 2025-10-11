'use client';

import { Links } from '../links';
import { AlertCircle, Plus, Search, Send, UserPlus } from 'lucide-react';
import { ResponsiveDialog } from '@/components/ui/responsive-dialog';
import Button from '../ui/button';
import { Workspace } from '@/types/workspace';
import { useState } from 'react';
import z from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import FormInput from '../ui/form-input';

const joinRequestSchema = z.object({
  messCode: z.string().min(1, 'Mess code is required'),
  message: z.string().max(200, 'Message cannot exceed 200 characters').optional(),
});

interface JoinOrCreateMessProps {
  workspace?: Workspace;
}

type JoinRequestFormValues = z.infer<typeof joinRequestSchema>;

export default function JoinOrCreateMess({ workspace }: JoinOrCreateMessProps) {
  const [isSubmittingRequest, setIsSubmittingRequest] = useState(false);

  const joinForm = useForm<JoinRequestFormValues>({
    resolver: zodResolver(joinRequestSchema),
    defaultValues: {
      messCode: '',
      message: '',
    },
  });

  const onSubmitJoinRequest = async (data: JoinRequestFormValues) => {
    setIsSubmittingRequest(true);
    try {
      console.log('Join request submitted:', data);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      joinForm.reset();
      // Success notification would go here
    } catch (error) {
      console.error('Join request failed:', error);
    } finally {
      setIsSubmittingRequest(false);
    }
  };

  return workspace ? (
    <Links.Mess>
      <Button variant="secondary" className="flex items-center gap-2">
        <div className="text-gray-600">{workspace?.name}</div>
      </Button>
    </Links.Mess>
  ) : (
    <div className="flex items-center gap-3">
      <Links.CreateMess>
        <Button variant="secondary" className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Create Mess
        </Button>
      </Links.CreateMess>
      <span> Or</span>

      <ResponsiveDialog>
        <ResponsiveDialog.Trigger>
          <Button className="flex items-center gap-2">
            <UserPlus className="h-4 w-4" />
            Join Mess
          </Button>
        </ResponsiveDialog.Trigger>
        <ResponsiveDialog.Content>
          <div className="space-y-6">
            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
              <h3 className="mb-4 text-lg font-medium text-gray-900">Join a New Mess</h3>
              <form onSubmit={joinForm.handleSubmit(onSubmitJoinRequest)} className="space-y-4">
                <FormInput
                  id="messCode"
                  label="Mess Code"
                  placeholder="Enter mess code (e.g., OFF-2024-001)"
                  icon={<Search className="h-5 w-5 text-gray-400" />}
                  error={joinForm.formState.errors.messCode?.message}
                  {...joinForm.register('messCode')}
                />

                <div>
                  <label htmlFor="message" className="mb-2 block text-sm font-medium text-gray-700">
                    Message (Optional)
                  </label>
                  <textarea
                    id="message"
                    rows={3}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
                    placeholder="Introduce yourself to the mess administrators..."
                    {...joinForm.register('message')}
                  />
                  {joinForm.formState.errors.message && (
                    <p className="mt-1 text-sm text-red-600">
                      {joinForm.formState.errors.message.message}
                    </p>
                  )}
                </div>

                <Button
                  type="submit"
                  className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white hover:from-emerald-700 hover:to-teal-700"
                  disabled={isSubmittingRequest}
                >
                  {isSubmittingRequest ? (
                    <>
                      <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      Sending Request...
                    </>
                  ) : (
                    <>
                      <Send className="mr-2 h-4 w-4" />
                      Send Join Request
                    </>
                  )}
                </Button>
              </form>
            </div>

            {/* Information Card */}
            <div className="rounded-xl border border-blue-200 bg-blue-50 p-6">
              <div className="flex">
                <AlertCircle className="mt-0.5 h-5 w-5 text-blue-400" />
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-blue-800">How to Join a Mess</h3>
                  <div className="mt-2 text-sm text-blue-700">
                    <ul className="list-inside list-disc space-y-1">
                      <li>Get the mess code from an existing member or administrator</li>
                      <li>Enter the code and optionally include a message</li>
                      <li>Wait for approval from the mess administrators</li>
                      <li>You'll receive a notification once approved</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </ResponsiveDialog.Content>
      </ResponsiveDialog>
    </div>
  );
}
