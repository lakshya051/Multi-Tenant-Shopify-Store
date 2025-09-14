"use client";

import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

interface PasswordInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
}

/**
 * A reusable password input component with a button to toggle text visibility.
 */
export function PasswordInput({ value, onChange, placeholder = "••••••••" }: PasswordInputProps) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="relative">
      <input 
        type={showPassword ? 'text' : 'password'} 
        value={value}
        onChange={onChange}
        className="w-full px-4 py-2 mt-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 pr-10" 
        required 
        placeholder={placeholder}
      />
      <button
        type="button"
        onClick={() => setShowPassword(!showPassword)}
        className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-500 hover:text-gray-700"
        aria-label={showPassword ? "Hide password" : "Show password"}
      >
        {!showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
      </button>
    </div>
  );
}