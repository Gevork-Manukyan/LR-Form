import { FormData } from '../../../types/form'
import { TagInput } from '../../ui/tag-input'

interface LWDAFieldsProps {
  formData: FormData
  setFormData: (data: FormData) => void
  isFieldRequired: (field: keyof FormData) => boolean
  getInputClassName: (field: keyof FormData) => string
  getLabelClassName: (field: keyof FormData) => string
}

export function LWDAFields({ formData, setFormData, getInputClassName, getLabelClassName }: LWDAFieldsProps) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className={getLabelClassName('attorney')}>
            Attorney Name
          </label>
          <TagInput
            tags={formData.attorney}
            onChange={(tags: string[]) => setFormData({ ...formData, attorney: tags })}
            placeholder="Enter attorney name"
            className={getInputClassName('attorney')}
          />
        </div>
        <div className="space-y-2">
          <label className={getLabelClassName('lawFirm')}>
            Law Firm
          </label>
          <TagInput
            tags={formData.lawFirm}
            onChange={(tags: string[]) => setFormData({ ...formData, lawFirm: tags })}
            placeholder="Enter law firm name"
            className={getInputClassName('lawFirm')}
          />
        </div>
      </div>
      <div className="space-y-2">
        <label className={getLabelClassName('notFiledDate')}>
          Not Filed Date
        </label>
        <input
          type="date"
          value={formData.notFiledDate}
          onChange={(e) => setFormData({ ...formData, notFiledDate: e.target.value })}
          className={getInputClassName('notFiledDate')}
        />
      </div>
    </div>
  )
} 