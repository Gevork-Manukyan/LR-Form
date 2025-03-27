import { FormData } from '../../../types/form'

interface LWDAFieldsProps {
  formData: FormData
  setFormData: (data: FormData) => void
  isFieldRequired: (field: keyof FormData) => boolean
  getInputClassName: (field: keyof FormData) => string
  getLabelClassName: (field: keyof FormData) => string
}

export function LWDAFields({
  formData,
  setFormData,
  isFieldRequired,
  getInputClassName,
  getLabelClassName
}: LWDAFieldsProps) {
  if (formData.status !== 'LWDA') return null;

  return (
    <>
      {/* Attorney and Law Firm Row */}
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
        </div>
      </div>
    </>
  )
} 