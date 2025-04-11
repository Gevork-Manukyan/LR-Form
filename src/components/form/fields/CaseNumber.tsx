import { FormData } from '../../../types/form';

interface CaseNumberProps {
  formData: FormData;
  setFormData: (data: FormData) => void;
  showValidation: boolean;
  isFieldRequired: (field: keyof FormData) => boolean;
  getInputClassName: (field: keyof FormData) => string;
  getLabelClassName: (field: keyof FormData) => string;
}

export function CaseNumber({
  formData,
  setFormData,
  isFieldRequired,
  getInputClassName,
  getLabelClassName,
}: CaseNumberProps) {
  return (
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
        onChange={e => setFormData({ ...formData, caseNumber: e.target.value })}
      />
    </div>
  );
}
