"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface ChartProps {

  data: { hour: string; sales: number }[];
}


export function SalesByHourChart({ data }: ChartProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 border h-96">
      <h3 className="text-xl font-bold text-gray-800 mb-4">Sales by Hour of the Day</h3>
      {data.length > 0 ? (
        <ResponsiveContainer width="100%" height="90%">
          <BarChart
            data={data}
            margin={{ top: 5, right: 20, left: -10, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="hour" tick={{ fontSize: 12 }} />
            <YAxis allowDecimals={false} />
            <Tooltip
              formatter={(value: number) => [value, 'Orders']}
              wrapperStyle={{
                backgroundColor: '#fff',
                border: '1px solid #e2e8f0',
                padding: '8px 12px',
                borderRadius: '8px',
              }}
            />
            <Bar dataKey="sales" fill="#818cf8" name="Total Orders" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      ) : (
        <div className="flex items-center justify-center h-full text-gray-500">
            No sales data available to display hourly trends.
        </div>
      )}
    </div>
  );
}