import { FormData } from '../../../types/form'
import { TagInput } from "../../ui/tag-input"

interface AttorneyFieldProps {
  formData: FormData
  setFormData: (data: FormData) => void
  showValidation: boolean
  isFieldRequired: (field: keyof FormData) => boolean
  getInputClassName: (field: keyof FormData) => string
  getLabelClassName: (field: keyof FormData) => string
}

export function AttorneyField({
  formData,
  setFormData,
  showValidation,
  isFieldRequired,
  getInputClassName,
  getLabelClassName
}: AttorneyFieldProps) {
  return (
    <div className="space-y-2">
      <label htmlFor="attorney" className={getLabelClassName('attorney')}>
        Attorney Name {isFieldRequired('attorney') && <span className="text-red-500">*</span>}
      </label>
      <TagInput
        tags={formData.attorney}
        onChange={(tags) => setFormData({ ...formData, attorney: tags })}
        placeholder="Enter attorney name"
        className={`${getInputClassName('attorney')} ${showValidation && isFieldRequired('attorney') && formData.attorney.length === 0 ? "border-red-500" : ""}`}
      />
    </div>
  )
} 