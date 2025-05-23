import Delete from '@/components/delete';
import { Drawer, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from '@/components/ui/drawer';
import { Separator } from '@/components/ui/separator';
import { numberFormat } from '@/utils/formatter';
import Edit from './edit';

export default function List({ title, assets }: { title: string; assets: App.Paginate<App.Models.Asset> }) {
    return (
        <div className="-mt-8 md:hidden">
            {assets.data.map((asset, index) => (
                <Drawer key={index} repositionInputs={false}>
                    <DrawerTrigger asChild>
                        <div key={asset.id} className="flex items-center justify-between gap-2 border-b p-4 last:border-0">
                            <div className="flex w-full items-center gap-2">
                                <div className="flex w-full flex-col">
                                    <p className="font-medium">{asset.name}</p>
                                    <p>{asset.owner}</p>
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
                            <Separator />
                            <Delete
                                title={title}
                                type="modal"
                                permissions={['asset delete']}
                                routes="asset.destroy"
                                description={asset.name}
                                id={asset.id}
                            />
                        </div>
                        <DrawerFooter className="mb-4"></DrawerFooter>
                    </DrawerContent>
                </Drawer>
            ))}
        </div>
    );
}
