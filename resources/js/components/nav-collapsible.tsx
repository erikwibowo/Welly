import { NavItem } from '@/types';
import { ChevronDown, LucideIcon } from 'lucide-react';
import NavItemCollapsible from './nav-item-collapsible';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from './ui/collapsible';
import { SidebarGroup, SidebarGroupContent, SidebarMenu, SidebarMenuButton } from './ui/sidebar';

export default function NavCollapsible({ label, Icon: Icon, items }: { label: string; Icon: LucideIcon | null; items: NavItem[] }) {
    return (
        <Collapsible defaultOpen={items.some((item) => route().current(item.href))} className="group/collapsible">
            <SidebarGroup className="pt-1 pb-0">
                <SidebarMenuButton tooltip={label} className="cursor-pointer" asChild>
                    <CollapsibleTrigger>
                        {Icon && <Icon className="icon" />}
                        {label}
                        <ChevronDown className="icon ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180" />
                    </CollapsibleTrigger>
                </SidebarMenuButton>
                <CollapsibleContent className="ml-4 border-l-1 pt-1 pl-2 group-has-data-[collapsible=icon]/sidebar-wrapper:ml-0 group-has-data-[collapsible=icon]/sidebar-wrapper:border-l-0 group-has-data-[collapsible=icon]/sidebar-wrapper:pl-0">
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {items.map((item) => (
                                <NavItemCollapsible key={item.title} item={item} />
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </CollapsibleContent>
            </SidebarGroup>
        </Collapsible>
    );
}
