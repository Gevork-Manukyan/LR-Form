import { useState, useEffect } from 'react';
import Lawsuit from './components/Lawsuit';

function App() {
  const [lawsuitIds, setLawsuitIds] = useState<string[]>([]);

  // Load existing lawsuits from localStorage on mount
  useEffect(() => {
    const savedLawsuits = localStorage.getItem('lawsuits');
    if (savedLawsuits) {
      const lawsuits = JSON.parse(savedLawsuits);
      setLawsuitIds(Object.keys(lawsuits));
    } else {
      // Only create a new lawsuit if there are no saved lawsuits
      setLawsuitIds([crypto.randomUUID()]);
    }
  }, []);

  const handleAddLawsuit = () => {
    setLawsuitIds(prev => [...prev, crypto.randomUUID()]);
  };

  const handleRemoveLawsuit = (id: string) => {
    setLawsuitIds(prev => prev.filter(lawsuitId => lawsuitId !== id));
  };

  return (
    <div className="app min-h-screen bg-gray-50 py-8">
      <div className="flex flex-col items-center gap-4">
        {lawsuitIds.map(id => (
          <Lawsuit key={id} id={id} onRemove={handleRemoveLawsuit} />
        ))}
        <button
          onClick={handleAddLawsuit}
          className="mt-4 inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
        >
          Add New Case
        </button>
      </div>
    </div>
  );
}

export default App;