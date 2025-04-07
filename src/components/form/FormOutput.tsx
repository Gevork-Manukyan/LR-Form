import { FormData } from '../../types/form'

function formatArrayWithConjunction(items: string[]): string {
  if (items.length === 0) return '';
  if (items.length === 1) return items[0];
  if (items.length === 2) return `${items[0]} and ${items[1]}`;
  return `${items.slice(0, -1).join(', ')}, and ${items[items.length - 1]}`;
}

const LAWSUIT_PROBLEM = <strong>Lawsuit Problem</strong>

interface FormOutputProps {
  formData: FormData
  isPartnerLawFirm: boolean
  isSpecialLawFirm: boolean
}

export function FormOutput({ formData, isPartnerLawFirm, isSpecialLawFirm }: FormOutputProps) {
  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString + 'T00:00:00');
    return `${String(date.getMonth() + 1).padStart(2, '0')}/${String(date.getDate()).padStart(2, '0')}/${date.getFullYear()}`;
  }

  const formatLiabilityCalc = (value: string) => {
    if (!value) return '';
    const num = parseFloat(value);
    if (isNaN(num)) return '';
    return num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  const lines: string[] = [];

  // Case Number
  lines.push(`Case Number: ${formData.caseNumber}`);

  // Date
  lines.push(`Date: ${formData.date}`);

  // Status-specific fields
  if (formData.status === 'LWDA') {
    lines.push(`Not Filed in Court: ${formData.notFiledDate}`);
    lines.push(`Attorney: ${formatArrayWithConjunction(formData.attorney)}`);
    lines.push(`Law Firm: ${formatArrayWithConjunction(formData.lawFirm)}`);
  } else {
    // Pending or Settled
    if (formData.status === 'Settled') {
      if (formData.classType === 'Class') {
        if (formData.customPA) {
          lines.push(`PA Date: ${formData.customPAText}`);
        } else {
          lines.push(`PA Date: ${formData.paDate}`);
        }
      }
      if (formData.customFA) {
        lines.push(`FA Date: ${formData.customFAText}`);
      } else {
        lines.push(`FA Date: ${formData.faDate}`);
      }
      if (!formData.noPeriodEndDate) {
        lines.push(`Period End Date: ${formData.periodEndDate}`);
      }
      if (!formData.noPNC) {
        lines.push(`LDW Date: ${formData.ldwDate}`);
      }
    }
    lines.push(`Law Firm: ${formatArrayWithConjunction(formData.lawFirm)}`);
  }

  // PNC-related fields
  if (!formData.noPNC) {
    lines.push(`Definition Match: ${formData.definitionMatch}`);
    if (formData.definitionMatch === 'Does NOT match definition') {
      lines.push(`Definition Mismatch Reason: ${formData.definitionMismatchReason}`);
      lines.push(`PNC Job Title: ${formData.pncJobTitle}`);
    }
  }

  return (
    <div className="mt-8 p-4 bg-gray-50 rounded-lg">
      <h2 className="text-lg font-semibold mb-4">Formatted Output</h2>
      <div className="font-mono text-sm whitespace-pre-wrap">
        {formData.status === 'Pending' ? (
          // Pending form output
          <ul className="list-disc pl-4">
            <li>Pending case {formData.caseNumber ? `(${formData.caseNumber})` : ''} filed {(() => {
              if (!formData.date) return '';
              const filedDate = new Date(formData.date);
              const today = new Date();
              const monthsDiff = (today.getFullYear() - filedDate.getFullYear()) * 12 + 
                (today.getMonth() - filedDate.getMonth());
              
              if (monthsDiff > 36) return 'over 36 months ago';
              if (monthsDiff > 12) return 'within 12-36 months';
              return 'within 12 months';
            })()} on {formatDate(formData.date)} with {(isPartnerLawFirm || isSpecialLawFirm) ? <strong>{formatArrayWithConjunction(formData.lawFirm)}</strong> : formatArrayWithConjunction(formData.lawFirm)}.{!formData.noPNC && (formData.definitionMatch === 'Matches definition' ? ' PNC matches the definition.' : <> <b>PNC does not match the definition</b>, as the definition is for {formData.definitionMismatchReason} whereas our PNC {formData.pncJobTitle}.</>)}</li>
            {(formData.description && formData.description.split('\n').some(line => line.trim())) || (formData.hasMultipleDefendants && formData.defendantNames.length > 0 && formData.defendantNames.some(name => name.trim() !== '')) ? (
              <li className="!list-none">
                <ul className="list-disc pl-4">
                  {formData.description && formData.description.split('\n').some(line => line.trim()) && (
                    <>
                      {formData.description.split('\n').map((line, index) => 
                        line.trim() && <li key={index}>{line.trim()}</li>
                      )}
                    </>
                  )}
                  {formData.hasMultipleDefendants && formData.defendantNames.length > 0 && formData.defendantNames.some(name => name.trim() !== '') && (
                    <li>Defendants: {formData.defendantNames.filter(name => name.trim() !== '').join('; ')}</li>
                  )}
                </ul>
              </li>
            ) : null}
          </ul>
        ) : formData.status === 'Settled' ? (
          // Settled form output
          <ul className="list-disc pl-4">
            <li>
              {`Settled case ${formData.caseNumber ? `(${formData.caseNumber})` : ''} filed on ${formatDate(formData.date)} with ${formatArrayWithConjunction(formData.lawFirm)}. `}
              {formData.classType === 'Class' && !formData.noPADate ? 
                formData.customPA ? `${formData.customPAText}; ` : 
                `${formData.scheduledMPA ? 'MPA scheduled on' : 'PA on'} ${formatDate(formData.paDate)}; ` : 
                formData.classType === 'Class' ? 'No PA scheduled; ' : ''}
              {!formData.noFADate ? 
                formData.customFA ? `${formData.customFAText}. ` : 
                `${formData.scheduledMFA ? 'MFA scheduled on' : 'FA on'} ${formatDate(formData.faDate)}. ` : 
                `No FA scheduled. `}
              {!formData.noPNC && (formData.definitionMatch === 'Matches definition' ? 'PNC matches the definition.' : <><b>PNC does not match the definition</b>, as the definition is for {formData.definitionMismatchReason} whereas our PNC {formData.pncJobTitle}.</>)}</li>
            <li className="!list-none">
              <ul className="list-disc pl-4">
                {(formData.definitionMatch === 'Matches definition' || formData.noPNC) && formData.periodEndDate && (
                  (() => {
                    const periodEnd = new Date(formData.periodEndDate);
                    const elevenMonthsLater = new Date(periodEnd);
                    elevenMonthsLater.setMonth(periodEnd.getMonth() + 11);
                    const today = new Date();
                    const hasPassed = today >= elevenMonthsLater;

                    if (formData.noPNC) {
                      return <li>{formData.classType} period end date {formatDate(formData.periodEndDate)}. 11 months {hasPassed ? 'have' : 'have not'} passed. {!hasPassed && LAWSUIT_PROBLEM}</li>;
                    }

                    if (formData.ldwDate) {
                      const ldwDate = new Date(formData.ldwDate);
                      const isLDWAfterPeriodEnd = ldwDate > periodEnd;

                      if (isLDWAfterPeriodEnd) {
                        if (!hasPassed) {
                          // PNC matches the definition and their LDW falls after the period end date, but 11 months have not passed
                          return <li>PNC matches the definition and their LDW ({formatDate(formData.ldwDate)}) falls after the {formData.classType} period end date ({formatDate(formData.periodEndDate)}). However, 11 months have not passed since the period end date. {LAWSUIT_PROBLEM}</li>;
                        } else {
                          // PNC matches the definition and their LDW falls after the period end date, and 11 months have passed
                          return <li>PNC matches the definition, but their LDW ({formatDate(formData.ldwDate)}) falls after the {formData.classType} period end date ({formatDate(formData.periodEndDate)}). 11 months have passed.</li>;
                        }
                      } else {
                        // PNC matches the definition and their LDW falls within the period end date
                        return <li>PNC matches the definition and their LDW ({formatDate(formData.ldwDate)}) falls within the {formData.classType} period end date ({formatDate(formData.periodEndDate)}). 11 months {hasPassed ? 'have' : 'have not'} passed. {LAWSUIT_PROBLEM}</li>;
                      }
                    }
                    return null;
                  })()
                )}
                {formData.hasDescription && formData.description && formData.description.split('\n').some(line => line.trim()) && (
                  <>
                    {formData.description.split('\n').map((line, index) => 
                      line.trim() && <li key={index}>{line.trim()}</li>
                    )}
                  </>
                )}
                {formData.hasMultipleDefendants && formData.defendantNames.length > 0 && formData.defendantNames.some(name => name.trim() !== '') && (
                  <li>Released Defendants: {formData.defendantNames.filter(name => name.trim() !== '').join('; ')}</li>
                )}
                {formData.definitionMatch === 'Matches definition' && formData.periodEndDate && formData.ldwDate && (() => {
                  const periodEnd = new Date(formData.periodEndDate);
                  const elevenMonthsLater = new Date(periodEnd);
                  elevenMonthsLater.setMonth(periodEnd.getMonth() + 11);
                  const today = new Date();
                  const hasPassed = today >= elevenMonthsLater;
                  const ldwDate = new Date(formData.ldwDate);
                  const isLDWAfterPeriodEnd = ldwDate > periodEnd;

                  if (hasPassed && isLDWAfterPeriodEnd && formData.liabilityCalc) {
                    return <li>Liability Calc: ${formatLiabilityCalc(formData.liabilityCalc)}</li>;
                  }
                  return null;
                })()}
              </ul>
            </li>
          </ul>
        ) : (
          // LWDA form output
          <ul className="list-disc pl-4">
            <li>LWDA filing {formData.caseNumber ? `(${formData.caseNumber})` : ''} filed on {formatDate(formData.date)} by {formatArrayWithConjunction(formData.attorney)} ({formatArrayWithConjunction(formData.lawFirm)}). Case has not been filed in Court as of {formatDate(formData.notFiledDate)}.</li>
          </ul>
        )}
      </div>
    </div>
  )
} 