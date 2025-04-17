import { Form } from '../components/ui/form';
import { useState, useEffect } from 'react';
import { FormFields } from '../components/form/FormFields';
import { FormOutput } from '../components/form/FormOutput';
import {
  isFieldRequired,
  getInputClassName,
  getLabelClassName,
  validateForm,
} from '../components/form/FormValidation';
import { Sidebar } from '../components/ui/Sidebar';
import { HamburgerMenu } from '../components/ui/HamburgerMenu';
import { SidebarToggle } from '../components/ui/SidebarToggle';
import { ChevronRight } from 'lucide-react';
import { ConfirmationModal } from '../components/ui/ConfirmationModal';
import { useLawsuitStore } from '../store/lawsuitStore';
import { useLawFirmType } from '../../src/hooks/useLawFirmType';

interface LawsuitProps {
  id: string;
  onRemove?: (id: string) => void;
  isCollapsed?: boolean;
  ldwDate: string;
  shouldShowValidation?: boolean;
}

export default function Lawsuit({ id, onRemove, isCollapsed: externalIsCollapsed, ldwDate, shouldShowValidation = false }: LawsuitProps) {
  const { updateLawsuit, removeLawsuit, getLawsuit, defaultFormData } = useLawsuitStore();
  const formData = useLawsuitStore(state => state.lawsuits[id] || getLawsuit(id));
  const { isPartnerLawFirm, isSpecialLawFirm } = useLawFirmType(formData);

  const [showOutput, setShowOutput] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [showValidation, setShowValidation] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isClearConfirming, setIsClearConfirming] = useState(false);

  // Update isMinimized when externalIsCollapsed changes
  useEffect(() => {
    if (externalIsCollapsed !== undefined) {
      setIsMinimized(externalIsCollapsed);
    }
  }, [externalIsCollapsed]);

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
      updateLawsuit(id, { ...formData, isLDWAfterPeriodEnd });
    }
  }, [formData.periodEndDate, formData.ldwDate, id, formData, updateLawsuit]);

  // Set initial load to false after mount
  useEffect(() => {
    setIsInitialLoad(false);
  }, []);

  // Add this after the handleLiabilityCalcChange function
  useEffect(() => {
    if (formData.status === 'LWDA' && !formData.notFiledDate) {
      const today = new Date();
      const formattedDate = today.toISOString().split('T')[0];
      updateLawsuit(id, { ...formData, notFiledDate: formattedDate });
    }
  }, [formData.status, formData.notFiledDate, id, formData, updateLawsuit]);

  // Reset clear confirmation after 3 seconds if not clicked
  useEffect(() => {
    if (isClearConfirming) {
      const timer = setTimeout(() => {
        setIsClearConfirming(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isClearConfirming]);

  // Update showValidation when shouldShowValidation changes
  useEffect(() => {
    if (shouldShowValidation && !validateForm(formData, ldwDate)) {
      setShowValidation(true);
    } else {
      setShowValidation(false);
    }
  }, [shouldShowValidation, formData, ldwDate]);

  const handleSubmit = () => {
    setShowValidation(true);

    if (validateForm(formData, ldwDate)) {
      setShowOutput(!showOutput);
    }
  };

  const handleClear = () => {
    if (!isClearConfirming) {
      setIsClearConfirming(true);
      return;
    }
    
    updateLawsuit(id, defaultFormData);
    setShowOutput(false);
    setShowValidation(false);
    setIsClearConfirming(false);
  };

  const handleRemove = () => {
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = () => {
    if (onRemove) {
      removeLawsuit(id);
      onRemove(id);
    }
    setShowDeleteModal(false);
  };

  return (
    <div className={`max-w-3xl w-[1000px] relative ${shouldShowValidation && !validateForm(formData, ldwDate) ? 'border-2 border-red-500 rounded-lg' : ''}`}>
      <div className="bg-white rounded-lg shadow relative z-10">
        <div className="flex justify-between items-center">
          <button
            onClick={() => setIsMinimized(!isMinimized)}
            className="flex flex-row items-center flex-1 p-6 hover:bg-gray-100 rounded-lg transition-transform duration-300"
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
              <div
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="flex-1 p-6 hover:bg-gray-100 rounded flex items-center justify-center cursor-pointer"
              >
                <HamburgerMenu isOpen={isSidebarOpen} onClick={() => {}} />
              </div>
            )}
          </div>
        </div>
        <div className={`px-6 transition-all duration-300 ${isMinimized ? 'h-0 overflow-hidden' : 'h-auto pb-6'}`}>
          {!isMinimized && (
            <>
              <Form className='mt-4' onSubmit={handleSubmit}>
                <FormFields
                  formData={formData}
                  setFormData={(newData) => updateLawsuit(id, newData)}
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
                    className={`inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-destructive text-destructive-foreground hover:bg-destructive/90 h-10 px-4 py-2 ${isClearConfirming ? 'animate-pulse' : ''}`}
                  >
                    {isClearConfirming ? 'Confirm?' : 'Clear'}
                  </button>
                </div>

                {showOutput && (
                  <div className="mt-8 p-4 bg-gray-50 rounded-lg">
                    <h2 className="text-lg font-semibold mb-4">Formatted Output</h2>
                    <FormOutput
                      formData={formData}
                      isPartnerLawFirm={isPartnerLawFirm}
                      isSpecialLawFirm={isSpecialLawFirm}
                      ldwDate={ldwDate}
                    />
                  </div>
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
              onCheckedChange={checked => updateLawsuit(id, { ...formData, noPNC: checked })}
            />
            <SidebarToggle
              id="limitedClaims"
              label="Limited Claims"
              checked={formData.limitedClaims}
              onCheckedChange={checked => updateLawsuit(id, { ...formData, limitedClaims: checked })}
            />
            <SidebarToggle
              id="noLawFirm"
              label="No Law Firm"
              checked={formData.noLawFirm}
              onCheckedChange={checked => updateLawsuit(id, { ...formData, noLawFirm: checked })}
            />
          </div>
        </div>
      </Sidebar>
    </div>
  );
}
