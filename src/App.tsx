import { Navbar } from './components/ui/Navbar';
import { LawsuitList } from './components/LawsuitList';
import { PNCForm } from './components/PNCForm';
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

  const handlePNCInfoChange = (info: { name: string; lwdaDate: string }) => {
    // You can handle the PNC information here
    console.log('PNC Info:', info);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar 
        onCollapseAll={handleCollapseAll} 
        isAllCollapsed={isAllCollapsed} 
        onDeleteAll={handleDeleteAll}
      />
      <PNCForm onPNCInfoChange={handlePNCInfoChange} className="mt-8" />
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