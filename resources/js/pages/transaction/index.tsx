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
import { cn } from '@/lib/utils';
import { BreadcrumbItem, Filter, SharedData } from '@/types';
import { dateFormat, numberFormat, shortDateFormat } from '@/utils/formatter';
import { Head, router, usePage } from '@inertiajs/react';
import { debounce, pickBy } from 'lodash';
import { ArrowRight, EllipsisIcon, EllipsisVerticalIcon, SearchIcon } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import Create from './create';
import Edit from './edit';

export default function Index({
    title,
    filters,
    transactions,
    froms,
    tos,
}: {
    title: string;
    filters: Filter;
    transactions: App.Paginate<App.Models.Transaction>;
    froms: App.Models.Asset[];
    tos: App.Models.Asset[];
}) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: title,
            href: 'transaction.index',
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
            <div className="mx-auto w-full space-y-4 py-4">
                <div className="flex scroll-px-0.5 items-center justify-between gap-4 overflow-x-auto px-4">
                    <div className="flex items-center gap-2">
                        <Create title={title} froms={froms} tos={tos} />
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
                                        permissions={['transaction delete']}
                                        routes="transaction.destroy-bulk"
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
                <Empty show={transactions.data.length === 0} />
                <Table className={transactions.data.length > 0 ? 'w-full' : 'hidden'}>
                    <TableHeader>
                        <TableRow>
                            <TableHead>
                                <Checkbox
                                    checked={selected.length > 0 && selected.length === transactions.data.length}
                                    onCheckedChange={(value) => setSelected(value ? transactions.data.map((transaction) => transaction.id) : [])}
                                />
                            </TableHead>
                            <TableHead>#</TableHead>
                            <SortableTableHead field={filters.field} onSort={() => handleSort('type')}>
                                Jenis
                            </SortableTableHead>
                            <TableHead>Kategori</TableHead>
                            <TableHead>Sumber Dana</TableHead>
                            <SortableTableHead field={filters.field} onSort={() => handleSort('amount')}>
                                Nominal
                            </SortableTableHead>
                            <SortableTableHead field={filters.field} onSort={() => handleSort('date')}>
                                Tanggal
                            </SortableTableHead>
                            <SortableTableHead field={filters.field} onSort={() => handleSort('created_at')}>
                                Oleh
                            </SortableTableHead>
                            <TableHead className="sr-only">{actionColumnLang}</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {transactions.data.map((transaction, index) => (
                            <TableRow key={transaction.id} data-state={selected.includes(transaction.id) ? 'selected' : ''}>
                                <TableCell>
                                    <Checkbox
                                        checked={selected.includes(transaction.id)}
                                        onCheckedChange={(value) => {
                                            setSelected((prev) => (value ? [...prev, transaction.id] : prev.filter((id) => id !== transaction.id)));
                                        }}
                                    />
                                </TableCell>
                                <TableHead>{numberFormat(transactions.from + index)}</TableHead>
                                <TableCell className="font-medium">
                                    {transaction.type_view} <br />
                                    <small>{transaction.note ?? '-'}</small>
                                </TableCell>
                                <TableCell>{transaction.category?.name}</TableCell>
                                <TableCell>
                                    {transaction.type !== 'transfer' ? (
                                        transaction.from?.name
                                    ) : (
                                        <span className="flex items-center gap-1">
                                            {transaction.from?.name}
                                            <ArrowRight className="icon" />
                                            {transaction.to?.name}
                                        </span>
                                    )}
                                </TableCell>
                                <TableCell
                                    className={cn(
                                        'text-right font-medium',
                                        transaction.type === 'income'
                                            ? 'text-success'
                                            : transaction.type === 'expense'
                                              ? 'text-destructive'
                                              : 'text-info',
                                    )}
                                >
                                    {numberFormat(transaction.amount)}
                                </TableCell>
                                <TableCell>{shortDateFormat(transaction.date || '')}</TableCell>
                                <TableCell>
                                    {transaction.user?.name} <br />
                                    <small>{dateFormat(transaction.created_at || '')}</small>
                                </TableCell>
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
                                                <p className="max-w-40 truncate font-semibold">{transaction.type}</p>
                                            </DropdownMenuLabel>
                                            <Separator className="my-1" />
                                            <Edit title={title} transaction={transaction} froms={froms} tos={tos} />
                                            <Delete
                                                title={title}
                                                permissions={['transaction delete']}
                                                routes="transaction.destroy"
                                                description={transaction.type}
                                                id={transaction.id}
                                            />
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                <Pagination data={transactions} />
            </div>
        </TableLayout>
    );
}
