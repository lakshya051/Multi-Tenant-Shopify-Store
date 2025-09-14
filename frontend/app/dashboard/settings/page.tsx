"use client";

import { useState } from 'react';
import { clientApiService } from '../../../lib/clientApiService';
import { useDashboard } from '../DashboardContext';
import { Trash2 } from 'lucide-react';
import { ConfirmationModal } from '../../../components/ConfirmationModal';
import { PasswordInput } from '../../../components/PasswordInput';
import { toast } from 'sonner'; 

export default function SettingsPage() {
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);

    const { allTenants, fetchAndSetTenants } = useDashboard();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [tenantToDelete, setTenantToDelete] = useState<string | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const handlePasswordSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (newPassword.length <= 6) {
            setError('New password must be longer than 6 characters.');
            toast.error('New password must be longer than 6 characters.');
            return;
        }

        if (newPassword !== confirmPassword) {
            setError('New passwords do not match.');
            toast.error('New passwords do not match.');
            return;
        }

        setLoading(true);
        try {
            const res = await clientApiService.changePassword(oldPassword, newPassword);
            if (res.ok) {
                setSuccess('Password changed successfully!');
                toast.success('Password changed successfully!');
                setOldPassword('');
                setNewPassword('');
                setConfirmPassword('');
            } else {
                const data = await res.json();
                setError(data.error || 'Failed to change password.');
                toast.error(data.error || 'Failed to change password.');
            }
        } catch {
            setError('An error occurred.');
            toast.error('An error occurred.');
        } finally {
            setLoading(false);
        }
    };
    
    const openDeleteModal = (tenantId: string) => {
        setTenantToDelete(tenantId);
        setIsModalOpen(true);
    };

    const handleDeleteConfirm = async () => {
        if (!tenantToDelete) return;
        setIsDeleting(true);
        try {
            await clientApiService.deleteTenant(tenantToDelete);
            toast.success('Store deleted successfully.');
            await fetchAndSetTenants();
            setIsModalOpen(false);
            setTenantToDelete(null);
        } catch {
            toast.error('Failed to delete store.');
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <>
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-800 mb-8">Settings</h1>
                
                <div className="space-y-12">
                    
                    <section className="grid grid-cols-1 md:grid-cols-3 md:gap-8">
                        <div className="md:col-span-1">
                            <h2 className="text-xl font-semibold text-gray-700">Change Password</h2>
                            <p className="mt-2 text-sm text-gray-500">Update your password here. Choose a strong, unique password.</p>
                        </div>
                        <div className="md:col-span-2 mt-6 md:mt-0">
                            <div className="bg-white p-6 rounded-lg shadow-md border">
                                {error && <p className="bg-red-100 text-red-700 p-3 rounded-md mb-4 text-sm">{error}</p>}
                                {success && <p className="bg-green-100 text-green-700 p-3 rounded-md mb-4 text-sm">{success}</p>}
                                <form onSubmit={handlePasswordSubmit} className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Current Password</label>
                                        <PasswordInput value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">New Password</label>
                                        <PasswordInput value={newPassword} onChange={(e) => setNewPassword(e.target.value)}  />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Confirm New Password</label>
                                        <PasswordInput value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                                    </div>
                                    <div className="pt-2 text-right">
                                        <button type="submit" disabled={loading} className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition disabled:bg-indigo-400">
                                            {loading ? 'Saving...' : 'Save Changes'}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </section>

                    
                    <section className="grid grid-cols-1 md:grid-cols-3 md:gap-8">
                        <div className="md:col-span-1">
                            <h2 className="text-xl font-semibold text-gray-700">Store Management</h2>
                            <p className="mt-2 text-sm text-gray-500">Manage your connected Shopify stores. Deleting a store will permanently remove all its associated data.</p>
                        </div>
                        <div className="md:col-span-2 mt-6 md:mt-0">
                             <div className="bg-white p-6 rounded-lg shadow-md border">
                                <div className="space-y-3">
                                    {allTenants.map(tenant => (
                                        <div key={tenant.id} className="flex justify-between items-center p-4 border rounded-lg bg-gray-50">
                                            <div>
                                                <p className="font-medium text-gray-800">{tenant.storeUrl}</p>
                                                <p className="text-xs text-gray-500 mt-1">ID: {tenant.id}</p>
                                            </div>
                                            <button 
                                                onClick={() => openDeleteModal(tenant.id)}
                                                className="flex items-center px-3 py-1.5 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm font-semibold transition"
                                            >
                                                <Trash2 className="w-4 h-4 mr-2" />
                                                Delete
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
            </div>

            <ConfirmationModal 
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onConfirm={handleDeleteConfirm}
                title="Delete Store"
                message="Are you sure you want to delete this store? All associated data will be permanently removed. This action cannot be undone."
                confirmText="Delete"
                isConfirming={isDeleting}
            />
        </>
    );
}