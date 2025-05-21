import Delete from '@/components/delete';
import DeleteBulk from '@/components/delete-bulk';
import Empty from '@/components/empty';
import Pagination from '@/components/pagination';
import SortableTableHead from '@/components/sortable-table-head';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { DropdownMenu, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { UserInfo } from '@/components/user-info';
import { useInitials } from '@/hooks/use-initials';
import { useLang } from '@/hooks/use-lang';
import TableLayout from '@/layouts/table-layout';
import { Filter, SharedData, type BreadcrumbItem } from '@/types';
import { dateFormat, numberFormat } from '@/utils/formatter';
import { Head, router, usePage } from '@inertiajs/react';
import { debounce, pickBy } from 'lodash';
import { BadgeCheckIcon, EllipsisIcon, EllipsisVerticalIcon, SearchIcon, TriangleAlertIcon } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import Permission from '../roles/permission';
import Create from './create';
import Edit from './edit';

export default function Dashboard({
    title,
    roles,
    filters,
    users,
}: {
    title: string;
    roles: App.Models.Role[];
    filters: Filter;
    users: App.Paginate<App.Models.User>;
}) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: useLang('text', 'user'),
            href: 'user.index',
        },
    ];
    const [selected, setSelected] = useState<number[]>([]);
    const isFirstRun = useRef(true);
    const [filter, setFilter] = useState({
        perpage: filters.perpage,
        q: filters?.q,
        field: filters?.field,
        order: filters?.order,
        page: filters?.page || 1,
    });
    useEffect(() => {
        if (isFirstRun.current) {
            isFirstRun.current = false;
            return;
        }

        const debouncedData = debounce(() => {
            router.get(route(String(route().current())), pickBy(filter), {
                replace: true,
                preserveScroll: true,
                preserveState: true,
            });
        }, 300);
        debouncedData();
        return () => {
            debouncedData.cancel();
        };
    }, [filter]);
    const handleSort = (field: string) => {
        setFilter((prev) => ({
            ...prev,
            field: field,
            order: filters.order === 'asc' ? 'desc' : 'asc',
            page: 1,
        }));
    };
    const getInitials = useInitials();

    const notSelectedtext = useLang('text', 'not_selected');
    const permissionText = useLang('text', 'permission');
    const actionColumnLang = useLang('column', 'action');
    return (
        <TableLayout breadcrumbs={breadcrumbs}>
            <Head title={title} />
            <div className="mx-auto w-full space-y-4 py-4">
                <div className="flex scroll-px-0.5 items-center justify-between gap-4 overflow-x-auto px-4">
                    <div className="flex items-center gap-2">
                        <Create roles={roles} title={title} />
                        {selected.length > 0 && (
                            <DropdownMenu modal={false}>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="outline">
                                        ({selected.length})
                                        <EllipsisVerticalIcon className="icon" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="start">
                                    <DeleteBulk
                                        onDeleteSuccess={() => setSelected([])}
                                        title={title}
                                        permissions={['user delete']}
                                        routes="user.destroy-bulk"
                                        id={selected}
                                    />
                                </DropdownMenuContent>
                            </DropdownMenu>
                        )}
                    </div>
                    <div className="flex items-center gap-2 py-1">
                        <Select
                            onValueChange={(value) => {
                                setFilter((prev) => ({
                                    ...prev,
                                    perpage: Number(value),
                                    page: 1,
                                }));
                            }}
                            value={String(filter.perpage)}
                        >
                            <SelectTrigger className="w-fit">
                                <SelectValue placeholder="Per Page" />
                            </SelectTrigger>
                            <SelectContent>
                                {usePage<SharedData>().props.app.perPages.map((perPage, index) => (
                                    <SelectItem key={index} value={String(perPage.value)}>
                                        {perPage.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <div className="relative">
                            <Input
                                value={filter.q}
                                onChange={(e) =>
                                    setFilter((prev) => ({
                                        ...prev,
                                        q: e.target.value,
                                        page: 1,
                                    }))
                                }
                                type="search"
                                className="w-40 pl-8"
                                placeholder={useLang('placeholder', 'search')}
                            />
                            <SearchIcon className="icon fill-primary/20 absolute top-2.5 left-3" />
                        </div>
                    </div>
                </div>
                <Empty show={users.data.length === 0} />
                <Table className={users.data.length > 0 ? 'w-full' : 'hidden'}>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="text-left">
                                <Checkbox
                                    checked={selected.length > 0 && selected.length === users.data.length}
                                    onCheckedChange={(value) => setSelected(value ? users.data.map((user) => user.id) : [])}
                                />
                            </TableHead>
                            <TableHead>#</TableHead>
                            <TableHead>{useLang('column', 'photo')}</TableHead>
                            <SortableTableHead field={filters.field} onSort={() => handleSort('name')}>
                                {useLang('column', 'name')}
                            </SortableTableHead>
                            <SortableTableHead field={filters.field} onSort={() => handleSort('email')}>
                                {useLang('column', 'email')}
                            </SortableTableHead>
                            <TableHead>{useLang('text', 'role')}</TableHead>
                            <SortableTableHead field={filters.field} onSort={() => handleSort('created_at')}>
                                {useLang('column', 'date')}
                            </SortableTableHead>
                            <TableHead className="sr-only">{actionColumnLang}</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {users.data.map((user, index) => (
                            <TableRow key={user.id} data-state={selected.includes(user.id) ? 'selected' : ''}>
                                <TableHead className="text-left">
                                    <Checkbox
                                        checked={selected.includes(user.id)}
                                        onCheckedChange={(value) => {
                                            setSelected((prev) => (value ? [...prev, user.id] : prev.filter((id) => id !== user.id)));
                                        }}
                                    />
                                </TableHead>
                                <TableHead>{numberFormat(users.from + index)}</TableHead>
                                <TableCell>
                                    <Avatar className="h-8 w-8 overflow-hidden rounded-md">
                                        <AvatarImage src={user.full_path_image} alt={user.name} />
                                        <AvatarFallback className="rounded-lg bg-neutral-200 text-black dark:bg-neutral-700 dark:text-white">
                                            {getInitials(user.name)}
                                        </AvatarFallback>
                                    </Avatar>
                                </TableCell>
                                <TableCell className="font-medium">
                                    <p className="flex items-center gap-1">
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
                                        )}
                                        <span className="line-clamp-1 min-w-48">{user.name}</span>
                                    </p>
                                </TableCell>
                                <TableCell>{user.email}</TableCell>
                                <TableCell className="flex flex-wrap items-center gap-1">
                                    {user.roles?.length === 0 ? (
                                        <span className="text-muted-foreground">{notSelectedtext}</span>
                                    ) : (
                                        user.roles?.map((role) => (
                                            <Permission key={role.id} title={`${permissionText} ${role.name}`} role={role} source="user" />
                                        ))
                                    )}
                                </TableCell>
                                <TableCell>{dateFormat(user.updated_at)}</TableCell>
                                <TableCell className="text-right">
                                    <DropdownMenu modal={false}>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" className="h-8 w-8 p-0">
                                                <span className="sr-only">{actionColumnLang}</span>
                                                <EllipsisIcon className="icon" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end" className="max-w-50">
                                            <DropdownMenuLabel className="flex items-center gap-2">
                                                <UserInfo user={user} showEmail />
                                            </DropdownMenuLabel>
                                            <DropdownMenuSeparator />
                                            <Edit title={title} user={user} roles={roles} />
                                            <Delete
                                                title={title}
                                                permissions={['user delete']}
                                                routes="user.destroy"
                                                description={user.name}
                                                id={user.id}
                                            />
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                <Pagination data={users} />
            </div>
        </TableLayout>
    );
}
