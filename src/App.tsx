import { useState, useEffect } from 'react';
import Lawsuit from './components/Lawsuit';
import { Navbar } from './components/ui/Navbar';
import { DividerWithAddButton } from './components/ui/DividerWithAddButton';

function App() {
  const [lawsuitIds, setLawsuitIds] = useState<string[]>([]);
  const [isAllCollapsed, setIsAllCollapsed] = useState(false);
  const [expandedLawsuitId, setExpandedLawsuitId] = useState<string | null>(null);

  // Load existing lawsuits from localStorage on mount
  useEffect(() => {
    const savedLawsuits = localStorage.getItem('lawsuits');
    if (savedLawsuits) {
      const lawsuits = JSON.parse(savedLawsuits);
      setLawsuitIds(Object.keys(lawsuits));
    } else {
      // Only create a new lawsuit if there are no saved lawsuits
      const newId = crypto.randomUUID();
      setLawsuitIds([newId]);
      setExpandedLawsuitId(newId);
    }
  }, []);

  const handleAddLawsuit = () => {
    const newId = crypto.randomUUID();
    const previousTopId = lawsuitIds[0];
    // First collapse the previous top lawsuit if it exists
    if (previousTopId && expandedLawsuitId === previousTopId) {
      setExpandedLawsuitId(null);
    }
    // Then add the new lawsuit and expand it
    setLawsuitIds(prev => [newId, ...prev]);
    // Always expand the new lawsuit
    setExpandedLawsuitId(newId);
  };

  const handleRemoveLawsuit = (id: string) => {
    setLawsuitIds(prev => prev.filter(lawsuitId => lawsuitId !== id));
    if (expandedLawsuitId === id) {
      setExpandedLawsuitId(null);
    }
  };

  const handleCollapseAll = () => {
    setIsAllCollapsed(!isAllCollapsed);
    if (!isAllCollapsed) {
      setExpandedLawsuitId(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar onCollapseAll={handleCollapseAll} isAllCollapsed={isAllCollapsed} />
      <div className="py-8">
        <div className="flex flex-col items-center gap-4">
          {lawsuitIds.map((id) => (
            <div key={id}>
              <DividerWithAddButton onAdd={handleAddLawsuit} />
              <Lawsuit
                id={id}
                onRemove={handleRemoveLawsuit}
                isCollapsed={expandedLawsuitId === id ? false : (isAllCollapsed || (expandedLawsuitId !== null && expandedLawsuitId !== id))}
              />
            </div>
          ))}
          {lawsuitIds.length === 0 && (
            <DividerWithAddButton onAdd={handleAddLawsuit} />
          )}
        </div>
      </div>
    </div>
  );
}

export default App;