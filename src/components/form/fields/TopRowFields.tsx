import { LawsuitFormData } from '../../../types/form';
import { CaseNumber } from './CaseNumber';
import { FiledOnField } from './FiledOnField';

interface TopRowFieldsProps {
  formData: LawsuitFormData;
  setFormData: (data: LawsuitFormData) => void;
  showValidation: boolean;
  isFieldRequired: (field: keyof LawsuitFormData) => boolean;
  getInputClassName: (field: keyof LawsuitFormData) => string;
  getLabelClassName: (field: keyof LawsuitFormData) => string;
}

export function TopRowFields({
  formData,
  setFormData,
  showValidation,
  isFieldRequired,
  getInputClassName,
  getLabelClassName,
}: TopRowFieldsProps) {
  return (
    <div className="flex space-x-4">
      <div className="flex-1">
        <CaseNumber
          formData={formData}
          setFormData={setFormData}
          showValidation={showValidation}
          isFieldRequired={isFieldRequired}
          getInputClassName={getInputClassName}
          getLabelClassName={getLabelClassName}
        />
      </div>

      <div className="flex-1">
        <FiledOnField
          formData={formData}
          setFormData={setFormData}
          showValidation={showValidation}
          isFieldRequired={isFieldRequired}
          getInputClassName={getInputClassName}
          getLabelClassName={getLabelClassName}
        />
      </div>

      {formData.status === 'LWDA' && (
        <div className="space-y-2 flex-1">
          <label htmlFor="notFiledDate" className={getLabelClassName('notFiledDate')}>
            Not Filed in Court as of{' '}
            {isFieldRequired('notFiledDate') && <span className="text-red-500">*</span>}
          </label>
          <input
            type="date"
            name="notFiledDate"
            id="notFiledDate"
            className={getInputClassName('notFiledDate')}
            value={formData.notFiledDate}
            onChange={e => setFormData({ ...formData, notFiledDate: e.target.value })}
          />
        </div>
      )}
    </div>
  );
}
