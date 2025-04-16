import { PARTNER_LAWFIRMS, SPECIAL_LAWFIRMS } from '../lib/constants';
import { LawsuitFormData } from '../types/form';

export function useLawFirmType(formData: LawsuitFormData) {
  const isPartnerLawFirm = PARTNER_LAWFIRMS.some(partnerFirm =>
    formData.lawFirm.some(firm => firm.trim().toLowerCase().includes(partnerFirm.toLowerCase()))
  );
  const isSpecialLawFirm = SPECIAL_LAWFIRMS.some(specialFirm =>
    formData.lawFirm.some(firm => firm.trim().toLowerCase().includes(specialFirm.toLowerCase()))
  );

  return { isPartnerLawFirm, isSpecialLawFirm };
} 