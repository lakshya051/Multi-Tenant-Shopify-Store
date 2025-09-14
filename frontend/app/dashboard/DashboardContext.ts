"use client";
import { createContext, useContext } from 'react';
import { Tenant } from '../../lib/clientApiService';

interface DashboardContextType {
  allTenants: Tenant[];
  selectedTenant: Tenant | null;
  setSelectedTenantId: (id: string) => void;
  fetchAndSetTenants: () => Promise<Tenant[]>;
  isLinking: boolean;
  isSyncing: boolean;
  handleLinkTenant: () => Promise<void>;
  handleSync: () => Promise<void>;
  openAddStoreModal: () => void;
  newlyInstalledTenant: {id: string; url: string} | null;
}

export const DashboardContext = createContext<DashboardContextType | null>(null);

export const useDashboard = () => {
  const context = useContext(DashboardContext);
  if (!context) {
    throw new Error('useDashboard must be used within a DashboardProvider');
  }
  return context;
};