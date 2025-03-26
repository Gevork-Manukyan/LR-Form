import { FormData, Status, DefinitionMatch, ClassType } from '../../types/form'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select"
import { Checkbox } from "../ui/checkbox"
import { RadioGroup, RadioGroupItem } from "../ui/radio-group"

interface FormFieldsProps {
  formData: FormData
  setFormData: (data: FormData) => void
  showValidation: boolean
  isFieldRequired: (field: keyof FormData) => boolean
  getInputClassName: (field: keyof FormData) => string
  getLabelClassName: (field: keyof FormData) => string
  isPartnerLawFirm: boolean
  isSpecialLawFirm: boolean
}

export function FormFields({
  formData,
  setFormData,
  showValidation,
  isFieldRequired,
  getInputClassName,
  getLabelClassName,
  isPartnerLawFirm,
  isSpecialLawFirm
}: FormFieldsProps) {
  const handleLiabilityCalcChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Allow empty string or numbers with up to 2 decimal places
    if (value === '' || /^\d*\.?\d{0,2}$/.test(value)) {
      setFormData({ ...formData, liabilityCalc: value });
    }
  };

  return (
    <div className="space-y-4">
      {/* Status and Case Number Row */}
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

      {/* Date Fields Row - For LWDA */}
      {formData.status === 'LWDA' && (
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
      )}

      {/* Attorney and Law Firm Row - For LWDA */}
      {formData.status === 'LWDA' && (
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
      )}

      {/* Two Column Grid - Common Fields - Only for Pending and Settled */}
      {(formData.status === 'Pending' || formData.status === 'Settled') && (
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
            {(formData.status as Status) === 'Pending' && (isPartnerLawFirm || isSpecialLawFirm) && (
              <p className="text-sm text-red-500">Warning: {isSpecialLawFirm ? 'Send Email to CTD Review' : 'Partner Law Firm'}</p>
            )}
          </div>
        </div>
      )}

      {/* Time Frame and Definition Match Row - Only for Pending */}
      {formData.status === 'Pending' && (
        <div className="grid grid-cols-2 gap-4">
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
                const monthsDiff = (today.getFullYear() - filedDate.getFullYear()) * 12 + 
                  (today.getMonth() - filedDate.getMonth());

                let timeFrame;
                let isRed = false;

                if (monthsDiff > 36) {
                  timeFrame = 'More than 36 months ago';
                  isRed = true;
                } else if (monthsDiff > 12) {
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

          {/* Definition Match Dropdown */}
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
        </div>
      )}

      {/* Definition Mismatch Details - Only show when "Does not match" is selected - For Pending */}
      {formData.status === 'Pending' && !formData.noPNC && formData.definitionMatch === 'Does NOT match definition' && (
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

      {/* Definition Match, PA Date, and FA Date Row - Only for Settled */}
      {formData.status === 'Settled' && (
        <>
          {/* Class/PAGA Radio Buttons - On their own row */}
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

          {/* PA and FA Dates - On the same row */}
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
        </>
      )}

      {/* Definition Match, Period End Date, and LDW Date Row - Only for Settled */}
      {formData.status === 'Settled' && (
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
      )}

      {/* Definition Mismatch Details - Only show when "Does not match" is selected - For Settled */}
      {formData.status === 'Settled' && !formData.noPNC && formData.definitionMatch === 'Does NOT match definition' && (
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
      {formData.status === 'Settled' && formData.definitionMatch === 'Matches definition' && formData.periodEndDate && formData.ldwDate && (() => {
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

      {/* Description Toggle - Only for Settled */}
      {formData.status === 'Settled' && (
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
      )}

      {/* Description Text Area - Only for Pending or Settled with toggle */}
      {(formData.status === 'Pending' || (formData.status === 'Settled' && formData.hasDescription)) && (
        <div className="space-y-2">
          <label htmlFor="description" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            Description
          </label>
          <textarea
            name="description"
            id="description"
            rows={4}
            className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />
        </div>
      )}

      {/* Multiple Defendants Toggle - Only show for Pending and Settled */}
      {(formData.status === 'Pending' || formData.status === 'Settled') && (
        <div className="flex items-center space-x-2">
          <Checkbox
            id="hasMultipleDefendants"
            checked={formData.hasMultipleDefendants}
            onCheckedChange={(checked) => setFormData({ ...formData, hasMultipleDefendants: checked as boolean })}
          />
          <label
            htmlFor="hasMultipleDefendants"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            More than searched defendant?
          </label>
        </div>
      )}

      {/* Defendant Names List */}
      {formData.hasMultipleDefendants && (
        <div className="space-y-2">
          <label htmlFor="defendantNames" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            Defendant Names (one per line)
          </label>
          <textarea
            name="defendantNames"
            id="defendantNames"
            rows={4}
            className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            value={formData.defendantNames.join('\n')}
            onChange={(e) => setFormData({ 
              ...formData, 
              defendantNames: e.target.value.split('\n')
            })}
          />
        </div>
      )}
    </div>
  )
} 