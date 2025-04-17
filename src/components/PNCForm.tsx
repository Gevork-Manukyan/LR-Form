import { useState } from 'react';
import { ChevronUp, ChevronDown, XCircle } from 'lucide-react';
import { usePNCInfoStore } from '../store/pncInfoStore';

interface PNCFormProps {
  className?: string;
  shouldShowValidation?: boolean;
}

export function PNCForm({ className = '', shouldShowValidation = false }: PNCFormProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const { pncInfo, updatePNCInfo } = usePNCInfoStore();

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newName = e.target.value;
    updatePNCInfo({ ...pncInfo, name: newName });
  };

  const handleLdwDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDate = e.target.value;
    updatePNCInfo({ ...pncInfo, ldwDate: newDate });
  };

  const isInvalid = shouldShowValidation && !pncInfo.noPNC && (!pncInfo.name || !pncInfo.ldwDate);

  return (
    <div className="flex flex-row justify-center mx-auto relative">
      <div className={`w-full max-w-2xl bg-white rounded-lg shadow-sm mb-8 ${isInvalid ? 'border-2 border-red-500' : ''} ${className} relative z-10`}>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full flex items-center justify-between p-6 hover:bg-gray-100 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={pncInfo.noPNC}
        >
          <h2 className="text-xl font-semibold">PNC Information</h2>
          {isExpanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
        </button>
        {isExpanded && (
          <div className="p-6">
            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="flex-1">
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={pncInfo.name}
                    onChange={handleNameChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter PNC name"
                  />
                </div>
                <div className="flex-1">
                  <label htmlFor="ldwDate" className="block text-sm font-medium text-gray-700 mb-1">
                    LDW Date
                  </label>
                  <input
                    type="date"
                    id="ldwDate"
                    value={pncInfo.ldwDate}
                    onChange={handleLdwDateChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      <button
        onClick={() => updatePNCInfo({ ...pncInfo, noPNC: !pncInfo.noPNC })}
        className={`w-16 h-[72px] flex flex-col items-center justify-center gap-1 bg-white rounded-lg shadow-sm mb-8 transition-all duration-300 select-none ${
          pncInfo.noPNC 
            ? 'hover:bg-red-50' 
            : 'hover:bg-gray-100 opacity-50'
        } ${isExpanded ? '-translate-x-12' : ''}`}
        style={{ pointerEvents: isExpanded ? 'none' : 'auto' }}
      >
        <XCircle 
          className={`w-6 h-6 transition-all duration-300 ${
            pncInfo.noPNC 
              ? 'text-red-500 animate-pulse drop-shadow-[0_0_8px_rgba(239,68,68,0.5)]' 
              : 'text-gray-400'
          }`}
        />
        <span className={`text-xs font-medium transition-colors duration-300 ${
          pncInfo.noPNC ? 'text-red-500' : 'text-gray-700'
        }`}>No PNC</span>
      </button>
    </div>
  );
} 