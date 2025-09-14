import { Sidebar } from '../../components/Sidebar';
import { serverApiService } from '../../lib/serverApiService';
import { DashboardProvider } from './DashboardProvider'; 
import { Tenant } from '../../lib/clientApiService';
import { Header } from '../../components/Header';
import { NewStoreNotification } from '../../components/NewStoreNotification';

async function getInitialData(): Promise<Tenant[]> {
    return await serverApiService.getDataOnServer();
}

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const initialData = await getInitialData();

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <DashboardProvider initialData={initialData}>
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header />
          <NewStoreNotification /> 
          <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-6 md:p-8">
            {children}
          </main>
        </div>
      </DashboardProvider>
    </div>
  );
}