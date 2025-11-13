
import React, { useState } from 'react';
import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';
import { useAuth } from '@/contexts/AuthContext';

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user } = useAuth();
  
  const toggleSidebar = () => setSidebarOpen(prev => !prev);
  const closeSidebar = () => setSidebarOpen(false);
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar toggleSidebar={toggleSidebar} />
      
      <div className="flex flex-1">
        {user && (
          <Sidebar isOpen={sidebarOpen} closeSidebar={closeSidebar} />
        )}
        
        <main className={`flex-1 ${user ? 'md:ml-64' : ''}`}>
          <div className="container py-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
