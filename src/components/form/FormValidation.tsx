import { FormData } from '../../types/form'

export function isFieldRequired(field: keyof FormData, formData: FormData): boolean {
  const requiredFields = ['caseNumber', 'date', 'lawFirm'];
  
  if (formData.status === 'LWDA') {
    return ['caseNumber', 'date', 'lawFirm', 'attorney', 'notFiledDate'].includes(field);
  }

  // Add definitionMatch for all statuses when PNC is not disabled
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
    if (!formData.noFADate) {
      // Require either faDate or customFAText if customFA is checked
      if (formData.customFA) {
        requiredFields.push('customFAText');
      } else {
        requiredFields.push('faDate');
      }
    }
    if (!formData.noPeriodEndDate) requiredFields.push('periodEndDate');
    if (!formData.noPNC) requiredFields.push('ldwDate');
  }

  // Add definition mismatch fields as required when "Does not match" is selected
  if (!formData.noPNC && formData.definitionMatch === 'Does NOT match definition') {
    requiredFields.push('definitionMismatchReason', 'pncJobTitle');
  }

  return requiredFields.includes(field);
}

export function getInputClassName(field: keyof FormData, showValidation: boolean, formData: FormData): string {
  const baseClasses = "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50";
  
  const isArrayField = ['lawFirm', 'attorney', 'defendantNames'].includes(field);
  const isEmpty = isArrayField 
    ? (formData[field] as string[]).length === 0 
    : !formData[field];
  
  if (showValidation && isFieldRequired(field, formData) && isEmpty) {
    return `${baseClasses} border-red-500 focus-visible:ring-red-500`;
  }
  return baseClasses;
}

export function getLabelClassName(field: keyof FormData, showValidation: boolean, formData: FormData): string {
  const baseClasses = "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70";
  
  const isArrayField = ['lawFirm', 'attorney', 'defendantNames'].includes(field);
  const isEmpty = isArrayField 
    ? (formData[field] as string[]).length === 0 
    : !formData[field];
  
  if (showValidation && isFieldRequired(field, formData) && isEmpty) {
    return `${baseClasses} text-red-500`;
  }
  return baseClasses;
}

export function validateForm(formData: FormData): boolean {
  let requiredFields: (keyof FormData)[] = [];
  
  if (formData.status === 'LWDA') {
    requiredFields = ['caseNumber', 'date', 'lawFirm', 'attorney', 'notFiledDate'];
  } else {
    requiredFields = ['caseNumber', 'date', 'lawFirm'];
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
      if (!formData.noFADate) {
        // Require either faDate or customFAText if customFA is checked
        if (formData.customFA) {
          requiredFields.push('customFAText');
        } else {
          requiredFields.push('faDate');
        }
      }
      if (!formData.noPeriodEndDate) requiredFields.push('periodEndDate');
      if (!formData.noPNC) requiredFields.push('ldwDate');
    }

    // Add definition mismatch fields as required when "Does not match" is selected
    if (!formData.noPNC && formData.definitionMatch === 'Does NOT match definition') {
      requiredFields.push('definitionMismatchReason', 'pncJobTitle');
    }
  }

  return requiredFields.every(field => {
    // Special handling for custom text fields
    if (field === 'customPAText' && formData.customPA) {
      return !!formData.customPAText;
    }
    if (field === 'customFAText' && formData.customFA) {
      return !!formData.customFAText;
    }
    
    // Special handling for array fields
    if (['lawFirm', 'attorney', 'defendantNames'].includes(field)) {
      return (formData[field] as string[]).length > 0;
    }
    
    return !!formData[field];
  });
} 