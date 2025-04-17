import { Navbar } from './components/ui/Navbar';
import { LawsuitList } from './components/LawsuitList';
import { PNCForm } from './components/PNCForm';
import { useLawsuitManager } from './hooks/useLawsuitManager';

export default function App() {
  const { lawsuitIds, expandedLawsuitId, isAllCollapsed, showValidation, setShowValidation, handleAddLawsuit, handleRemoveLawsuit, handleCollapseAll, handleDeleteAll } = useLawsuitManager();

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar 
        onCollapseAll={handleCollapseAll} 
        isAllCollapsed={isAllCollapsed} 
        onDeleteAll={handleDeleteAll}
        onShowValidation={setShowValidation}
      />
      <PNCForm className="mt-8" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <LawsuitList
          lawsuitIds={lawsuitIds}
          expandedLawsuitId={expandedLawsuitId}
          isAllCollapsed={isAllCollapsed}
          onAddLawsuit={handleAddLawsuit}
          onRemoveLawsuit={handleRemoveLawsuit}
          shouldShowValidation={showValidation}
        />
      </div>
    </div>
  );
}