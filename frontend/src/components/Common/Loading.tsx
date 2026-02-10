'use client';

import React from 'react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 'md', 
  className = '' 
}) => {
  const sizeStyles = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
  };
  
  return (
    <svg
      className={`animate-spin ${sizeStyles[size]} ${className}`}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      ></circle>
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      ></path>
    </svg>
  );
};

interface LoadingProps {
  text?: string;
  fullScreen?: boolean;
}

export const Loading: React.FC<LoadingProps> = ({ 
  text = 'Cargando...', 
  fullScreen = false 
}) => {
  const containerClasses = fullScreen
    ? 'fixed inset-0 flex items-center justify-center bg-white dark:bg-gray-900 bg-opacity-75 dark:bg-opacity-75 z-50'
    : 'flex items-center justify-center p-8';
  
  return (
    <div className={containerClasses}>
      <div className="text-center">
        <LoadingSpinner size="lg" className="mx-auto text-blue-600 dark:text-blue-400" />
        {text && (
          <p className="mt-4 text-gray-600 dark:text-gray-400">{text}</p>
        )}
      </div>
    </div>
  );
};

export const Skeleton: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div
      className={`animate-pulse bg-gray-200 dark:bg-gray-700 rounded ${className}`}
    ></div>
  );
};
