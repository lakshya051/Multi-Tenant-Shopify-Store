"use client";

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Checkout, Order } from '../lib/clientApiService';
import { format, subDays, eachDayOfInterval, startOfDay } from 'date-fns';

interface ChartProps {
  checkouts: Checkout[];
  orders: Order[];
}


export function AbandonedCheckoutsChart({ checkouts, orders }: ChartProps) {

  const last30Days = subDays(new Date(), 30);
  const dailyCheckoutsMap = new Map<string, number>();


  const interval = eachDayOfInterval({ start: last30Days, end: new Date() });
  interval.forEach(day => {
      dailyCheckoutsMap.set(format(startOfDay(day), 'MMM dd'), 0);
  });
  

  const completedCheckoutIds = new Set(orders.map(order => order.checkoutId).filter(Boolean));
  
 
  checkouts
    .filter(checkout => 
      new Date(checkout.createdAt) >= last30Days && 
      !completedCheckoutIds.has(checkout.id)
    )
    .forEach(checkout => {
        const date = format(new Date(checkout.createdAt), 'MMM dd');
        const currentCount = dailyCheckoutsMap.get(date) || 0;
        dailyCheckoutsMap.set(date, currentCount + 1);
    });

  const chartData = Array.from(dailyCheckoutsMap, ([date, count]) => ({ date, checkouts: count }));

  return (
    <div className="bg-white rounded-lg shadow-md p-6 border h-96">
      <h3 className="text-xl font-bold text-gray-800 mb-4">Abandoned Checkouts (Last 30 Days)</h3>
      {checkouts.length > 0 ? (
        <ResponsiveContainer width="100%" height="90%">
          <LineChart
            data={chartData}
            margin={{ top: 5, right: 20, left: -10, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="date" tick={{ fontSize: 12 }} />
            <YAxis allowDecimals={false} />
            <Tooltip
              formatter={(value: number) => [value, 'Checkouts']}
              wrapperStyle={{ backgroundColor: '#fff', border: '1px solid #ccc', padding: '10px', borderRadius: '8px' }}
            />
            <Legend verticalAlign="top" align="right" />
            <Line type="monotone" dataKey="checkouts" name="Abandoned Checkouts" stroke="#ef4444" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 8 }} />
          </LineChart>
        </ResponsiveContainer>
      ) : (
        <div className="flex items-center justify-center h-full text-gray-500">
            No abandoned checkout data available.
        </div>
      )}
    </div>
  );
}