import './App.css'
import { Form } from './components/ui/form'
import { FormData, Status, TimeFrame, DefinitionMatch } from './types/form'
import { useState } from 'react'

function App() {
  const [formData, setFormData] = useState<FormData>({
    status: 'Pending',
    caseNumber: '',
    timeFrame: '12 months',
    date: '',
    lawFirm: '',
    definitionMatch: 'Matches definition',
    description: '',
    hasMultipleDefendants: false,
    defendantNames: []
  })

  const handleSubmit = (data: Record<string, string>) => {
    console.log('Form submitted:', data)
    // Here we'll add the formatting logic later
  }

  return (
    <div className="app min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow">
        <h1 className="text-2xl font-bold mb-6">LR Form</h1>
        <Form onSubmit={handleSubmit}>
          <div className="space-y-4">
            {/* Status Dropdown */}
            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                Status
              </label>
              <select
                name="status"
                id="status"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as Status })}
              >
                <option value="Pending">Pending</option>
                <option value="Settled">Settled</option>
              </select>
            </div>

            {/* Case Number */}
            <div>
              <label htmlFor="caseNumber" className="block text-sm font-medium text-gray-700">
                Case Number
              </label>
              <input
                type="text"
                name="caseNumber"
                id="caseNumber"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                value={formData.caseNumber}
                onChange={(e) => setFormData({ ...formData, caseNumber: e.target.value })}
              />
            </div>

            {/* Time Frame Dropdown */}
            <div>
              <label htmlFor="timeFrame" className="block text-sm font-medium text-gray-700">
                Time Frame
              </label>
              <select
                name="timeFrame"
                id="timeFrame"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                value={formData.timeFrame}
                onChange={(e) => setFormData({ ...formData, timeFrame: e.target.value as TimeFrame })}
              >
                <option value="12 months">12 months</option>
                <option value="12-36 months">12-36 months</option>
                <option value="36 months">36 months</option>
              </select>
            </div>

            {/* Date Input */}
            <div>
              <label htmlFor="date" className="block text-sm font-medium text-gray-700">
                Date
              </label>
              <input
                type="date"
                name="date"
                id="date"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              />
            </div>

            {/* Law Firm */}
            <div>
              <label htmlFor="lawFirm" className="block text-sm font-medium text-gray-700">
                Law Firm
              </label>
              <input
                type="text"
                name="lawFirm"
                id="lawFirm"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                value={formData.lawFirm}
                onChange={(e) => setFormData({ ...formData, lawFirm: e.target.value })}
              />
            </div>

            {/* Definition Match Dropdown */}
            <div>
              <label htmlFor="definitionMatch" className="block text-sm font-medium text-gray-700">
                Definition Match
              </label>
              <select
                name="definitionMatch"
                id="definitionMatch"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                value={formData.definitionMatch}
                onChange={(e) => setFormData({ ...formData, definitionMatch: e.target.value as DefinitionMatch })}
              >
                <option value="Matches definition">Matches definition</option>
                <option value="Does NOT match definition">Does NOT match definition</option>
              </select>
            </div>

            {/* Description Text Area */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <textarea
                name="description"
                id="description"
                rows={4}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>

            {/* Multiple Defendants Toggle */}
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                name="hasMultipleDefendants"
                id="hasMultipleDefendants"
                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                checked={formData.hasMultipleDefendants}
                onChange={(e) => setFormData({ ...formData, hasMultipleDefendants: e.target.checked })}
              />
              <label htmlFor="hasMultipleDefendants" className="text-sm font-medium text-gray-700">
                More than searched defendant?
              </label>
            </div>

            {/* Defendant Names List */}
            {formData.hasMultipleDefendants && (
              <div>
                <label htmlFor="defendantNames" className="block text-sm font-medium text-gray-700">
                  Defendant Names (one per line)
                </label>
                <textarea
                  name="defendantNames"
                  id="defendantNames"
                  rows={4}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  value={formData.defendantNames.join('\n')}
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    defendantNames: e.target.value.split('\n').filter(name => name.trim() !== '')
                  })}
                />
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Submit
            </button>
          </div>
        </Form>
      </div>
    </div>
  )
}

export default App
