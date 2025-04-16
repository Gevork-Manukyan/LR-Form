import { LawsuitFormData } from '../../../types/form';

interface CaseNumberProps {
  formData: LawsuitFormData;
  setFormData: (data: LawsuitFormData) => void;
  showValidation: boolean;
  isFieldRequired: (field: keyof LawsuitFormData) => boolean;
  getInputClassName: (field: keyof LawsuitFormData) => string;
  getLabelClassName: (field: keyof LawsuitFormData) => string;
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
