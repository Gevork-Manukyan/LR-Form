import { Modal } from './Modal';

interface NotesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function NotesModal({ isOpen, onClose }: NotesModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Combined Notes">
      <div className="mt-4">
        <div className="p-4 bg-gray-50 rounded-lg">
          <div className="font-mono text-sm whitespace-pre-wrap">
            {/* Placeholder for notes */}
            <p className="text-gray-500">No notes available</p>
          </div>
        </div>
      </div>
    </Modal>
  );
} 