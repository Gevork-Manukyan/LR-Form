import { Plus } from 'lucide-react';

interface DividerWithAddButtonProps {
  onAdd: (index: number) => void;
  index: number;
}

export function DividerWithAddButton({ onAdd, index }: DividerWithAddButtonProps) {
  return (
    <div className="relative h-8 max-w-3xl w-[1000px] my-2 flex items-center justify-center group">
      <div className="absolute inset-0 flex items-center">
        <div className="w-full border-t border-gray-200"></div>
      </div>
      <div className="relative flex justify-center">
        <button
          onClick={() => onAdd(index)}
          className="invisible opacity-0 group-hover:visible group-hover:opacity-100 inline-flex items-center justify-center rounded-full w-8 h-8 bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-200 ease-in-out transform scale-95 group-hover:scale-100"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
} 