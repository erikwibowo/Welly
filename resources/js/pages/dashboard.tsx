import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { format } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';
import * as React from 'react';
import { DateRange } from 'react-day-picker';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';

export default function Dashboard({ title }: { title: string }) {
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
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={title} />
            <div className="flex min-h-svh w-full flex-1 flex-col gap-4 rounded-xl">
                <div className={cn('flex justify-end gap-2')}>
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button
                                id="date"
                                variant={'outline'}
                                className={cn(
                                    'dark:bg-input/30 border-input min-w-[300px] justify-between border bg-transparent text-left font-normal',
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
                                    <span>Pick a date</span>
                                )}
                                <CalendarIcon className="icon" />
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                            <Calendar initialFocus mode="range" defaultMonth={date?.from} selected={date} onSelect={setDate} numberOfMonths={2} />
                        </PopoverContent>
                    </Popover>
                </div>
                <h3>Ikhtisar</h3>
                <div className="grid auto-rows-min gap-4 md:grid-cols-3"></div>
            </div>
        </AppLayout>
    );
}
