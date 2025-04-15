import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface PNCFormProps {
  onPNCInfoChange: (info: { name: string; lwdaDate: string }) => void;
  className?: string;
}

export function PNCForm({ onPNCInfoChange, className = '' }: PNCFormProps) {
  const [name, setName] = useState('');
  const [lwdaDate, setLwdaDate] = useState('');
  const [isExpanded, setIsExpanded] = useState(true);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newName = e.target.value;
    setName(newName);
    onPNCInfoChange({ name: newName, lwdaDate });
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDate = e.target.value;
    setLwdaDate(newDate);
    onPNCInfoChange({ name, lwdaDate: newDate });
  };

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className={`w-full max-w-2xl mx-auto bg-white rounded-lg shadow-sm mb-8 ${className}`}>
      <button
        onClick={toggleExpand}
        className="w-full flex items-center justify-between p-6 hover:bg-gray-50 rounded-t-lg"
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
                value={name}
                onChange={handleNameChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter PNC name"
              />
            </div>
            <div className="flex-1">
              <label htmlFor="lwdaDate" className="block text-sm font-medium text-gray-700 mb-1">
                LWDA Date
              </label>
              <input
                type="date"
                id="lwdaDate"
                value={lwdaDate}
                onChange={handleDateChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 