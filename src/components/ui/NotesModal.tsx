import { Modal } from './Modal';
import { useLawsuitStore } from '../../store/lawsuitStore';
import { FormOutput } from '../form/FormOutput';
import { useLawFirmType } from '../../hooks/useLawFirmType';
import { usePNCInfoStore } from '../../store/pncInfoStore';
import { LawsuitFormData } from '../../types/form';

interface NotesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface LawsuitEntryProps {
  lawsuit: LawsuitFormData;
  ldwDate: string;
}

function LawsuitEntry({ lawsuit, ldwDate }: LawsuitEntryProps) {
  const { isPartnerLawFirm, isSpecialLawFirm } = useLawFirmType(lawsuit);
  
  return (
    <div className="mb-6 last:mb-0">
      <FormOutput
        formData={lawsuit}
        isPartnerLawFirm={isPartnerLawFirm}
        isSpecialLawFirm={isSpecialLawFirm}
        ldwDate={ldwDate}
      />
    </div>
  );
}

export function NotesModal({ isOpen, onClose }: NotesModalProps) {
  const lawsuits = useLawsuitStore(state => state.lawsuits);
  const lawsuitOrder = useLawsuitStore(state => state.lawsuitOrder);
  const { pncInfo } = usePNCInfoStore();

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Combined Notes">
      <div className="mt-4">
        <div className="p-4 bg-gray-50 rounded-lg">
          <div className="font-mono text-sm whitespace-pre-wrap">
            {lawsuitOrder.length === 0 ? (
              <p className="text-gray-500">No notes available</p>
            ) : (
              lawsuitOrder.map((id) => (
                <LawsuitEntry key={id} lawsuit={lawsuits[id]} ldwDate={pncInfo.ldwDate} />
              ))
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
} 