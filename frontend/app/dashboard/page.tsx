"use client";

import { useDashboard } from './DashboardContext';
import StatCard from '../../components/StatCard';
import TopCustomersList from '../../components/TopCustomersList';
import { CustomerSegmentationChart } from '../../components/CustomerSegmentationChart';
import { AbandonedCheckoutsChart } from '../../components/AbandonedCheckoutsChart'; 
import { Customer, Order } from '../../lib/clientApiService';
import { EmptyState } from '../../components/EmptyState';

export default function DashboardOverviewPage() {
  const { selectedTenant } = useDashboard();

  if (!selectedTenant) {
    return <EmptyState />;
  }

  const { customers, orders, checkouts } = selectedTenant; 
  const totalRevenue = orders.reduce((sum, order) => sum + order.totalPrice, 0);
  const averageOrderValue = orders.length > 0 ? totalRevenue / orders.length : 0;
  
  const processedCustomers = customers.map((c: Customer) => {
      const customerOrders = orders.filter((o: Order) => o.customer?.id === c.id);
      return { ...c, totalSpend: customerOrders.reduce((sum, order) => sum + order.totalPrice, 0) };
  });
  const cartsCreated = checkouts.length;
  const completedCheckoutIds = new Set(orders.map(order => order.checkoutId).filter(Boolean));
  const abandonedCarts = checkouts.filter(checkout => !completedCheckoutIds.has(checkout.id)).length;

  const topCustomers = processedCustomers.sort((a, b) => (b.totalSpend || 0) - (a.totalSpend || 0)).slice(0, 5);

  return (
    <div className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            <StatCard title="Total Revenue" value={`$${totalRevenue.toFixed(2)}`} />
            <StatCard title="Avg. Order Value (AOV)" value={`$${averageOrderValue.toFixed(2)}`} />
            <StatCard title="Total Orders" value={orders.length} />
            <StatCard title="Checkouts Initiated" value={cartsCreated} />
            <StatCard title="Checkouts Abandoned" value={abandonedCarts} />

        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <CustomerSegmentationChart customers={customers} />
            <TopCustomersList customers={topCustomers} />
        </div>
        <AbandonedCheckoutsChart checkouts={checkouts} orders={orders} />
    </div>
  );
}