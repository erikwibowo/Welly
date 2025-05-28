import { AppShell } from '@/components/app-shell';
import { AppSidebarHeader } from '@/components/app-sidebar-header';
import { type BreadcrumbItem } from '@/types';
import { type PropsWithChildren } from 'react';
import { AppSidebar } from '../authenticated/app-sidebar';
import { BottomNavbar } from '@/components/bottom-navbar';

export default function AppSidebarLayout({ children, breadcrumbs = [] }: PropsWithChildren<{ breadcrumbs?: BreadcrumbItem[] }>) {
    return (
        <AppShell variant="sidebar">
            <AppSidebar />
            <div className="min-h[100svh] grid flex-1 grid-rows-[auto_1fr_auto]">
                <AppSidebarHeader breadcrumbs={breadcrumbs} />
                <div className="overflow-x-hidden overflow-y-auto">{children}</div>
                <BottomNavbar />
            </div>
        </AppShell>
    );
}
