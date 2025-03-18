import './App.css'
import { Form } from './components/ui/form'
import { FormData, Status, TimeFrame, DefinitionMatch } from './types/form'
import { useState } from 'react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./components/ui/select"
import { Checkbox } from "./components/ui/checkbox"

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
    defendantNames: [],
    // New fields for Settled status
    paDate: '',
    faDate: '',
    classType: 'Class',
    periodEndDate: '',
    ldwDate: 'After',
    elevenMonthsPassed: '11 months has passed',
    liabilityCalc: ''
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
            <div className="space-y-2">
              <label htmlFor="status" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Status
              </label>
              <Select
                value={formData.status}
                onValueChange={(value: Status) => setFormData({ ...formData, status: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Pending">Pending</SelectItem>
                  <SelectItem value="Settled">Settled</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Two Column Grid - Common Fields */}
            <div className="grid grid-cols-2 gap-4">
              {/* Case Number */}
              <div className="space-y-2">
                <label htmlFor="caseNumber" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Case Number
                </label>
                <input
                  type="text"
                  name="caseNumber"
                  id="caseNumber"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  value={formData.caseNumber}
                  onChange={(e) => setFormData({ ...formData, caseNumber: e.target.value })}
                />
              </div>

              {/* Filed On */}
              <div className="space-y-2">
                <label htmlFor="date" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Filed On
                </label>
                <input
                  type="date"
                  name="date"
                  id="date"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                />
              </div>

              {/* Law Firm */}
              <div className="space-y-2">
                <label htmlFor="lawFirm" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Law Firm
                </label>
                <input
                  type="text"
                  name="lawFirm"
                  id="lawFirm"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  value={formData.lawFirm}
                  onChange={(e) => setFormData({ ...formData, lawFirm: e.target.value })}
                />
              </div>

              {/* Definition Match Dropdown */}
              <div className="space-y-2">
                <label htmlFor="definitionMatch" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Definition Match
                </label>
                <Select
                  value={formData.definitionMatch}
                  onValueChange={(value: DefinitionMatch) => setFormData({ ...formData, definitionMatch: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select definition match" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Matches definition">Matches definition</SelectItem>
                    <SelectItem value="Does NOT match definition">Does NOT match definition</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Pending-specific fields */}
              {formData.status === 'Pending' && (
                <>
                  {/* Time Frame Dropdown */}
                  <div className="space-y-2">
                    <label htmlFor="timeFrame" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                      Time Frame
                    </label>
                    <Select
                      value={formData.timeFrame}
                      onValueChange={(value: TimeFrame) => setFormData({ ...formData, timeFrame: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select time frame" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="12 months">12 months</SelectItem>
                        <SelectItem value="12-36 months">12-36 months</SelectItem>
                        <SelectItem value="36 months">36 months</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </>
              )}

              {/* Settled-specific fields */}
              {formData.status === 'Settled' && (
                <>
                  {/* PA Date */}
                  <div className="space-y-2">
                    <label htmlFor="paDate" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                      PA Date
                    </label>
                    <input
                      type="date"
                      name="paDate"
                      id="paDate"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      value={formData.paDate}
                      onChange={(e) => setFormData({ ...formData, paDate: e.target.value })}
                    />
                  </div>

                  {/* FA Date */}
                  <div className="space-y-2">
                    <label htmlFor="faDate" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                      FA Date
                    </label>
                    <input
                      type="date"
                      name="faDate"
                      id="faDate"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      value={formData.faDate}
                      onChange={(e) => setFormData({ ...formData, faDate: e.target.value })}
                    />
                  </div>

                  {/* Class/PAGA and Period End Date */}
                  {formData.definitionMatch === 'Matches definition' && (
                    <div className="col-span-2 grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label htmlFor="classType" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                          Class/PAGA
                        </label>
                        <Select
                          value={formData.classType}
                          onValueChange={(value) => setFormData({ ...formData, classType: value })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Class">Class</SelectItem>
                            <SelectItem value="PAGA">PAGA</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="periodEndDate" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                          Period End Date
                        </label>
                        <input
                          type="date"
                          name="periodEndDate"
                          id="periodEndDate"
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                          value={formData.periodEndDate}
                          onChange={(e) => setFormData({ ...formData, periodEndDate: e.target.value })}
                        />
                      </div>
                    </div>
                  )}

                  {/* LDW Date */}
                  {formData.definitionMatch === 'Matches definition' && (
                    <div className="col-span-2 flex items-center gap-4">
                      <div className="space-y-2 flex-1">
                        <label htmlFor="ldwDate" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                          LDW Date
                        </label>
                        <Select
                          value={formData.ldwDate}
                          onValueChange={(value) => setFormData({ ...formData, ldwDate: value })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select LDW date" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="After">After</SelectItem>
                            <SelectItem value="Before">Before</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="flex items-end h-10 text-sm text-muted-foreground">
                        period end date
                      </div>
                    </div>
                  )}

                  {/* 11 months passed */}
                  {formData.definitionMatch === 'Matches definition' && (
                    <div className="col-span-2">
                      <div className="space-y-2">
                        <label htmlFor="elevenMonthsPassed" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                          11 months passed
                        </label>
                        <Select
                          value={formData.elevenMonthsPassed}
                          onValueChange={(value) => setFormData({ ...formData, elevenMonthsPassed: value })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="11 months has passed">11 months has passed</SelectItem>
                            <SelectItem value="11 months HAS NOT passed">11 months HAS NOT passed</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  )}

                  {/* Liability Calc */}
                  <div className="col-span-2">
                    <div className="space-y-2">
                      <label htmlFor="liabilityCalc" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                        Liability Calc
                      </label>
                      <div className="flex items-center">
                        <span className="mr-2">$</span>
                        <input
                          type="number"
                          name="liabilityCalc"
                          id="liabilityCalc"
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                          value={formData.liabilityCalc}
                          onChange={(e) => setFormData({ ...formData, liabilityCalc: e.target.value })}
                        />
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Description Text Area - Only for Pending */}
            {formData.status === 'Pending' && (
              <div className="space-y-2">
                <label htmlFor="description" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Description
                </label>
                <textarea
                  name="description"
                  id="description"
                  rows={4}
                  className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>
            )}

            {/* Multiple Defendants Toggle */}
            <div className="flex items-center space-x-2">
              <Checkbox
                id="hasMultipleDefendants"
                checked={formData.hasMultipleDefendants}
                onCheckedChange={(checked) => setFormData({ ...formData, hasMultipleDefendants: checked as boolean })}
              />
              <label
                htmlFor="hasMultipleDefendants"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                More than searched defendant?
              </label>
            </div>

            {/* Defendant Names List */}
            {formData.hasMultipleDefendants && (
              <div className="space-y-2">
                <label htmlFor="defendantNames" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Defendant Names (one per line)
                </label>
                <textarea
                  name="defendantNames"
                  id="defendantNames"
                  rows={4}
                  className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
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
              className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 w-full"
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
