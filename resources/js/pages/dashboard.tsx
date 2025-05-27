import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { addHours } from 'date-fns';
import { ArrowDown, ArrowRight, ArrowUp, Calendar as CalendarIcon, ChevronRight, EllipsisIcon, Wallet } from 'lucide-react';
import * as React from 'react';
import { DateRange } from 'react-day-picker';

import Delete from '@/components/delete';
import Empty from '@/components/empty';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuLabel, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Separator } from '@/components/ui/separator';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import TableLayout from '@/layouts/table-layout';
import { cn } from '@/lib/utils';
import { numberFormat, shortDateFormat } from '@/utils/formatter';
import Create from './transaction/create';
import Edit from './transaction/edit';
import List from './transaction/list';

export default function Dashboard({
    title,
    totals,
    transactions,
    froms,
    tos,
}: {
    title: string;
    totals: {
        assets: number;
        incomes: number;
        expenses: number;
    };
    transactions?: App.Models.Transaction[];
    froms: App.Models.Asset[];
    tos: App.Models.Asset[];
}) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: title,
            href: '/dashboard',
        },
    ];
    const now = new Date();
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastDayOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    const [date, setDate] = React.useState<DateRange | undefined>({
        from: firstDayOfMonth,
        to: lastDayOfMonth,
    });
    return (
        <TableLayout breadcrumbs={breadcrumbs}>
            <Head title={title} />
            <div className="flex min-h-svh w-full flex-1 flex-col gap-4 rounded-xl">
                <div className={cn('flex flex-wrap items-center justify-between gap-2 px-4')}>
                    <h3 className="font-medium tracking-wide uppercase">Ikhtisar</h3>
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button
                                id="date"
                                variant={'outline'}
                                className={cn(
                                    'dark:bg-input/30 border-input w-fit justify-between border bg-transparent text-left font-normal',
                                    'focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]',
                                    !date && 'text-muted-foreground',
                                )}
                            >
                                {date?.from ? (
                                    date.to ? (
                                        <>
                                            {shortDateFormat(addHours(date.from, 7).toString())} - {shortDateFormat(addHours(date.to, 7).toString())}
                                        </>
                                    ) : (
                                        shortDateFormat(addHours(date.from, 7).toString())
                                    )
                                ) : (
                                    <span>Pilih Tanggal</span>
                                )}
                                <CalendarIcon className="text-muted-foreground/60 size-4" />
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                            <Calendar initialFocus mode="range" defaultMonth={date?.from} selected={date} onSelect={setDate} numberOfMonths={2} />
                        </PopoverContent>
                    </Popover>
                </div>
                <div className="grid auto-rows-min gap-2 px-4 md:grid-cols-4 md:gap-4">
                    <div className="bg-destructive/10 text-destructive border-destructive/20 relative rounded-lg border p-4 shadow">
                        <h4 className="text-lg font-semibold">Total Pengeluaran</h4>
                        <p className="text-2xl font-bold">{numberFormat(totals.expenses)}</p>
                        <ArrowUp className="absolute top-4 right-4 size-16 opacity-20" />
                    </div>
                    <div className="bg-success/10 text-success border-success/20 relative rounded-lg border p-4 shadow">
                        <h4 className="text-lg font-semibold">Total Pendapatan</h4>
                        <p className="text-2xl font-bold">{numberFormat(totals.incomes)}</p>
                        <ArrowDown className="absolute top-4 right-4 size-16 opacity-20" />
                    </div>
                    <div className="bg-info/10 text-info border-info/20 relative rounded-lg border p-4 shadow">
                        <h4 className="text-lg font-semibold">Total Aset</h4>
                        <p className="text-2xl font-bold">{numberFormat(totals.assets)}</p>
                        <Wallet className="absolute top-4 right-4 size-16 opacity-20" />
                    </div>
                </div>
                <div className="flex items-center justify-between gap-4 px-4">
                    <h3 className="font-medium tracking-wide uppercase">Transaksi Terakhir</h3>
                    <Link className="md:hidden" href={route('transaction.index')}>
                        <Button size="icon" variant="outline">
                            <ChevronRight />
                        </Button>
                    </Link>
                    <Create title="Transaksi" froms={froms} tos={tos} />
                </div>
                <div>
                    <Empty show={transactions?.length === 0} />
                    <List className="md:hidden" title="Transaksi" froms={froms} tos={tos} transactions={transactions ?? []} />
                    <Table className={(transactions?.length ?? 0) > 0 ? 'hidden w-full md:inline-table' : 'hidden'}>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="text-center">#</TableHead>
                                <TableHead>Jenis</TableHead>
                                <TableHead>Kategori</TableHead>
                                <TableHead>Sumber Dana</TableHead>
                                <TableHead className="text-right">Nominal</TableHead>
                                <TableHead>Tanggal</TableHead>
                                <TableHead>Oleh</TableHead>
                                <TableHead className="sr-only">Aksi</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {transactions?.map((transaction, index) => (
                                <TableRow key={transaction.id}>
                                    <TableCell className="text-center">{numberFormat(index + 1)}</TableCell>
                                    <TableCell className="font-medium">
                                        {transaction.type_view} <br />
                                        <small>{transaction.note ?? '-'}</small>
                                    </TableCell>
                                    <TableCell>{transaction.category?.name}</TableCell>
                                    <TableCell>
                                        {transaction.type !== 'transfer' ? (
                                            transaction.from?.name + ' (' + transaction.from?.owner + ')'
                                        ) : (
                                            <span className="flex items-center gap-1">
                                                {transaction.from?.name} ({transaction.from?.owner})
                                                <ArrowRight className="icon" />
                                                {transaction.to?.name} ({transaction.to?.owner})
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
                                        <small>{shortDateFormat(transaction.created_at || '')}</small>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <DropdownMenu modal={false}>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon">
                                                    <EllipsisIcon className="icon" />
                                                    <span className="sr-only">Aksi</span>
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuLabel>
                                                    <p className="max-w-40 truncate font-semibold">{transaction.note ?? '-'}</p>
                                                </DropdownMenuLabel>
                                                <Separator className="my-1" />
                                                <Edit title="Transaksi" transaction={transaction} froms={froms} tos={tos} />
                                                <Delete
                                                    title="Transaksi"
                                                    permissions={['transaction delete']}
                                                    routes="transaction.destroy"
                                                    description={transaction.note ?? '-'}
                                                    id={transaction.id}
                                                />
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </TableLayout>
    );
}
