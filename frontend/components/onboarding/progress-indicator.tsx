import { cn } from '@/utils/cn';

interface ProgressIndicatorProps {
  currentStep: number;
  totalSteps: number;
}

const ProgressIndicator = ({ currentStep, totalSteps }: ProgressIndicatorProps) => {
  return (
    <div className="mb-6">
      <div className="flex items-center justify-between">
        {Array.from({ length: totalSteps }).map((_, index) => {
          const stepNumber = index + 1;
          const isActive = stepNumber === currentStep;
          const isCompleted = stepNumber < currentStep;
          
          return (
            <div key={stepNumber} className="flex flex-1 flex-col items-center">
              <div className="flex w-full items-center">
                {/* Line before the first step is hidden */}
                {stepNumber > 1 && (
                  <div 
                    className={cn(
                      'h-1 flex-1', 
                      isCompleted ? 'bg-blue-600' : 'bg-gray-300'
                    )}
                  />
                )}
                
                {/* Step circle */}
                <div 
                  className={cn(
                    'flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium',
                    isActive && 'bg-blue-600 text-white',
                    isCompleted && 'bg-blue-600 text-white',
                    !isActive && !isCompleted && 'bg-gray-300 text-gray-700'
                  )}
                >
                  {isCompleted ? (
                    <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    stepNumber
                  )}
                </div>
                
                {/* Line after the last step is hidden */}
                {stepNumber < totalSteps && (
                  <div 
                    className={cn(
                      'h-1 flex-1', 
                      stepNumber < currentStep ? 'bg-blue-600' : 'bg-gray-300'
                    )}
                  />
                )}
              </div>
              
              {/* Step label */}
              <span 
                className={cn(
                  'mt-2 text-xs font-medium',
                  isActive && 'text-blue-600',
                  isCompleted && 'text-blue-600',
                  !isActive && !isCompleted && 'text-gray-500'
                )}
              >
                {stepNumber === 1 && 'Workspace'}
                {stepNumber === 2 && 'Team'}
              </span>
            </div>
          );
        })}
      </div>
      
      {/* Current step description */}
      <div className="mt-4 text-center">
        <h2 className="text-lg font-semibold text-gray-900">
          {currentStep === 1 && 'Workspace Creation'}
          {currentStep === 2 && 'Team Member Setup'}
        </h2>
        <p className="text-sm text-gray-500">
          {currentStep === 1 && 'Set up your workspace details'}
          {currentStep === 2 && 'Add team members to your workspace'}
        </p>
      </div>
    </div>
  );
};

export default ProgressIndicator;