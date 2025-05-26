import Delete from '@/components/delete';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuLabel, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Separator } from '@/components/ui/separator';
import { useLang } from '@/hooks/use-lang';
import { cn } from '@/lib/utils';
import { dateFormatWithDay, numberFormat } from '@/utils/formatter';
import { ArrowDown, ArrowLeftRight, ArrowRight, ArrowUp, EllipsisIcon } from 'lucide-react';
import Edit from './edit';

export default function List({
    title,
    className,
    transactions,
    froms,
    tos,
}: {
    title?: string;
    className?: string;
    transactions: App.Models.Transaction[];
    froms?: App.Models.Asset[];
    tos?: App.Models.Asset[];
}) {
    const actionColumnLang = useLang('column', 'action');
    return transactions?.map((transaction, index) => (
        <div className={cn('m-0 border-b px-4 py-2 last:border-none', className)} key={index}>
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div
                        className={cn(
                            'flex size-10 items-center justify-center rounded-full',
                            transaction.type === 'income'
                                ? 'bg-success/10 text-success'
                                : transaction.type === 'expense'
                                  ? 'bg-destructive/10 text-destructive'
                                  : 'bg-info/10 text-info',
                        )}
                    >
                        {transaction.type === 'income' ? (
                            <ArrowDown className="size-6" />
                        ) : transaction.type === 'expense' ? (
                            <ArrowUp className="size-6" />
                        ) : (
                            <ArrowLeftRight className="size-6" />
                        )}
                    </div>
                    <div>
                        <h4 className="line-clamp-1 font-medium">{transaction.note ?? '-'}</h4>
                        <div className="text-xs">
                            {transaction.type !== 'transfer' ? (
                                <p>{transaction.from?.name + ' (' + transaction.from?.owner + ')'}</p>
                            ) : (
                                <p className="flex flex-wrap gap-1">
                                    <span>
                                        {transaction.from?.name} ({transaction.from?.owner})
                                    </span>
                                    <ArrowRight className="icon shrink-0" />
                                    <span>
                                        {transaction.to?.name} ({transaction.to?.owner})
                                    </span>
                                </p>
                            )}
                        </div>
                        <p className="text-muted-foreground text-sm">{dateFormatWithDay(transaction.date)}</p>
                    </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                    <DropdownMenu modal={false}>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                                <EllipsisIcon className="icon" />
                                <span className="sr-only">{actionColumnLang}</span>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>
                                <p className="max-w-40 truncate font-semibold">{transaction.note ?? '-'}</p>
                            </DropdownMenuLabel>
                            <Separator className="my-1" />
                            <Edit title={title ?? ''} transaction={transaction} froms={froms ?? []} tos={tos ?? []} />
                            <Delete
                                title={title ?? ''}
                                permissions={['transaction delete']}
                                routes="transaction.destroy"
                                description={transaction.note ?? '-'}
                                id={transaction.id}
                            />
                        </DropdownMenuContent>
                    </DropdownMenu>
                    <p
                        className={cn(
                            'text-lg font-bold',
                            transaction.type === 'income' ? 'text-success' : transaction.type === 'expense' ? 'text-destructive' : 'text-info',
                        )}
                    >
                        {numberFormat(transaction.amount)}
                    </p>
                </div>
            </div>
        </div>
    ));
}
