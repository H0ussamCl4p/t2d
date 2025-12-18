'use client';

import { ReactNode } from 'react';
import SidebarLayout from '@/components/SidebarLayout';

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return <SidebarLayout>{children}</SidebarLayout>;
}