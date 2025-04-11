import { FormData } from '../../../types/form';

interface FiledOnFieldProps {
  formData: FormData;
  setFormData: (data: FormData) => void;
  showValidation: boolean;
  isFieldRequired: (field: keyof FormData) => boolean;
  getInputClassName: (field: keyof FormData) => string;
  getLabelClassName: (field: keyof FormData) => string;
}

export function FiledOnField({
  formData,
  setFormData,
  isFieldRequired,
  getInputClassName,
  getLabelClassName,
}: FiledOnFieldProps) {
  return (
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
        onChange={e => setFormData({ ...formData, date: e.target.value })}
      />
    </div>
  );
}
