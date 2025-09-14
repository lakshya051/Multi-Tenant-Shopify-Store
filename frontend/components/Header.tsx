"use client";

import React from 'react';
import { Store, PlusCircle, RefreshCw } from 'lucide-react';
import { LogoutButton } from './LogoutButton';
import { useDashboard } from '../app/dashboard/DashboardContext';

export function Header() {
  const { 
    allTenants, 
    selectedTenant, 
    setSelectedTenantId,
    isSyncing,
    handleSync,
    openAddStoreModal
  } = useDashboard();
  
  return (
    <header className="bg-white shadow-sm p-4 h-16 flex justify-between items-center border-b border-gray-200 z-10 relative">
      <div className="flex items-center gap-4">
        <div className="relative">
            <Store className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <select 
                id="tenant-switcher"
                value={selectedTenant?.id || ''}
                onChange={(e) => setSelectedTenantId(e.target.value)}
                className="pl-10 pr-4 py-2 border rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
                {allTenants.length > 0 ? (
                  allTenants.map(tenant => (
                      <option key={tenant.id} value={tenant.id}>{tenant.storeUrl}</option>
                  ))
                ) : (
                  <option>No stores connected</option>
                )}
            </select>
        </div>
        <button onClick={handleSync} disabled={isSyncing || allTenants.length === 0} className="flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition disabled:bg-gray-400">
          <RefreshCw className={`w-5 h-5 mr-2 ${isSyncing ? 'animate-spin' : ''}`} />
          {isSyncing ? 'Syncing...' : 'Sync Data'}
        </button>
        <button onClick={openAddStoreModal} className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition">
          <PlusCircle className="w-5 h-5 mr-2" />
          Add Store
        </button>
      </div>
      <LogoutButton />
    </header>
  );
}