import { useFormContext } from 'react-hook-form'
import FormInput from '../ui/form-input'
import { Info } from 'lucide-react'

const WorkspaceCreation = () => {
  const {
    register,
    formState: { errors },
  } = useFormContext()

  return (
    <div className="space-y-6">
      <div className="rounded-md bg-blue-50 p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <Info className="h-5 w-5 text-blue-400" aria-hidden="true" />
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-blue-800">
              Workspace Setup
            </h3>
            <div className="mt-2 text-sm text-blue-700">
              <p>Let's set up your workspace with a name to get started.</p>
            </div>
          </div>
        </div>
      </div>

      <FormInput
        id="workspaceName"
        label="Workspace Name"
        placeholder="Enter workspace name"
        error={errors.workspaceName?.message as string}
        {...register('workspaceName')}
      />
    </div>
  )
}

export default WorkspaceCreation
