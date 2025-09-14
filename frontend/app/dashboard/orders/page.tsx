"use client";
import { useDashboard } from '../DashboardContext';
import { OrdersClient } from './OrdersClient';
import { DailyOrdersChart } from '../../../components/DailyOrdersChart';
import { useState, useMemo } from 'react';
import { subDays, format, eachDayOfInterval, startOfDay } from 'date-fns';

const TIME_RANGES = [7, 30, 90];

export default function OrdersPage() {
  const { selectedTenant } = useDashboard();
  const [timeRange, setTimeRange] = useState<number>(30);

  const dailyOrdersData = useMemo(() => {
    if (!selectedTenant) return [];
    const { orders } = selectedTenant;
    const endDate = startOfDay(new Date());
    const startDate = startOfDay(subDays(endDate, timeRange - 1));
    const dailyOrdersMap = new Map<string, number>();
    const interval = eachDayOfInterval({ start: startDate, end: endDate });
    interval.forEach(day => dailyOrdersMap.set(format(day, 'MMM dd'), 0));
    orders
      .filter(order => new Date(order.createdAt) >= startDate)
      .forEach(order => {
        const date = format(new Date(order.createdAt), 'MMM dd');
        const currentOrders = dailyOrdersMap.get(date) || 0;
        dailyOrdersMap.set(date, currentOrders + 1);
      });
    return Array.from(dailyOrdersMap, ([date, orders]) => ({ date, orders }));
  }, [selectedTenant, timeRange]);

  if (!selectedTenant) {
    return (
        <div className="text-center p-10 bg-white rounded-lg shadow">
            <h2 className="text-xl font-semibold text-gray-700">No Store Selected</h2>
            <p className="text-gray-500 mt-2">Please select a store from the dropdown to view its orders.</p>
        </div>
    );
  }
  return (
    <div className="space-y-8">
        <h1 className="text-3xl font-bold text-gray-800">Order History</h1>
        
        <div className="bg-white p-6 rounded-lg shadow-md border">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-700">Daily Orders</h2>
            <div className="flex space-x-2 bg-gray-100 p-1 rounded-lg">
              {TIME_RANGES.map(days => (
                <button 
                  key={days} 
                  onClick={() => setTimeRange(days)} 
                  className={`px-4 py-1.5 text-sm font-semibold rounded-md transition ${
                    timeRange === days 
                      ? 'bg-white text-indigo-600 shadow-sm' 
                      : 'text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  Last {days} Days
                </button>
              ))}
            </div>
          </div>
          <DailyOrdersChart data={dailyOrdersData} />
        </div>

        <OrdersClient 
            initialOrders={selectedTenant ? selectedTenant.orders.map(o => ({...o, storeUrl: selectedTenant.storeUrl})) : []} 
        />
    </div>
  );
}