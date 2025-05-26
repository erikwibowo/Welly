import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useLang } from '@/hooks/use-lang';
import { usePermission } from '@/hooks/use-permission';
import { cn } from '@/lib/utils';
import { Link } from '@inertiajs/react';
import { ArrowUpDown, Ellipsis, Key, LayoutGrid, Settings, Shield, Tags, User, Users, Wallet } from 'lucide-react';
import type * as React from 'react';

interface BottomNavItemProps {
    href: string;
    icon: React.ReactNode;
    label: string;
    isActive?: boolean;
}

const BottomNavItem = ({ href, icon, label, isActive }: BottomNavItemProps) => {
    return (
        <Link
            href={href}
            className={cn(
                'flex flex-1 flex-col items-center justify-center gap-1 py-2 text-xs transition-colors',
                isActive ? 'text-primary' : 'text-muted-foreground hover:text-primary',
            )}
        >
            <div className={cn('flex w-full items-center justify-center rounded-full p-1', isActive && 'fill-primary/20 bg-primary/20')}>{icon}</div>
            <span className="line-clamp-1 text-center text-xs">{label}</span>
        </Link>
    );
};

export function BottomNavbar() {
    const dashboardText = useLang('text', 'dashboard');
    const userText = useLang('text', 'user');
    const roleText = useLang('text', 'role');
    const permissionText = useLang('text', 'permission');
    const settingText = useLang('text', 'setting');

    // Call hooks unconditionally
    const hasAdminMenu = usePermission(['user read', 'role read', 'permission read', 'setting read', 'category read']);
    const hasUserRead = usePermission(['user read']);
    const hasRoleRead = usePermission(['role read']);
    const hasPermissionRead = usePermission(['permission read']);
    const hasSettingRead = usePermission(['setting read']);
    const hasCategoryRead = usePermission(['category read']);
    const menuActive =
        route().current('user.*') ||
        route().current('role.*') ||
        route().current('permission.*') ||
        route().current('setting.*') ||
        route().current('category.*');

    const hasAsetMenu = usePermission(['asset read']);
    const hasTransactionMenu = usePermission(['transaction read']);

    return (
        <div className={cn(
            "bg-background/60 sticky bottom-0 left-0 z-50 w-full border-t backdrop-blur-lg md:hidden",
            (typeof navigator !== "undefined" && /iPhone|iPad/i.test(navigator.userAgent)) && "pb-4"
        )}>
            <div className="mx-auto flex h-16 max-w-md items-center justify-around gap-2 px-4">
            <BottomNavItem
                href="/dashboard"
                icon={<LayoutGrid className={cn('size-5')} />}
                label={dashboardText}
                isActive={route().current('dashboard')}
            />
            {hasTransactionMenu && (
                <BottomNavItem
                href={route('transaction.index')}
                icon={<ArrowUpDown className={cn('size-5')} />}
                label="Transaksi"
                isActive={route().current('transaction.*')}
                />
            )}
            {hasAsetMenu && (
                <BottomNavItem
                href={route('asset.index')}
                icon={<Wallet className={cn('size-5')} />}
                label="Aset & Liabilitas"
                isActive={route().current('asset.*')}
                />
            )}
            {hasAdminMenu && (
                <DropdownMenu modal={false}>
                <DropdownMenuTrigger asChild>
                    <div
                    className={cn(
                        'flex flex-1 flex-col items-center justify-center gap-1 py-2 text-xs transition-colors',
                        menuActive ? 'text-primary' : 'text-muted-foreground hover:text-primary',
                    )}
                    >
                    <div
                        className={cn(
                        'flex w-full items-center justify-center rounded-full p-1',
                        menuActive && 'fill-primary/20 bg-primary/20',
                        )}
                    >
                        <Ellipsis className="size-5" />
                    </div>
                    <span className="line-clamp-1 text-center text-xs">Lainnya</span>
                    </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="max-w-50">
                    <DropdownMenuLabel className="flex items-center gap-2">Menu Lainnya</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {hasUserRead && (
                    <DropdownMenuItem asChild>
                        <Link className="block w-full" href={route('user.index')} as="button" prefetch>
                        <Users className="icon" />
                        {userText}
                        </Link>
                    </DropdownMenuItem>
                    )}
                    {hasRoleRead && (
                    <DropdownMenuItem asChild>
                        <Link className="block w-full" href={route('role.index')} as="button" prefetch>
                        <Shield className="icon" />
                        {roleText}
                        </Link>
                    </DropdownMenuItem>
                    )}
                    {hasPermissionRead && (
                    <DropdownMenuItem asChild>
                        <Link className="block w-full" href={route('permission.index')} as="button" prefetch>
                        <Key className="icon" />
                        {permissionText}
                        </Link>
                    </DropdownMenuItem>
                    )}
                    {hasSettingRead && (
                    <DropdownMenuItem asChild>
                        <Link className="block w-full" href={route('setting.index')} as="button" prefetch>
                        <Settings className="icon" />
                        {settingText}
                        </Link>
                    </DropdownMenuItem>
                    )}
                    {hasCategoryRead && (
                    <DropdownMenuItem asChild>
                        <Link className="block w-full" href={route('category.index')} as="button" prefetch>
                        <Tags className="icon" />
                        Kategori
                        </Link>
                    </DropdownMenuItem>
                    )}
                </DropdownMenuContent>
                </DropdownMenu>
            )}

            <BottomNavItem
                href="/profiles/profile"
                icon={<User className={cn('size-5')} />}
                label="Profil"
                isActive={route().current('profile.*')}
            />
            </div>
        </div>
    );
}
