"use client";

import React, { useState, useEffect } from 'react';
import { clientApiService, Tenant } from '../../lib/clientApiService';
import { useRouter } from 'next/navigation';
import { DashboardContext } from './DashboardContext';
import { AddStoreModal } from '../../components/AddStoreModal';
import { toast } from 'sonner';

export function DashboardClient({ initialData, children }: { initialData: Tenant[], children: React.ReactNode }) {
  const [allTenants, setAllTenants] = useState<Tenant[]>(initialData);
  const [selectedTenantId, setSelectedTenantId] = useState<string | null>(initialData[0]?.id || null);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  
  const [newlyInstalledTenant, setNewlyInstalledTenant] = useState<{id: string; url: string} | null>(null);
  const [isLinking, setIsLinking] = useState(false);

  const router = useRouter();

  const fetchAndSetTenants = async () => {
    const data = await clientApiService.getData().then(res => res.json());
    setAllTenants(data);
    if (data.length > 0 && !allTenants.some(t => t.id === selectedTenantId)) {
      setSelectedTenantId(data[0].id);
    }
    return data;
  };

  useEffect(() => {
    const checkForNewTenant = () => {
      const storedTenant = localStorage.getItem('newlyInstalledTenant');
      if (storedTenant) {
        setNewlyInstalledTenant(JSON.parse(storedTenant));
        localStorage.removeItem('newlyInstalledTenant');
      }
    };
    checkForNewTenant();
    window.addEventListener('storage', checkForNewTenant);
    return () => window.removeEventListener('storage', checkForNewTenant);
  }, []);

  const handleLinkTenant = async () => {
    if (!newlyInstalledTenant) return;
    setIsLinking(true);
    try {
      await clientApiService.linkTenant(newlyInstalledTenant.id);
      toast.success(`Successfully linked to ${newlyInstalledTenant.url}!`);
      setSelectedTenantId(newlyInstalledTenant.id);
      setNewlyInstalledTenant(null);
    } catch {
      toast.error('Failed to link the store.');
    } finally {
      setIsLinking(false);
    }
  };

  const handleSync = async () => {
    if (!selectedTenantId) { toast.message("Please select a store to sync."); return; }
    setIsSyncing(true);
    try {
      const res = await clientApiService.syncTenant(selectedTenantId);
      if (res.ok) {
        toast.success("Data sync completed successfully! The page will now refresh.");
        router.refresh();
      } else {
        throw new Error("Sync failed");
      }
    } catch {
      toast.error("An error occurred during sync.");
    } finally {
      setIsSyncing(false);
    }
  };
  
  const selectedTenant = allTenants.find(t => t.id === selectedTenantId) || null;

  const contextValue = {
    allTenants,
    selectedTenant,
    setSelectedTenantId,
    fetchAndSetTenants,
    isLinking,
    isSyncing,
    handleLinkTenant,
    handleSync,
    openAddStoreModal: () => setIsModalOpen(true),
    newlyInstalledTenant,
  };

  return (
    <DashboardContext.Provider value={contextValue}>
      {children}
      <AddStoreModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </DashboardContext.Provider>
  );
}