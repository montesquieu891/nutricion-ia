'use client';

import React, { useState } from 'react';
import { ProtectedRoute } from '@/components/Auth/ProtectedRoute';
import { Navbar, Sidebar, Footer } from '@/components/Layout';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  return (
    <ProtectedRoute>
      <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
        <Navbar 
          onMenuClick={() => setSidebarOpen(!sidebarOpen)}
          showMenuButton 
        />
        
        <div className="flex flex-1">
          <Sidebar 
            isOpen={sidebarOpen}
            onClose={() => setSidebarOpen(false)}
          />
          
          <main className="flex-1 p-4 lg:p-8 overflow-y-auto">
            <div className="max-w-7xl mx-auto">
              {children}
            </div>
          </main>
        </div>
        
        <Footer />
      </div>
    </ProtectedRoute>
  );
}
