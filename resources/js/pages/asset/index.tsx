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
import { BreadcrumbItem, Filter, SharedData } from '@/types';
import { dateFormat, numberFormat } from '@/utils/formatter';
import { Head, router, usePage } from '@inertiajs/react';
import { debounce, pickBy } from 'lodash';
import { EllipsisIcon, EllipsisVerticalIcon, SearchIcon } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import Create from './create';
import Edit from './edit';
import List from './list';

export default function Index({ title, filters, assets }: { title: string; filters: Filter; assets: App.Paginate<App.Models.Asset> }) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: title,
            href: 'asset.index',
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
    const actionColumnLang = useLang('column', 'action');
    return (
        <TableLayout breadcrumbs={breadcrumbs}>
            <Head title={title} />
            <div className="mx-auto w-full space-y-4 py-0 md:py-4">
                <div className="flex items-center justify-between overflow-x-auto px-4 md:scroll-px-0.5 md:gap-4">
                    <div className="items-center gap-2">
                        <Create title={title} />
                        {selected.length > 0 && (
                            <DropdownMenu modal={false}>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="outline" className="hidden md:flex">
                                        ({selected.length})
                                        <EllipsisVerticalIcon className="icon" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="start">
                                    <DeleteBulk
                                        onDeleteSuccess={() => setSelected([])}
                                        title={title}
                                        permissions={['asset delete']}
                                        routes="asset.destroy-bulk"
                                        id={selected}
                                    />
                                </DropdownMenuContent>
                            </DropdownMenu>
                        )}
                    </div>
                    <div className="flex w-full items-center gap-2 py-1 md:w-fit">
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
                            <SelectTrigger className="hidden w-fit md:flex">
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
                        <div className="relative w-full md:w-40">
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
                                className="pl-8"
                                placeholder={useLang('placeholder', 'search')}
                            />
                            <SearchIcon className="icon fill-primary/20 absolute top-2.5 left-3" />
                        </div>
                    </div>
                </div>
                <Empty show={assets.data.length === 0} />
                <Table className={assets.data.length > 0 ? 'hidden w-full md:table' : 'hidden'}>
                    <TableHeader>
                        <TableRow>
                            <TableHead>
                                <Checkbox
                                    checked={selected.length > 0 && selected.length === assets.data.length}
                                    onCheckedChange={(value) => setSelected(value ? assets.data.map((asset) => asset.id) : [])}
                                />
                            </TableHead>
                            <TableHead>#</TableHead>
                            <SortableTableHead field={filters.field} onSort={() => handleSort('name')}>
                                {useLang('column', 'name')}
                            </SortableTableHead>
                            <SortableTableHead field={filters.field} onSort={() => handleSort('owner')}>
                                Pemilik
                            </SortableTableHead>
                            <SortableTableHead field={filters.field} onSort={() => handleSort('initial_value')}>
                                Nilai Awal
                            </SortableTableHead>
                            <SortableTableHead field={filters.field} onSort={() => handleSort('created_at')}>
                                {useLang('column', 'date')}
                            </SortableTableHead>
                            <TableHead className="sr-only">{actionColumnLang}</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {assets.data.map((asset, index) => (
                            <TableRow key={asset.id} data-state={selected.includes(asset.id) ? 'selected' : ''}>
                                <TableCell>
                                    <Checkbox
                                        checked={selected.includes(asset.id)}
                                        onCheckedChange={(value) => {
                                            setSelected((prev) => (value ? [...prev, asset.id] : prev.filter((id) => id !== asset.id)));
                                        }}
                                    />
                                </TableCell>
                                <TableHead>{numberFormat(assets.from + index)}</TableHead>
                                <TableCell className="font-medium">{asset.name}</TableCell>
                                <TableCell>{asset.owner}</TableCell>
                                <TableCell className="text-right">{numberFormat(asset.initial_value)}</TableCell>
                                <TableCell>{dateFormat(asset.created_at || '')}</TableCell>
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
                                                <p className="max-w-40 truncate font-semibold">{asset.name}</p>
                                            </DropdownMenuLabel>
                                            <Separator className="my-1" />
                                            <Edit title={title} asset={asset} />
                                            <Delete
                                                title={title}
                                                permissions={['asset delete']}
                                                routes="asset.destroy"
                                                description={asset.name}
                                                id={asset.id}
                                            />
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                <Pagination className="hidden md:flex" data={assets} />
                <List title={title} assets={assets} />
            </div>
        </TableLayout>
    );
}
