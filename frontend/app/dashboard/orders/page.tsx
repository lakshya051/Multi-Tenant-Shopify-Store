"use client";
import { useDashboard } from '../DashboardContext';
import { OrdersClient } from './OrdersClient';

export default function OrdersPage() {
  const { selectedTenant } = useDashboard();

  return (
    <div>
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Order History</h1>
        <OrdersClient 
            initialOrders={selectedTenant ? selectedTenant.orders.map(o => ({...o, storeUrl: selectedTenant.storeUrl})) : []} 
        />
    </div>
  );
}