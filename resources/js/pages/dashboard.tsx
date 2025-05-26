import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { format } from 'date-fns';
import { ArrowDown, ArrowUp, Calendar as CalendarIcon, Wallet } from 'lucide-react';
import * as React from 'react';
import { DateRange } from 'react-day-picker';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import TableLayout from '@/layouts/table-layout';
import { cn } from '@/lib/utils';
import { numberFormat } from '@/utils/formatter';
import Create from './transaction/create';
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
                                            {format(date.from, 'LLL dd, y')} - {format(date.to, 'LLL dd, y')}
                                        </>
                                    ) : (
                                        format(date.from, 'LLL dd, y')
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
                    <Create title={title} froms={froms} tos={tos} />
                </div>
                <div>
                    <List title="Transaksi" froms={froms} tos={tos} transactions={transactions ?? []} />
                </div>
            </div>
        </TableLayout>
    );
}
