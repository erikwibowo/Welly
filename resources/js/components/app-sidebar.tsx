import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { useLang } from '@/hooks/use-lang';
import { type NavItem } from '@/types';
import { Link } from '@inertiajs/react';
import { BookOpen, Folder, KeyIcon, LayoutGrid, ShieldIcon, Users2Icon } from 'lucide-react';
import AppLogo from './app-logo';

export function AppSidebar() {
    const mainNavItems: NavItem[] = [
        {
            title: useLang('text', 'dashboard'),
            href: 'dashboard',
            icon: LayoutGrid,
            permission: null,
        },
    ];
    const accessNavItems: NavItem[] = [
        {
            title: useLang('text', 'user'),
            href: 'user.index',
            icon: Users2Icon,
            permission: 'user read',
        },
        {
            title: useLang('text', 'role'),
            href: 'role.index',
            icon: ShieldIcon,
            permission: 'role read',
        },
        {
            title: useLang('text', 'permission'),
            href: 'permission.index',
            icon: KeyIcon,
            permission: 'permission read',
        },
    ];

    const footerNavItems: NavItem[] = [
        {
            title: 'Repository',
            href: 'https://github.com/laravel/react-starter-kit',
            icon: Folder,
        },
        {
            title: 'Documentation',
            href: 'https://laravel.com/docs/starter-kits',
            icon: BookOpen,
        },
    ];
    return (
        <Sidebar collapsible="icon" variant="sidebar">
            <SidebarHeader className="mb-2">
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href="/dashboard" prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>
            <SidebarContent>
                <NavMain items={mainNavItems} />
                <NavMain labelGroup={useLang('text', 'access')} items={accessNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
