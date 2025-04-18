import { LawsuitFormData } from '../../../types/form';
import { TagInput } from '../../ui/tag-input';

interface LawFirmFieldProps {
  formData: LawsuitFormData;
  setFormData: (data: LawsuitFormData) => void;
  showValidation: boolean;
  isFieldRequired: (field: keyof LawsuitFormData, formData: LawsuitFormData) => boolean;
  getInputClassName: (field: keyof LawsuitFormData, showValidation: boolean, formData: LawsuitFormData) => string;
  getLabelClassName: (field: keyof LawsuitFormData, showValidation: boolean, formData: LawsuitFormData) => string;
}

export function LawFirmField({
  formData,
  setFormData,
  showValidation,
  isFieldRequired,
  getInputClassName,
  getLabelClassName,
}: LawFirmFieldProps) {
  return (
    <div className="space-y-2">
      <label htmlFor="lawFirm" className={getLabelClassName('lawFirm', showValidation, formData)}>
        Law Firm Name {isFieldRequired('lawFirm', formData) && <span className="text-red-500">*</span>}
      </label>
      <TagInput
        tags={formData.lawFirm}
        onChange={tags => setFormData({ ...formData, lawFirm: tags })}
        placeholder="Enter law firm name and press enter..."
        className={`${getInputClassName('lawFirm', showValidation, formData)} ${showValidation && isFieldRequired('lawFirm', formData) && formData.lawFirm.length === 0 ? 'border-red-500' : ''}`}
      />
    </div>
  );
}
