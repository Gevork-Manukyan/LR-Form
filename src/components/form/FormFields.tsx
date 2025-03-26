import { FormData } from '../../types/form'
import { StatusAndCaseNumber } from './fields/StatusAndCaseNumber'
import { LWDAFields } from './fields/LWDAFields'
import { PendingFields } from './fields/PendingFields'
import { SettledFields } from './fields/SettledFields'
import { CommonFields } from './fields/CommonFields'

interface FormFieldsProps {
  formData: FormData
  setFormData: (data: FormData) => void
  showValidation: boolean
  isFieldRequired: (field: keyof FormData) => boolean
  getInputClassName: (field: keyof FormData) => string
  getLabelClassName: (field: keyof FormData) => string
  isPartnerLawFirm: boolean
  isSpecialLawFirm: boolean
}

export function FormFields({
  formData,
  setFormData,
  showValidation,
  isFieldRequired,
  getInputClassName,
  getLabelClassName,
  isPartnerLawFirm,
  isSpecialLawFirm
}: FormFieldsProps) {
  return (
    <div className="space-y-4">
      {/* Status and Case Number Row */}
      <StatusAndCaseNumber
        formData={formData}
        setFormData={setFormData}
        showValidation={showValidation}
        isFieldRequired={isFieldRequired}
        getInputClassName={getInputClassName}
        getLabelClassName={getLabelClassName}
      />

      {/* LWDA Fields */}
      <LWDAFields
        formData={formData}
        setFormData={setFormData}
        isFieldRequired={isFieldRequired}
        getInputClassName={getInputClassName}
        getLabelClassName={getLabelClassName}
      />

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
      />

      {/* Common Fields */}
      <CommonFields
        formData={formData}
        setFormData={setFormData}
      />
    </div>
  )
} 