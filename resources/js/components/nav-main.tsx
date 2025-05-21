import { SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu } from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { NavItem as Nav } from './nav-item';

export function NavMain({ labelGroup, items = [] }: { labelGroup?: string | null; items: NavItem[] }) {
    return (
        <SidebarGroup className="px-2 py-0">
            {labelGroup ? (
                <>
                    <SidebarGroupLabel>{labelGroup}</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {items.map((item) => (
                                <Nav key={item.title} item={item} />
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </>
            ) : (
                <SidebarGroupContent>
                    <SidebarMenu>
                        {items.map((item) => (
                            <Nav key={item.title} item={item} />
                        ))}
                    </SidebarMenu>
                </SidebarGroupContent>
            )}
        </SidebarGroup>
    );
}
