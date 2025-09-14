export interface Product { 
  id: string; 
  title: string; 
  vendor: string | null; 
  productType: string | null; 
  imageUrl: string | null;
}
export interface Checkout {
  id: string;
  totalPrice: number;
  currency: string;
  customerEmail: string | null;
  createdAt: string;
  webUrl: string | null; 
  updatedAt: string;
}
export interface Customer { 
  id: string; 
  firstName: string | null; 
  lastName: string | null; 
  email: string | null; 
  totalSpend?: number; 
  status?: 'New' | 'Returning';
  _count?: {
    orders: number;
  };
}
export interface Order { 
  id: string; 
  totalPrice: number; 
  financialStatus: string | null; 
  createdAt: string; 
  customer?: { id: string }; 
  lineItems?: LineItem[];
  checkoutId: string | null;
}
export interface Tenant { 
  id: string; 
  storeUrl: string; 
  products: Product[]; 
  customers: Customer[]; 
  orders: Order[];
  checkouts: Checkout[]; 
}
export interface LineItem { 
  id: string; 
  quantity: number; 
  title: string; 
  productId: string | null; 
}

const API_HOST = process.env.NEXT_PUBLIC_API_BASE_URL;
const API_BASE_URL = `${API_HOST}/api`;

const clientApiFetch = (url: string, options: RequestInit = {}) => {
  return fetch(url, {
    ...options,
    credentials: 'include',
    cache: 'no-store',
  });
};

export const clientApiService = {
  login: (email: string, password: string) => clientApiFetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  }),
  register: (email: string, password: string) => clientApiFetch(`${API_BASE_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  }),
  logout: () => clientApiFetch(`${API_BASE_URL}/auth/logout`, {
    method: 'POST',
  }),
  linkTenant: (tenantId: string) => clientApiFetch(`${API_BASE_URL}/tenants/link`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ tenantId }),
  }),
  syncTenant: (tenantId: string) => clientApiFetch(`${API_BASE_URL}/tenants/${tenantId}/sync`, {
    method: 'POST',
  }),
  getData: () => clientApiFetch(`${API_BASE_URL}/tenants/me/data`),

  changePassword: (oldPassword: string, newPassword: string) => clientApiFetch(`${API_BASE_URL}/auth/change-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ oldPassword, newPassword }),
  }),

  deleteTenant: (tenantId: string) => clientApiFetch(`${API_BASE_URL}/tenants/${tenantId}`, {
    method: 'DELETE',
  }),
};