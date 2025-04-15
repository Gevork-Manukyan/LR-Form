import { Navbar } from './components/ui/Navbar';
import { LawsuitList } from './components/LawsuitList';
import { PNCForm } from './components/PNCForm';
import { useLawsuitManager } from './hooks/useLawsuitManager';

function App() {
  const {
    lawsuitIds,
    expandedLawsuitId,
    isAllCollapsed,
    name,
    lwdaDate,
    handleAddLawsuit,
    handleRemoveLawsuit,
    handleCollapseAll,
    handleDeleteAll,
    handlePNCInfoChange,
  } = useLawsuitManager();

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar 
        onCollapseAll={handleCollapseAll} 
        isAllCollapsed={isAllCollapsed} 
        onDeleteAll={handleDeleteAll}
      />
      <PNCForm 
        onPNCInfoChange={handlePNCInfoChange} 
        className="mt-8" 
        name={name}
        lwdaDate={lwdaDate}
      />
      <LawsuitList
        lawsuitIds={lawsuitIds}
        expandedLawsuitId={expandedLawsuitId}
        isAllCollapsed={isAllCollapsed}
        onAddLawsuit={handleAddLawsuit}
        onRemoveLawsuit={handleRemoveLawsuit}
        name={name}
        lwdaDate={lwdaDate}
      />
    </div>
  );
}

export default App;