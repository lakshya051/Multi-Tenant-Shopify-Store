"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LabelList } from 'recharts';
import { Order, Product } from '../lib/clientApiService';

interface ChartProps {
  orders: Order[];
  products: Product[];
}

export function BestSellingProductsChart({ orders, products }: ChartProps) {
  
  const productSales = new Map<string, number>();
  orders.forEach(order => {
    order.lineItems?.forEach(item => {
      if (item.productId) {
        const currentSales = productSales.get(item.productId) || 0;
        productSales.set(item.productId, currentSales + item.quantity);
      }
    });
  });

  
  const chartData = Array.from(productSales.entries())
    .map(([productId, quantity]) => {
      const product = products.find(p => p.id === productId);
      return {
        
        name: product ? product.title : 'Unknown Product',
        shortName: product ? (product.title.slice(0, 35) + (product.title.length > 35 ? '...' : '')) : 'Unknown',
        sales: quantity,
      };
    })
    .sort((a, b) => b.sales - a.sales)
    .slice(0, 5); 

  return (

    <div className="bg-white rounded-lg shadow-md p-6 border h-[500px]"> 
      <h3 className="text-xl font-bold text-gray-800 mb-4">Top 5 Best-Selling Products</h3>
      {chartData.length > 0 ? (
        <ResponsiveContainer width="100%" height="90%">
          <BarChart 
            data={chartData} 
            layout="vertical" 
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" allowDecimals={false} />

            <YAxis 
              type="category" 
              dataKey="shortName" 
              width={250} 
              tick={{ fontSize: 12 }} 
            />
            
            <Tooltip
              formatter={(value: number) => [value, 'Units Sold']}
              labelFormatter={(label: string) => {
                  
                  const fullProduct = chartData.find(d => d.shortName === label);
                  return fullProduct ? fullProduct.name : label;
              }}
              wrapperStyle={{ backgroundColor: '#fff', border: '1px solid #ccc', padding: '10px' }}
            />
            <Legend />
            <Bar dataKey="sales" fill="#4f46e5" name="Units Sold" radius={[0, 4, 4, 0]}>
                <LabelList dataKey="sales" position="right" style={{ fill: '#374151' }} />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      ) : (
        <div className="flex items-center justify-center h-full text-gray-500">
            No sales data to display.
        </div>
      )}
    </div>
  );
}