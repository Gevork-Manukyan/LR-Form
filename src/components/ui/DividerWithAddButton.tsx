import { Plus } from 'lucide-react';
import { useState } from 'react';

interface DividerWithAddButtonProps {
  onAdd: (index: number) => void;
  index: number;
}

export function DividerWithAddButton({ onAdd, index }: DividerWithAddButtonProps) {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div 
      className="relative h-8 w-[800px] flex items-center justify-center group"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      <div className="absolute inset-0 flex items-center">
        <div className="w-full border-t border-gray-200"></div>
      </div>
      <div className="relative flex justify-center">
        <button
          onClick={() => onAdd(index)}
          className={`${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'} inline-flex items-center justify-center rounded-full w-8 h-8 bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-200 ease-in-out`}
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
} 