import { Plus } from 'lucide-react';

interface DividerWithAddButtonProps {
  onAdd: () => void;
}

export function DividerWithAddButton({ onAdd }: DividerWithAddButtonProps) {
  return (
    <div className="relative h-8 w-[800px] flex items-center justify-center group">
      <div className="absolute inset-0 flex items-center">
        <div className="w-full border-t border-gray-200"></div>
      </div>
      <div className="relative flex justify-center">
        <button
          onClick={onAdd}
          className="invisible group-hover:visible inline-flex items-center justify-center rounded-full w-8 h-8 bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-200"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
} 