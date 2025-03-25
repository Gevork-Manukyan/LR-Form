import './App.css'
import { Form } from './components/ui/form'
import { FormData, Status, DefinitionMatch, ClassType } from './types/form'
import { useState, useEffect } from 'react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./components/ui/select"
import { Checkbox } from "./components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "./components/ui/radio-group"
import { Switch } from "./components/ui/switch"

const LAWSUIT_PROBLEM = <strong>Lawsuit Problem</strong>

const PARTNER_LAWFIRMS = [
  "aegis",
  "cohelan khoury",
  "cohelan khoury & singer",
  "cohelan khoury and singer",
  "diversity",
  "gaines",
  "tunyan",
  "moon",
  "yang",
  "otkupman",
]

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
    attorney: '',
    customPA: false,
    customFA: false,
    customPAText: '',
    customFAText: '',
    noPNC: false
  })
  const [showOutput, setShowOutput] = useState(false)
  const [isInitialLoad, setIsInitialLoad] = useState(true)
  const [showValidation, setShowValidation] = useState(false)

  // Add this near the top of the component
  const isPartnerLawFirm = PARTNER_LAWFIRMS.some(partnerFirm => 
    formData.lawFirm.trim().toLowerCase().includes(partnerFirm.toLowerCase())
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

        // Ensure all required fields are present
        const completeData: FormData = {
          status: parsedData.status === 'Pending' || parsedData.status === 'Settled' || parsedData.status === 'LWDA' ? parsedData.status : 'Pending',
          caseNumber: parsedData.caseNumber || '',
          timeFrame: parsedData.timeFrame || '12 months',
          date: parsedData.date || '',
          lawFirm: parsedData.lawFirm || '',
          definitionMatch: parsedData.definitionMatch || 'Matches definition',
          description: parsedData.description || '',
          hasMultipleDefendants: parsedData.hasMultipleDefendants || false,
          defendantNames: parsedData.defendantNames || [],
          paDate: parsedData.paDate || '',
          faDate: parsedData.faDate || '',
          noPADate: parsedData.noPADate || false,
          noFADate: parsedData.noFADate || false,
          classType: parsedData.classType || 'Class',
          periodEndDate: parsedData.periodEndDate || '',
          ldwDate: parsedData.ldwDate || '',
          isLDWAfterPeriodEnd: parsedData.isLDWAfterPeriodEnd || false,
          liabilityCalc: parsedData.liabilityCalc || '',
          hasDescription: parsedData.hasDescription || false,
          scheduledMPA: Boolean(parsedData.scheduledMPA),
          scheduledMFA: Boolean(parsedData.scheduledMFA),
          noPeriodEndDate: parsedData.noPeriodEndDate || false,
          definitionMismatchReason: parsedData.definitionMismatchReason || '',
          pncJobTitle: parsedData.pncJobTitle || '',
          notFiledDate: parsedData.notFiledDate || '',
          attorney: parsedData.attorney || '',
          customPA: parsedData.customPA || false,
          customFA: parsedData.customFA || false,
          customPAText: parsedData.customPAText || '',
          customFAText: parsedData.customFAText || '',
          noPNC: Boolean(parsedData.noPNC)
        }

        setFormData(completeData)
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
        // Ensure status is valid before saving
        const dataToSave = {
          ...formData,
          status: formData.status === 'Pending' || formData.status === 'Settled' || formData.status === 'LWDA' ? formData.status : 'Pending'
        }
        localStorage.setItem('formData', JSON.stringify(dataToSave))
      } catch (error) {
        console.error('Error saving form data:', error)
      }
    }
  }, [formData, isInitialLoad])

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString + 'T00:00:00');
    return `${String(date.getMonth() + 1).padStart(2, '0')}/${String(date.getDate()).padStart(2, '0')}/${date.getFullYear()}`;
  }

  const handleSubmit = () => {
    setShowValidation(true);
    
    // Check if all required fields are filled
    let requiredFields: (keyof FormData)[] = [];
    
    if (formData.status === 'LWDA') {
      requiredFields = ['caseNumber', 'date', 'lawFirm', 'attorney', 'notFiledDate'];
    } else {
      requiredFields = ['caseNumber', 'date', 'lawFirm'];
      if (!formData.noPNC) {
        requiredFields.push('definitionMatch');
      }
      
      if (formData.status === 'Settled') {
        if (formData.classType === 'Class' && !formData.noPADate) {
          // Require either paDate or customPAText if customPA is checked
          if (formData.customPA) {
            requiredFields.push('customPAText');
          } else {
            requiredFields.push('paDate');
          }
        }
        if (!formData.noFADate) {
          // Require either faDate or customFAText if customFA is checked
          if (formData.customFA) {
            requiredFields.push('customFAText');
          } else {
            requiredFields.push('faDate');
          }
        }
        if (!formData.noPeriodEndDate) requiredFields.push('periodEndDate');
        if (!formData.noPNC) requiredFields.push('ldwDate');
      }

      // Add definition mismatch fields as required when "Does not match" is selected
      if (!formData.noPNC && formData.definitionMatch === 'Does NOT match definition') {
        requiredFields.push('definitionMismatchReason', 'pncJobTitle');
      }
    }

    const allFieldsFilled = requiredFields.every(field => {
      // Special handling for custom text fields
      if (field === 'customPAText' && formData.customPA) {
        return formData.customPAText.trim() !== '';
      }
      if (field === 'customFAText' && formData.customFA) {
        return formData.customFAText.trim() !== '';
      }
      return formData[field];
    });

    if (allFieldsFilled) {
      setShowOutput(!showOutput);
    }
  }

  const handleClear = () => {
    setFormData({
      ...formData,
      caseNumber: '',
      timeFrame: '12 months',
      date: '',
      lawFirm: '',
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
      attorney: '',
      customPA: false,
      customFA: false,
      customPAText: '',
      customFAText: ''
    })
    localStorage.removeItem('formData')
    setShowOutput(false)
    setShowValidation(false)
  }

  const isFieldRequired = (field: keyof FormData) => {
    const requiredFields = ['caseNumber', 'date', 'lawFirm'];
    
    if (formData.status === 'LWDA') {
      return ['caseNumber', 'date', 'lawFirm', 'attorney', 'notFiledDate'].includes(field);
    }

    if (formData.status === 'Settled') {
      if (formData.classType === 'Class' && !formData.noPADate) {
        // Require either paDate or customPAText if customPA is checked
        if (formData.customPA) {
          requiredFields.push('customPAText');
        } else {
          requiredFields.push('paDate');
        }
      }
      if (!formData.noFADate) {
        // Require either faDate or customFAText if customFA is checked
        if (formData.customFA) {
          requiredFields.push('customFAText');
        } else {
          requiredFields.push('faDate');
        }
      }
      if (!formData.noPeriodEndDate) requiredFields.push('periodEndDate');
      requiredFields.push('ldwDate');
    }

    // Add definition mismatch fields as required when "Does not match" is selected
    if (!formData.noPNC && formData.definitionMatch === 'Does NOT match definition') {
      requiredFields.push('definitionMismatchReason', 'pncJobTitle');
    }

    return requiredFields.includes(field);
  }

  const getInputClassName = (field: keyof FormData) => {
    const baseClasses = "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50";
    if (showValidation && isFieldRequired(field) && !formData[field]) {
      return `${baseClasses} border-red-500 focus-visible:ring-red-500`;
    }
    return baseClasses;
  }

  const getLabelClassName = (field: keyof FormData) => {
    const baseClasses = "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70";
    if (showValidation && isFieldRequired(field) && !formData[field]) {
      return `${baseClasses} text-red-500`;
    }
    return baseClasses;
  }

  const handleLiabilityCalcChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Allow empty string or numbers with up to 2 decimal places
    if (value === '' || /^\d*\.?\d{0,2}$/.test(value)) {
      setFormData({ ...formData, liabilityCalc: value });
    }
  };

  const formatLiabilityCalc = (value: string) => {
    if (!value) return '';
    const num = parseFloat(value);
    if (isNaN(num)) return '';
    return num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  // Add this after the handleLiabilityCalcChange function
  useEffect(() => {
    if (formData.status === 'LWDA' && !formData.notFiledDate) {
      const today = new Date();
      const formattedDate = today.toISOString().split('T')[0];
      setFormData(prev => ({ ...prev, notFiledDate: formattedDate }));
    }
  }, [formData.status, formData.notFiledDate]);

  return (
    <div className="app min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">LR Form</h1>
          <div className="flex items-center space-x-2">
            <Switch
              id="noPNC"
              checked={formData.noPNC}
              onCheckedChange={(checked: boolean) => setFormData({ ...formData, noPNC: checked })}
            />
            <label
              htmlFor="noPNC"
              className="text-base font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              No PNC
            </label>
          </div>
        </div>
        <Form onSubmit={handleSubmit}>
          <div className="space-y-4">
            {/* Status and Case Number Row */}
            <div className="grid grid-cols-2 gap-4">
              {/* Status Dropdown */}
              <div className="space-y-2">
                <label htmlFor="status" className={getLabelClassName('status')}>
                  Status
                </label>
                <Select
                  value={formData.status || 'Pending'}
                  onValueChange={(value: Status) => {
                    if (value === 'Pending' || value === 'Settled' || value === 'LWDA') {
                      setFormData(prevData => ({
                        ...prevData,
                        status: value
                      }));
                    }
                  }}
                >
                  <SelectTrigger className={showValidation && isFieldRequired('status') && !formData.status ? "border-red-500" : ""}>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Pending">Pending</SelectItem>
                    <SelectItem value="Settled">Settled</SelectItem>
                    <SelectItem value="LWDA">LWDA</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Case Number */}
              <div className="space-y-2">
                <label htmlFor="caseNumber" className={getLabelClassName('caseNumber')}>
                  Case Number {isFieldRequired('caseNumber') && <span className="text-red-500">*</span>}
                </label>
                <input
                  type="text"
                  name="caseNumber"
                  id="caseNumber"
                  className={getInputClassName('caseNumber')}
                  value={formData.caseNumber}
                  onChange={(e) => setFormData({ ...formData, caseNumber: e.target.value })}
                />
              </div>
            </div>

            {/* Date Fields Row - For LWDA */}
            {formData.status === 'LWDA' && (
              <div className="grid grid-cols-2 gap-4">
                {/* Filed On */}
                <div className="space-y-2">
                  <label htmlFor="date" className={getLabelClassName('date')}>
                    Filed On {isFieldRequired('date') && <span className="text-red-500">*</span>}
                  </label>
                  <input
                    type="date"
                    name="date"
                    id="date"
                    className={getInputClassName('date')}
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  />
                </div>

                {/* Not Filed in Court as of */}
                <div className="space-y-2">
                  <label htmlFor="notFiledDate" className={getLabelClassName('notFiledDate')}>
                    Not filed in Court as of {isFieldRequired('notFiledDate') && <span className="text-red-500">*</span>}
                  </label>
                  <input
                    type="date"
                    name="notFiledDate"
                    id="notFiledDate"
                    className={getInputClassName('notFiledDate')}
                    value={formData.notFiledDate}
                    onChange={(e) => setFormData({ ...formData, notFiledDate: e.target.value })}
                  />
                </div>
              </div>
            )}

            {/* Attorney and Law Firm Row - For LWDA */}
            {formData.status === 'LWDA' && (
              <div className="grid grid-cols-2 gap-4">
                {/* Attorney */}
                <div className="space-y-2">
                  <label htmlFor="attorney" className={getLabelClassName('attorney')}>
                    Attorney {isFieldRequired('attorney') && <span className="text-red-500">*</span>}
                  </label>
                  <input
                    type="text"
                    name="attorney"
                    id="attorney"
                    className={getInputClassName('attorney')}
                    value={formData.attorney}
                    onChange={(e) => setFormData({ ...formData, attorney: e.target.value })}
                  />
                </div>

                {/* Law Firm */}
                <div className="space-y-2">
                  <label htmlFor="lawFirm" className={getLabelClassName('lawFirm')}>
                    Law Firm {isFieldRequired('lawFirm') && <span className="text-red-500">*</span>}
                  </label>
                  <input
                    type="text"
                    name="lawFirm"
                    id="lawFirm"
                    className={getInputClassName('lawFirm')}
                    value={formData.lawFirm}
                    onChange={(e) => setFormData({ ...formData, lawFirm: e.target.value })}
                  />
                  {(formData.status as Status) === 'Pending' && isPartnerLawFirm && (
                    <p className="text-sm text-red-500">Warning: Partner Law Firm</p>
                  )}
                </div>
              </div>
            )}

            {/* Two Column Grid - Common Fields - Only for Pending and Settled */}
            {(formData.status === 'Pending' || formData.status === 'Settled') && (
              <div className="grid grid-cols-2 gap-4">
                {/* Filed On */}
                <div className="space-y-2">
                  <label htmlFor="date" className={getLabelClassName('date')}>
                    Filed On {isFieldRequired('date') && <span className="text-red-500">*</span>}
                  </label>
                  <input
                    type="date"
                    name="date"
                    id="date"
                    className={getInputClassName('date')}
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  />
                </div>

                {/* Law Firm */}
                <div className="space-y-2">
                  <label htmlFor="lawFirm" className={getLabelClassName('lawFirm')}>
                    Law Firm {isFieldRequired('lawFirm') && <span className="text-red-500">*</span>}
                  </label>
                  <input
                    type="text"
                    name="lawFirm"
                    id="lawFirm"
                    className={getInputClassName('lawFirm')}
                    value={formData.lawFirm}
                    onChange={(e) => setFormData({ ...formData, lawFirm: e.target.value })}
                  />
                </div>
              </div>
            )}

            {/* Time Frame and Definition Match Row - Only for Pending */}
            {formData.status === 'Pending' && (
              <div className="grid grid-cols-2 gap-4">
                {/* Time Frame */}
                <div className="space-y-2">
                  <label htmlFor="timeFrame" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    Time Frame
                  </label>
                  <div className="flex flex-col gap-1">
                    {(() => {
                      if (!formData.date) {
                        return <div className="text-sm text-muted-foreground">Enter Filed On date to calculate</div>;
                      }

                      const filedDate = new Date(formData.date);
                      const today = new Date();
                      const monthsDiff = (today.getFullYear() - filedDate.getFullYear()) * 12 + 
                        (today.getMonth() - filedDate.getMonth());

                      let timeFrame;
                      let isRed = false;

                      if (monthsDiff > 36) {
                        timeFrame = 'More than 36 months ago';
                        isRed = true;
                      } else if (monthsDiff > 12) {
                        timeFrame = 'Between 12-36 months';
                      } else {
                        timeFrame = 'Within 12 months';
                      }

                      return (
                        <div className={`text-base font-medium ${isRed ? 'text-red-600' : 'text-green-600'}`}>
                          {timeFrame}
                        </div>
                      );
                    })()}
                  </div>
                </div>

                {/* Definition Match Dropdown */}
                {!formData.noPNC && (
                  <div className="space-y-2">
                    <label htmlFor="definitionMatch" className={getLabelClassName('definitionMatch')}>
                      Definition Match {isFieldRequired('definitionMatch') && <span className="text-red-500">*</span>}
                    </label>
                    <Select
                      value={formData.definitionMatch}
                      onValueChange={(value: DefinitionMatch) => setFormData({ ...formData, definitionMatch: value })}
                    >
                      <SelectTrigger className={showValidation && isFieldRequired('definitionMatch') && !formData.definitionMatch ? "border-red-500" : ""}>
                        <SelectValue placeholder="Select definition match" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Matches definition">Matches</SelectItem>
                        <SelectItem value="Does NOT match definition">Does not match</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>
            )}

            {/* Definition Mismatch Details - Only show when "Does not match" is selected - For Pending */}
            {formData.status === 'Pending' && !formData.noPNC && formData.definitionMatch === 'Does NOT match definition' && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="definitionMismatchReason" className={getLabelClassName('definitionMismatchReason')}>
                    PNC does not match the definition, as the definition is for {isFieldRequired('definitionMismatchReason') && <span className="text-red-500">*</span>}
                  </label>
                  <input
                    type="text"
                    name="definitionMismatchReason"
                    id="definitionMismatchReason"
                    className={getInputClassName('definitionMismatchReason')}
                    value={formData.definitionMismatchReason}
                    onChange={(e) => setFormData({ ...formData, definitionMismatchReason: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="pncJobTitle" className={getLabelClassName('pncJobTitle')}>
                    whereas our PNC was a {isFieldRequired('pncJobTitle') && <span className="text-red-500">*</span>}
                  </label>
                  <input
                    type="text"
                    name="pncJobTitle"
                    id="pncJobTitle"
                    className={getInputClassName('pncJobTitle')}
                    value={formData.pncJobTitle}
                    onChange={(e) => setFormData({ ...formData, pncJobTitle: e.target.value })}
                  />
                </div>
              </div>
            )}

            {/* Definition Match, PA Date, and FA Date Row - Only for Settled */}
            {formData.status === 'Settled' && (
              <>
                {/* Class/PAGA Radio Buttons - On their own row */}
                <div className="space-y-2">
                  <RadioGroup
                    value={formData.classType}
                    onValueChange={(value: ClassType) => setFormData({ ...formData, classType: value })}
                    className="flex flex-row space-x-4"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="Class" id="class" />
                      <label htmlFor="class" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                        Class
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="PAGA" id="paga" />
                      <label htmlFor="paga" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                        PAGA
                      </label>
                    </div>
                  </RadioGroup>
                </div>

                {/* PA and FA Dates - On the same row */}
                <div className="grid grid-cols-2 gap-4">
                  {/* PA Date */}
                  {formData.classType === 'Class' && (
                    <div className="space-y-2 pr-4 border-r border-gray-200">
                      <label htmlFor="paDate" className={getLabelClassName(formData.customPA ? 'customPAText' : 'paDate')}>
                        PA Date {isFieldRequired(formData.customPA ? 'customPAText' : 'paDate') && <span className="text-red-500">*</span>}
                      </label>
                      {formData.customPA ? (
                        <textarea
                          name="paDate"
                          id="paDate"
                          rows={3}
                          className={`${getInputClassName('customPAText')} ${formData.noPADate ? 'opacity-50 cursor-not-allowed' : ''}`}
                          value={formData.customPAText}
                          onChange={(e) => setFormData({ ...formData, customPAText: e.target.value })}
                          disabled={formData.noPADate}
                          placeholder="Enter custom PA text..."
                        />
                      ) : (
                        <input
                          type="date"
                          name="paDate"
                          id="paDate"
                          className={`${getInputClassName('paDate')} ${formData.noPADate ? 'opacity-50 cursor-not-allowed' : ''}`}
                          value={formData.paDate}
                          onChange={(e) => setFormData({ ...formData, paDate: e.target.value })}
                          disabled={formData.noPADate}
                        />
                      )}
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="scheduledMPA"
                            checked={formData.scheduledMPA}
                            onCheckedChange={(checked) => {
                              setFormData({ 
                                ...formData, 
                                scheduledMPA: checked as boolean,
                                noPADate: checked ? false : formData.noPADate,
                                customPA: checked ? false : formData.customPA
                              });
                            }}
                          />
                          <label
                            htmlFor="scheduledMPA"
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            Scheduled MPA
                          </label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="noPADate"
                            checked={formData.noPADate}
                            onCheckedChange={(checked) => {
                              setFormData({ 
                                ...formData, 
                                noPADate: checked as boolean,
                                scheduledMPA: checked ? false : formData.scheduledMPA,
                                customPA: checked ? false : formData.customPA,
                                paDate: checked ? '' : formData.paDate
                              });
                            }}
                          />
                          <label
                            htmlFor="noPADate"
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            No PA Date
                          </label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="customPA"
                            checked={formData.customPA}
                            onCheckedChange={(checked) => {
                              setFormData({ 
                                ...formData, 
                                customPA: checked as boolean,
                                scheduledMPA: checked ? false : formData.scheduledMPA,
                                noPADate: checked ? false : formData.noPADate,
                                paDate: checked ? '' : formData.paDate,
                                customPAText: checked ? formData.customPAText : ''
                              });
                            }}
                          />
                          <label
                            htmlFor="customPA"
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            Custom
                          </label>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* FA Date */}
                  <div className="space-y-2">
                    <label htmlFor="faDate" className={getLabelClassName(formData.customFA ? 'customFAText' : 'faDate')}>
                      FA Date {isFieldRequired(formData.customFA ? 'customFAText' : 'faDate') && <span className="text-red-500">*</span>}
                    </label>
                    {formData.customFA ? (
                      <textarea
                        name="faDate"
                        id="faDate"
                        rows={3}
                        className={`${getInputClassName('customFAText')} ${formData.noFADate ? 'opacity-50 cursor-not-allowed' : ''}`}
                        value={formData.customFAText}
                        onChange={(e) => setFormData({ ...formData, customFAText: e.target.value })}
                        disabled={formData.noFADate}
                        placeholder="Enter custom FA text..."
                      />
                    ) : (
                      <input
                        type="date"
                        name="faDate"
                        id="faDate"
                        className={`${getInputClassName('faDate')} ${formData.noFADate ? 'opacity-50 cursor-not-allowed' : ''}`}
                        value={formData.faDate}
                        onChange={(e) => setFormData({ ...formData, faDate: e.target.value })}
                        disabled={formData.noFADate}
                      />
                    )}
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="scheduledMFA"
                          checked={formData.scheduledMFA}
                          onCheckedChange={(checked) => {
                            setFormData({ 
                              ...formData, 
                              scheduledMFA: checked as boolean,
                              noFADate: checked ? false : formData.noFADate,
                              customFA: checked ? false : formData.customFA
                            });
                          }}
                        />
                        <label
                          htmlFor="scheduledMFA"
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          Scheduled MFA
                        </label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="noFADate"
                          checked={formData.noFADate}
                          onCheckedChange={(checked) => {
                            setFormData({ 
                              ...formData, 
                              noFADate: checked as boolean,
                              scheduledMFA: checked ? false : formData.scheduledMFA,
                              customFA: checked ? false : formData.customFA,
                              faDate: checked ? '' : formData.faDate
                            });
                          }}
                        />
                        <label
                          htmlFor="noFADate"
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          No FA Date
                        </label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="customFA"
                          checked={formData.customFA}
                          onCheckedChange={(checked) => {
                            setFormData({ 
                              ...formData, 
                              customFA: checked as boolean,
                              scheduledMFA: checked ? false : formData.scheduledMFA,
                              noFADate: checked ? false : formData.noFADate,
                              faDate: checked ? '' : formData.faDate,
                              customFAText: checked ? formData.customFAText : ''
                            });
                          }}
                        />
                        <label
                          htmlFor="customFA"
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          Custom
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* Definition Match, Period End Date, and LDW Date Row - Only for Settled */}
            {formData.status === 'Settled' && (
              <div className={`grid ${formData.noPNC ? 'grid-cols-1' : 'grid-cols-3'} gap-4 border-t border-b border-gray-200 py-4`}>
                {/* Definition Match */}
                {!formData.noPNC && (
                  <div className="space-y-2">
                    <label htmlFor="definitionMatch" className={getLabelClassName('definitionMatch')}>
                      Definition Match {isFieldRequired('definitionMatch') && <span className="text-red-500">*</span>}
                    </label>
                    <Select
                      value={formData.definitionMatch}
                      onValueChange={(value: DefinitionMatch) => setFormData({ ...formData, definitionMatch: value })}
                    >
                      <SelectTrigger className={showValidation && isFieldRequired('definitionMatch') && !formData.definitionMatch ? "border-red-500" : ""}>
                        <SelectValue placeholder="Select definition match" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Matches definition">Matches</SelectItem>
                        <SelectItem value="Does NOT match definition">Does not match</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {/* Period End Date */}
                <div className="space-y-2">
                  <label htmlFor="periodEndDate" className={getLabelClassName('periodEndDate')}>
                    Period End Date {isFieldRequired('periodEndDate') && <span className="text-red-500">*</span>}
                  </label>
                  <input
                    type="date"
                    name="periodEndDate"
                    id="periodEndDate"
                    className={`${getInputClassName('periodEndDate')} ${formData.noPeriodEndDate ? 'opacity-50 cursor-not-allowed' : ''}`}
                    value={formData.periodEndDate}
                    onChange={(e) => setFormData({ ...formData, periodEndDate: e.target.value })}
                    disabled={formData.noPeriodEndDate}
                  />
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="noPeriodEndDate"
                      checked={formData.noPeriodEndDate}
                      onCheckedChange={(checked) => {
                        setFormData({ 
                          ...formData, 
                          noPeriodEndDate: checked as boolean,
                          periodEndDate: checked ? '' : formData.periodEndDate
                        });
                      }}
                    />
                    <label
                      htmlFor="noPeriodEndDate"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      No End Date
                    </label>
                  </div>
                </div>

                {/* LDW Date */}
                {!formData.noPNC && (
                  <div className="space-y-2">
                    <label htmlFor="ldwDate" className={getLabelClassName('ldwDate')}>
                      LDW Date {isFieldRequired('ldwDate') && <span className="text-red-500">*</span>}
                    </label>
                    <input
                      type="date"
                      name="ldwDate"
                      id="ldwDate"
                      className={getInputClassName('ldwDate')}
                      value={formData.ldwDate}
                      onChange={(e) => setFormData({ ...formData, ldwDate: e.target.value })}
                    />
                  </div>
                )}
              </div>
            )}

            {/* Definition Mismatch Details - Only show when "Does not match" is selected - For Settled */}
            {formData.status === 'Settled' && !formData.noPNC && formData.definitionMatch === 'Does NOT match definition' && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="definitionMismatchReason" className={getLabelClassName('definitionMismatchReason')}>
                    PNC does not match the definition, as the definition is for {isFieldRequired('definitionMismatchReason') && <span className="text-red-500">*</span>}
                  </label>
                  <input
                    type="text"
                    name="definitionMismatchReason"
                    id="definitionMismatchReason"
                    className={getInputClassName('definitionMismatchReason')}
                    value={formData.definitionMismatchReason}
                    onChange={(e) => setFormData({ ...formData, definitionMismatchReason: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="pncJobTitle" className={getLabelClassName('pncJobTitle')}>
                    whereas our PNC was a {isFieldRequired('pncJobTitle') && <span className="text-red-500">*</span>}
                  </label>
                  <input
                    type="text"
                    name="pncJobTitle"
                    id="pncJobTitle"
                    className={getInputClassName('pncJobTitle')}
                    value={formData.pncJobTitle}
                    onChange={(e) => setFormData({ ...formData, pncJobTitle: e.target.value })}
                  />
                </div>
              </div>
            )}

            {/* Liability Calc */}
            {formData.status === 'Settled' && formData.definitionMatch === 'Matches definition' && formData.periodEndDate && formData.ldwDate && (() => {
              const periodEnd = new Date(formData.periodEndDate);
              const elevenMonthsLater = new Date(periodEnd);
              elevenMonthsLater.setMonth(periodEnd.getMonth() + 11);
              const today = new Date();
              const hasPassed = today >= elevenMonthsLater;
              const ldwDate = new Date(formData.ldwDate);
              const isLDWAfterPeriodEnd = ldwDate > periodEnd;

              if (hasPassed && isLDWAfterPeriodEnd) {
                return (
                  <div className="space-y-2">
                    <label htmlFor="liabilityCalc" className={getLabelClassName('liabilityCalc')}>
                      Liability Calc {isFieldRequired('liabilityCalc') && <span className="text-red-500">*</span>}
                    </label>
                    <div className="flex items-center">
                      <span className="mr-2">$</span>
                      <input
                        type="text"
                        name="liabilityCalc"
                        id="liabilityCalc"
                        className={getInputClassName('liabilityCalc')}
                        value={formData.liabilityCalc}
                        onChange={handleLiabilityCalcChange}
                        placeholder="0.00"
                      />
                    </div>
                  </div>
                );
              }
              return null;
            })()}

            {/* Description Toggle - Only for Settled */}
            {formData.status === 'Settled' && (
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="hasDescription"
                  checked={formData.hasDescription}
                  onCheckedChange={(checked) => setFormData({ ...formData, hasDescription: checked as boolean })}
                />
                <label
                  htmlFor="hasDescription"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Add description?
                </label>
              </div>
            )}

            {/* Description Text Area - Only for Pending or Settled with toggle */}
            {(formData.status === 'Pending' || (formData.status === 'Settled' && formData.hasDescription)) && (
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

            {/* Multiple Defendants Toggle - Only show for Pending and Settled */}
            {(formData.status === 'Pending' || formData.status === 'Settled') && (
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
            )}

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
                    defendantNames: e.target.value.split('\n')
                  })}
                />
              </div>
            )}

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
              <div className="mt-8 p-4 bg-gray-50 rounded-lg">
                <h2 className="text-lg font-semibold mb-4">Formatted Output</h2>
                <div className="font-mono text-sm whitespace-pre-wrap">
                  {formData.status === 'Pending' ? (
                    // Pending form output
                    <ul className="list-disc pl-4">
                      <li>Pending case {formData.caseNumber ? `(${formData.caseNumber})` : ''} filed {(() => {
                        if (!formData.date) return '';
                        const filedDate = new Date(formData.date);
                        const today = new Date();
                        const monthsDiff = (today.getFullYear() - filedDate.getFullYear()) * 12 + 
                          (today.getMonth() - filedDate.getMonth());
                        
                        if (monthsDiff > 36) return 'over 36 months ago';
                        if (monthsDiff > 12) return 'within 12-36 months';
                        return 'within 12 months';
                      })()} on {formatDate(formData.date)} with {isPartnerLawFirm ? <strong>{formData.lawFirm}</strong> : formData.lawFirm}.{!formData.noPNC && (formData.definitionMatch === 'Matches definition' ? ' PNC matches the definition.' : <> <b>PNC does not match the definition</b>, as the definition is for {formData.definitionMismatchReason} whereas our PNC was a {formData.pncJobTitle}.</>)}</li>
                      {(formData.description && formData.description.split('\n').some(line => line.trim())) || (formData.hasMultipleDefendants && formData.defendantNames.length > 0 && formData.defendantNames.some(name => name.trim() !== '')) ? (
                        <li className="!list-none">
                          <ul className="list-disc pl-4">
                            {formData.description && formData.description.split('\n').some(line => line.trim()) && (
                              <>
                                {formData.description.split('\n').map((line, index) => 
                                  line.trim() && <li key={index}>{line.trim()}</li>
                                )}
                              </>
                            )}
                            {formData.hasMultipleDefendants && formData.defendantNames.length > 0 && formData.defendantNames.some(name => name.trim() !== '') && (
                              <li>Defendants: {formData.defendantNames.filter(name => name.trim() !== '').join('; ')}</li>
                            )}
                          </ul>
                        </li>
                      ) : null}
                    </ul>
                  ) : formData.status === 'Settled' ? (
                    // Settled form output
                    <ul className="list-disc pl-4">
                      <li>
                        {`Settled case ${formData.caseNumber ? `(${formData.caseNumber})` : ''} filed on ${formatDate(formData.date)} with ${formData.lawFirm}. `}
                        {formData.classType === 'Class' && !formData.noPADate ? 
                          formData.customPA ? `${formData.customPAText}; ` : 
                          `${formData.scheduledMPA ? 'MPA scheduled on' : 'PA on'} ${formatDate(formData.paDate)}; ` : 
                          formData.classType === 'Class' ? 'No PA scheduled; ' : ''}
                        {!formData.noFADate ? 
                          formData.customFA ? `${formData.customFAText}. ` : 
                          `${formData.scheduledMFA ? 'MFA scheduled on' : 'FA on'} ${formatDate(formData.faDate)}. ` : 
                          `No FA scheduled. `}
                        {!formData.noPNC && (formData.definitionMatch === 'Matches definition' ? 'PNC matches the definition.' : <><b>PNC does not match the definition</b>, as the definition is for {formData.definitionMismatchReason} whereas our PNC was a {formData.pncJobTitle}.</>)}</li>
                      <li className="!list-none">
                        <ul className="list-disc pl-4">
                          {(formData.definitionMatch === 'Matches definition' || formData.noPNC) && formData.periodEndDate && (
                            (() => {
                              const periodEnd = new Date(formData.periodEndDate);
                              const elevenMonthsLater = new Date(periodEnd);
                              elevenMonthsLater.setMonth(periodEnd.getMonth() + 11);
                              const today = new Date();
                              const hasPassed = today >= elevenMonthsLater;

                              if (formData.noPNC) {
                                return <li>{formData.classType} period end date {formatDate(formData.periodEndDate)}. 11 months {hasPassed ? 'have' : 'have not'} passed. {!hasPassed && LAWSUIT_PROBLEM}</li>;
                              }

                              if (formData.ldwDate) {
                                const ldwDate = new Date(formData.ldwDate);
                                const isLDWAfterPeriodEnd = ldwDate > periodEnd;

                                if (isLDWAfterPeriodEnd) {
                                  if (!hasPassed) {
                                    // PNC matches the definition and their LDW falls after the period end date, but 11 months have not passed
                                    return <li>PNC matches the definition and their LDW ({formatDate(formData.ldwDate)}) falls after the {formData.classType} period end date ({formatDate(formData.periodEndDate)}). However, 11 months have not passed since the period end date. {LAWSUIT_PROBLEM}</li>;
                                  } else {
                                    // PNC matches the definition and their LDW falls after the period end date, and 11 months have passed
                                    return <li>PNC matches the definition, but their LDW ({formatDate(formData.ldwDate)}) falls after the {formData.classType} period end date ({formatDate(formData.periodEndDate)}). 11 months have passed.</li>;
                                  }
                                } else {
                                  // PNC matches the definition and their LDW falls within the period end date
                                  return <li>PNC matches the definition and their LDW ({formatDate(formData.ldwDate)}) falls within the {formData.classType} period end date ({formatDate(formData.periodEndDate)}). 11 months {hasPassed ? 'have' : 'have not'} passed. {LAWSUIT_PROBLEM}</li>;
                                }
                              }
                              return null;
                            })()
                          )}
                          {formData.hasDescription && formData.description && formData.description.split('\n').some(line => line.trim()) && (
                            <>
                              {formData.description.split('\n').map((line, index) => 
                                line.trim() && <li key={index}>{line.trim()}</li>
                              )}
                            </>
                          )}
                          {formData.hasMultipleDefendants && formData.defendantNames.length > 0 && formData.defendantNames.some(name => name.trim() !== '') && (
                            <li>Released Defendants: {formData.defendantNames.filter(name => name.trim() !== '').join('; ')}</li>
                          )}
                          {formData.definitionMatch === 'Matches definition' && formData.periodEndDate && formData.ldwDate && (() => {
                            const periodEnd = new Date(formData.periodEndDate);
                            const elevenMonthsLater = new Date(periodEnd);
                            elevenMonthsLater.setMonth(periodEnd.getMonth() + 11);
                            const today = new Date();
                            const hasPassed = today >= elevenMonthsLater;
                            const ldwDate = new Date(formData.ldwDate);
                            const isLDWAfterPeriodEnd = ldwDate > periodEnd;

                            if (hasPassed && isLDWAfterPeriodEnd && formData.liabilityCalc) {
                              return <li>Liability Calc: ${formatLiabilityCalc(formData.liabilityCalc)}</li>;
                            }
                            return null;
                          })()}
                        </ul>
                      </li>
                    </ul>
                  ) : (
                    // LWDA form output
                    <ul className="list-disc pl-4">
                      <li>LWDA filing {formData.caseNumber ? `(${formData.caseNumber})` : ''} filed on {formatDate(formData.date)} by {formData.attorney} ({formData.lawFirm}). Case has not been filed in Court as of {formatDate(formData.notFiledDate)}.</li>
                    </ul>
                  )}
                </div>
              </div>
            )}
          </div>
        </Form>
      </div>
    </div>
  )
}

export default App