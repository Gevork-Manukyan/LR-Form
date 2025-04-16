import { create } from 'zustand';
import { LawsuitFormData } from '../types/form';

interface LawsuitState {
  lawsuits: Record<string, LawsuitFormData>;
  addLawsuit: (id: string, formData: LawsuitFormData) => void;
  updateLawsuit: (id: string, formData: LawsuitFormData) => void;
  removeLawsuit: (id: string) => void;
  getLawsuit: (id: string) => LawsuitFormData;
}

const defaultFormData: LawsuitFormData = {
  status: 'Pending',
  caseNumber: '',
  timeFrame: '12 months',
  date: '',
  lawFirm: [],
  definitionMatch: 'Matches definition',
  description: '',
  hasMultipleDefendants: false,
  defendantNames: [],
  paDate: '',
  faDate: '',
  noPADate: false,
  noFADate: false,
  classType: 'Class',
  periodEndDate: '',
  ldwDate: '',
  isLDWAfterPeriodEnd: false,
  liabilityCalc: '',
  hasDescription: false,
  scheduledMPA: false,
  scheduledMFA: false,
  noPeriodEndDate: false,
  definitionMismatchReason: '',
  pncJobTitle: '',
  notFiledDate: '',
  attorney: [],
  customPA: false,
  customFA: false,
  customPAText: '',
  customFAText: '',
  noPNC: false,
  limitedClaims: false,
  noLawFirm: false,
};

export const useLawsuitStore = create<LawsuitState>((set, get) => ({
  lawsuits: {},
  
  addLawsuit: (id: string, formData: LawsuitFormData) => {
    set((state) => ({
      lawsuits: {
        ...state.lawsuits,
        [id]: formData,
      },
    }));
  },

  updateLawsuit: (id: string, formData: LawsuitFormData) => {
    set((state) => ({
      lawsuits: {
        ...state.lawsuits,
        [id]: formData,
      },
    }));
  },

  removeLawsuit: (id: string) => {
    set((state) => {
      const { [id]: _, ...rest } = state.lawsuits;
      return { lawsuits: rest };
    });
  },

  getLawsuit: (id: string) => {
    return get().lawsuits[id] || defaultFormData;
  },
})); 