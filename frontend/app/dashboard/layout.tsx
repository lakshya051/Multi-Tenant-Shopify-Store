import { Sidebar } from '../../components/Sidebar';
import { Header } from '../../components/Header';
import { serverApiService } from '../../lib/serverApiService';
import { DashboardClient } from './DashBoardClient';
import { Tenant } from '../../lib/clientApiService';
import { NewStoreNotification } from '../../components/NewStoreNotification';
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';

async function getInitialData(): Promise<Tenant[]> {
    try {
        return await serverApiService.getDataOnServer();
    } catch (error) {
        console.error("Failed to fetch initial data:", error);
        return [];
    }
}

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Check if user is authenticated
  const cookieStore = await cookies();
  const token = cookieStore.get('token');
  
  if (!token) {
    redirect('/login');
  }

  const initialData = await getInitialData();

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <DashboardClient initialData={initialData}>
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header />
          <NewStoreNotification /> 
          <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-6 md:p-8">
            {children}
          </main>
        </div>
      </DashboardClient>
    </div>
  );
}