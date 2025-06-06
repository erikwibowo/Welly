import AppLogo from '@/components/app-logo';
import NavCollapsible from '@/components/nav-collapsible';
import { NavMain } from '@/components/nav-main';
import { Sidebar, SidebarContent, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { useLang } from '@/hooks/use-lang';
import { usePermission } from '@/hooks/use-permission';
import { type NavItem } from '@/types';
import { Link } from '@inertiajs/react';
import { ArrowUpDown, Database, KeyIcon, LayoutGrid, ShieldIcon, Tags, Users2Icon, Wallet } from 'lucide-react';

export function AppSidebar() {
    const mainNavItems: NavItem[] = [
        {
            title: useLang('text', 'dashboard'),
            href: 'dashboard',
            icon: LayoutGrid,
            permission: null,
        },
    ];
    const masterNavItems: NavItem[] = [
        {
            title: 'Aset & Liabilitas',
            href: 'asset.index',
            icon: Wallet,
            permission: 'asset read',
        },
        {
            title: 'Kategori',
            href: 'category.index',
            icon: Tags,
            permission: 'category read',
        },
        {
            title: 'Transaksi',
            href: 'transaction.index',
            icon: ArrowUpDown,
            permission: 'transaction read',
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

    const accessText = useLang('text', 'access');
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
            <SidebarContent className="py-1">
                <NavMain items={mainNavItems} />
                {usePermission(masterNavItems.map((item) => item.permission).filter((permission): permission is string => !!permission)) && (
                    <NavCollapsible label="Master Data" Icon={Database} items={masterNavItems} />
                )}
                <NavMain
                    labelGroup={
                        usePermission(accessNavItems.map((item) => item.permission).filter((permission): permission is string => !!permission))
                            ? accessText
                            : null
                    }
                    items={accessNavItems}
                />
            </SidebarContent>
        </Sidebar>
    );
}
