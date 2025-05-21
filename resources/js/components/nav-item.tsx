import { usePermission } from '@/hooks/use-permission';
import { NavItem as Nav } from '@/types';
import { Link } from '@inertiajs/react';
import { SidebarMenuButton, SidebarMenuItem } from './ui/sidebar';

export function NavItem({ item }: { item: Nav }) {
    const permission = usePermission(item.permission ? [item.permission] : null);
    return item.permission ? (
        permission && (
            <SidebarMenuItem key={item.title}>
                <SidebarMenuButton tooltip={item.title} asChild isActive={route().current(item.href)}>
                    <Link href={route(item.href)} prefetch>
                        {item.icon && <item.icon className="icon" />}
                        <span>{item.title}</span>
                    </Link>
                </SidebarMenuButton>
            </SidebarMenuItem>
        )
    ) : (
        <SidebarMenuItem key={item.title}>
            <SidebarMenuButton tooltip={item.title} asChild isActive={route().current(item.href)}>
                <Link href={route(item.href)} prefetch>
                    {item.icon && <item.icon className="icon" />}
                    <span>{item.title}</span>
                </Link>
            </SidebarMenuButton>
        </SidebarMenuItem>
    );
}
