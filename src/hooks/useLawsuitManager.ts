import { useState, useEffect } from 'react';
import { usePNCInfoStore } from '../store/pncInfoStore';

export function useLawsuitManager() {
  const [lawsuitIds, setLawsuitIds] = useState<string[]>([]);
  const [isAllCollapsed, setIsAllCollapsed] = useState(true);
  const [expandedLawsuitId, setExpandedLawsuitId] = useState<string | null>(null);
  const { pncInfo, updatePNCInfo } = usePNCInfoStore();

  // Load existing lawsuits from localStorage on mount
  useEffect(() => {
    const savedLawsuits = localStorage.getItem('lawsuits');
    const savedOrder = localStorage.getItem('lawsuitOrder');
    
    if (savedLawsuits && savedOrder) {
      const lawsuits = JSON.parse(savedLawsuits);
      const order = JSON.parse(savedOrder);
      // Only keep IDs that exist in the lawsuits object
      const validOrder = order.filter((id: string) => id in lawsuits);
      setLawsuitIds(validOrder);
    }
  }, []);

  // Save lawsuit order whenever it changes
  useEffect(() => {
    if (lawsuitIds.length > 0) {
      localStorage.setItem('lawsuitOrder', JSON.stringify(lawsuitIds));
    }
  }, [lawsuitIds]);

  const handleAddLawsuit = (index: number) => {
    const newId = crypto.randomUUID();
    const previousTopId = lawsuitIds[index];
    // First collapse the previous top lawsuit if it exists
    if (previousTopId && expandedLawsuitId === previousTopId) {
      setExpandedLawsuitId(null);
    }
    // Insert the new lawsuit at the specified position
    setLawsuitIds(prev => {
      const newIds = [...prev];
      newIds.splice(index, 0, newId);
      return newIds;
    });
    // Always expand the new lawsuit
    setExpandedLawsuitId(newId);
  };

  const handleRemoveLawsuit = (id: string) => {
    setLawsuitIds(prev => prev.filter(lawsuitId => lawsuitId !== id));
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
    setLawsuitIds([]);
    setExpandedLawsuitId(null);
    localStorage.removeItem('lawsuits');
    localStorage.removeItem('lawsuitOrder');
  };

  const handlePNCInfoChange = (info: { name: string; ldwDate: string }) => {
    updatePNCInfo(info);
  };

  return {
    lawsuitIds,
    expandedLawsuitId,
    isAllCollapsed,
    name: pncInfo.name,
    ldwDate: pncInfo.ldwDate,
    handleAddLawsuit,
    handleRemoveLawsuit,
    handleCollapseAll,
    handleDeleteAll,
    handlePNCInfoChange,
  };
} 