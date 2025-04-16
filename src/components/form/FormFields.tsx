import { LawsuitFormData } from '../../types/form';
import { TopRowFields } from './fields/TopRowFields';
import { StatusTabs } from './fields/StatusTabs';
import { LWDAFields } from './fields/LWDAFields';
import { PendingFields } from './fields/PendingFields';
import { SettledFields } from './fields/SettledFields';
import { CommonFields } from './fields/CommonFields';

interface FormFieldsProps {
  formData: LawsuitFormData;
  setFormData: (data: LawsuitFormData) => void;
  showValidation: boolean;
  isFieldRequired: (field: keyof LawsuitFormData) => boolean;
  getInputClassName: (field: keyof LawsuitFormData) => string;
  getLabelClassName: (field: keyof LawsuitFormData) => string;
  isPartnerLawFirm: boolean;
  isSpecialLawFirm: boolean;
  ldwDate: string;
}

export function FormFields({
  formData,
  setFormData,
  showValidation,
  isFieldRequired,
  getInputClassName,
  getLabelClassName,
  isPartnerLawFirm,
  isSpecialLawFirm,
  ldwDate,
}: FormFieldsProps) {
  return (
    <div className="space-y-4">
      {/* Status Tabs */}
      <StatusTabs formData={formData} setFormData={setFormData} />

      {/* Top Row Fields (Case Number, Filed On, Not Filed in Court for LWDA) */}
      <TopRowFields
        formData={formData}
        setFormData={setFormData}
        showValidation={showValidation}
        isFieldRequired={isFieldRequired}
        getInputClassName={getInputClassName}
        getLabelClassName={getLabelClassName}
      />

      {/* LWDA Fields */}
      {formData.status === 'LWDA' && (
        <LWDAFields
          formData={formData}
          setFormData={setFormData}
          isFieldRequired={isFieldRequired}
          getInputClassName={getInputClassName}
          getLabelClassName={getLabelClassName}
          showValidation={showValidation}
        />
      )}

      {/* Pending Fields */}
      <PendingFields
        formData={formData}
        setFormData={setFormData}
        showValidation={showValidation}
        isFieldRequired={isFieldRequired}
        getInputClassName={getInputClassName}
        getLabelClassName={getLabelClassName}
        isPartnerLawFirm={isPartnerLawFirm}
        isSpecialLawFirm={isSpecialLawFirm}
      />

      {/* Settled Fields */}
      <SettledFields
        formData={formData}
        setFormData={setFormData}
        showValidation={showValidation}
        isFieldRequired={isFieldRequired}
        getInputClassName={getInputClassName}
        getLabelClassName={getLabelClassName}
        ldwDate={ldwDate}
      />

      {/* Common Fields */}
      <CommonFields formData={formData} setFormData={setFormData} />
    </div>
  );
}
