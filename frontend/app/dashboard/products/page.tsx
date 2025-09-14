"use client";

import { useDashboard } from '../DashboardContext';
import Image from 'next/image';
import { BestSellingProductsChart } from '../../../components/BestSellingProductsChart';
import { useState } from 'react';

export default function ProductsPage() {
    const { selectedTenant } = useDashboard();
    const [showAll, setShowAll] = useState(false);

    if (!selectedTenant) {
        return (
            <div className="text-center p-10 bg-white rounded-lg shadow">
                <h2 className="text-xl font-semibold text-gray-700">No Store Selected</h2>
                <p className="text-gray-500 mt-2">Please select a store from the dropdown to view its products.</p>
            </div>
        );
    }

    const { products, orders } = selectedTenant;
    const displayedProducts = showAll ? products : products.slice(0, 5);
    const hasMoreProducts = products.length > 5;

    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-bold text-gray-800">Products</h1>

            {/* The Best-Selling Products chart for the selected store */}
            <BestSellingProductsChart orders={orders} products={products} />

            {/* The Product Catalog table for the selected store */}
            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                <h2 className="text-xl font-semibold text-gray-700 mb-4">Product Catalog</h2>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-20">Image</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product Title</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vendor</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product Type</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {products.length > 0 ? (
                                displayedProducts.map(product => (
                                    <tr key={product.id}>
                                        <td className="px-6 py-4">
                                            <div className="flex-shrink-0 h-12 w-12">
                                                <Image
                                                    className="h-12 w-12 rounded-md object-cover"
                                                    src={product.imageUrl || '/no_image.jpg'}
                                                    alt={product.title || 'Product image'}
                                                    width={48}
                                                    height={48}
                                                    onError={(e) => { (e.target as HTMLImageElement).src = '/no_image.jpg'; }}
                                                />
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{product.title}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.vendor}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.productType}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={4} className="text-center py-10 text-gray-500">
                                        No products found for this store.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
                {hasMoreProducts && (
                    <div className="mt-4 text-center">
                        <button
                            onClick={() => setShowAll(!showAll)}
                            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200 font-medium"
                        >
                            {showAll ? 'Show Less' : `Show More (${products.length - 5} more)`}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}