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
      {/* Date Fields Row */}
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