import ResponsiveDialog from '@/components/responsive-dialog';
import { Button } from '@/components/ui/button';
import { useLang } from '@/hooks/use-lang';
import { numberFormat } from '@/utils/formatter';
import { useState } from 'react';
import List from '../transaction/list';

export default function Transaction({ title, asset }: { title: string; asset: App.Models.Asset }) {
    const [open, setOpen] = useState(false);

    return (
        <ResponsiveDialog
            open={open}
            onOpenChange={setOpen}
            className="max-w-xl"
            title={title}
            trigger={
                <Button variant="link" className="px-0 underline">
                    {numberFormat(
                        asset.transactions?.reduce(
                            (total: number, transaction: App.Models.Transaction) => {
                                // Ensure we're working with numbers
                                const currentTotal = Number(total) || 0;
                                const transactionAmount = Number(transaction.amount) || 0;
                                const assetId = Number(asset.id);
                                const fromAssetId = Number(transaction.from_asset_id);
                                const toAssetId = Number(transaction.to_asset_id);

                                if (transaction.type === 'expense') {
                                    return currentTotal - transactionAmount;
                                } else if (transaction.type === 'income') {
                                    return currentTotal + transactionAmount;
                                } else if (transaction.type === 'transfer') {
                                    if (fromAssetId === assetId) {
                                        return currentTotal - transactionAmount;
                                    } else if (toAssetId === assetId) {
                                        return currentTotal + transactionAmount;
                                    }
                                }
                                return currentTotal;
                            },
                            Number(asset.initial_value) || 0,
                        ),
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
                    <h4 className="font-bold uppercase">Nilai Awal</h4>
                    <p className="text-lg font-bold">{numberFormat(asset.initial_value)}</p>
                </div>
                <List transactions={asset.transactions ?? []} />
                <div className="flex items-center justify-between gap-4 py-2">
                    <h4 className="font-bold uppercase">Nilai Akhir</h4>
                    <p className="text-lg font-bold">
                        {numberFormat(
                            asset.transactions?.reduce(
                                (total: number, transaction: App.Models.Transaction) => {
                                    // Ensure we're working with numbers
                                    const currentTotal = Number(total) || 0;
                                    const transactionAmount = Number(transaction.amount) || 0;
                                    const assetId = Number(asset.id);
                                    const fromAssetId = Number(transaction.from_asset_id);
                                    const toAssetId = Number(transaction.to_asset_id);

                                    if (transaction.type === 'expense') {
                                        return currentTotal - transactionAmount;
                                    } else if (transaction.type === 'income') {
                                        return currentTotal + transactionAmount;
                                    } else if (transaction.type === 'transfer') {
                                        if (fromAssetId === assetId) {
                                            return currentTotal - transactionAmount;
                                        } else if (toAssetId === assetId) {
                                            return currentTotal + transactionAmount;
                                        }
                                    }
                                    return currentTotal;
                                },
                                Number(asset.initial_value) || 0,
                            ),
                        )}
                    </p>
                </div>
            </div>
        </ResponsiveDialog>
    );
}
