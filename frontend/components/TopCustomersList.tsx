import React from 'react';
import { Customer } from '../lib/clientApiService';

interface TopCustomersListProps {
  customers: Customer[];
}

export default function TopCustomersList({ customers }: TopCustomersListProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
      <h3 className="text-xl font-bold text-gray-800 mb-4">Top Customers by Spend</h3>
      {customers.length > 0 ? (
        <ul className="space-y-4">
          {customers.map((customer, index) => (
            <li key={customer.id} className="flex justify-between items-center p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition">
              <div className="flex items-center">
                <span className="text-lg font-bold text-indigo-600 mr-4 w-6 text-center">{index + 1}</span>
                <div>
                  <p className="font-semibold text-gray-700">{customer.firstName} {customer.lastName}</p>
                  <p className="text-sm text-gray-500">{customer.email}</p>
                </div>
              </div>
              <p className="text-lg font-bold text-green-600">${(customer.totalSpend || 0).toFixed(2)}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500 text-center py-4">No customer spending data available yet.</p>
      )}
    </div>
  );
}