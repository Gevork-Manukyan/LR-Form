import { FormData, Status } from '../../../types/form'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../ui/select"

interface StatusAndCaseNumberProps {
  formData: FormData
  setFormData: (data: FormData) => void
  showValidation: boolean
  isFieldRequired: (field: keyof FormData) => boolean
  getInputClassName: (field: keyof FormData) => string
  getLabelClassName: (field: keyof FormData) => string
}

export function StatusAndCaseNumber({
  formData,
  setFormData,
  showValidation,
  isFieldRequired,
  getInputClassName,
  getLabelClassName
}: StatusAndCaseNumberProps) {
  return (
    <div className="grid grid-cols-2 gap-4">
      {/* Status Dropdown */}
      <div className="space-y-2">
        <label htmlFor="status" className={getLabelClassName('status')}>
          Status
        </label>
        <Select
          value={formData.status || 'Pending'}
          onValueChange={(value: Status) => {
            if (value === 'Pending' || value === 'Settled' || value === 'LWDA') {
              setFormData({
                ...formData,
                status: value
              });
            }
          }}
        >
          <SelectTrigger className={showValidation && isFieldRequired('status') && !formData.status ? "border-red-500" : ""}>
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Pending">Pending</SelectItem>
            <SelectItem value="Settled">Settled</SelectItem>
            <SelectItem value="LWDA">LWDA</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Case Number */}
      <div className="space-y-2">
        <label htmlFor="caseNumber" className={getLabelClassName('caseNumber')}>
          Case Number {isFieldRequired('caseNumber') && <span className="text-red-500">*</span>}
        </label>
        <input
          type="text"
          name="caseNumber"
          id="caseNumber"
          className={getInputClassName('caseNumber')}
          value={formData.caseNumber}
          onChange={(e) => setFormData({ ...formData, caseNumber: e.target.value })}
        />
      </div>
    </div>
  )
} 