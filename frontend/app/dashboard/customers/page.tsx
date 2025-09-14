"use client";
import { useDashboard } from '../DashboardContext';
import TopCustomersList from '../../../components/TopCustomersList';
import { Customer, Order } from '../../../lib/clientApiService';
import { AllCustomersTable } from '../../../components/AllCustomersTable';

export default function CustomersPage() {
    const { selectedTenant } = useDashboard();

    if (!selectedTenant) {
        return (
            <div className="text-center p-10 bg-white rounded-lg shadow">
                <h2 className="text-xl font-semibold text-gray-700">No Store Selected</h2>
                <p className="text-gray-500 mt-2">Please select a store from the dropdown to view its customers.</p>
            </div>
        );
    }

    const { customers, orders } = selectedTenant;
    const processedCustomers = customers.map((c: Customer) => {
        const customerOrders = orders.filter((o: Order) => o.customer?.id === c.id);
        return { ...c, totalSpend: customerOrders.reduce((sum: number, order: Order) => sum + order.totalPrice, 0) };
    });
    
    const sortedCustomers = processedCustomers.sort((a, b) => (b.totalSpend || 0) - (a.totalSpend || 0));

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-6">All Customers</h1>
            <TopCustomersList customers={sortedCustomers} />
            <h1 className="text-3xl font-bold text-gray-800 mb-6 mt-6">Customers Data</h1>
            <AllCustomersTable customers={sortedCustomers} />
        </div>
    );
}