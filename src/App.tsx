import { useState, useEffect } from 'react';
import Lawsuit from './components/Lawsuit';
import { Navbar } from './components/ui/Navbar';

interface Settings {
  theme: 'light' | 'dark';
  autoSave: boolean;
  defaultStatus: 'Pending' | 'Settled' | 'LWDA';
}

function App() {
  const [lawsuitIds, setLawsuitIds] = useState<string[]>([]);
  const [settings, setSettings] = useState<Settings>({
    theme: 'light',
    autoSave: true,
    defaultStatus: 'Pending'
  });

  // Load existing lawsuits and settings from localStorage on mount
  useEffect(() => {
    const savedLawsuits = localStorage.getItem('lawsuits');
    const savedSettings = localStorage.getItem('settings');
    
    if (savedLawsuits) {
      const lawsuits = JSON.parse(savedLawsuits);
      setLawsuitIds(Object.keys(lawsuits));
    } else {
      // Only create a new lawsuit if there are no saved lawsuits
      setLawsuitIds([crypto.randomUUID()]);
    }

    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
  }, []);

  // Save settings to localStorage when they change
  useEffect(() => {
    localStorage.setItem('settings', JSON.stringify(settings));
  }, [settings]);

  const handleAddLawsuit = () => {
    setLawsuitIds(prev => [crypto.randomUUID(), ...prev]);
  };

  const handleRemoveLawsuit = (id: string) => {
    setLawsuitIds(prev => prev.filter(lawsuitId => lawsuitId !== id));
  };

  const handleSettingsChange = (newSettings: Settings) => {
    setSettings(newSettings);
  };

  return (
    <div className={`min-h-screen ${settings.theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-50'}`}>
      <Navbar onSettingsChange={handleSettingsChange} />
      <div className="py-8">
        <div className="flex flex-col items-center gap-4">
          <button
            onClick={handleAddLawsuit}
            className="mb-4 inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
          >
            Add New Case
          </button>
          {lawsuitIds.map(id => (
            <Lawsuit key={id} id={id} onRemove={handleRemoveLawsuit} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;