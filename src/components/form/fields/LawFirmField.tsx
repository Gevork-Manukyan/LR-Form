import { FormData } from '../../../types/form';
import { TagInput } from '../../ui/tag-input';

interface LawFirmFieldProps {
  formData: FormData;
  setFormData: (data: FormData) => void;
  showValidation: boolean;
  isFieldRequired: (field: keyof FormData) => boolean;
  getInputClassName: (field: keyof FormData) => string;
  getLabelClassName: (field: keyof FormData) => string;
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
      <label htmlFor="lawFirm" className={getLabelClassName('lawFirm')}>
        Law Firm {isFieldRequired('lawFirm') && <span className="text-red-500">*</span>}
      </label>
      <TagInput
        tags={formData.lawFirm}
        onChange={tags => setFormData({ ...formData, lawFirm: tags })}
        placeholder="Enter law firm name and press enter..."
        className={`${getInputClassName('lawFirm')} ${showValidation && isFieldRequired('lawFirm') && formData.lawFirm.length === 0 ? 'border-red-500' : ''}`}
      />
    </div>
  );
}
