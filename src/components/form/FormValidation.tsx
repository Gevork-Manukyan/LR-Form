import { FormData } from '../../types/form';

export function isFieldRequired(field: keyof FormData, formData: FormData, ldwDate?: string): boolean {
  // Always required fields
  if (field === 'caseNumber' || field === 'date') {
    return true;
  }

  // Handle law firm and attorney fields based on noLawFirm
  if (field === 'lawFirm' || field === 'attorney') {
    return true;
  }

  // Handle notFiledDate - required for LWDA cases
  if (field === 'notFiledDate') {
    return formData.status === 'LWDA';
  }

  // Handle FA date - always required for settled cases
  if (field === 'faDate' || field === 'customFAText') {
    return (
      formData.status === 'Settled' &&
      (formData.classType === 'PAGA' || !formData.noPADate) &&
      !formData.noFADate
    );
  }

  // Handle PA date - required for settled cases unless noPADate is true
  if (field === 'paDate' || field === 'customPAText') {
    return formData.status === 'Settled' && formData.classType === 'Class' && !formData.noPADate;
  }

  // Handle definition match - required for settled cases unless noPNC is true
  if (field === 'definitionMatch') {
    return formData.status === 'Settled' && !formData.noPNC;
  }

  // Handle definition mismatch reason - required if definition match is "Does NOT match definition"
  if (field === 'definitionMismatchReason' || field === 'pncJobTitle') {
    return (
      formData.status === 'Settled' &&
      !formData.noPNC &&
      formData.definitionMatch === 'Does NOT match definition'
    );
  }

  // Handle period end date - required for settled cases
  if (field === 'periodEndDate') {
    return formData.status === 'Settled';
  }

  // Handle LDW date - required for settled cases unless noPNC is true
  if (field === 'ldwDate') {
    return formData.status === 'Settled' && !formData.noPNC;
  }

  // Handle liability calc - required for settled cases with specific conditions
  if (field === 'liabilityCalc') {
    if (formData.status !== 'Settled') return false;
    if (!formData.periodEndDate || !ldwDate) return false;
    if (formData.definitionMatch !== 'Matches definition') return false;

    const periodEnd = new Date(formData.periodEndDate);
    const elevenMonthsLater = new Date(periodEnd);
    elevenMonthsLater.setMonth(periodEnd.getMonth() + 11);
    const today = new Date();
    const hasPassed = today >= elevenMonthsLater;
    const ldwDateObj = new Date(ldwDate);
    const isLDWAfterPeriodEnd = ldwDateObj > periodEnd;

    return hasPassed && isLDWAfterPeriodEnd;
  }

  // Handle description - required for settled cases if hasDescription is true
  if (field === 'description') {
    return formData.status === 'Settled' && formData.hasDescription;
  }

  return false;
}

export function getInputClassName(
  field: keyof FormData,
  showValidation: boolean,
  formData: FormData
): string {
  const baseClasses =
    'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50';

  const isArrayField = ['lawFirm', 'attorney', 'defendantNames'].includes(field);
  const isEmpty = isArrayField ? (formData[field] as string[]).length === 0 : !formData[field];

  // Special case for periodEndDate when noPeriodEndDate is true
  if (field === 'periodEndDate' && formData.noPeriodEndDate) {
    return baseClasses;
  }

  if (showValidation && isFieldRequired(field, formData) && isEmpty) {
    return `${baseClasses} border-red-500 focus-visible:ring-red-500`;
  }
  return baseClasses;
}

export function getLabelClassName(
  field: keyof FormData,
  showValidation: boolean,
  formData: FormData
): string {
  const baseClasses =
    'text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70';

  const isArrayField = ['lawFirm', 'attorney', 'defendantNames'].includes(field);
  const isEmpty = isArrayField ? (formData[field] as string[]).length === 0 : !formData[field];

  // Special case for periodEndDate when noPeriodEndDate is true
  if (field === 'periodEndDate' && formData.noPeriodEndDate) {
    return baseClasses;
  }

  if (showValidation && isFieldRequired(field, formData) && isEmpty) {
    return `${baseClasses} text-red-500`;
  }
  return baseClasses;
}

export function validateForm(formData: FormData, ldwDate?: string): boolean {
  let requiredFields: (keyof FormData)[] = [];

  if (formData.status === 'LWDA') {
    requiredFields = ['caseNumber', 'date', 'attorney', 'notFiledDate'];
    if (!formData.noLawFirm) {
      requiredFields.push('lawFirm');
    }
  } else {
    requiredFields = ['caseNumber', 'date'];
    if (!formData.noLawFirm) {
      requiredFields.push('lawFirm');
    } else {
      requiredFields.push('attorney');
    }
    if (!formData.noPNC) {
      requiredFields.push('definitionMatch');
    }

    if (formData.status === 'Settled') {
      if (formData.classType === 'Class' && !formData.noPADate) {
        // Require either paDate or customPAText if customPA is checked
        if (formData.customPA) {
          requiredFields.push('customPAText');
        } else {
          requiredFields.push('paDate');
        }
      }
      if (!formData.noFADate && !formData.noPADate && !formData.scheduledMPA) {
        // Require either faDate or customFAText if customFA is checked
        if (formData.customFA) {
          requiredFields.push('customFAText');
        } else {
          requiredFields.push('faDate');
        }
      }
      if (!formData.noPeriodEndDate) requiredFields.push('periodEndDate');
      if (!formData.noPNC && ldwDate) requiredFields.push('ldwDate');
    }

    // Add definition mismatch fields as required when "Does not match" is selected
    if (!formData.noPNC && formData.definitionMatch === 'Does NOT match definition') {
      requiredFields.push('definitionMismatchReason', 'pncJobTitle');
    }

    // Add liabilityCalc as required when conditions are met
    if (formData.status === 'Settled' && 
        formData.definitionMatch === 'Matches definition' && 
        formData.periodEndDate && 
        ldwDate) {
      const periodEnd = new Date(formData.periodEndDate);
      const elevenMonthsLater = new Date(periodEnd);
      elevenMonthsLater.setMonth(periodEnd.getMonth() + 11);
      const today = new Date();
      const hasPassed = today >= elevenMonthsLater;
      const ldwDateObj = new Date(ldwDate);
      const isLDWAfterPeriodEnd = ldwDateObj > periodEnd;

      if (hasPassed && isLDWAfterPeriodEnd) {
        requiredFields.push('liabilityCalc');
      }
    }
  }

  // Check if all required fields have values
  return requiredFields.every(field => {
    const value = formData[field];
    if (Array.isArray(value)) {
      return value.length > 0;
    }
    return value !== undefined && value !== null && value !== '';
  });
}
