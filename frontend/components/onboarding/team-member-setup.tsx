import { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import FormInput from '../ui/form-input';
import FormSelect from '../ui/form-select';
import Button from '../ui/button';
import { Plus, X, Mail, AlertCircle, Check } from 'lucide-react';

const roleOptions = [
  { value: 'Owner', label: 'Owner' },
  { value: 'Manager', label: 'Manager' },
  { value: 'Member', label: 'Member' },
  { value: 'Viewer', label: 'Viewer' },
];

export const TeamMemberSetup = () => {
  const { setValue, watch } = useFormContext();
  const onlineMembers = watch('onlineMembers') || [];

  const [newOnlineMember, setNewOnlineMember] = useState({ email: '', role: 'Member' });
  const [emailError, setEmailError] = useState('');

  // Validate email format
  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  // Add online member
  const addOnlineMember = () => {
    if (!newOnlineMember.email) {
      setEmailError('Email is required');
      return;
    }

    if (!validateEmail(newOnlineMember.email)) {
      setEmailError('Invalid email format');
      return;
    }

    // Check if email already exists
    if (onlineMembers.some((member: { email: string }) => member.email === newOnlineMember.email)) {
      setEmailError('This email has already been added');
      return;
    }

    setEmailError('');
    setValue('onlineMembers', [...onlineMembers, { ...newOnlineMember, status: 'Pending' }]);
    setNewOnlineMember({ email: '', role: 'Member' });
  };

  // Remove online member
  const removeOnlineMember = (index: number) => {
    const updatedMembers = [...onlineMembers];
    updatedMembers.splice(index, 1);
    setValue('onlineMembers', updatedMembers);
  };

  // Send invitation
  const sendInvitation = (index: number) => {
    const updatedMembers = [...onlineMembers];
    updatedMembers[index] = { ...updatedMembers[index], status: 'Sent' };
    setValue('onlineMembers', updatedMembers);
  };

  return (
    <div className="space-y-8">
      {/* Online Members Section */}
      <div>
        <h3 className="mb-4 text-lg font-medium text-gray-900">Invite Team Members</h3>

        <div className="mb-6 rounded-md bg-blue-50 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <AlertCircle className="h-5 w-5 text-blue-400" aria-hidden="true" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-blue-700">
                Team members will receive an email invitation to join your workspace.
              </p>
            </div>
          </div>
        </div>

        <div className="mb-4 flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4">
          <div className="flex-grow">
            <FormInput
              id="newMemberEmail"
              placeholder="Email address"
              value={newOnlineMember.email}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setNewOnlineMember({ ...newOnlineMember, email: e.target.value });
                setEmailError('');
              }}
              error={emailError}
              icon={<Mail className="h-5 w-5 text-gray-400" />}
            />
          </div>

          <div className="w-full sm:w-40">
            <FormSelect
              id="newMemberRole"
              options={roleOptions}
              value={newOnlineMember.role}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                setNewOnlineMember({ ...newOnlineMember, role: e.target.value });
              }}
            />
          </div>

          <div className="flex-shrink-0">
            <Button
              onClick={addOnlineMember}
              className="w-full sm:w-auto"
              aria-label="Add team member"
            >
              <Plus className="mr-1 h-4 w-4" />
              Add
            </Button>
          </div>
        </div>

        {/* Online Members List */}
        {onlineMembers.length > 0 && (
          <div className="mt-4 rounded-md border border-gray-200">
            <ul className="divide-y divide-gray-200">
              {onlineMembers.map(
                (member: { email: string; role: string; status: string }, index: number) => (
                  <li key={index} className="flex items-center justify-between p-4">
                    <div className="flex items-center">
                      <Mail className="mr-3 h-5 w-5 text-gray-400" />
                      <div>
                        <p className="font-medium text-gray-900">{member.email}</p>
                        <p className="text-sm text-gray-500">{member.role}</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      {member.status === 'Pending' ? (
                        <button
                          type="button"
                          onClick={() => sendInvitation(index)}
                          className="rounded-md bg-emerald-50 px-2 py-1 text-xs font-medium text-emerald-700 hover:bg-emerald-100"
                        >
                          Send Invitation
                        </button>
                      ) : (
                        <span className="flex items-center rounded-md bg-emerald-50 px-2 py-1 text-xs font-medium text-emerald-700">
                          <Check className="mr-1 h-3 w-3" />
                          Invitation Sent
                        </span>
                      )}

                      <button
                        type="button"
                        onClick={() => removeOnlineMember(index)}
                        className="rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-500"
                      >
                        <span className="sr-only">Remove</span>
                        <X className="h-5 w-5" />
                      </button>
                    </div>
                  </li>
                ),
              )}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};
