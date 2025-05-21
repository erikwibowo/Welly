import { usePermission } from '@/hooks/use-permission';
import { NavItem } from '@/types';
import { Link } from '@inertiajs/react';
import { SidebarMenuButton, SidebarMenuItem } from './ui/sidebar';

export default function NavItemCollapsible({ item }: { item: NavItem }) {
    const permission = usePermission(item.permission ? [item.permission] : null);
    return (
        permission && (
            <SidebarMenuItem key={item.title}>
                <SidebarMenuButton tooltip={item.title} asChild isActive={route().current(item.href)}>
                    <Link href={route(item.href)} prefetch>
                        {item.icon && <item.icon className="icon hidden group-has-data-[collapsible=icon]/sidebar-wrapper:block" />}
                        <span>{item.title}</span>
                    </Link>
                </SidebarMenuButton>
            </SidebarMenuItem>
        )
    );
}
