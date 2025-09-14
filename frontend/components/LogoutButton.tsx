"use client";

import { useRouter } from 'next/navigation';
import { clientApiService } from '../lib/clientApiService';

export function LogoutButton() {
    const router = useRouter();

    const handleLogout = async () => {
        await clientApiService.logout();
        router.push('/login');
        router.refresh();
    };

    return (
        <button onClick={handleLogout} className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition">
            Logout
        </button>
    );
}