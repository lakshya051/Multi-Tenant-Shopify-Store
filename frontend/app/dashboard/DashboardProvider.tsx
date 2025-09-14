"use client";
import React, { useState, useEffect } from 'react';
import { clientApiService, Tenant } from '../../lib/clientApiService';
import { useRouter } from 'next/navigation';
import { DashboardContext } from './DashboardContext';
import { AddStoreModal } from '../../components/AddStoreModal';
import { Spinner } from '../../components/Spinner';
import { toast } from 'sonner';

export function DashboardProvider({ initialData, children }: { initialData: Tenant[], children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  const [allTenants, setAllTenants] = useState<Tenant[]>(initialData);
  
  // Initialize selectedTenantId from localStorage or fallback to first tenant
  const getInitialSelectedTenantId = () => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('selectedTenantId');
      if (stored && initialData.some(tenant => tenant.id === stored)) {
        return stored;
      }
    }
    return initialData[0]?.id || null;
  };
  
  const [selectedTenantId, setSelectedTenantIdState] = useState<string | null>(getInitialSelectedTenantId());
  
  // Wrapper function that updates state and localStorage
  const setSelectedTenantId = (id: string) => {
    setSelectedTenantIdState(id);
    if (typeof window !== 'undefined') {
      localStorage.setItem('selectedTenantId', id);
    }
  };
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [newlyInstalledTenant, setNewlyInstalledTenant] = useState<{id: string; url: string} | null>(null);
  const [isLinking, setIsLinking] = useState(false);
  
  const router = useRouter();

  useEffect(() => {
    const verifySession = async () => {
      try {
        const res = await clientApiService.getData();
        if (res.ok) {
          const data = await res.json();
          setAllTenants(data);
          
          // Check if current selectedTenantId is still valid, if not, use localStorage or first tenant
          if (data.length > 0) {
            const currentSelectedId = selectedTenantId;
            const isCurrentIdValid = currentSelectedId && data.some((t: Tenant) => t.id === currentSelectedId);
            
            if (!isCurrentIdValid) {
              // Try to restore from localStorage first
              const storedId = typeof window !== 'undefined' ? localStorage.getItem('selectedTenantId') : null;
              const isStoredIdValid = storedId && data.some((t: Tenant) => t.id === storedId);
              
              if (isStoredIdValid) {
                setSelectedTenantId(storedId);
              } else {
                setSelectedTenantId(data[0].id);
              }
            }
          }
          setIsAuthenticated(true);
        } else {
          router.push('/login');
        }
      } catch (error) {
        router.push('/login');
      } finally {
        setIsLoading(false);
      }
    };
    verifySession();
  }, [router, selectedTenantId]);

  const fetchAndSetTenants = async (): Promise<Tenant[]> => {
    try {
      const data = await clientApiService.getData().then(res => res.json());
      setAllTenants(data);
      
      // Check if current selectedTenantId is still valid
      if (data.length > 0 && !data.some((t: Tenant) => t.id === selectedTenantId)) {
        // Try to restore from localStorage first
        const storedId = typeof window !== 'undefined' ? localStorage.getItem('selectedTenantId') : null;
        const isStoredIdValid = storedId && data.some((t: Tenant) => t.id === storedId);
        
        if (isStoredIdValid) {
          setSelectedTenantId(storedId);
        } else {
          setSelectedTenantId(data[0].id);
        }
      }
      return data;
    } catch (error) {
      console.error("Failed to fetch tenants", error);
      return [];
    }
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
      const updatedTenants = await fetchAndSetTenants();
      setSelectedTenantId(newlyInstalledTenant.id);
      setNewlyInstalledTenant(null);
    } catch (error) {
      alert('Failed to link the store.');
    } finally {
      setIsLinking(false);
    }
  };

  const handleSync = async () => {
    if (!selectedTenantId) return alert("Please select a store to sync.");
    setIsSyncing(true);
    try {
      const res = await clientApiService.syncTenant(selectedTenantId);
      if (res.ok) {
        toast.success("Data sync completed successfully! The page will now refresh.");
        router.refresh();
      } else {
        throw new Error("Sync failed");
      }
    } catch (error) {
      alert("An error occurred during sync.");
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
  
  if (isLoading) {
    return <div className="flex h-screen w-full items-center justify-center"><Spinner /></div>;
  }

  if (isAuthenticated) {
    return (
      <DashboardContext.Provider value={contextValue}>
        {children}
        <AddStoreModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      </DashboardContext.Provider>
    );
  }

  return null;
}