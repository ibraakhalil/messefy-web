'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { LogOut } from 'lucide-react';
import Button from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import FormInput from '@/components/ui/form-input';
import { leaveWorkspace } from '@/lib/workspace-requests';
import toast from 'react-hot-toast';

interface LeaveWorkspaceButtonProps {
  workspaceId: string;
  workspaceName: string;
  onSuccess?: () => void;
}

export default function LeaveWorkspaceButton({
  workspaceId,
  workspaceName,
  onSuccess,
}: LeaveWorkspaceButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [confirmationText, setConfirmationText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLeaveWorkspace = async () => {
    if (confirmationText.toLowerCase() !== 'leave') {
      toast.error('Please type "leave" to confirm');
      return;
    }

    setIsLoading(true);
    try {
      await leaveWorkspace(workspaceId);
      toast.success('Successfully left the workspace');
      setIsOpen(false);

      // Call onSuccess callback if provided
      if (onSuccess) {
        onSuccess();
      } else {
        // Default behavior: redirect to home or workspace selection
        router.push('/');
        router.refresh();
      }
    } catch (error) {
      toast.error('Failed to leave workspace');
      console.error('Error leaving workspace:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      setConfirmationText('');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button
          variant="secondary"
          className="border-red-200 text-red-600 hover:border-red-300 hover:bg-red-50"
          leftIcon={LogOut}
        >
          Leave Workspace
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-red-600">Leave Workspace</DialogTitle>
          <DialogDescription>
            Are you sure you want to leave "{workspaceName}"? This action cannot be undone.
            <br />
            <br />
            Type <span className="font-semibold text-red-600">leave</span> to confirm.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <FormInput
            id="confirmation"
            placeholder="Type 'leave' to confirm"
            value={confirmationText}
            onChange={(e) => setConfirmationText(e.target.value)}
            className="w-full"
          />
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="secondary" onClick={() => setIsOpen(false)} disabled={isLoading}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleLeaveWorkspace}
            isLoading={isLoading}
            disabled={confirmationText.toLowerCase() !== 'leave' || isLoading}
            className="bg-red-600 text-white hover:bg-red-700"
          >
            Leave Workspace
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
