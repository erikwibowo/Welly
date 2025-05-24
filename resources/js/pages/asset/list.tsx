import Delete from '@/components/delete';
import { Button } from '@/components/ui/button';
import { Drawer, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from '@/components/ui/drawer';
import { numberFormat } from '@/utils/formatter';
import { useState } from 'react';
import Edit from './edit';

export default function List({ title, assets }: { title: string; assets: App.Paginate<App.Models.Asset> }) {
    const [open, setOpen] = useState(false);

    const closeModal = () => {
        setOpen(!open);
    };
    return (
        <div className="-mt-8 md:hidden">
            {assets.data.map((asset, index) => (
                <Drawer
                    repositionInputs={false}
                    open={open}
                    autoFocus={open}
                    onOpenChange={() => {
                        closeModal();
                        setTimeout(() => (document.body.style.pointerEvents = ''), 100);
                    }}
                    key={index}
                >
                    <DrawerTrigger asChild>
                        <div key={asset.id} className="flex items-center justify-between gap-2 border-b p-4 last:border-0">
                            <div className="flex w-full items-center gap-2">
                                <div className="flex w-full flex-col">
                                    <p className="font-medium">{asset.name}</p>
                                    <p>{asset.owner}</p>
                                    <small>{asset.note ?? '-'}</small>
                                </div>
                            </div>
                            <p className="text-right">{numberFormat(asset.initial_value)}</p>
                        </div>
                    </DrawerTrigger>
                    <DrawerContent
                        onFocus={(e: React.FocusEvent) => e.preventDefault()}
                        className="max-h-[96dvh]"
                        onInteractOutside={(e: { preventDefault: () => void }) => {
                            e.preventDefault();
                        }}
                    >
                        <DrawerHeader className="text-left">
                            <DrawerTitle>{asset.name}</DrawerTitle>
                            <DrawerDescription>{asset.owner}</DrawerDescription>
                        </DrawerHeader>
                        <div>
                            <Edit type="modal" title={title} asset={asset} />
                            <Delete
                                title={title}
                                type="modal"
                                permissions={['asset delete']}
                                routes="asset.destroy"
                                description={asset.name}
                                id={asset.id}
                            />
                        </div>
                        <DrawerFooter className="mb-4">
                            <Button size="lg" onClick={() => setOpen(false)} type="button" variant="outline">
                                Tutup
                            </Button>
                        </DrawerFooter>
                    </DrawerContent>
                </Drawer>
            ))}
        </div>
    );
}
