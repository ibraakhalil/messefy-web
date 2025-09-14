'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Plus, Building, Users, Briefcase, X, ChevronDown, Check } from 'lucide-react'
import FormInput from '@/components/ui/form-input'
import Button from '@/components/ui/button'

// Define the schema for workspace creation form
const workspaceSchema = z.object({
  name: z
    .string()
    .min(1, 'Workspace name is required')
    .max(50, 'Workspace name cannot exceed 50 characters'),
  description: z.string().max(200, 'Description cannot exceed 200 characters').optional(),
})

type WorkspaceFormValues = z.infer<typeof workspaceSchema>

interface WorkspacesSectionProps {
  isLoading?: boolean
}

// Sample workspaces data
const workspaces = [
  {
    id: 'ws-1',
    name: 'Personal Workspace',
    description: 'Your personal workspace',
    members: 1,
    isOwner: true,
    isActive: true,
  },
  {
    id: 'ws-2',
    name: 'Design Team',
    description: 'Collaborative workspace for design projects',
    members: 8,
    isOwner: true,
    isActive: false,
  },
  {
    id: 'ws-3',
    name: 'Marketing',
    description: 'Marketing team workspace',
    members: 12,
    isOwner: false,
    isActive: false,
  },
]

export default function WorkspacesSection({ isLoading = false }: WorkspacesSectionProps) {
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [isCreatingWorkspace, setIsCreatingWorkspace] = useState(false)
  const [showLeaveConfirmation, setShowLeaveConfirmation] = useState(false)
  const [isLeavingWorkspace, setIsLeavingWorkspace] = useState(false)
  const [isChangingWorkspace, setIsChangingWorkspace] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<WorkspaceFormValues>({
    resolver: zodResolver(workspaceSchema),
    defaultValues: {
      name: '',
      description: '',
    },
  })

  const onSubmitWorkspace = async (data: WorkspaceFormValues) => {
    setIsCreatingWorkspace(true)
    try {
      // Simulate API call
      console.log('Workspace form submitted:', data)
      await new Promise((resolve) => setTimeout(resolve, 1000))
      reset()
      setShowCreateModal(false)
      // Success notification would go here
    } catch (error) {
      console.error('Workspace creation failed:', error)
      // Error notification would go here
    } finally {
      setIsCreatingWorkspace(false)
    }
  }

  const handleLeaveWorkspace = async () => {
    setShowLeaveConfirmation(true)
  }

  const confirmLeaveWorkspace = async () => {
    setIsLeavingWorkspace(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))
      setShowLeaveConfirmation(false)
      // Success notification would go here
    } catch (error) {
      console.error('Leave workspace failed:', error)
      // Error notification would go here
    } finally {
      setIsLeavingWorkspace(false)
    }
  }

  const handleSwitchWorkspace = async () => {
    setIsChangingWorkspace(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))
      setDropdownOpen(false)
      // Success notification would go here
    } catch (error) {
      console.error('Switch workspace failed:', error)
      // Error notification would go here
    } finally {
      setIsChangingWorkspace(false)
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div className="h-8 w-48 animate-pulse rounded-md bg-gray-200"></div>
          <div className="h-10 w-32 animate-pulse rounded-md bg-gray-200"></div>
        </div>

        <div className="space-y-4">
          <div className="h-24 animate-pulse rounded-md bg-gray-200"></div>
          <div className="h-24 animate-pulse rounded-md bg-gray-200"></div>
          <div className="h-24 animate-pulse rounded-md bg-gray-200"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Workspace Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">Your Workspaces</h2>
        <Button
          className="flex items-center space-x-2 bg-gradient-to-r from-emerald-600 to-teal-600 text-white hover:from-emerald-700 hover:to-teal-700"
          onClick={() => setShowCreateModal(true)}
        >
          <Plus className="h-4 w-4" />
          <span>New Workspace</span>
        </Button>
      </div>

      {/* Workspace Switcher */}
      <div className="relative">
        <div className="mb-4">
          <label className="mb-2 block text-sm font-medium text-gray-700">Active Workspace</label>
          <div className="relative">
            <button
              type="button"
              className="flex w-full items-center justify-between rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-left text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              onClick={() => setDropdownOpen(!dropdownOpen)}
              aria-haspopup="listbox"
              aria-expanded={dropdownOpen}
              disabled={isChangingWorkspace}
            >
              <div className="flex items-center">
                <Building className="mr-2 h-5 w-5 text-gray-400" />
                <span>{workspaces.find((w) => w.isActive)?.name || 'Select Workspace'}</span>
              </div>
              <ChevronDown
                className={`h-5 w-5 text-gray-400 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`}
              />
            </button>

            {dropdownOpen && (
              <div className="absolute z-10 mt-1 w-full rounded-md bg-white shadow-lg">
                <ul
                  className="ring-opacity-5 max-h-60 overflow-auto rounded-md py-1 text-base ring-1 ring-black focus:outline-none"
                  tabIndex={-1}
                  role="listbox"
                >
                  {workspaces.map((workspace) => (
                    <li
                      key={workspace.id}
                      className={`relative cursor-pointer py-2 pr-9 pl-3 select-none hover:bg-gray-100 ${workspace.isActive ? 'bg-emerald-50' : ''}`}
                      role="option"
                      aria-selected={workspace.isActive}
                      onClick={() => !workspace.isActive && handleSwitchWorkspace()}
                    >
                      <div className="flex items-center">
                        <Building className="mr-2 h-5 w-5 text-gray-400" />
                        <span
                          className={`block truncate ${workspace.isActive ? 'font-medium text-emerald-600' : 'font-normal'}`}
                        >
                          {workspace.name}
                        </span>
                      </div>

                      {workspace.isActive && (
                        <span className="absolute inset-y-0 right-0 flex items-center pr-4 text-emerald-600">
                          <Check className="h-5 w-5" aria-hidden="true" />
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Workspaces List */}
      <div className="space-y-4">
        {workspaces.map((workspace) => (
          <div
            key={workspace.id}
            className="laptop:flex-row laptop:items-center laptop:justify-between flex flex-col rounded-lg border border-gray-200 bg-white p-4 shadow-sm"
          >
            <div className="laptop:mb-0 mb-4">
              <div className="flex items-center">
                <h3 className="text-lg font-medium text-gray-900">
                  {workspace.name}
                  {workspace.isActive && (
                    <span className="ml-2 rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-800">
                      Active
                    </span>
                  )}
                </h3>
              </div>
              <p className="mt-1 text-sm text-gray-500">{workspace.description}</p>
              <div className="mt-2 flex items-center text-sm text-gray-500">
                <Users className="mr-1 h-4 w-4" />
                <span>
                  {workspace.members} {workspace.members === 1 ? 'member' : 'members'}
                </span>
                {workspace.isOwner && (
                  <span className="ml-2 rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-800">
                    Owner
                  </span>
                )}
              </div>
            </div>
            <div className="laptop:flex-row laptop:space-y-0 laptop:space-x-2 flex flex-col space-y-2">
              {!workspace.isOwner && (
                <Button
                  variant="secondary"
                  className="border-red-300 text-red-600 hover:bg-red-50 hover:text-red-700"
                  onClick={() => handleLeaveWorkspace()}
                >
                  Leave
                </Button>
              )}
              {!workspace.isActive && (
                <Button
                  variant="secondary"
                  className="border-emerald-300 text-emerald-600 hover:bg-emerald-50 hover:text-emerald-700"
                  onClick={() => handleSwitchWorkspace()}
                  disabled={isChangingWorkspace}
                >
                  {isChangingWorkspace ? 'Switching...' : 'Switch to'}
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Create Workspace Modal */}
      {showCreateModal && (
        <div className="bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center bg-black">
          <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900">Create New Workspace</h3>
              <button
                type="button"
                className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 focus:outline-none"
                onClick={() => setShowCreateModal(false)}
              >
                <span className="sr-only">Close</span>
                <X className="h-6 w-6" aria-hidden="true" />
              </button>
            </div>
            <form onSubmit={handleSubmit(onSubmitWorkspace)} className="space-y-4">
              <FormInput
                id="name"
                type="text"
                label="Workspace Name"
                placeholder="Enter workspace name"
                icon={<Briefcase className="h-5 w-5 text-gray-400" />}
                error={errors.name?.message}
                {...register('name')}
              />
              <div>
                <label
                  htmlFor="description"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Description (Optional)
                </label>
                <div className="relative rounded-md shadow-sm">
                  <textarea
                    id="description"
                    rows={3}
                    className="block w-full rounded-md border-gray-300 text-sm shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
                    placeholder="Brief description of this workspace"
                    {...register('description')}
                  />
                </div>
                {errors.description && (
                  <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
                )}
              </div>
              <div className="mt-5 flex justify-end space-x-3">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => setShowCreateModal(false)}
                  disabled={isCreatingWorkspace}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white hover:from-emerald-700 hover:to-teal-700"
                  disabled={isCreatingWorkspace}
                >
                  {isCreatingWorkspace ? 'Creating...' : 'Create Workspace'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Leave Workspace Confirmation Dialog */}
      {showLeaveConfirmation && (
        <div className="bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center bg-black">
          <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
            <div className="mb-4 flex items-center justify-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
                <Users className="h-6 w-6 text-red-600" />
              </div>
            </div>
            <h3 className="mb-2 text-center text-lg font-medium text-gray-900">Leave Workspace?</h3>
            <p className="mb-6 text-center text-gray-600">
              Are you sure you want to leave this workspace? You'll lose access to all workspace
              data and will need an invitation to rejoin.
            </p>
            <div className="flex justify-center space-x-4">
              <Button
                variant="secondary"
                onClick={() => {
                  setShowLeaveConfirmation(false)
                }}
                disabled={isLeavingWorkspace}
              >
                Cancel
              </Button>
              <Button
                className="bg-red-600 text-white hover:bg-red-700"
                onClick={confirmLeaveWorkspace}
                disabled={isLeavingWorkspace}
              >
                {isLeavingWorkspace ? 'Leaving...' : 'Yes, Leave Workspace'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
