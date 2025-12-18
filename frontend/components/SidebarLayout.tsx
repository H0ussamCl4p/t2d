'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import Sidebar from '@/components/Sidebar';
import { Bell, ChevronRight } from 'lucide-react';

interface SidebarLayoutProps {
  children: React.ReactNode;
}

export default function SidebarLayout({ children }: SidebarLayoutProps) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-safran-blue border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-400">Loading Strataero...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Will redirect to login
  }

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 ml-72">
        {/* Top Bar */}
        <header className="bg-slate-900/50 backdrop-blur-md border-b border-slate-800 px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Breadcrumbs */}
            <nav className="flex items-center space-x-2 text-sm">
              <span className="text-slate-400">Strataero</span>
              <ChevronRight className="w-4 h-4 text-slate-500" />
              <span className="text-slate-100 font-medium">Platform</span>
              <ChevronRight className="w-4 h-4 text-slate-500" />
              <span className="text-safran-blue">Dashboard</span>
            </nav>

            {/* Right Side */}
            <div className="flex items-center space-x-4">
              {/* Status Indicator */}
              <div className="flex items-center space-x-2 text-sm">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-slate-400">System Secure & Encrypted</span>
              </div>

              {/* Notifications */}
              <button className="relative p-2 text-slate-400 hover:text-slate-100 transition-colors">
                <Bell className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-safran-blue rounded-full"></span>
              </button>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
}