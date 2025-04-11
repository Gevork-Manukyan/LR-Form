import { FormData } from '../../../types/form'
import { AttorneyField } from './AttorneyField'
import { LawFirmField } from './LawFirmField'

interface LWDAFieldsProps {
  formData: FormData
  setFormData: (data: FormData) => void
  isFieldRequired: (field: keyof FormData) => boolean
  getInputClassName: (field: keyof FormData) => string
  getLabelClassName: (field: keyof FormData) => string
  showValidation: boolean
}

export function LWDAFields({ formData, setFormData, getInputClassName, getLabelClassName, isFieldRequired, showValidation }: LWDAFieldsProps) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <AttorneyField
            formData={formData}
            setFormData={setFormData}
            showValidation={showValidation}
            isFieldRequired={isFieldRequired}
            getInputClassName={getInputClassName}
            getLabelClassName={getLabelClassName}
          />
        </div>

        {!formData.noLawFirm && (
          <LawFirmField
            formData={formData}
            setFormData={setFormData}
            showValidation={showValidation}
            isFieldRequired={isFieldRequired}
            getInputClassName={getInputClassName}
            getLabelClassName={getLabelClassName}
          />
        )}
      </div>
    </div>
  )
} 