"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import type { NameType, ValueType } from 'recharts/types/component/DefaultTooltipContent';

interface ChartData {
  date: string;
  orders: number;
}

export function DailyOrdersChart({ data }: { data: ChartData[] }) {
  return (
    <div style={{ width: '100%', height: 400 }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis tickFormatter={(value) => `${Number(value).toLocaleString()}`} />
          <Tooltip
            formatter={(value: ValueType, _name: NameType) => {
              const numeric = typeof value === 'number' ? value : Number(value);
              const display = Number.isFinite(numeric) ? `${numeric}` : `${value}`;
              return [display, 'Orders'];
            }}
            wrapperStyle={{ backgroundColor: '#fff', border: '1px solid #ccc', padding: '10px', borderRadius: '8px' }}
          />
          <Legend />
          <Bar dataKey="orders" fill="#10b981" name="Daily Orders" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
