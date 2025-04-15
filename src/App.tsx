import { Navbar } from './components/ui/Navbar';
import { LawsuitList } from './components/LawsuitList';
import { useLawsuitManager } from './hooks/useLawsuitManager';

function App() {
  const {
    lawsuitIds,
    expandedLawsuitId,
    isAllCollapsed,
    handleAddLawsuit,
    handleRemoveLawsuit,
    handleCollapseAll,
    handleDeleteAll,
  } = useLawsuitManager();

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar 
        onCollapseAll={handleCollapseAll} 
        isAllCollapsed={isAllCollapsed} 
        onDeleteAll={handleDeleteAll}
      />
      <LawsuitList
        lawsuitIds={lawsuitIds}
        expandedLawsuitId={expandedLawsuitId}
        isAllCollapsed={isAllCollapsed}
        onAddLawsuit={handleAddLawsuit}
        onRemoveLawsuit={handleRemoveLawsuit}
      />
    </div>
  );
}

export default App;