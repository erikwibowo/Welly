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

export function AppSidebarHeader({ breadcrumbs = [] }: { breadcrumbs?: BreadcrumbItemType[] }) {
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
            className={`border-sidebar-border/50 bg-background sticky inset-x-0 top-0 isolate z-1 flex w-full shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 ${scrollY > 0 ? 'bg-background/60 h-12 border-b backdrop-blur' : 'h-14'}`}
        >
            <div className="mx-auto flex w-full items-center justify-between gap-2 px-4">
                <div className="flex items-center gap-2">
                    <SidebarTrigger />
                    <Breadcrumbs breadcrumbs={breadcrumbs} />
                </div>
                <div className="flex items-center gap-2">
                    <AppearanceToggleDropdown />
                    <DropdownMenu modal={false}>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="size-9 rounded-md p-1">
                                <Avatar className="size-9 overflow-hidden rounded-md">
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
