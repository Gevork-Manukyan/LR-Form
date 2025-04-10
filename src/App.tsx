import { Form } from './components/ui/form'
import { FormData } from './types/form'
import { useState, useEffect } from 'react'
import { FormFields } from './components/form/FormFields'
import { FormOutput } from './components/form/FormOutput'
import { isFieldRequired, getInputClassName, getLabelClassName, validateForm } from './components/form/FormValidation'
import { PARTNER_LAWFIRMS, SPECIAL_LAWFIRMS } from './lib/constants'
import { Sidebar } from './components/ui/Sidebar'
import { HamburgerMenu } from './components/ui/HamburgerMenu'
import { SidebarToggle } from './components/ui/SidebarToggle'

function App() {
  const [formData, setFormData] = useState<FormData>({
    status: 'Pending',
    caseNumber: '',
    timeFrame: '12 months',
    date: '',
    lawFirm: [],
    definitionMatch: 'Matches definition',
    description: '',
    hasMultipleDefendants: false,
    defendantNames: [],
    paDate: '',
    faDate: '',
    noPADate: false,
    noFADate: false,
    classType: 'Class',
    periodEndDate: '',
    ldwDate: '',
    isLDWAfterPeriodEnd: false,
    liabilityCalc: '',
    hasDescription: false,
    scheduledMPA: false,
    scheduledMFA: false,
    noPeriodEndDate: false,
    definitionMismatchReason: '',
    pncJobTitle: '',
    notFiledDate: '',
    attorney: [],
    customPA: false,
    customFA: false,
    customPAText: '',
    customFAText: '',
    noPNC: false,
    limitedClaims: false,
    noLawFirm: false
  })
  const [showOutput, setShowOutput] = useState(false)
  const [isInitialLoad, setIsInitialLoad] = useState(true)
  const [showValidation, setShowValidation] = useState(false)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  // Add these near the top of the component
  const isPartnerLawFirm = PARTNER_LAWFIRMS.some(partnerFirm => 
    formData.lawFirm.some(firm => firm.trim().toLowerCase().includes(partnerFirm.toLowerCase()))
  )
  const isSpecialLawFirm = SPECIAL_LAWFIRMS.some(specialFirm => 
    formData.lawFirm.some(firm => firm.trim().toLowerCase().includes(specialFirm.toLowerCase()))
  )

  // Hide output when form data changes
  useEffect(() => {
    if (!isInitialLoad) {
      setShowOutput(false)
    }
  }, [formData, isInitialLoad])

  // Calculate isLDWAfterPeriodEnd whenever periodEndDate or ldwDate changes
  useEffect(() => {
    if (formData.periodEndDate && formData.ldwDate) {
      const periodEnd = new Date(formData.periodEndDate);
      const ldwDate = new Date(formData.ldwDate);
      const isLDWAfterPeriodEnd = ldwDate > periodEnd;
      setFormData(prev => ({ ...prev, isLDWAfterPeriodEnd }));
    }
  }, [formData.periodEndDate, formData.ldwDate]);

  // Load form data from localStorage on component mount
  useEffect(() => {
    const savedFormData = localStorage.getItem('formData')
    if (savedFormData) {
      try {
        const parsedData = JSON.parse(savedFormData)
        // Ensure lawFirm is an array
        if (!Array.isArray(parsedData.lawFirm)) {
          parsedData.lawFirm = parsedData.lawFirm ? [parsedData.lawFirm] : []
        }
        // Ensure attorney is an array
        if (!Array.isArray(parsedData.attorney)) {
          parsedData.attorney = parsedData.attorney ? [parsedData.attorney] : []
        }
        setFormData(parsedData)
      } catch (error) {
        console.error('Error loading form data:', error)
      }
    }
    setIsInitialLoad(false)
  }, [])

  // Save form data to localStorage whenever it changes
  useEffect(() => {
    if (!isInitialLoad) {
      try {
        localStorage.setItem('formData', JSON.stringify(formData))
      } catch (error) {
        console.error('Error saving form data:', error)
      }
    }
  }, [formData, isInitialLoad])

  // Add this after the handleLiabilityCalcChange function
  useEffect(() => {
    if (formData.status === 'LWDA' && !formData.notFiledDate) {
      const today = new Date();
      const formattedDate = today.toISOString().split('T')[0];
      setFormData(prev => ({ ...prev, notFiledDate: formattedDate }));
    }
  }, [formData.status, formData.notFiledDate]);

  const handleSubmit = () => {
    setShowValidation(true);
    
    if (validateForm(formData)) {
      setShowOutput(!showOutput);
    }
  }

  const handleClear = () => {
    setFormData({
      ...formData,
      caseNumber: '',
      timeFrame: '12 months',
      date: '',
      lawFirm: [], // Ensure empty array
      definitionMatch: 'Matches definition',
      description: '',
      hasMultipleDefendants: false,
      defendantNames: [],
      paDate: '',
      faDate: '',
      noPADate: false,
      noFADate: false,
      classType: 'Class',
      periodEndDate: '',
      ldwDate: '',
      liabilityCalc: '',
      hasDescription: false,
      scheduledMPA: false,
      scheduledMFA: false,
      noPeriodEndDate: false,
      definitionMismatchReason: '',
      pncJobTitle: '',
      notFiledDate: '',
      attorney: [], // Ensure empty array
      customPA: false,
      customFA: false,
      customPAText: '',
      customFAText: '',
      noPNC: false,
      limitedClaims: false,
      noLawFirm: false
    })
    localStorage.removeItem('formData')
    setShowOutput(false)
    setShowValidation(false)
  }

  return (
    <div className="app min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto relative">
        <div className="p-6 bg-white rounded-lg shadow relative z-50">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">LR Form</h1>
            <HamburgerMenu
              isOpen={isSidebarOpen}
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            />
          </div>
          <Form onSubmit={handleSubmit}>
            <FormFields
              formData={formData}
              setFormData={setFormData}
              showValidation={showValidation}
              isFieldRequired={(field) => isFieldRequired(field, formData)}
              getInputClassName={(field) => getInputClassName(field, showValidation, formData)}
              getLabelClassName={(field) => getLabelClassName(field, showValidation, formData)}
              isPartnerLawFirm={isPartnerLawFirm}
              isSpecialLawFirm={isSpecialLawFirm}
            />

            <div className="flex gap-4">
              <button
                type="submit"
                className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 flex-1"
              >
                {showOutput ? 'Hide' : 'Show'}
              </button>
              <button
                type="button"
                onClick={handleClear}
                className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-destructive text-destructive-foreground hover:bg-destructive/90 h-10 px-4 py-2"
              >
                Clear
              </button>
            </div>

            {/* Formatted Display Section */}
            {showOutput && (
              <FormOutput
                formData={formData}
                isPartnerLawFirm={isPartnerLawFirm}
                isSpecialLawFirm={isSpecialLawFirm}
              />
            )}
          </Form>
        </div>

        {/* Sidebar */}
        <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)}>
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Settings</h2>
            <div className="space-y-4">
              <SidebarToggle
                id="noPNC"
                label="No PNC"
                checked={formData.noPNC}
                onCheckedChange={(checked) => setFormData({ ...formData, noPNC: checked })}
              />
              {/* TODO: Implement this functionality once you have multiple forms available */}
              {/* <SidebarToggle
                id="limitedClaims"
                label="Limited Claims"
                checked={formData.limitedClaims}
                onCheckedChange={(checked) => setFormData({ ...formData, limitedClaims: checked })}
              /> */}
              <SidebarToggle
                id="noLawFirm"
                label="No Law Firm"
                checked={formData.noLawFirm}
                onCheckedChange={(checked) => setFormData({ ...formData, noLawFirm: checked })}
              />
            </div>
          </div>
        </Sidebar>
      </div>
    </div>
  )
}

export default App