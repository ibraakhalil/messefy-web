import { ReactNode } from 'react';

interface ToggleSwitchProps {
  id: string;
  label: ReactNode;
  helpText?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
}

const ToggleSwitch = ({ id, label, helpText, checked, onChange, disabled = false }: ToggleSwitchProps) => {
  return (
    <div className="flex items-center justify-between space-x-4">
      <div>
        <label htmlFor={id} className="text-sm font-medium text-gray-700 dark:text-gray-300">
          {label}
        </label>
        {helpText && (
          <p className="text-xs text-gray-500 dark:text-gray-400">{helpText}</p>
        )}
      </div>
      <button
        type="button"
        id={id}
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-emerald-500/20 ${checked ? 'bg-emerald-600' : 'bg-gray-200 dark:bg-gray-600'} ${disabled ? 'cursor-not-allowed opacity-50' : ''}`}
        onClick={() => !disabled && onChange(!checked)}
      >
        <span className="sr-only">Toggle {typeof label === 'string' ? label : 'setting'}</span>
        <span
          aria-hidden="true"
          className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${checked ? 'translate-x-5' : 'translate-x-0'}`}
        />
      </button>
    </div>
  );
};

export default ToggleSwitch;