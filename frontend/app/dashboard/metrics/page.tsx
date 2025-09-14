"use client";

import { useState, useMemo } from 'react';
import { useDashboard } from '../DashboardContext';
import { RevenueChart } from './RevenueChart';
import { subDays, format, eachDayOfInterval, startOfDay } from 'date-fns';
import { CustomerSegmentationChart } from '../../../components/CustomerSegmentationChart';
import { SalesByHourChart } from '../../../components/SalesByHourChart';
import { Order } from '../../../lib/clientApiService';

const TIME_RANGES = [7, 30, 90];

export default function MetricsPage() {
    const { selectedTenant } = useDashboard();
    const [timeRange, setTimeRange] = useState<number>(30);

    const dailyRevenueData = useMemo(() => {
        if (!selectedTenant) return [];
        const { orders } = selectedTenant;
        const endDate = startOfDay(new Date());
        const startDate = startOfDay(subDays(endDate, timeRange - 1));
        const dailyRevenueMap = new Map<string, number>();
        const interval = eachDayOfInterval({ start: startDate, end: endDate });
        interval.forEach(day => dailyRevenueMap.set(format(day, 'MMM dd'), 0));
        orders
            .filter(order => new Date(order.createdAt) >= startDate)
            .forEach(order => {
                const date = format(new Date(order.createdAt), 'MMM dd');
                const currentRevenue = dailyRevenueMap.get(date) || 0;
                dailyRevenueMap.set(date, currentRevenue + order.totalPrice);
            });
        return Array.from(dailyRevenueMap, ([date, revenue]) => ({ date, revenue }));
    }, [selectedTenant, timeRange]);

    const salesByHourData = useMemo(() => {
        if (!selectedTenant) return [];
        const hourlySales = Array(24).fill(0).map((_, i) => ({
            hour: i.toString().padStart(2, '0'),
            sales: 0,
        }));

        selectedTenant.orders.forEach((order: Order) => {
            const hour = new Date(order.createdAt).getHours();
            if (hourlySales[hour]) {
                hourlySales[hour].sales += 1;
            }
        });
        
        return hourlySales;
    }, [selectedTenant]);

    if (!selectedTenant) {
        return (
            <div className="text-center p-10 bg-white rounded-lg shadow">
                <h2 className="text-xl font-semibold text-gray-700">No Store Selected</h2>
                <p className="text-gray-500 mt-2">Please select a store from the dropdown to view its metrics.</p>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-bold text-gray-800">Business Metrics</h1>
            
            <div className="bg-white p-6 rounded-lg shadow-md border">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold text-gray-700">Daily Revenue</h2>
                    <div className="flex space-x-2 bg-gray-100 p-1 rounded-lg">
                        {TIME_RANGES.map(days => (
                            <button key={days} onClick={() => setTimeRange(days)} className={`px-4 py-1.5 text-sm font-semibold rounded-md transition ${ timeRange === days ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-600 hover:bg-gray-200' }`}>
                                Last {days} Days
                            </button>
                        ))}
                    </div>
                </div>
                <RevenueChart data={dailyRevenueData} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <CustomerSegmentationChart customers={selectedTenant.customers} />
                <SalesByHourChart data={salesByHourData} />
            </div>
        </div>
    );
}