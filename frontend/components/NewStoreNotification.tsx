"use client";
import { useDashboard } from '../app/dashboard/DashboardContext';
import { Link2 } from 'lucide-react';

export function NewStoreNotification() {
    const { newlyInstalledTenant, handleLinkTenant, isLinking } = useDashboard();
    if (!newlyInstalledTenant) return null;

    return (
        <div className="bg-blue-600 text-white p-4 flex justify-center items-center gap-4 shadow-lg">
          <p>
            <span className="font-semibold">Installation Successful:</span> Click to connect {newlyInstalledTenant.url} to your account.
          </p>
          <button
            onClick={handleLinkTenant}
            disabled={isLinking}
            className="flex items-center px-4 py-2 bg-white text-blue-600 font-semibold rounded-lg hover:bg-blue-50 transition disabled:opacity-50"
          >
            <Link2 className="w-5 h-5 mr-2" />
            {isLinking ? 'Linking...' : 'Link to Account'}
          </button>
        </div>
    );
}