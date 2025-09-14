"use client";

import { Suspense, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Spinner } from '../../../../components/Spinner'; 

function ReturnClient() {
  const searchParams = useSearchParams();

  useEffect(() => {
    const newTenantId = searchParams.get('newTenantId');
    const shopUrl = searchParams.get('shop');

    if (newTenantId && shopUrl) {
      localStorage.setItem('newlyInstalledTenant', JSON.stringify({
        id: newTenantId,
        url: shopUrl
      }));
      window.close();
    }
  }, [searchParams]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <Spinner />
      <p className="mt-4 text-gray-600">Finalizing connection, this window will close automatically...</p>
    </div>
  );
}

export default function ShopifyReturnPage() {
  return (
    <Suspense fallback={
      <div className="flex flex-col items-center justify-center min-h-screen">
        <Spinner />
        <p className="mt-4 text-gray-600">Loading...</p>
      </div>
    }>
      <ReturnClient />
    </Suspense>
  );
}