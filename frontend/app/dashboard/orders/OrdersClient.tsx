"use client";

import React, { useState, useMemo } from 'react';
import { Order } from '../../../lib/clientApiService';
import { DateRange } from 'react-day-picker';
import { addDays, format, endOfDay } from 'date-fns'; 
import { DatePickerWithRange } from '../../../components/DatePicker';

export function OrdersClient({ initialOrders }: { initialOrders: (Order & { storeUrl: string })[] }) {
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: addDays(new Date(), -30),
    to: new Date(),
  });
  const [showAll, setShowAll] = useState(false);

  const filteredOrders = useMemo(() => {
    return initialOrders.filter(order => {
      const orderDate = new Date(order.createdAt);

      const toDate = dateRange?.to ? endOfDay(dateRange.to) : undefined;
      

      if (dateRange?.from && orderDate < dateRange.from) return false;
      if (toDate && orderDate > toDate) return false;
      
      return true;
    }).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [initialOrders, dateRange]);

  const displayedOrders = showAll ? filteredOrders : filteredOrders.slice(0, 5);
  const hasMoreOrders = filteredOrders.length > 5;

  return (
    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
      <div className="flex justify-end mb-4">
        <DatePickerWithRange date={dateRange} onDateChange={setDateRange} />
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Store</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredOrders.length > 0 ? displayedOrders.map(order => (
              <tr key={order.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">#{order.id.substring(order.id.length-7)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{format(new Date(order.createdAt), 'MMM dd, yyyy')}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.storeUrl}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${order.financialStatus === 'paid' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                    {order.financialStatus}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 text-right font-semibold">${order.totalPrice.toFixed(2)}</td>
              </tr>
            )) : (
              <tr>
                <td colSpan={5} className="text-center py-10 text-gray-500">No orders found for the selected date range.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {hasMoreOrders && (
        <div className="mt-4 text-center">
          <button
            onClick={() => setShowAll(!showAll)}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200 font-medium"
          >
            {showAll ? 'Show Less' : `Show More (${filteredOrders.length - 5} more)`}
          </button>
        </div>
      )}
    </div>
  );
}