import { useState } from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';
import { usePNCInfoStore } from '../store/pncInfoStore';

interface PNCFormProps {
  className?: string;
  shouldShowValidation?: boolean;
}

export function PNCForm({ className = '', shouldShowValidation = false }: PNCFormProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const { pncInfo, updatePNCInfo } = usePNCInfoStore();

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newName = e.target.value;
    updatePNCInfo({ ...pncInfo, name: newName });
  };

  const handleLdwDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDate = e.target.value;
    updatePNCInfo({ ...pncInfo, ldwDate: newDate });
  };

  const isInvalid = shouldShowValidation && (!pncInfo.name || !pncInfo.ldwDate);

  return (
    <div className={`w-full max-w-2xl mx-auto bg-white rounded-lg shadow-sm mb-8 ${isInvalid ? 'border-2 border-red-500' : ''} ${className}`}>
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-6 hover:bg-gray-100 rounded-t-lg"
      >
        <h2 className="text-xl font-semibold">PNC Information</h2>
        {isExpanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
      </button>
      {isExpanded && (
        <div className="p-6 pt-0">
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
      )}
    </div>
  );
} 