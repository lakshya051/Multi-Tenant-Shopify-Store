"use client";

import React, { useState } from 'react';
import { X } from 'lucide-react';
import { toast } from 'sonner';

interface AddStoreModalProps {
  isOpen: boolean;
  onClose: () => void;
}


export function AddStoreModal({ isOpen, onClose }: AddStoreModalProps) {
  const [storeName, setStoreName] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!storeName.trim() || !storeName.includes('.myshopify.com')) {
      setError('Please enter a valid .myshopify.com store URL.');
      toast.error('Please enter a valid .myshopify.com store URL.');
      return;
    }

    
    const installUrl = `${process.env.NEXT_PUBLIC_CALLBACK_URL}/api/shopify/install?shop=${storeName.trim()}`;
    
    
    window.open(installUrl, '_blank', 'noopener,noreferrer');
    
    toast.success('Opening Shopify installation page...');
    
    onClose();
  };

  if (!isOpen) {
    return null;
  }

  return (
    
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 transition-opacity duration-300">
      
      <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md relative transform transition-all duration-300 scale-100">
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 transition-colors"
          aria-label="Close modal"
        >
          <X className="w-6 h-6" />
        </button>
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Connect a New Store</h2>
        <p className="text-gray-600 mb-6">Enter your store&apos;s &quot;.myshopify.com&quot; URL to begin the installation process in a new tab.</p>
        
        {error && <p className="bg-red-100 text-red-700 p-3 rounded-md mb-4 text-sm">{error}</p>}
        
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="storeName" className="block text-sm font-medium text-gray-700">Store URL</label>
            <input
              id="storeName"
              type="text"
              value={storeName}
              onChange={(e) => setStoreName(e.target.value)}
              className="w-full px-4 py-2 mt-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="your-store-name.myshopify.com"
              required
            />
          </div>
          <div className="mt-6 flex justify-end space-x-4">
            <button 
              type="button" 
              onClick={onClose} 
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Connect Store
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
