import { FormData } from '../../../types/form'
import { TagInput } from '../../ui/tag-input'
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
          <label className={getLabelClassName('attorney')}>
            Attorney Name {isFieldRequired('attorney') && <span className="text-red-500">*</span>}
          </label>
          <TagInput
            tags={formData.attorney}
            onChange={(tags: string[]) => setFormData({ ...formData, attorney: tags })}
            placeholder="Enter attorney name"
            className={getInputClassName('attorney')}
          />
        </div>

        <LawFirmField
          formData={formData}
          setFormData={setFormData}
          showValidation={showValidation}
          isFieldRequired={isFieldRequired}
          getInputClassName={getInputClassName}
          getLabelClassName={getLabelClassName}
        />
      </div>
    </div>
  )
} 