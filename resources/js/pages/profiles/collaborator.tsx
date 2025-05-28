import { Head, usePage } from '@inertiajs/react';

import { SharedData, type BreadcrumbItem } from '@/types';

import Delete from '@/components/delete';
import HeadingSmall from '@/components/heading-small';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { UserInfo } from '@/components/user-info';
import AppLayout from '@/layouts/app-layout';
import ProfileLayout from '@/layouts/profiles/layout';
import { dateFormat } from '@/utils/formatter';
import { BadgeCheckIcon, EllipsisIcon, TriangleAlertIcon } from 'lucide-react';
import Create from '../users/create';
import Edit from '../users/edit';

export default function Collaborator({ title, users }: { title: string; users: App.Models.User[] }) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: title,
            href: '/profiles/collaborator',
        },
    ];
    const { auth } = usePage<SharedData>().props;
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={title} />
            <ProfileLayout>
                <div className="space-y-6">
                    <HeadingSmall title="Anggota" description="Kelola anggota untuk mengelola data keuangan" />
                    {auth.user.id === auth.user.parent_id && <Create source="profile" title={title} withRoles={false} />}
                    <div className="space-y-2">
                        {users.map((user, index) => (
                            <div key={index} className="bg-card flex items-center justify-between gap-4 rounded-lg border px-4 py-2 shadow-sm">
                                <div className="flex items-center justify-start gap-2">
                                    <Avatar className="size-10 overflow-hidden rounded-md">
                                        <AvatarImage src={user.full_path_image} alt={user.name} />
                                        <AvatarFallback className="rounded-lg bg-neutral-200 text-black dark:bg-neutral-700 dark:text-white">
                                            {user.initial}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="flex flex-col">
                                        <div className="flex flex-wrap items-center gap-1">
                                            {user.name}
                                            {user.email_verified_at ? (
                                                <span className="flex items-center">
                                                    <Tooltip>
                                                        <TooltipTrigger asChild>
                                                            <BadgeCheckIcon className="icon !fill-info/40 text-info shrink-0 cursor-pointer" />
                                                        </TooltipTrigger>
                                                        <TooltipContent>
                                                            <p>Diverifikasi pada {dateFormat(user.email_verified_at)}</p>
                                                        </TooltipContent>
                                                    </Tooltip>
                                                </span>
                                            ) : (
                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        <TriangleAlertIcon className="icon !fill-destructive/20 text-destructive shrink-0 cursor-pointer" />
                                                    </TooltipTrigger>
                                                    <TooltipContent>
                                                        <p>Belum verifikasi email</p>
                                                    </TooltipContent>
                                                </Tooltip>
                                            )}{' '}
                                            {user.id === user.parent_id && <Badge>Utama</Badge>}
                                        </div>
                                        <span className="text-muted-foreground text-xs">{user.email}</span>
                                    </div>
                                </div>
                                <DropdownMenu modal={false}>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" className="h-8 w-8 p-0">
                                            <span className="sr-only">Aksi</span>
                                            <EllipsisIcon className="icon" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end" className="max-w-50">
                                        <DropdownMenuLabel className="flex items-center gap-2">
                                            <UserInfo user={user} showEmail />
                                        </DropdownMenuLabel>
                                        {auth.user.id === auth.user.parent_id && (
                                            <>
                                                <DropdownMenuSeparator />
                                                <Edit source="profile" title={title} user={user} />
                                                {user.id !== user.parent_id && (
                                                    <Delete
                                                        title={title}
                                                        permissions={['user delete']}
                                                        routes="user.destroy"
                                                        description={user.name}
                                                        id={user.id}
                                                    />
                                                )}
                                            </>
                                        )}
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        ))}
                    </div>
                </div>
            </ProfileLayout>
        </AppLayout>
    );
}
