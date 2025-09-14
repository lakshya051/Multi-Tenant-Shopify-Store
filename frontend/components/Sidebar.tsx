"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { 
    LayoutDashboard, 
    ShoppingCart, 
    Users, 
    BarChart2, 
    Package, 
    Settings 
} from 'lucide-react';


const navItems = [
  { href: '/dashboard', label: 'Overview', icon: LayoutDashboard },
  { href: '/dashboard/orders', label: 'Orders', icon: ShoppingCart },
  { href: '/dashboard/customers', label: 'Customers', icon: Users },
  { href: '/dashboard/products', label: 'Products', icon: Package },
  { href: '/dashboard/metrics', label: 'Metrics', icon: BarChart2 },
];


export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-white border-r border-gray-200 flex-col hidden md:flex">

      <div className="p-6 h-16 flex items-center border-b">
        <Package className="w-8 h-8 text-indigo-600"/>
        <h1 className="ml-3 text-2xl font-bold text-gray-800">Shopalytics</h1>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-2">
        {navItems.map(item => {

          const isActive = pathname === item.href;
          return (
            <Link
              key={item.label}
              href={item.href}
              className={`flex items-center px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-indigo-50 text-indigo-600' 
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900' 
              }`}
            >
              <item.icon className="w-5 h-5 mr-3" />
              {item.label}
            </Link>
          );
        })}
      </nav>


      <div className="px-4 py-6 border-t">
        <Link
          href="/dashboard/settings"
          className={`flex items-center px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
            pathname === '/dashboard/settings'
              ? 'bg-indigo-50 text-indigo-600'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          <Settings className="w-5 h-5 mr-3" />
          Settings
        </Link>
      </div>
    </aside>
  );
}

