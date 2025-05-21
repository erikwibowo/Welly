import { AppContent } from '@/components/app-content';
import { AppShell } from '@/components/app-shell';
import { AppSidebarHeader } from '@/components/app-sidebar-header';
import { BottomNavbar } from '@/components/bottom-navbar';
import { type BreadcrumbItem } from '@/types';
import { type PropsWithChildren } from 'react';
import { AppSidebar } from '../authenticated/app-sidebar';

export default function AppSidebarLayout({ children, breadcrumbs = [] }: PropsWithChildren<{ breadcrumbs?: BreadcrumbItem[] }>) {
    return (
        <AppShell variant="sidebar">
            <AppSidebar />
            <AppContent variant="sidebar">
                <AppSidebarHeader breadcrumbs={breadcrumbs} />
                {children}
                <BottomNavbar />
            </AppContent>
        </AppShell>
    );
}
