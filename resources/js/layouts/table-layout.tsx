import AppLayoutTemplate from '@/layouts/app/app-sidebar-layout';
import { type BreadcrumbItem } from '@/types';
import { type ReactNode } from 'react';

interface AppLayoutProps {
    children: ReactNode;
    breadcrumbs?: BreadcrumbItem[];
    subtitle?: string;
}

export default ({ children, breadcrumbs, subtitle, ...props }: AppLayoutProps) => (
    <AppLayoutTemplate breadcrumbs={breadcrumbs} subtitle={subtitle} {...props}>
        <div vaul-drawer-wrapper="true" className="min-h-[87dvh] w-full">
            {children}
        </div>
    </AppLayoutTemplate>
);
