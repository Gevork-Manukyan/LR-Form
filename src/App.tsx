import { Navbar } from './components/ui/Navbar';
import { LawsuitList } from './components/LawsuitList';
import { PNCForm } from './components/PNCForm';
import { useLawsuitManager } from './hooks/useLawsuitManager';
import { useState } from 'react';

export default function App() {
  const [showValidation, setShowValidation] = useState(false);
  const { lawsuitIds, expandedLawsuitId, isAllCollapsed, handleAddLawsuit, handleRemoveLawsuit, handleCollapseAll, handleDeleteAll } = useLawsuitManager();

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar 
        onCollapseAll={handleCollapseAll} 
        isAllCollapsed={isAllCollapsed} 
        onDeleteAll={handleDeleteAll}
        onShowValidation={setShowValidation}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <PNCForm shouldShowValidation={showValidation} />
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