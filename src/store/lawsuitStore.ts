import { create } from 'zustand';
import { LawsuitFormData } from '../types/form';

interface LawsuitState {
  lawsuits: Record<string, LawsuitFormData>;
  lawsuitOrder: string[];
  defaultFormData: LawsuitFormData;
  addLawsuit: (id: string, formData: LawsuitFormData, index: number) => void;
  updateLawsuit: (id: string, formData: LawsuitFormData) => void;
  removeLawsuit: (id: string) => void;
  getLawsuit: (id: string) => LawsuitFormData;
  getLawsuitOrder: () => string[];
}

export const defaultFormData: LawsuitFormData = {
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
  limitedClaims: false,
  noLawFirm: false,
};

export const useLawsuitStore = create<LawsuitState>((set, get) => {
  // Load from localStorage on store creation
  const savedLawsuits = localStorage.getItem('lawsuits');
  const savedOrder = localStorage.getItem('lawsuitOrder');
  const initialLawsuits = savedLawsuits ? JSON.parse(savedLawsuits) : {};
  const initialOrder = savedOrder ? JSON.parse(savedOrder) : [];

  return {
    lawsuits: initialLawsuits,
    lawsuitOrder: initialOrder,
    defaultFormData,
    
    addLawsuit: (id: string, formData: LawsuitFormData, index: number) => {
      set((state) => {
        const newOrder = [...state.lawsuitOrder];
        newOrder.splice(index, 0, id);
        const newState = {
          lawsuits: {
            ...state.lawsuits,
            [id]: formData,
          },
          lawsuitOrder: newOrder,
        };
        localStorage.setItem('lawsuits', JSON.stringify(newState.lawsuits));
        localStorage.setItem('lawsuitOrder', JSON.stringify(newState.lawsuitOrder));
        return newState;
      });
    },

    updateLawsuit: (id: string, formData: LawsuitFormData) => {
      set((state) => {
        const newState = {
          ...state,
          lawsuits: {
            ...state.lawsuits,
            [id]: formData,
          },
        };
        localStorage.setItem('lawsuits', JSON.stringify(newState.lawsuits));
        return newState;
      });
    },

    removeLawsuit: (id: string) => {
      set((state) => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { [id]: _, ...rest } = state.lawsuits;
        const newOrder = state.lawsuitOrder.filter(lawsuitId => lawsuitId !== id);
        const newState = {
          lawsuits: rest,
          lawsuitOrder: newOrder,
        };
        localStorage.setItem('lawsuits', JSON.stringify(newState.lawsuits));
        localStorage.setItem('lawsuitOrder', JSON.stringify(newState.lawsuitOrder));
        return newState;
      });
    },

    getLawsuit: (id: string) => {
      return get().lawsuits[id] || defaultFormData;
    },

    getLawsuitOrder: () => {
      return get().lawsuitOrder;
    },
  };
}); 