import { FormData, DefinitionMatch } from '../../../types/form'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../ui/select"
import { LawFirmField } from './LawFirmField'
import { AttorneyField } from './AttorneyField'
import { SPECIAL_ATTORNEY } from '../../../lib/constants'

interface PendingFieldsProps {
  formData: FormData
  setFormData: (data: FormData) => void
  showValidation: boolean
  isFieldRequired: (field: keyof FormData) => boolean
  getInputClassName: (field: keyof FormData) => string
  getLabelClassName: (field: keyof FormData) => string
  isPartnerLawFirm: boolean
  isSpecialLawFirm: boolean
}

export function PendingFields({
  formData,
  setFormData,
  showValidation,
  isFieldRequired,
  getInputClassName,
  getLabelClassName,
  isPartnerLawFirm,
  isSpecialLawFirm
}: PendingFieldsProps) {
  if (formData.status !== 'Pending') return null;

  return (
    <>
      {/* Law Firm and Time Frame Row */}
      <div className="grid grid-cols-2 gap-4">
        {/* Law Firm */}
        <div className="space-y-2">
          {formData.noLawFirm ? (
            <AttorneyField
              formData={formData}
              setFormData={setFormData}
              showValidation={showValidation}
              isFieldRequired={isFieldRequired}
              getInputClassName={getInputClassName}
              getLabelClassName={getLabelClassName}
            />
          ) : (
            <LawFirmField
              formData={formData}
              setFormData={setFormData}
              showValidation={showValidation}
              isFieldRequired={isFieldRequired}
              getInputClassName={getInputClassName}
              getLabelClassName={getLabelClassName}
            />
          )}
          {isPartnerLawFirm && (
            <p className="text-sm text-red-500">Warning: Partner Law Firm</p>
          )}
          {isSpecialLawFirm && (
            <p className="text-sm text-red-500">Warning: Send Email to CTD Review</p>
          )}
          {formData.noLawFirm && formData.attorney.some(attorney => 
            SPECIAL_ATTORNEY.some(special => 
              attorney.toLowerCase().includes(special.toLowerCase())
            )
          ) && (
            <p className="text-sm text-red-500">Warning: If not filed with D. Law, treat as LP based on partner attorney, but notify manager about case</p>
          )}
        </div>

        {/* Time Frame */}
        <div className="space-y-2">
          <label htmlFor="timeFrame" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            Time Frame
          </label>
          <div className="flex flex-col gap-1">
            {(() => {
              if (!formData.date) {
                return <div className="text-sm text-muted-foreground">Enter Filed On date to calculate</div>;
              }

              const filedDate = new Date(formData.date);
              const today = new Date();

              // Check if the date is in the future
              if (filedDate > today) {
                return (
                  <div className="text-base font-medium text-red-600">
                    Invalid: Date is in the future
                  </div>
                );
              }

              // Use exact date difference for edge case handling
              const fullThreeYearsAgo = new Date(today);
              fullThreeYearsAgo.setFullYear(today.getFullYear() - 3);

              const fullOneYearAgo = new Date(today);
              fullOneYearAgo.setFullYear(today.getFullYear() - 1);

              let timeFrame;
              let isRed = false;

              if (filedDate <= fullThreeYearsAgo) {
                timeFrame = 'More than 36 months ago';
                isRed = true;
              } else if (filedDate <= fullOneYearAgo) {
                timeFrame = 'Between 12-36 months';
              } else {
                timeFrame = 'Within 12 months';
              }

              return (
                <div className={`text-base font-medium ${isRed ? 'text-red-600' : 'text-green-600'}`}>
                  {timeFrame}
                </div>
              );
            })()}
          </div>
        </div>
      </div>

      {/* Definition Match Row */}
      {!formData.noPNC && (
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label htmlFor="definitionMatch" className={getLabelClassName('definitionMatch')}>
              Definition Match {isFieldRequired('definitionMatch') && <span className="text-red-500">*</span>}
            </label>
            <Select
              value={formData.definitionMatch}
              onValueChange={(value: DefinitionMatch) => setFormData({ ...formData, definitionMatch: value })}
            >
              <SelectTrigger className={showValidation && isFieldRequired('definitionMatch') && !formData.definitionMatch ? "border-red-500" : ""}>
                <SelectValue placeholder="Select definition match" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Matches definition">Matches</SelectItem>
                <SelectItem value="Does NOT match definition">Does not match</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      )}

      {/* Definition Mismatch Details */}
      {!formData.noPNC && formData.definitionMatch === 'Does NOT match definition' && (
        <div className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="definitionMismatchReason" className={getLabelClassName('definitionMismatchReason')}>
              PNC does not match the definition, as the definition is for {isFieldRequired('definitionMismatchReason') && <span className="text-red-500">*</span>}
            </label>
            <input
              type="text"
              name="definitionMismatchReason"
              id="definitionMismatchReason"
              className={getInputClassName('definitionMismatchReason')}
              value={formData.definitionMismatchReason}
              onChange={(e) => setFormData({ ...formData, definitionMismatchReason: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="pncJobTitle" className={getLabelClassName('pncJobTitle')}>
              whereas our PNC {isFieldRequired('pncJobTitle') && <span className="text-red-500">*</span>}
            </label>
            <input
              type="text"
              name="pncJobTitle"
              id="pncJobTitle"
              className={getInputClassName('pncJobTitle')}
              value={formData.pncJobTitle}
              onChange={(e) => setFormData({ ...formData, pncJobTitle: e.target.value })}
            />
          </div>
        </div>
      )}
    </>
  )
} 