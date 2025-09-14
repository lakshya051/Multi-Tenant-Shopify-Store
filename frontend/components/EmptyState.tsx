"use client";

import { useDashboard } from '../app/dashboard/DashboardContext';
import { ShoppingCart } from 'lucide-react';

export function EmptyState() {
  const { openAddStoreModal } = useDashboard();

  return (
    <div className="flex items-center justify-center h-full">
      <div className="text-center p-12 bg-white rounded-lg shadow-md border max-w-2xl mx-auto">
        <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-indigo-100">
          <ShoppingCart className="h-9 w-9 text-indigo-600" />
        </div>
        <h2 className="mt-6 text-2xl font-bold text-gray-800">
          Welcome to Shopalytics!
        </h2>
        <p className="mt-2 text-gray-600">
          You&apos;re just a few steps away from unlocking your store&apos;s insights.
        </p>

        <div className="mt-8 text-left space-y-6">
          {/* Step 1: Add Store */}
          <div className="flex items-start">
            <div className="flex-shrink-0 flex items-center justify-center h-8 w-8 rounded-full border-2 border-indigo-500 text-indigo-500 font-bold">
              1
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-gray-800">Add Your Store</h3>
              <p className="mt-1 text-gray-500">
                Click the{" "}
                <button
                  onClick={openAddStoreModal}
                  className="font-semibold text-indigo-600 hover:underline"
                >
                  Add Store
                </button>{" "}
                button in the header and enter your shop&apos;s
                <code>.myshopify.com</code> URL.
              </p>
            </div>
          </div>

          {/* Step 2 */}
          <div className="flex items-start">
            <div className="flex-shrink-0 flex items-center justify-center h-8 w-8 rounded-full border-2 border-indigo-500 text-indigo-500 font-bold">
              2
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-gray-800">Authorize and Link</h3>
              <p className="mt-1 text-gray-500">
                You&apos;ll be redirected to Shopify to approve the installation. After you return to the dashboard, a blue notification bar will appear. Click the{" "}
                <span className="font-semibold text-indigo-600">
                  Link to Account
                </span>{" "}
                button to finalize the connection.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
