import { useState } from 'react'
import { useFormContext } from 'react-hook-form'
import FormInput from '../ui/form-input'
import FormSelect from '../ui/form-select'
import Button from '../ui/button'
import { Plus, X, Mail, User, AlertCircle, Check } from 'lucide-react'

const roleOptions = [
  { value: 'Owner', label: 'Owner' },
  { value: 'Manager', label: 'Manager' },
  { value: 'Member', label: 'Member' },
  { value: 'Viewer', label: 'Viewer' },
]

const TeamMemberSetup = () => {
  const { setValue, watch } = useFormContext()
  const onlineMembers = watch('onlineMembers') || []
  const offlineMembers = watch('offlineMembers') || []

  const [newOnlineMember, setNewOnlineMember] = useState({ email: '', role: 'Member' })
  const [newOfflineMember, setNewOfflineMember] = useState({ name: '', role: 'Member' })
  const [emailError, setEmailError] = useState('')
  const [nameError, setNameError] = useState('')

  // Validate email format
  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return re.test(email)
  }

  // Add online member
  const addOnlineMember = () => {
    if (!newOnlineMember.email) {
      setEmailError('Email is required')
      return
    }

    if (!validateEmail(newOnlineMember.email)) {
      setEmailError('Invalid email format')
      return
    }

    // Check if email already exists
    if (onlineMembers.some((member: { email: string }) => member.email === newOnlineMember.email)) {
      setEmailError('This email has already been added')
      return
    }

    setEmailError('')
    setValue('onlineMembers', [...onlineMembers, { ...newOnlineMember, status: 'Pending' }])
    setNewOnlineMember({ email: '', role: 'Member' })
  }

  // Add offline member
  const addOfflineMember = () => {
    if (!newOfflineMember.name) {
      setNameError('Name is required')
      return
    }

    // Check if name already exists
    if (offlineMembers.some((member: { name: string }) => member.name === newOfflineMember.name)) {
      setNameError('This name has already been added')
      return
    }

    setNameError('')
    setValue('offlineMembers', [...offlineMembers, newOfflineMember])
    setNewOfflineMember({ name: '', role: 'Member' })
  }

  // Remove online member
  const removeOnlineMember = (index: number) => {
    const updatedMembers = [...onlineMembers]
    updatedMembers.splice(index, 1)
    setValue('onlineMembers', updatedMembers)
  }

  // Remove offline member
  const removeOfflineMember = (index: number) => {
    const updatedMembers = [...offlineMembers]
    updatedMembers.splice(index, 1)
    setValue('offlineMembers', updatedMembers)
  }

  // Send invitation
  const sendInvitation = (index: number) => {
    const updatedMembers = [...onlineMembers]
    updatedMembers[index] = { ...updatedMembers[index], status: 'Sent' }
    setValue('onlineMembers', updatedMembers)
  }

  return (
    <div className="space-y-8">
      {/* Online Members Section */}
      <div>
        <h3 className="mb-4 text-lg font-medium text-gray-900 dark:text-white">
          Invite Team Members
        </h3>

        <div className="mb-6 rounded-md bg-blue-50 p-4 dark:bg-blue-900/30">
          <div className="flex">
            <div className="flex-shrink-0">
              <AlertCircle className="h-5 w-5 text-blue-400" aria-hidden="true" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-blue-700 dark:text-blue-200">
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
                setNewOnlineMember({ ...newOnlineMember, email: e.target.value })
                setEmailError('')
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
                setNewOnlineMember({ ...newOnlineMember, role: e.target.value })
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
          <div className="mt-4 rounded-md border border-gray-200 dark:border-gray-700">
            <ul className="divide-y divide-gray-200 dark:divide-gray-700">
              {onlineMembers.map(
                (member: { email: string; role: string; status: string }, index: number) => (
                  <li key={index} className="flex items-center justify-between p-4">
                    <div className="flex items-center">
                      <Mail className="mr-3 h-5 w-5 text-gray-400" />
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">{member.email}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{member.role}</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      {member.status === 'Pending' ? (
                        <button
                          type="button"
                          onClick={() => sendInvitation(index)}
                          className="rounded-md bg-emerald-50 px-2 py-1 text-xs font-medium text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-300 dark:hover:bg-emerald-900/50"
                        >
                          Send Invitation
                        </button>
                      ) : (
                        <span className="flex items-center rounded-md bg-emerald-50 px-2 py-1 text-xs font-medium text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300">
                          <Check className="mr-1 h-3 w-3" />
                          Invitation Sent
                        </span>
                      )}

                      <button
                        type="button"
                        onClick={() => removeOnlineMember(index)}
                        className="rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-500 dark:hover:bg-gray-700"
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

      {/* Offline Members Section */}
      <div>
        <h3 className="mb-4 text-lg font-medium text-gray-900 dark:text-white">
          Add Offline Members
        </h3>

        <div className="mb-4 flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4">
          <div className="flex-grow">
            <FormInput
              id="newOfflineMemberName"
              placeholder="Member name"
              value={newOfflineMember.name}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setNewOfflineMember({ ...newOfflineMember, name: e.target.value })
                setNameError('')
              }}
              error={nameError}
              icon={<User className="h-5 w-5 text-gray-400" />}
            />
          </div>

          <div className="w-full sm:w-40">
            <FormSelect
              id="newOfflineMemberRole"
              options={roleOptions}
              value={newOfflineMember.role}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                setNewOfflineMember({ ...newOfflineMember, role: e.target.value })
              }}
            />
          </div>

          <div className="flex-shrink-0">
            <Button
              onClick={addOfflineMember}
              className="w-full sm:w-auto"
              aria-label="Add offline member"
            >
              <Plus className="mr-1 h-4 w-4" />
              Add
            </Button>
          </div>
        </div>

        {/* Offline Members List */}
        {offlineMembers.length > 0 && (
          <div className="mt-4 rounded-md border border-gray-200 dark:border-gray-700">
            <ul className="divide-y divide-gray-200 dark:divide-gray-700">
              {offlineMembers.map((member: { name: string; role: string }, index: number) => (
                <li key={index} className="flex items-center justify-between p-4">
                  <div className="flex items-center">
                    <User className="mr-3 h-5 w-5 text-gray-400" />
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">{member.name}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{member.role}</p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => removeOfflineMember(index)}
                    className="rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-500 dark:hover:bg-gray-700"
                  >
                    <span className="sr-only">Remove</span>
                    <X className="h-5 w-5" />
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  )
}

export default TeamMemberSetup
