import { useState, ReactNode } from 'react';

interface TooltipProps {
  children: ReactNode;
  content: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
}

const Tooltip = ({ children, content, position = 'top' }: TooltipProps) => {
  const [isVisible, setIsVisible] = useState(false);
  
  const positionClasses = {
    top: 'bottom-full left-1/2 mb-2 -translate-x-1/2',
    bottom: 'top-full left-1/2 mt-2 -translate-x-1/2',
    left: 'right-full top-1/2 mr-2 -translate-y-1/2',
    right: 'left-full top-1/2 ml-2 -translate-y-1/2',
  };
  
  const arrowClasses = {
    top: '-bottom-1 left-1/2 -translate-x-1/2 rotate-45',
    bottom: '-top-1 left-1/2 -translate-x-1/2 rotate-45',
    left: '-right-1 top-1/2 -translate-y-1/2 rotate-45',
    right: '-left-1 top-1/2 -translate-y-1/2 rotate-45',
  };
  
  return (
    <div className="relative inline-block">
      <div
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
        className="cursor-help"
      >
        {children}
      </div>
      {isVisible && (
        <div className={`absolute z-10 w-64 rounded-lg bg-gray-800 p-2 text-xs text-white shadow-lg ${positionClasses[position]}`}>
          {content}
          <div className={`absolute h-2 w-2 bg-gray-800 ${arrowClasses[position]}`}></div>
        </div>
      )}
    </div>
  );
};

export default Tooltip;