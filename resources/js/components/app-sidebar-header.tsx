import { Breadcrumbs } from '@/components/breadcrumbs';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { useInitials } from '@/hooks/use-initials';
import { SharedData, type BreadcrumbItem as BreadcrumbItemType } from '@/types';
import { usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import AppearanceToggleDropdown from './appearance-dropdown';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Button } from './ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from './ui/dropdown-menu';
import { UserMenuContent } from './user-menu-content';

export function AppSidebarHeader({ breadcrumbs = [], subtitle }: { breadcrumbs?: BreadcrumbItemType[], subtitle?: string }) {
    const [scrollY, setScrollY] = useState(0);

    const { auth } = usePage<SharedData>().props;
    const getInitials = useInitials();

    useEffect(() => {
        const handleScroll = () => setScrollY(window.scrollY);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);
    return (
        <header
            className={`border-sidebar-border/50 bg-background sticky inset-x-0 top-0 isolate z-1 flex w-full shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 ${scrollY > 0 ? 'h-12 border-b' : 'h-14'}`}
        >
            <div className="mx-auto flex w-full items-center justify-between gap-2 px-4">
                <div className="flex items-center gap-2">
                    <SidebarTrigger className="hidden md:flex" />
                    <div className="flex flex-col">
                        <Breadcrumbs breadcrumbs={breadcrumbs} />
                        {subtitle && <p className="text-muted-foreground md:hidden text-xs">{subtitle}</p>}
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <AppearanceToggleDropdown />
                    <DropdownMenu modal={false}>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="size-9 rounded-md p-1">
                                <Avatar className="size-9 overflow-hidden rounded-md border">
                                    <AvatarImage src={auth.user.full_path_image} alt={auth.user.name} />
                                    <AvatarFallback className="rounded-md bg-neutral-200 text-black dark:bg-neutral-700 dark:text-white">
                                        {getInitials(auth.user.name)}
                                    </AvatarFallback>
                                </Avatar>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-56" align="end">
                            <UserMenuContent user={auth.user} />
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
        </header>
    );
}
