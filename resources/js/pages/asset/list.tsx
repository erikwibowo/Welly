import Delete from '@/components/delete';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuLabel, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Separator } from '@/components/ui/separator';
import { useLang } from '@/hooks/use-lang';
import { cn } from '@/lib/utils';
import { numberFormat } from '@/utils/formatter';
import { EllipsisIcon, Wallet } from 'lucide-react';
import Edit from './edit';
import Transaction from './transaction';

export default function List({ title, className, assets }: { title?: string; className?: string; assets: App.Models.Asset[] }) {
    const actionColumnLang = useLang('column', 'action');
    return assets?.map((asset, index) => (
        <div className={cn('m-0 border-b px-4 py-1 last:border-none', className)} key={index}>
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div
                        className={cn(
                            'flex size-10 items-center justify-center rounded-full',
                            asset.type === 'asset'
                                ? 'bg-success/10 text-success'
                                : asset.type === 'liability'
                                  ? 'bg-destructive/10 text-destructive'
                                  : 'bg-info/10 text-info',
                        )}
                    >
                        <Wallet className="size-6" />
                    </div>
                    <div className="flex flex-col">
                        <h4 className="line-clamp-1 font-medium">{asset.name}</h4>
                        <div className="text-xs">
                            <p>{asset.owner}</p>
                            <p className="text-muted-foreground text-sm">{asset.note ?? '-'}</p>
                        </div>
                    </div>
                </div>
                <div className="flex flex-col items-end">
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
                            <Edit title={title ?? '-'} asset={asset} />
                            <Delete
                                title={title ?? '-'}
                                permissions={['asset delete']}
                                routes="asset.destroy"
                                description={asset.name}
                                id={asset.id}
                            />
                        </DropdownMenuContent>
                    </DropdownMenu>
                    <p className='text-xs text-muted-foreground'>{numberFormat(asset.initial_value)}</p>
                    <Transaction title={'Transaksi ' + asset.name + ' (' + asset.owner + ')'} asset={asset} />
                </div>
            </div>
        </div>
    ));
}
