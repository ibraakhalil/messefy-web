import Button from '../ui/button';
import FormInput from '../ui/form-input';
import { useState } from 'react';
import { ResponsiveDialog, useResponsiveDialog } from '../ui/responsive-dialog';

interface DeleteModalProps {
  title?: string;
  subtitle?: string;
  onDelete: () => void;
}

export function DeleteModal({ title, subtitle, onDelete }: DeleteModalProps) {
  const [confirmationText, setConfirmationText] = useState('');
  const { close } = useResponsiveDialog();

  return (
    <div>
      <div className="mb-4 space-y-1.5">
        <h2 className="text-xl font-semibold text-red-600">{title || 'Warning!'}</h2>
        <p>{subtitle || 'Are you sure you want to Delete This?'}</p>
      </div>

      <div className="py-4">
        <FormInput
          id="confirmation"
          label="Type 'Yes' to confirm"
          placeholder="Type to confirm..."
          value={confirmationText}
          onChange={(e) => setConfirmationText(e.target.value)}
          className="w-full"
        />
      </div>

      <div className="flex justify-end gap-2">
        <ResponsiveDialog.Close>
          <Button variant="secondary">Cancel</Button>
        </ResponsiveDialog.Close>
        <Button
          variant="primary"
          onClick={() => {
            onDelete();
            close();
          }}
          disabled={confirmationText !== 'Yes'}
          className="bg-red-600 text-white hover:bg-red-700"
        >
          Submit
        </Button>
      </div>
    </div>
  );
}
