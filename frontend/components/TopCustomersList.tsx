import React, { useState } from 'react';
import { Customer } from '../lib/clientApiService';

interface TopCustomersListProps {
  customers: Customer[];
}

export default function TopCustomersList({ customers }: TopCustomersListProps) {
  const [showAll, setShowAll] = useState(false);
  
  const displayedCustomers = showAll ? customers : customers.slice(0, 5);
  const hasMoreCustomers = customers.length > 5;

  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
      <h3 className="text-xl font-bold text-gray-800 mb-4">Top Customers by Spend</h3>
      {customers.length > 0 ? (
        <>
          <ul className="space-y-4">
            {displayedCustomers.map((customer, index) => (
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
          {hasMoreCustomers && (
            <div className="mt-4 text-center">
              <button
                onClick={() => setShowAll(!showAll)}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200 font-medium"
              >
                {showAll ? 'Show Less' : `Show More (${customers.length - 5} more)`}
              </button>
            </div>
          )}
        </>
      ) : (
        <p className="text-gray-500 text-center py-4">No customer spending data available yet.</p>
      )}
    </div>
  );
}