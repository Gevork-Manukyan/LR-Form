import { create } from 'zustand';

interface PNCInfo {
  name: string;
  ldwDate: string;
}

interface PNCInfoState {
  pncInfo: PNCInfo;
  updatePNCInfo: (info: PNCInfo) => void;
  resetPNCInfo: () => void;
}

const defaultPNCInfo: PNCInfo = {
  name: '',
  ldwDate: '',
};

export const usePNCInfoStore = create<PNCInfoState>((set) => ({
  pncInfo: defaultPNCInfo,
  
  updatePNCInfo: (info: PNCInfo) => {
    set({ pncInfo: info });
    localStorage.setItem('pncInfo', JSON.stringify(info));
  },

  resetPNCInfo: () => {
    set({ pncInfo: defaultPNCInfo });
    localStorage.removeItem('pncInfo');
  },
})); 