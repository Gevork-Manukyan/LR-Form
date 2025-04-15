import { DividerWithAddButton } from './ui/DividerWithAddButton';
import Lawsuit from './Lawsuit';

interface LawsuitListProps {
  lawsuitIds: string[];
  expandedLawsuitId: string | null;
  isAllCollapsed: boolean;
  onAddLawsuit: (index: number) => void;
  onRemoveLawsuit: (id: string) => void;
}

export function LawsuitList({
  lawsuitIds,
  expandedLawsuitId,
  isAllCollapsed,
  onAddLawsuit,
  onRemoveLawsuit,
}: LawsuitListProps) {
  return (
    <div className="pb-8">
      <div className="flex flex-col items-center">
        {lawsuitIds.map((id, index) => (
          <div key={id} className="flex flex-col">
            <DividerWithAddButton onAdd={onAddLawsuit} index={index} />
            <Lawsuit
              id={id}
              onRemove={onRemoveLawsuit}
              isCollapsed={expandedLawsuitId === id ? false : (isAllCollapsed || (expandedLawsuitId !== null && expandedLawsuitId !== id))}
            />
          </div>
        ))}
        {lawsuitIds.length > 0 && (
          <DividerWithAddButton onAdd={onAddLawsuit} index={lawsuitIds.length} />
        )}
        {lawsuitIds.length === 0 && (
          <button
            onClick={() => onAddLawsuit(0)}
            className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
          >
            Add Lawsuit
          </button>
        )}
      </div>
    </div>
  );
} 