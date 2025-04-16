import { Form } from '../components/ui/form';
import { FormData } from '../types/form';
import { useState, useEffect } from 'react';
import { FormFields } from '../components/form/FormFields';
import { FormOutput } from '../components/form/FormOutput';
import {
  isFieldRequired,
  getInputClassName,
  getLabelClassName,
  validateForm,
} from '../components/form/FormValidation';
import { PARTNER_LAWFIRMS, SPECIAL_LAWFIRMS } from '../lib/constants';
import { Sidebar } from '../components/ui/Sidebar';
import { HamburgerMenu } from '../components/ui/HamburgerMenu';
import { SidebarToggle } from '../components/ui/SidebarToggle';
import { ChevronRight } from 'lucide-react';
import { ConfirmationModal } from '../components/ui/ConfirmationModal';

interface LawsuitProps {
  id: string;
  onRemove?: (id: string) => void;
  isCollapsed?: boolean;
  ldwDate: string;
}

export default function Lawsuit({ id, onRemove, isCollapsed: externalIsCollapsed, ldwDate }: LawsuitProps) {
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
    noLawFirm: false,
  });
  const [showOutput, setShowOutput] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [showValidation, setShowValidation] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Update isMinimized when externalIsCollapsed changes
  useEffect(() => {
    if (externalIsCollapsed !== undefined) {
      setIsMinimized(externalIsCollapsed);
    }
  }, [externalIsCollapsed]);

  // Add these near the top of the component
  const isPartnerLawFirm = PARTNER_LAWFIRMS.some(partnerFirm =>
    formData.lawFirm.some(firm => firm.trim().toLowerCase().includes(partnerFirm.toLowerCase()))
  );
  const isSpecialLawFirm = SPECIAL_LAWFIRMS.some(specialFirm =>
    formData.lawFirm.some(firm => firm.trim().toLowerCase().includes(specialFirm.toLowerCase()))
  );

  // Hide output when form data changes
  useEffect(() => {
    if (!isInitialLoad) {
      setShowOutput(false);
    }
  }, [formData, isInitialLoad]);

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
    const savedLawsuits = localStorage.getItem('lawsuits');
    if (savedLawsuits) {
      try {
        const lawsuits = JSON.parse(savedLawsuits);
        const savedFormData = lawsuits[id];
        if (savedFormData) {
          // Ensure lawFirm is an array
          if (!Array.isArray(savedFormData.lawFirm)) {
            savedFormData.lawFirm = savedFormData.lawFirm ? [savedFormData.lawFirm] : [];
          }
          // Ensure attorney is an array
          if (!Array.isArray(savedFormData.attorney)) {
            savedFormData.attorney = savedFormData.attorney ? [savedFormData.attorney] : [];
          }
          setFormData(savedFormData);
        }
      } catch (error) {
        console.error('Error loading form data:', error);
      }
    }
    setIsInitialLoad(false);
  }, [id]);

  // Save form data to localStorage whenever it changes
  useEffect(() => {
    if (!isInitialLoad) {
      try {
        const savedLawsuits = localStorage.getItem('lawsuits');
        const lawsuits = savedLawsuits ? JSON.parse(savedLawsuits) : {};
        lawsuits[id] = formData;
        localStorage.setItem('lawsuits', JSON.stringify(lawsuits));
      } catch (error) {
        console.error('Error saving form data:', error);
      }
    }
  }, [formData, isInitialLoad, id]);

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
  };

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
      noLawFirm: false,
    });
    const savedLawsuits = localStorage.getItem('lawsuits');
    if (savedLawsuits) {
      const lawsuits = JSON.parse(savedLawsuits);
      delete lawsuits[id];
      localStorage.setItem('lawsuits', JSON.stringify(lawsuits));
    }
    setShowOutput(false);
    setShowValidation(false);
  };

  const handleRemove = () => {
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = () => {
    if (onRemove) {
      const savedLawsuits = localStorage.getItem('lawsuits');
      if (savedLawsuits) {
        const lawsuits = JSON.parse(savedLawsuits);
        delete lawsuits[id];
        localStorage.setItem('lawsuits', JSON.stringify(lawsuits));
      }
      onRemove(id);
    }
    setShowDeleteModal(false);
  };

  return (
    <div className="max-w-3xl w-[1000px] relative">
      <div className="bg-white rounded-lg shadow relative z-10">
        <div className="flex justify-between items-center">
          <button
            onClick={() => setIsMinimized(!isMinimized)}
            className="flex flex-row items-center flex-1 p-6 hover:bg-gray-100 rounded transition-transform duration-300"
          >
            <ChevronRight className={`mr-2 w-5 h-5 transition-transform duration-300 ${!isMinimized ? 'rotate-90' : ''}`} />
            <h2 className="text-2xl font-bold">{formData.caseNumber || 'New Case'}</h2>
          </button>
          <div className={`flex items-center`}>
            {/* Delete Button */}
            {onRemove && (
              <button
                onClick={handleRemove}
                className="flex-1 p-7 hover:bg-gray-100 rounded text-red-500 flex items-center justify-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 6h18" />
                  <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                  <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                </svg>
              </button>
            )}

            {/* Sidebar Button */}
            {!isMinimized && (
              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="flex-1 p-6 hover:bg-gray-100 rounded flex items-center justify-center"
              >
                <HamburgerMenu isOpen={isSidebarOpen} onClick={() => {}} />
              </button>
            )}
          </div>
        </div>
        <div className={`px-6 transition-all duration-300 ${isMinimized ? 'h-0 overflow-hidden' : 'h-auto pb-6'}`}>
          {!isMinimized && (
            <>
              <Form className='mt-4' onSubmit={handleSubmit}>
                <FormFields
                  formData={formData}
                  setFormData={setFormData}
                  showValidation={showValidation}
                  isFieldRequired={field => isFieldRequired(field, formData)}
                  getInputClassName={field => getInputClassName(field, showValidation, formData)}
                  getLabelClassName={field => getLabelClassName(field, showValidation, formData)}
                  isPartnerLawFirm={isPartnerLawFirm}
                  isSpecialLawFirm={isSpecialLawFirm}
                  ldwDate={ldwDate}
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

                {showOutput && (
                  <FormOutput
                    formData={formData}
                    isPartnerLawFirm={isPartnerLawFirm}
                    isSpecialLawFirm={isSpecialLawFirm}
                    ldwDate={ldwDate}
                  />
                )}
              </Form>
            </>
          )}
        </div>
      </div>

      <ConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Case"
        message="Are you sure you want to delete this case? This action cannot be undone."
      />

      {/* Sidebar */}
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)}>
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Settings</h2>
          <div className="space-y-4">
            <SidebarToggle
              id="noPNC"
              label="No PNC"
              checked={formData.noPNC}
              onCheckedChange={checked => setFormData({ ...formData, noPNC: checked })}
            />
            <SidebarToggle
              id="limitedClaims"
              label="Limited Claims"
              checked={formData.limitedClaims}
              onCheckedChange={checked => setFormData({ ...formData, limitedClaims: checked })}
            />
            <SidebarToggle
              id="noLawFirm"
              label="No Law Firm"
              checked={formData.noLawFirm}
              onCheckedChange={checked => setFormData({ ...formData, noLawFirm: checked })}
            />
          </div>
        </div>
      </Sidebar>
    </div>
  );
}
