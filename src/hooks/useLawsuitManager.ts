import { useState } from 'react';
import { usePNCInfoStore } from '../store/pncInfoStore';
import { useLawsuitStore } from '../store/lawsuitStore';

export function useLawsuitManager() {
  const [isAllCollapsed, setIsAllCollapsed] = useState(true);
  const [expandedLawsuitId, setExpandedLawsuitId] = useState<string | null>(null);
  const [showValidation, setShowValidation] = useState(false);
  const { pncInfo } = usePNCInfoStore();
  const { lawsuitOrder, addLawsuit, removeLawsuit, defaultFormData } = useLawsuitStore();

  const handleAddLawsuit = (index: number) => {
    const newId = crypto.randomUUID();
    const previousTopId = lawsuitOrder[index];
    // First collapse the previous top lawsuit if it exists
    if (previousTopId && expandedLawsuitId === previousTopId) {
      setExpandedLawsuitId(null);
    }
    // Add the new lawsuit at the specified position
    addLawsuit(newId, defaultFormData, index);
    // Always expand the new lawsuit
    setExpandedLawsuitId(newId);
  };

  const handleRemoveLawsuit = (id: string) => {
    removeLawsuit(id);
    if (expandedLawsuitId === id) {
      setExpandedLawsuitId(null);
    }
  };

  const handleCollapseAll = () => {
    setIsAllCollapsed(!isAllCollapsed);
    if (!isAllCollapsed) {
      setExpandedLawsuitId(null);
    }
  };

  const handleDeleteAll = () => {
    lawsuitOrder.forEach(id => removeLawsuit(id));
    setExpandedLawsuitId(null);
  };

  return {
    lawsuitIds: lawsuitOrder,
    expandedLawsuitId,
    isAllCollapsed,
    name: pncInfo.name,
    ldwDate: pncInfo.ldwDate,
    showValidation,
    setShowValidation,
    handleAddLawsuit,
    handleRemoveLawsuit,
    handleCollapseAll,
    handleDeleteAll,
  };
} 