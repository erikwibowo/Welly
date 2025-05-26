import ResponsiveDialog from '@/components/responsive-dialog';
import { Button } from '@/components/ui/button';
import { useLang } from '@/hooks/use-lang';
import { cn } from '@/lib/utils';
import { dateFormatWithDay, numberFormat } from '@/utils/formatter';
import { ArrowDown, ArrowLeftRight, ArrowRight, ArrowUp } from 'lucide-react';
import { useState } from 'react';

export default function Transaction({ title, asset }: { title: string; asset: App.Models.Asset }) {
    const [open, setOpen] = useState(false);

    return (
        <ResponsiveDialog
            open={open}
            onOpenChange={setOpen}
            className="max-w-xl"
            title={title}
            trigger={
                <Button variant="link">
                    {numberFormat(
                        asset.transactions?.reduce((total: number, transaction: App.Models.Transaction) => {
                            if (transaction.type === 'expense') {
                                return total - transaction.amount;
                            } else if (transaction.type === 'income') {
                                return total + transaction.amount;
                            } else if (transaction.type === 'transfer') {
                                if (transaction.from_asset_id === asset.id) {
                                    return total - transaction.amount;
                                } else if (transaction.to_asset_id === asset.id) {
                                    return total + transaction.amount;
                                }
                            }
                            return total;
                        }, asset.initial_value) || asset.initial_value,
                    )}
                </Button>
            }
            submit={() => {}}
            footer={
                <>
                    <Button size="lg" onClick={() => setOpen(false)} type="button" variant="outline">
                        {useLang('button', 'close')}
                    </Button>
                </>
            }
        >
            <div>
                <div className="flex items-center justify-between gap-4 border-b py-2">
                    <h4 className="font-bold uppercase">Saldo Awal</h4>
                    <p className="text-lg font-bold">{numberFormat(asset.initial_value)}</p>
                </div>
                {asset.transactions?.map((transaction: App.Models.Transaction, index: number) => (
                    <div className="border-b py-2" key={index}>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div
                                    className={cn(
                                        'flex h-10 w-10 items-center justify-center rounded-full',
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
                            <p
                                className={cn(
                                    'text-lg font-bold',
                                    transaction.type === 'income'
                                        ? 'text-success'
                                        : transaction.type === 'expense'
                                          ? 'text-destructive'
                                          : 'text-info',
                                )}
                            >
                                {numberFormat(transaction.amount)}
                            </p>
                        </div>
                    </div>
                ))}
                <div className="flex items-center justify-between gap-4 py-2">
                    <h4 className="font-bold uppercase">Saldo AKhir</h4>
                    <p className="text-lg font-bold">
                        {numberFormat(
                            asset.transactions?.reduce((total: number, transaction: App.Models.Transaction) => {
                                if (transaction.type === 'expense') {
                                    return total - transaction.amount;
                                } else if (transaction.type === 'income') {
                                    return total + transaction.amount;
                                } else if (transaction.type === 'transfer') {
                                    if (transaction.from_asset_id === asset.id) {
                                        return total - transaction.amount;
                                    } else if (transaction.to_asset_id === asset.id) {
                                        return total + transaction.amount;
                                    }
                                }
                                return total;
                            }, asset.initial_value) || asset.initial_value,
                        )}
                    </p>
                </div>
            </div>
        </ResponsiveDialog>
    );
}
