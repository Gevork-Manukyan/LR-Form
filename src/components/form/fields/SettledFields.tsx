import { FormData, DefinitionMatch, ClassType } from '../../../types/form'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../ui/select"
import { Checkbox } from "../../ui/checkbox"
import { RadioGroup, RadioGroupItem } from "../../ui/radio-group"

interface SettledFieldsProps {
  formData: FormData
  setFormData: (data: FormData) => void
  showValidation: boolean
  isFieldRequired: (field: keyof FormData) => boolean
  getInputClassName: (field: keyof FormData) => string
  getLabelClassName: (field: keyof FormData) => string
}

export function SettledFields({
  formData,
  setFormData,
  showValidation,
  isFieldRequired,
  getInputClassName,
  getLabelClassName
}: SettledFieldsProps) {
  if (formData.status !== 'Settled') return null;

  const handleLiabilityCalcChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Allow empty string or numbers with up to 2 decimal places
    if (value === '' || /^\d*\.?\d{0,2}$/.test(value)) {
      setFormData({ ...formData, liabilityCalc: value });
    }
  };

  return (
    <>
      {/* Two Column Grid - Common Fields */}
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

      {/* Class/PAGA Radio Buttons */}
      <div className="space-y-2">
        <RadioGroup
          value={formData.classType}
          onValueChange={(value: ClassType) => setFormData({ ...formData, classType: value })}
          className="flex flex-row space-x-4"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="Class" id="class" />
            <label htmlFor="class" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              Class
            </label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="PAGA" id="paga" />
            <label htmlFor="paga" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              PAGA
            </label>
          </div>
        </RadioGroup>
      </div>

      {/* PA and FA Dates */}
      <div className="grid grid-cols-2 gap-4">
        {/* PA Date */}
        {formData.classType === 'Class' && (
          <div className="space-y-2 pr-4 border-r border-gray-200">
            <label htmlFor="paDate" className={getLabelClassName(formData.customPA ? 'customPAText' : 'paDate')}>
              PA Date {isFieldRequired(formData.customPA ? 'customPAText' : 'paDate') && <span className="text-red-500">*</span>}
            </label>
            {formData.customPA ? (
              <textarea
                name="paDate"
                id="paDate"
                rows={3}
                className={`${getInputClassName('customPAText')} ${formData.noPADate ? 'opacity-50 cursor-not-allowed' : ''}`}
                value={formData.customPAText}
                onChange={(e) => setFormData({ ...formData, customPAText: e.target.value })}
                disabled={formData.noPADate}
                placeholder="Enter custom PA text..."
              />
            ) : (
              <input
                type="date"
                name="paDate"
                id="paDate"
                className={`${getInputClassName('paDate')} ${formData.noPADate ? 'opacity-50 cursor-not-allowed' : ''}`}
                value={formData.paDate}
                onChange={(e) => setFormData({ ...formData, paDate: e.target.value })}
                disabled={formData.noPADate}
              />
            )}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="scheduledMPA"
                  checked={formData.scheduledMPA}
                  onCheckedChange={(checked) => {
                    setFormData({ 
                      ...formData, 
                      scheduledMPA: checked as boolean,
                      noPADate: checked ? false : formData.noPADate,
                      customPA: checked ? false : formData.customPA
                    });
                  }}
                />
                <label
                  htmlFor="scheduledMPA"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Scheduled MPA
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="noPADate"
                  checked={formData.noPADate}
                  onCheckedChange={(checked) => {
                    setFormData({ 
                      ...formData, 
                      noPADate: checked as boolean,
                      scheduledMPA: checked ? false : formData.scheduledMPA,
                      customPA: checked ? false : formData.customPA,
                      paDate: checked ? '' : formData.paDate
                    });
                  }}
                />
                <label
                  htmlFor="noPADate"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  No PA Date
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="customPA"
                  checked={formData.customPA}
                  onCheckedChange={(checked) => {
                    setFormData({ 
                      ...formData, 
                      customPA: checked as boolean,
                      scheduledMPA: checked ? false : formData.scheduledMPA,
                      noPADate: checked ? false : formData.noPADate,
                      paDate: checked ? '' : formData.paDate,
                      customPAText: checked ? formData.customPAText : ''
                    });
                  }}
                />
                <label
                  htmlFor="customPA"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Custom
                </label>
              </div>
            </div>
          </div>
        )}

        {/* FA Date */}
        <div className="space-y-2">
          <label htmlFor="faDate" className={getLabelClassName(formData.customFA ? 'customFAText' : 'faDate')}>
            FA Date {isFieldRequired(formData.customFA ? 'customFAText' : 'faDate') && <span className="text-red-500">*</span>}
          </label>
          {formData.customFA ? (
            <textarea
              name="faDate"
              id="faDate"
              rows={3}
              className={`${getInputClassName('customFAText')} ${formData.noFADate ? 'opacity-50 cursor-not-allowed' : ''}`}
              value={formData.customFAText}
              onChange={(e) => setFormData({ ...formData, customFAText: e.target.value })}
              disabled={formData.noFADate}
              placeholder="Enter custom FA text..."
            />
          ) : (
            <input
              type="date"
              name="faDate"
              id="faDate"
              className={`${getInputClassName('faDate')} ${formData.noFADate ? 'opacity-50 cursor-not-allowed' : ''}`}
              value={formData.faDate}
              onChange={(e) => setFormData({ ...formData, faDate: e.target.value })}
              disabled={formData.noFADate}
            />
          )}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="scheduledMFA"
                checked={formData.scheduledMFA}
                onCheckedChange={(checked) => {
                  setFormData({ 
                    ...formData, 
                    scheduledMFA: checked as boolean,
                    noFADate: checked ? false : formData.noFADate,
                    customFA: checked ? false : formData.customFA
                  });
                }}
              />
              <label
                htmlFor="scheduledMFA"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Scheduled MFA
              </label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="noFADate"
                checked={formData.noFADate}
                onCheckedChange={(checked) => {
                  setFormData({ 
                    ...formData, 
                    noFADate: checked as boolean,
                    scheduledMFA: checked ? false : formData.scheduledMFA,
                    customFA: checked ? false : formData.customFA,
                    faDate: checked ? '' : formData.faDate
                  });
                }}
              />
              <label
                htmlFor="noFADate"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                No FA Date
              </label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="customFA"
                checked={formData.customFA}
                onCheckedChange={(checked) => {
                  setFormData({ 
                    ...formData, 
                    customFA: checked as boolean,
                    scheduledMFA: checked ? false : formData.scheduledMFA,
                    noFADate: checked ? false : formData.noFADate,
                    faDate: checked ? '' : formData.faDate,
                    customFAText: checked ? formData.customFAText : ''
                  });
                }}
              />
              <label
                htmlFor="customFA"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Custom
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Definition Match, Period End Date, and LDW Date Row */}
      <div className={`grid ${formData.noPNC ? 'grid-cols-1' : 'grid-cols-3'} gap-4 border-t border-b border-gray-200 py-4`}>
        {/* Definition Match */}
        {!formData.noPNC && (
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
        )}

        {/* Period End Date */}
        <div className="space-y-2">
          <label htmlFor="periodEndDate" className={getLabelClassName('periodEndDate')}>
            Period End Date {isFieldRequired('periodEndDate') && <span className="text-red-500">*</span>}
          </label>
          <input
            type="date"
            name="periodEndDate"
            id="periodEndDate"
            className={`${getInputClassName('periodEndDate')} ${formData.noPeriodEndDate ? 'opacity-50 cursor-not-allowed' : ''}`}
            value={formData.periodEndDate}
            onChange={(e) => setFormData({ ...formData, periodEndDate: e.target.value })}
            disabled={formData.noPeriodEndDate}
          />
          <div className="flex items-center space-x-2">
            <Checkbox
              id="noPeriodEndDate"
              checked={formData.noPeriodEndDate}
              onCheckedChange={(checked) => {
                setFormData({ 
                  ...formData, 
                  noPeriodEndDate: checked as boolean,
                  periodEndDate: checked ? '' : formData.periodEndDate
                });
              }}
            />
            <label
              htmlFor="noPeriodEndDate"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              No End Date
            </label>
          </div>
        </div>

        {/* LDW Date */}
        {!formData.noPNC && (
          <div className="space-y-2">
            <label htmlFor="ldwDate" className={getLabelClassName('ldwDate')}>
              LDW Date {isFieldRequired('ldwDate') && <span className="text-red-500">*</span>}
            </label>
            <input
              type="date"
              name="ldwDate"
              id="ldwDate"
              className={getInputClassName('ldwDate')}
              value={formData.ldwDate}
              onChange={(e) => setFormData({ ...formData, ldwDate: e.target.value })}
            />
          </div>
        )}
      </div>

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
              whereas our PNC was a {isFieldRequired('pncJobTitle') && <span className="text-red-500">*</span>}
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

      {/* Liability Calc */}
      {formData.definitionMatch === 'Matches definition' && formData.periodEndDate && formData.ldwDate && (() => {
        const periodEnd = new Date(formData.periodEndDate);
        const elevenMonthsLater = new Date(periodEnd);
        elevenMonthsLater.setMonth(periodEnd.getMonth() + 11);
        const today = new Date();
        const hasPassed = today >= elevenMonthsLater;
        const ldwDate = new Date(formData.ldwDate);
        const isLDWAfterPeriodEnd = ldwDate > periodEnd;

        if (hasPassed && isLDWAfterPeriodEnd) {
          return (
            <div className="space-y-2">
              <label htmlFor="liabilityCalc" className={getLabelClassName('liabilityCalc')}>
                Liability Calc {isFieldRequired('liabilityCalc') && <span className="text-red-500">*</span>}
              </label>
              <div className="flex items-center">
                <span className="mr-2">$</span>
                <input
                  type="text"
                  name="liabilityCalc"
                  id="liabilityCalc"
                  className={getInputClassName('liabilityCalc')}
                  value={formData.liabilityCalc}
                  onChange={handleLiabilityCalcChange}
                  placeholder="0.00"
                />
              </div>
            </div>
          );
        }
        return null;
      })()}

      {/* Description Toggle */}
      <div className="flex items-center space-x-2">
        <Checkbox
          id="hasDescription"
          checked={formData.hasDescription}
          onCheckedChange={(checked) => setFormData({ ...formData, hasDescription: checked as boolean })}
        />
        <label
          htmlFor="hasDescription"
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          Add description?
        </label>
      </div>
    </>
  )
} 