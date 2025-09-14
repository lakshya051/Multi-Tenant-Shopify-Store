"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { clientApiService } from '../../../lib/clientApiService';
import { Package } from 'lucide-react';
import { PasswordInput } from '../../../components/PasswordInput';
import { toast } from 'sonner';
export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const validateForm = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address.');
      return false;
    }
    if (password.length <= 6) {
      setError('Password must be longer than 6 characters.');
      return false;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    try {
      const res = await clientApiService.register(email, password);
      if (res.ok) {
        toast.success('Registration successful! Please log in.');
        setTimeout(() => {
          router.push('/login');
        }, 1500);
      } else {
        const data = await res.json();
        setError(data.error || 'Registration failed.');
        toast.error(data.error || 'Registration failed.');
      }
    } catch {
      setError('An error occurred.');
      toast.error('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-lg border">
        <div className="flex justify-center items-center mb-6">
          <Package className="w-10 h-10 text-indigo-600"/>
          <h1 className="ml-3 text-3xl font-bold text-gray-800">Shopalytics</h1>
        </div>
        <h2 className="text-xl text-center text-gray-600 mb-8">Create an Account</h2>
        {error && <p className="bg-red-100 text-red-700 p-3 rounded-md mb-4 text-center text-sm">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Email Address</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-4 py-2 mt-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" required placeholder="you@example.com" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <PasswordInput 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="More than 6 characters"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Confirm Password</label>
            <PasswordInput 
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Re-type your password"
            />
          </div>
          <button type="submit" disabled={loading} className="w-full bg-indigo-600 text-white py-2.5 rounded-lg hover:bg-indigo-700 transition disabled:bg-indigo-400">
            {loading ? 'Creating Account...' : 'Register'}
          </button>
        </form>
        <p className="mt-6 text-center text-sm text-gray-600">
          Already have an account?{' '}
          <Link href="/login" className="text-indigo-600 hover:underline font-semibold">Login here</Link>
        </p>
      </div>
    </div>
  );
}