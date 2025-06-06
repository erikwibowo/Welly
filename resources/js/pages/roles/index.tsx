import Delete from '@/components/delete';
import DeleteBulk from '@/components/delete-bulk';
import Empty from '@/components/empty';
import Pagination from '@/components/pagination';
import SortableTableHead from '@/components/sortable-table-head';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { DropdownMenu, DropdownMenuContent, DropdownMenuLabel, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useLang } from '@/hooks/use-lang';
import TableLayout from '@/layouts/table-layout';
import { BreadcrumbItem, Filter, PermissionGroup, SharedData } from '@/types';
import { dateFormat, numberFormat } from '@/utils/formatter';
import { Head, router, usePage } from '@inertiajs/react';
import { debounce, pickBy } from 'lodash';
import { EllipsisIcon, EllipsisVerticalIcon, SearchIcon } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import Create from './create';
import Edit from './edit';
import Permission from './permission';

export default function Index({
    title,
    filters,
    permissions,
    roles,
}: {
    title: string;
    filters: Filter;
    permissions: PermissionGroup[];
    roles: App.Paginate<App.Models.Role>;
}) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: useLang('text', 'role'),
            href: 'user.index',
        },
    ];
    const isFirstRun = useRef(true);
    const [filter, setFilter] = useState({
        perpage: filters.perpage,
        q: filters.q,
        field: filters.field,
        order: filters.order,
        page: filters.page || 1,
    });
    const [selected, setSelected] = useState<number[]>([]);
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
    const permissionText = useLang('text', 'permission');
    const actionColumnLang = useLang('column', 'action');
    return (
        <TableLayout breadcrumbs={breadcrumbs}>
            <Head title={title} />
            <div className="mx-auto w-full space-y-4 py-4">
                <div className="flex scroll-px-0.5 items-center justify-between gap-4 overflow-x-auto px-4">
                    <div className="flex items-center gap-2">
                        <Create permissions={permissions} title={title} />
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
                <Empty show={roles.data.length === 0} />
                <Table className={roles.data.length > 0 ? 'w-full' : 'hidden'}>
                    <TableHeader>
                        <TableRow>
                            <TableHead>
                                <Checkbox
                                    checked={selected.length > 0 && selected.length === roles.data.length}
                                    onCheckedChange={(value) => setSelected(value ? roles.data.map((role) => role.id) : [])}
                                />
                            </TableHead>
                            <TableHead>#</TableHead>
                            <SortableTableHead field={filters.field} onSort={() => handleSort('name')}>
                                {useLang('column', 'name')}
                            </SortableTableHead>
                            <SortableTableHead field={filters.field} onSort={() => handleSort('guard_name')}>
                                Guard
                            </SortableTableHead>
                            <TableHead>{permissionText}</TableHead>
                            <SortableTableHead field={filters.field} onSort={() => handleSort('created_at')}>
                                {useLang('column', 'date')}
                            </SortableTableHead>
                            <TableHead className="sr-only">{actionColumnLang}</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {roles.data.map((role, index) => (
                            <TableRow key={role.id} data-state={selected.includes(role.id) ? 'selected' : ''}>
                                <TableCell>
                                    <Checkbox
                                        checked={selected.includes(role.id)}
                                        onCheckedChange={(value) => {
                                            setSelected((prev) => (value ? [...prev, role.id] : prev.filter((id) => id !== role.id)));
                                        }}
                                    />
                                </TableCell>
                                <TableHead>{numberFormat(roles.from + index)}</TableHead>
                                <TableCell className="font-medium">{role.name}</TableCell>
                                <TableCell>{role.guard_name}</TableCell>
                                <TableCell>
                                    <Permission title={`${permissionText} ${role.name}`} role={role} permissions={permissions} />
                                </TableCell>
                                <TableCell>{dateFormat(role.created_at || '')}</TableCell>
                                <TableCell className="text-right">
                                    <DropdownMenu modal={false}>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="icon">
                                                <EllipsisIcon className="icon" />
                                                <span className="sr-only">{actionColumnLang}</span>
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuLabel>
                                                <p className="max-w-40 truncate font-semibold">{role.name}</p>
                                            </DropdownMenuLabel>
                                            <Separator className="my-1" />
                                            <Edit permissions={permissions} title={title} role={role} />
                                            <Delete
                                                title={title}
                                                permissions={['role delete']}
                                                routes="role.destroy"
                                                description={role.name}
                                                id={role.id}
                                            />
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                <Pagination data={roles} />
            </div>
        </TableLayout>
    );
}
