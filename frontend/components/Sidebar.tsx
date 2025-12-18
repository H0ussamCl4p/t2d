'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Shield, Home, BarChart3, MessageSquare, Settings, User, LogOut } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface SidebarProps {
  activeItem?: string;
}

const Sidebar: React.FC<SidebarProps> = () => {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home, href: '/dashboard' },
    { id: 'analysis', label: 'Analysis', icon: BarChart3, href: '/dashboard/analysis' },
    { id: 'bob-chatbot', label: 'Bob (Chatbot)', icon: MessageSquare, href: '/dashboard/chatbot' },
    { id: 'settings', label: 'Settings', icon: Settings, href: '/dashboard/settings' },
  ];

  const getActiveItem = () => {
    if (pathname === '/dashboard') return 'dashboard';
    if (pathname === '/dashboard/analysis') return 'analysis';
    if (pathname === '/dashboard/chatbot') return 'bob-chatbot';
    if (pathname === '/dashboard/settings') return 'settings';
    return 'dashboard';
  };

  const activeItem = getActiveItem();

  return (
    <div className="fixed left-0 top-0 h-full w-72 bg-slate-900/50 backdrop-blur-md border-r border-slate-800 z-50">
      {/* Logo */}
      <div className="p-6 border-b border-slate-800 flex items-center justify-center">
        <Image
          src="/images/safran-logo.png"
          alt="Strataero Logo"
          width={140}
          height={48}
          priority
          className="object-contain"
        />
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeItem === item.id;
            return (
              <li key={item.id} className="hover:translate-x-1 transition-transform duration-200">
                <Link
                  href={item.href}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                    isActive
                      ? 'bg-safran-blue/20 text-safran-blue border border-safran-blue/30'
                      : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/50'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* User Profile */}
      <div className="p-4 border-t border-slate-800">
        <div className="flex items-center space-x-3 mb-3 hover:scale-105 transition-transform duration-200">
          <div className="w-10 h-10 bg-slate-700 rounded-full flex items-center justify-center">
            <User className="w-5 h-5 text-slate-300" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-100">
              {user?.first_name || user?.full_name || user?.email || 'Utilisateur'}
              {user?.last_name ? ` ${user.last_name}` : ''}
            </p>
            <p className="text-xs text-slate-400">Sécurisé</p>
          </div>
        </div>
        <button 
          onClick={logout}
          className="w-full flex items-center space-x-2 px-4 py-2 text-slate-400 hover:text-slate-100 hover:bg-slate-800/50 rounded-lg transition-all duration-200 hover:scale-105 active:scale-95"
        >
          <LogOut className="w-4 h-4" />
          <span className="text-sm">Déconnexion</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;