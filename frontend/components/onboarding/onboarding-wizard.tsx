import { useState } from 'react';
import { useForm, FormProvider, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Button from '../ui/button';
import FormInput from '../ui/form-input';
import { Info, Plus, X, Mail, Check } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

// Define the schema for the consolidated form
const onboardingSchema = z.object({
  name: z.string().min(1, 'Mess name is required'),
  description: z.string().optional(),
  onlineMembers: z
    .array(
      z.object({
        email: z.string().email('Invalid email address'),
        role: z.enum(['Owner', 'Manager', 'Member', 'Viewer']),
        status: z.enum(['Pending', 'Sent']).default('Pending'),
      }),
    )
    .default([]),
});

type OnboardingFormValues = z.infer<typeof onboardingSchema>;

const OnboardingWizard = () => {
  const [newMemberEmail, setNewMemberEmail] = useState('');
  const [newMemberRole, setNewMemberRole] = useState<string>('Member');
  const [emailError, setEmailError] = useState('');

  const methods = useForm<OnboardingFormValues>({
    resolver: zodResolver(onboardingSchema),
    defaultValues: {
      name: '',
      description: '',
      onlineMembers: [],
    },
    mode: 'onChange',
  });

  const {
    handleSubmit,
    register,
    formState: { errors },
    watch,
    control,
  } = methods;
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'onlineMembers',
  });

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const addMember = () => {
    if (!newMemberEmail) {
      setEmailError('Email is required');
      return;
    }

    if (!validateEmail(newMemberEmail)) {
      setEmailError('Invalid email format');
      return;
    }

    // Check if email already exists
    const members = watch('onlineMembers') || [];
    if (members.some((member) => member.email === newMemberEmail)) {
      setEmailError('This email has already been added');
      return;
    }

    setEmailError('');
    append({ email: newMemberEmail, role: newMemberRole as 'Member', status: 'Pending' });
    setNewMemberEmail('');
    setNewMemberRole('Member');
  };

  const onSubmit = (data: OnboardingFormValues) => {
    const messData = {
      ...data,
      subdomain: data.name.toLowerCase().replace(/\s+/g, '-'),
    };

    axios
      .post(`${process.env.NEXT_PUBLIC_API_URL}/workspaces/create`, messData)
      .then((response) => {
        toast.success('Workspace created successfully');
        console.log('Workspace created:', response.data);
      })
      .catch((error) => {
        console.error('Error creating workspace:', error);
      });
  };

  return (
    <div className="mx-auto max-w-3xl rounded-lg border border-gray-200 bg-white p-6 shadow-md">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Create Your Mess</h1>
        <p className="text-gray-600">Set up your Mess and add team members in one step</p>
      </div>

      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {/* Mess Section */}
          <div className="space-y-6">
            <div className="rounded-md bg-blue-50 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <Info className="h-5 w-5 text-blue-400" aria-hidden="true" />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-blue-800">Mess Setup</h3>
                  <div className="mt-2 text-sm text-blue-700">
                    <p>Let's set up your Mess with a name to get started.</p>
                  </div>
                </div>
              </div>
            </div>

            <FormInput
              id="name"
              label="Mess Name"
              placeholder="Enter Mess name"
              error={errors.name?.message as string}
              {...register('name')}
            />

            <FormInput
              id="description"
              label="Description"
              placeholder="Enter a brief description"
              error={errors.description?.message as string}
              {...register('description')}
              className="h-20"
            />
          </div>

          {/* Team Members Section */}
          <div className="space-y-6">
            <h3 className="text-lg font-medium text-gray-900">Add Team Members</h3>
            <p className="text-sm text-gray-500">Invite team members to collaborate in your Mess</p>

            {/* Add new member form */}
            <div className="space-y-4">
              <div className="flex gap-4">
                <FormInput
                  id="newMemberEmail"
                  placeholder="colleague@example.com"
                  value={newMemberEmail}
                  onChange={(e) => setNewMemberEmail(e.target.value)}
                  error={emailError}
                  className="flex-3"
                />

                <Button type="button" variant="primary" onClick={addMember} className="h-12 flex-1">
                  <Plus className="mr-1 size-4" />
                  Add
                </Button>
              </div>
            </div>

            {/* Team members list */}
            {fields.length > 0 ? (
              <div className="mt-4 rounded-md border border-gray-200">
                <ul className="divide-y divide-gray-200">
                  {fields.map((member, index) => (
                    <li key={member.id} className="flex items-center justify-between p-4">
                      <div className="flex items-center">
                        <Mail className="mr-3 h-5 w-5 text-gray-400" />
                        <div>
                          <p className="font-medium text-gray-900">{member.email}</p>
                          <p className="text-sm text-gray-500">{member.role}</p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <span className="mr-4 flex items-center text-sm text-green-600">
                          <Check className="mr-1 h-4 w-4" />
                          {member.status}
                        </span>
                        <button
                          type="button"
                          onClick={() => remove(index)}
                          className="text-gray-400 hover:text-red-500"
                        >
                          <X className="h-5 w-5" />
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <div className="mt-4 rounded-md border border-gray-200 bg-gray-50 p-6 text-center">
                <p className="text-gray-500">No team members added yet</p>
              </div>
            )}
          </div>

          <div className="pt-4">
            <Button variant="primary" type="submit" className="w-full">
              Complete Setup
            </Button>
          </div>
        </form>
      </FormProvider>
    </div>
  );
};

export default OnboardingWizard;
