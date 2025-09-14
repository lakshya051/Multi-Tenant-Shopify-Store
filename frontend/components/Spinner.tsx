import React from 'react';

/**
 * A simple, reusable loading spinner component.
 * It uses Tailwind CSS classes for animation and styling.
 */
export function Spinner() {
  return (
    <div className="flex justify-center items-center h-full">
      <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-indigo-500"></div>
    </div>
  );
}