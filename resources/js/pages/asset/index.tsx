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
import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useLang } from '@/hooks/use-lang';
import TableLayout from '@/layouts/table-layout';
import { cn } from '@/lib/utils';
import { BreadcrumbItem, Filter, SharedData } from '@/types';
import { dateFormat, numberFormat } from '@/utils/formatter';
import { Head, router, usePage } from '@inertiajs/react';
import { debounce, pickBy } from 'lodash';
import { EllipsisIcon, EllipsisVerticalIcon, SearchIcon } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import Create from './create';
import Edit from './edit';
import List from './list';
import Transaction from './transaction';

export default function Index({
    title,
    filters,
    assets,
    totals,
}: {
    title: string;
    filters: Filter;
    assets: App.Paginate<App.Models.Asset>;
    totals: {
        initial_value: number;
        balance: number;
    };
}) {
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
    const { auth } = usePage<SharedData>().props;
    return (
        <TableLayout breadcrumbs={breadcrumbs}>
            <Head title={title} />
            <div className="mx-auto w-full space-y-4 py-4">
                <div className="flex scroll-px-0.5 items-center justify-between gap-4 overflow-x-auto px-4">
                    <div className="flex items-center gap-2">
                        <Create title={title} />
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
                                        permissions={['category delete']}
                                        routes="category.destroy-bulk"
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
                <Empty show={assets.data.length === 0} />
                <List title={title} className="md:hidden" assets={assets.data} />
                <Table className={assets.data.length > 0 ? 'hidden w-full md:inline-table' : 'hidden'}>
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
                            <TableHead className="text-right">Nilai Akhir</TableHead>
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
                                <TableCell className="font-medium">
                                    {asset.name} <br />
                                    <small className={cn(asset.type === 'asset' ? 'text-success' : 'text-destructive')}>{asset.type_view}</small>
                                </TableCell>
                                <TableCell>
                                    {asset.owner} <br />
                                    <small>{asset.note ?? '-'}</small>
                                </TableCell>
                                <TableCell className="text-right">{numberFormat(asset.initial_value)}</TableCell>
                                <TableCell className="text-right">
                                    <Transaction title={'Transaksi ' + asset.name + ' (' + asset.owner + ')'} asset={asset} />
                                </TableCell>
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
                                            {auth.user.id === asset.user_id && (
                                                <>
                                                    <Separator className="my-1" />
                                                    <Edit title={title} asset={asset} />
                                                    <Delete
                                                        title={title}
                                                        permissions={['asset delete']}
                                                        routes="asset.destroy"
                                                        description={asset.name}
                                                        id={asset.id}
                                                    />
                                                </>
                                            )}
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                    <TableFooter>
                        <TableRow className="font-semibold">
                            <TableHead className="text-center" colSpan={4}>
                                Total
                            </TableHead>
                            <TableHead className="text-right">{numberFormat(totals.initial_value)}</TableHead>
                            <TableHead className="text-right">{numberFormat(totals.initial_value - totals.balance)}</TableHead>
                            <TableHead colSpan={4}></TableHead>
                        </TableRow>
                    </TableFooter>
                </Table>
                <Pagination data={assets} />
            </div>
        </TableLayout>
    );
}
