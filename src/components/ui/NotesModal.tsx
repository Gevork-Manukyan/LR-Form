import { Modal } from './Modal';

interface NotesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function NotesModal({ isOpen, onClose }: NotesModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Combined Notes">
      <div className="mt-4">
        {/* Notes content will go here */}
        <div className="space-y-4">
          {/* Placeholder for notes */}
          <p className="text-gray-500">No notes available</p>
        </div>
      </div>
    </Modal>
  );
} 