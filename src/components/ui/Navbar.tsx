import { useState } from 'react';
import { Settings, ChevronDown } from 'lucide-react';

interface NavbarProps {
  onSettingsChange: (settings: Settings) => void;
}

interface Settings {
  theme: 'light' | 'dark';
  autoSave: boolean;
  defaultStatus: 'Pending' | 'Settled' | 'LWDA';
}

export function Navbar({ onSettingsChange }: NavbarProps) {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [settings, setSettings] = useState<Settings>({
    theme: 'light',
    autoSave: true,
    defaultStatus: 'Pending'
  });

  const handleSettingChange = (key: keyof Settings, value: Settings[keyof Settings]) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    onSettingsChange(newSettings);
  };

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <h1 className="text-xl font-semibold">LR Form</h1>
          </div>
          <div className="flex items-center">
            <div className="relative">
              <button
                onClick={() => setIsSettingsOpen(!isSettingsOpen)}
                className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-gray-100"
              >
                <Settings className="w-5 h-5" />
                <span>Settings</span>
                <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isSettingsOpen ? 'rotate-180' : ''}`} />
              </button>
              {isSettingsOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-md shadow-lg py-1 z-50">
                  <div className="px-4 py-2 border-b">
                    <h3 className="text-sm font-medium text-gray-700">Theme</h3>
                    <select
                      value={settings.theme}
                      onChange={(e) => handleSettingChange('theme', e.target.value as 'light' | 'dark')}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                    >
                      <option value="light">Light</option>
                      <option value="dark">Dark</option>
                    </select>
                  </div>
                  <div className="px-4 py-2 border-b">
                    <h3 className="text-sm font-medium text-gray-700">Auto Save</h3>
                    <label className="flex items-center mt-1">
                      <input
                        type="checkbox"
                        checked={settings.autoSave}
                        onChange={(e) => handleSettingChange('autoSave', e.target.checked)}
                        className="rounded border-gray-300 text-primary focus:ring-primary"
                      />
                      <span className="ml-2 text-sm text-gray-700">Enable auto save</span>
                    </label>
                  </div>
                  <div className="px-4 py-2">
                    <h3 className="text-sm font-medium text-gray-700">Default Status</h3>
                    <select
                      value={settings.defaultStatus}
                      onChange={(e) => handleSettingChange('defaultStatus', e.target.value as 'Pending' | 'Settled' | 'LWDA')}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                    >
                      <option value="Pending">Pending</option>
                      <option value="Settled">Settled</option>
                      <option value="LWDA">LWDA</option>
                    </select>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
} 