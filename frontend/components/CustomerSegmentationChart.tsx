"use client";

import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import type { PieLabelRenderProps } from 'recharts';
import { Customer } from '../lib/clientApiService';

interface ChartProps {
  customers: Customer[];
}


const COLORS = {
  Returning: '#4f46e5', 
  New: '#a5b4fc',       
};


const renderCustomizedLabel = (props: PieLabelRenderProps) => {
  const {
    cx = 0,
    cy = 0,
    midAngle = 0,
    innerRadius = 0,
    outerRadius = 0,
    percent = 0,
  } = props as Partial<PieLabelRenderProps> & {
    cx?: number;
    cy?: number;
    midAngle?: number;
    innerRadius?: number;
    outerRadius?: number;
    percent?: number;
  };

  if (percent < 0.05) {
    return null;
  }
  
  const RADIAN = Math.PI / 180;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" className="font-semibold text-sm">
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};


export function CustomerSegmentationChart({ customers }: ChartProps) {
  const data = [
    { name: 'Returning', value: customers.filter(c => c.status === 'Returning').length },
    { name: 'New', value: customers.filter(c => c.status === 'New').length },
  ];

  return (
    <div className="bg-white rounded-lg shadow-md p-6 border h-96">
      <h3 className="text-xl font-bold text-gray-800 mb-4">Customer Segmentation</h3>
      {customers.length > 0 ? (
        <ResponsiveContainer width="100%" height="90%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={(props) => renderCustomizedLabel(props as PieLabelRenderProps)} 
              outerRadius={110}
              innerRadius={60} 
              fill="#8884d8"
              paddingAngle={5}
              dataKey="value"
            >
              <Cell key={`cell-0`} fill={COLORS.Returning} />
              <Cell key={`cell-1`} fill={COLORS.New} />
            </Pie>
            <Tooltip
              formatter={(value: number, name: string) => [value, name]}
              wrapperStyle={{
                backgroundColor: '#fff',
                border: '1px solid #e2e8f0',
                padding: '10px 15px',
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
              }}
            />
            <Legend iconType="circle" />
          </PieChart>
        </ResponsiveContainer>
      ) : (
        <div className="flex items-center justify-center h-full text-gray-500">
            No customer data to display.
        </div>
      )}
    </div>
  );
}