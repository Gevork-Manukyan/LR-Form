import { LawsuitFormData } from '../../../types/form';
import { LawFirmField } from './LawFirmField';
import { AttorneyField } from './AttorneyField';
import { SPECIAL_ATTORNEY } from '../../../lib/constants';
import { DefinitionMatchField } from './DefinitionMatchField'
import { usePNCInfoStore } from '../../../store/pncInfoStore';
import { Checkbox } from '../../ui/checkbox';

interface PendingFieldsProps {
  formData: LawsuitFormData;
  setFormData: (data: LawsuitFormData) => void;
  showValidation: boolean;
  isFieldRequired: (field: keyof LawsuitFormData) => boolean;
  getInputClassName: (field: keyof LawsuitFormData) => string;
  getLabelClassName: (field: keyof LawsuitFormData) => string;
  isPartnerLawFirm: boolean;
  isSpecialLawFirm: boolean;
}

export function PendingFields({
  formData,
  setFormData,
  showValidation,
  isFieldRequired,
  getInputClassName,
  getLabelClassName,
  isPartnerLawFirm,
  isSpecialLawFirm,
}: PendingFieldsProps) {
  const { pncInfo } = usePNCInfoStore();

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
          {isPartnerLawFirm && <p className="text-sm text-red-500">Warning: Partner Law Firm</p>}
          {isSpecialLawFirm && (
            <p className="text-sm text-red-500">Warning: Send Email to CTD Review</p>
          )}
          {formData.noLawFirm &&
            formData.attorney.some(attorney =>
              SPECIAL_ATTORNEY.some(special =>
                attorney.toLowerCase().includes(special.toLowerCase())
              )
            ) && (
              <p className="text-sm text-red-500">
                Warning: If not filed with D. Law, treat as LP based on partner attorney, but notify
                manager about case
              </p>
            )}
        </div>

        {/* Time Frame */}
        <div className="space-y-2">
          <label
            htmlFor="timeFrame"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Time Frame
          </label>
          <div className="flex flex-col gap-1">
            {(() => {
              if (!formData.date) {
                return (
                  <div className="text-sm text-muted-foreground">
                    Enter Filed On date to calculate
                  </div>
                );
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
                <div
                  className={`text-base font-medium ${isRed ? 'text-red-600' : 'text-green-600'}`}
                >
                  {timeFrame}
                </div>
              );
            })()}
          </div>
        </div>
      </div>

      {/* LWDA PAGA Maintainability */}
      <div className="grid grid-cols-3 gap-4">
        {/* Plaintiff LDW Date */}
        <div className="space-y-2">
          <label htmlFor="plaintiffLDW" className={getLabelClassName('plaintiffLDW')}>
            Plaintiff LDW
            {!formData.noPlaintiffLDW && <span className="text-red-500">*</span>}
          </label>
          <input
            type="date"
            name="plaintiffLDW"
            id="plaintiffLDW"
            className={getInputClassName('plaintiffLDW')}
            value={formData.plaintiffLDW}
            onChange={e => setFormData({ ...formData, plaintiffLDW: e.target.value })}
            disabled={formData.noPlaintiffLDW}
          />
          <div className="flex items-center space-x-2">
            <Checkbox
              id="noPlaintiffLDW"
              checked={formData.noPlaintiffLDW}
              onCheckedChange={(checked) => {
                setFormData({
                  ...formData,
                  noPlaintiffLDW: checked as boolean,
                  plaintiffLDW: checked ? '' : formData.plaintiffLDW,
                  noLWDANotice: checked as boolean,
                  lwdaNoticeDate: checked ? '' : formData.lwdaNoticeDate
                });
              }}
            />
            <label
              htmlFor="noPlaintiffLDW"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              No LDW Date
            </label>
          </div>
        </div>

        {!formData.noPlaintiffLDW && (
          <>
            {/* LWDA Notice Filing Date */}
            <div className="space-y-2">
              <label htmlFor="lwdaNoticeDate" className={getLabelClassName('lwdaNoticeDate')}>
                LWDA Notice Filing
                {!formData.noLWDANotice && <span className="text-red-500">*</span>}
              </label>
              <input
                type="date"
                name="lwdaNoticeDate"
                id="lwdaNoticeDate"
                className={getInputClassName('lwdaNoticeDate')}
                value={formData.lwdaNoticeDate}
                onChange={e => setFormData({ ...formData, lwdaNoticeDate: e.target.value })}
                disabled={formData.noLWDANotice}
              />
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="noLWDANotice"
                  checked={formData.noLWDANotice}
                  onCheckedChange={(checked) => {
                    setFormData({
                      ...formData,
                      noLWDANotice: checked as boolean,
                      lwdaNoticeDate: checked ? '' : formData.lwdaNoticeDate
                    });
                  }}
                />
                <label
                  htmlFor="noLWDANotice"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  No LWDA Notice
                </label>
              </div>
            </div>

            {/* PAGA Maintainability */}
            <div className="space-y-2">
              <label className="block text-sm font-medium">
                PAGA Maintainability
              </label>
              <div className="h-[38px] flex items-center">
                {(() => {
                  // Show instruction if either date is missing or their respective checkboxes are checked
                  if (!formData.plaintiffLDW || formData.noPlaintiffLDW || 
                      (!formData.lwdaNoticeDate && !formData.noLWDANotice)) {
                    return (
                      <div className="text-sm text-muted-foreground">
                        Enter LDW Date and LWDA Notice Filing Date to calculate
                      </div>
                    );
                  }

                  // Create date in local timezone by adding time component
                  const ldwDate = new Date(formData.plaintiffLDW + 'T12:00:00');
                  const noticeDate = new Date(formData.lwdaNoticeDate + 'T12:00:00');
                  let inWaitingPeriod = false;
                  const today = new Date();
                  // Calculate the end of the waiting period (notice date + 65 days)
                  const waitingPeriodEnd = new Date(noticeDate);
                  waitingPeriodEnd.setDate(noticeDate.getDate() + 65);

                  const solPeriod = new Date(ldwDate);

                  // add 1 year to the ldw date
                  solPeriod.setFullYear(ldwDate.getFullYear() + 1);

                  // if there is a lwda notice, then add 65 days to the one year from ldw date
                  if (!formData.noLWDANotice) {
                    solPeriod.setDate(solPeriod.getDate() + 65);
                    
                    // Check if today is within the waiting period (between notice date and waiting period end)
                    inWaitingPeriod = today >= noticeDate && today <= waitingPeriodEnd;
                  }

                  // if the sol period is after the today's date, then return green
                  if (solPeriod >= today) {
                    return <div className="text-green-600">CAN Maintain PAGA{inWaitingPeriod ? ` (In Waiting Period until ${waitingPeriodEnd.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' })})` : ""}</div>;
                  }

                  // otherwise return red
                  return <div className="text-red-600">CANNOT Maintain PAGA</div>;
                })()}
              </div>
            </div>
          </>
        )}
      </div>

      {/* Definition Match Row */}
      {!pncInfo.noPNC && (
        <div className="grid grid-cols-2 gap-4">
            <DefinitionMatchField
              value={formData.definitionMatch}
              onChange={(value) => setFormData({ ...formData, definitionMatch: value })}
              getLabelClassName={(field: string) => getLabelClassName(field as keyof LawsuitFormData)}
            />
        </div>
      )}

      {/* Definition Mismatch Details */}
      {!pncInfo.noPNC && formData.definitionMatch === 'Does NOT match definition' && (
        <div className="space-y-4">
          <div className="space-y-2">
            <label
              htmlFor="definitionMismatchReason"
              className={getLabelClassName('definitionMismatchReason')}
            >
              PNC does not match the definition, as the definition is for{' '}
              {isFieldRequired('definitionMismatchReason') && (
                <span className="text-red-500">*</span>
              )}
            </label>
            <input
              type="text"
              name="definitionMismatchReason"
              id="definitionMismatchReason"
              className={getInputClassName('definitionMismatchReason')}
              value={formData.definitionMismatchReason}
              onChange={e => setFormData({ ...formData, definitionMismatchReason: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="pncJobTitle" className={getLabelClassName('pncJobTitle')}>
              whereas our PNC{' '}
              {isFieldRequired('pncJobTitle') && <span className="text-red-500">*</span>}
            </label>
            <input
              type="text"
              name="pncJobTitle"
              id="pncJobTitle"
              className={getInputClassName('pncJobTitle')}
              value={formData.pncJobTitle}
              onChange={e => setFormData({ ...formData, pncJobTitle: e.target.value })}
            />
          </div>
        </div>
      )}
    </>
  );
}
