'use client';

import React from 'react';
import Link from 'next/link';
import { useTheme } from '@/providers/ThemeProvider';
import { useAuth } from '@/hooks/useAuth';

interface NavbarProps {
  onMenuClick?: () => void;
  showMenuButton?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({ 
  onMenuClick, 
  showMenuButton = false 
}) => {
  const { theme, toggleTheme } = useTheme();
  const { user, isAuthenticated } = useAuth();
  
  return (
    <nav className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Left side */}
          <div className="flex items-center">
            {showMenuButton && (
              <button
                onClick={onMenuClick}
                className="mr-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 lg:hidden"
              >
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            )}
            
            <Link href={isAuthenticated ? '/dashboard' : '/'} className="flex items-center">
              <span className="text-xl font-bold text-blue-600 dark:text-blue-400">
                Nutrición IA
              </span>
            </Link>
          </div>
          
          {/* Right side */}
          <div className="flex items-center space-x-4">
            {/* Dark mode toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-smooth"
              aria-label="Toggle dark mode"
            >
              {theme === 'dark' ? (
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" />
                </svg>
              ) : (
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                </svg>
              )}
            </button>
            
            {isAuthenticated && user && (
              <div className="flex items-center space-x-2">
                <span className="hidden sm:block text-sm text-gray-700 dark:text-gray-300">
                  {user.nombre}
                </span>
                <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold">
                  {user.nombre.charAt(0).toUpperCase()}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};
