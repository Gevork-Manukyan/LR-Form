import { ChevronDown, ChevronUp, Trash2, FileText } from 'lucide-react';
import { ConfirmationModal } from './ConfirmationModal';
import { useState } from 'react';
import { NotesModal } from './NotesModal';
import { useLawsuitStore } from '../../store/lawsuitStore';
import { usePNCInfoStore } from '../../store/pncInfoStore';
import { validateForm } from '../form/FormValidation';
import { Toast } from './Toast';

interface NavbarProps {
  onCollapseAll: () => void;
  isAllCollapsed: boolean;
  onDeleteAll: () => void;
  onShowValidation: (show: boolean) => void;
}

export function Navbar({ onCollapseAll, isAllCollapsed, onDeleteAll, onShowValidation }: NavbarProps) {
  const [showDeleteAllModal, setShowDeleteAllModal] = useState(false);
  const [showNotesModal, setShowNotesModal] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const lawsuits = useLawsuitStore(state => state.lawsuits);
  const lawsuitOrder = useLawsuitStore(state => state.lawsuitOrder);
  const { pncInfo } = usePNCInfoStore();

  const handleShowNotes = () => {
    const allValid = lawsuitOrder.every(id => {
      const isValid = validateForm(lawsuits[id], pncInfo.ldwDate)
      // if (!isValid) console.log(pncInfo);
      return isValid;
    });
    if (allValid) {
      setShowNotesModal(true);
      onShowValidation(false);
    } else {
      setShowToast(true);
      onShowValidation(true);
    }
  };

  return (
    <>
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 w-full">
            <div className="flex items-center w-1/4">
              <h1 className="text-xl font-semibold">LR Form</h1>
            </div>
            <div className="flex items-center justify-center flex-1">
              <button
                onClick={handleShowNotes}
                className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-gray-100"
              >
                <FileText className="w-5 h-5" />
                <span>Show Entire Note</span>
              </button>
            </div>
            <div className="w-1/4 flex items-center gap-2">
              <button
                onClick={onCollapseAll}
                className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-gray-100"
              >
                {isAllCollapsed ? (
                  <>
                    <ChevronDown className="w-5 h-5" />
                    <span>Expand All</span>
                  </>
                ) : (
                  <>
                    <ChevronUp className="w-5 h-5" />
                    <span>Collapse All</span>
                  </>
                )}
              </button>
              <button
                onClick={() => setShowDeleteAllModal(true)}
                className="flex items-center gap-2 px-3 py-2 rounded-md text-red-600 hover:bg-red-50"
              >
                <Trash2 className="w-5 h-5" />
                <span>Delete All</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      <ConfirmationModal
        isOpen={showDeleteAllModal}
        onClose={() => setShowDeleteAllModal(false)}
        onConfirm={() => {
          onDeleteAll();
          setShowDeleteAllModal(false);
        }}
        title="Delete All Lawsuits"
        message="Are you sure you want to delete all lawsuits? This action cannot be undone."
        confirmText="Delete All"
      />

      <NotesModal
        isOpen={showNotesModal}
        onClose={() => {
          setShowNotesModal(false);
          onShowValidation(false);
        }}
      />

      {showToast && <Toast message="Missing Lawsuit Information" onClose={() => setShowToast(false)} />}
    </>
  );
} 