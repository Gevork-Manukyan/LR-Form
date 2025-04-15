import { useState, useEffect } from 'react';

export function useLawsuitManager() {
  const [lawsuitIds, setLawsuitIds] = useState<string[]>([]);
  const [isAllCollapsed, setIsAllCollapsed] = useState(true);
  const [expandedLawsuitId, setExpandedLawsuitId] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [lwdaDate, setLwdaDate] = useState('');

  // Load existing lawsuits from localStorage on mount
  useEffect(() => {
    const savedLawsuits = localStorage.getItem('lawsuits');
    const savedOrder = localStorage.getItem('lawsuitOrder');
    const savedPNCInfo = localStorage.getItem('pncInfo');
    
    if (savedPNCInfo) {
      const { name: savedName, lwdaDate: savedLwdaDate } = JSON.parse(savedPNCInfo);
      setName(savedName);
      setLwdaDate(savedLwdaDate);
    }

    if (savedLawsuits && savedOrder) {
      const lawsuits = JSON.parse(savedLawsuits);
      const order = JSON.parse(savedOrder);
      // Only keep IDs that exist in the lawsuits object
      const validOrder = order.filter((id: string) => id in lawsuits);
      setLawsuitIds(validOrder);
    } else {
      // Only create a new lawsuit if there are no saved lawsuits
      const newId = crypto.randomUUID();
      setLawsuitIds([newId]);
      setExpandedLawsuitId(newId);
    }
  }, []);

  // Save lawsuit order whenever it changes
  useEffect(() => {
    if (lawsuitIds.length > 0) {
      localStorage.setItem('lawsuitOrder', JSON.stringify(lawsuitIds));
    }
  }, [lawsuitIds]);

  // Save PNC info whenever it changes
  useEffect(() => {
    localStorage.setItem('pncInfo', JSON.stringify({ name, lwdaDate }));
  }, [name, lwdaDate]);

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

  const handlePNCInfoChange = (info: { name: string; lwdaDate: string }) => {
    setName(info.name);
    setLwdaDate(info.lwdaDate);
  };

  return {
    lawsuitIds,
    expandedLawsuitId,
    isAllCollapsed,
    name,
    lwdaDate,
    handleAddLawsuit,
    handleRemoveLawsuit,
    handleCollapseAll,
    handleDeleteAll,
    handlePNCInfoChange,
  };
} 