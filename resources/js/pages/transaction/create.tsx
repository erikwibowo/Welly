import InputError from '@/components/input-error';
import ResponsiveDialog from '@/components/responsive-dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useLang } from '@/hooks/use-lang';
import { useIsMobile } from '@/hooks/use-mobile';
import { usePermission } from '@/hooks/use-permission';
import { useForm } from '@inertiajs/react';
import axios from 'axios';
import { Loader2, Plus, SaveIcon } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function Create({ title, froms, tos }: { title: string; froms: App.Models.Asset[]; tos: App.Models.Asset[] }) {
    const [open, setOpen] = useState(false);
    const [categories, setCategories] = useState<App.Models.Category[]>([]);
    const isMobile = useIsMobile();

    const { data, setData, post, processing, errors, clearErrors, reset } = useForm({
        type: 'income',
        category_id: '',
        from_asset_id: '',
        to_asset_id: '',
        date: new Date().toISOString().split('T')[0],
        amount: 0,
        note: '',
    });

    useEffect(() => {
        if (data.type) {
            setData('category_id', '');
            setCategories([]);
            axios
                .get(route('category.get-category'), {
                    params: {
                        type: data.type,
                    },
                })
                .then((response: { data: App.Models.Category[] }) => {
                    setCategories(response.data);
                    setData('category_id', response.data.length > 0 ? String(response.data[0].id) : '');
                })
                .catch((error: unknown) => {
                    console.error(error);
                });
        }
    }, [setData, data.type]);

    function submit(e: React.FormEvent) {
        e.preventDefault();
        post(route('transaction.store'), {
            onSuccess: () => {
                closeModal();
            },
        });
    }

    const closeModal = () => {
        reset();
        clearErrors();
        setOpen(!open);
    };

    const createText = useLang('button', 'create');

    return (
        <ResponsiveDialog
            open={open}
            onOpenChange={setOpen}
            onClose={() => closeModal()}
            title={createText + ' ' + title}
            trigger={
                usePermission(['transaction create']) &&
                (!isMobile ? (
                    <Button>
                        <Plus className="icon" /> {createText}
                    </Button>
                ) : (
                    <Button className="fixed right-4 bottom-20 z-10 h-12 w-12 rounded-lg shadow-lg">
                        <Plus className="size-6" />
                    </Button>
                ))
            }
            submit={submit}
            footer={
                <>
                    <Button size="lg" onClick={() => setOpen(false)} type="button" variant="outline">
                        {useLang('button', 'cancel')}
                    </Button>
                    <Button size="lg" disabled={processing} type="submit">
                        {processing ? <Loader2 className="size-4 animate-spin" /> : <SaveIcon className="icon" />}
                        {useLang('button', 'save')}
                    </Button>
                </>
            }
        >
            <div className="space-y-4">
                <div className="grid gap-2">
                    <Label htmlFor="type">Jenis</Label>
                    <Select
                        onValueChange={(value) => {
                            setData('type', value);
                        }}
                        value={String(data.type)}
                    >
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Pilih Jenis" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="income">Pemasukan</SelectItem>
                            <SelectItem value="expense">Pengeluaran</SelectItem>
                            <SelectItem value="transfer">Transfer</SelectItem>
                        </SelectContent>
                    </Select>
                    <InputError message={errors.type} />
                </div>
                {data.type !== 'transfer' && (
                    <div className="grid gap-2">
                        <Label htmlFor="category_id">Kategori</Label>
                        <Select
                            onValueChange={(value) => {
                                setData('category_id', value);
                            }}
                            value={String(data.category_id)}
                        >
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Pilih Kategori" />
                            </SelectTrigger>
                            <SelectContent>
                                {categories.map((category, index) => (
                                    <SelectItem key={index} value={String(category.id)}>
                                        {category.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <InputError message={errors.category_id} />
                    </div>
                )}
                <div className="grid gap-2">
                    <Label htmlFor="from_asset_id">Sumber Dana</Label>
                    <Select
                        onValueChange={(value) => {
                            setData('from_asset_id', value);
                        }}
                        value={String(data.from_asset_id)}
                    >
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Pilih Dompet/Aset" />
                        </SelectTrigger>
                        <SelectContent>
                            {froms.map((from, index) => (
                                <SelectItem key={index} value={String(from.id)}>
                                    {from.name} - {from.owner}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <InputError message={errors.from_asset_id} />
                </div>
                {data.type === 'transfer' && (
                    <div className="grid gap-2">
                        <Label htmlFor="to_asset_id">Ke</Label>
                        <Select
                            onValueChange={(value) => {
                                setData('to_asset_id', value);
                            }}
                            value={String(data.to_asset_id)}
                        >
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Pilih Dompet/Aset" />
                            </SelectTrigger>
                            <SelectContent>
                                {tos.map((to, index) => (
                                    <SelectItem key={index} value={String(to.id)}>
                                        {to.name} - {to.owner}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <InputError message={errors.to_asset_id} />
                    </div>
                )}
                <div className="grid gap-2">
                    <Label htmlFor="amount">Nominal</Label>
                    <Input
                        id="amount"
                        name="amount"
                        type="number"
                        value={data.amount}
                        className="block w-full"
                        autoComplete="amount"
                        aria-invalid={!!errors.amount}
                        placeholder="Nominal"
                        onChange={(e) => setData('amount', Number(e.target.value))}
                    />

                    <InputError message={errors.amount} />
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="date">Tanggal</Label>
                    <Input
                        id="date"
                        name="date"
                        type="date"
                        value={data.date}
                        className="block w-full"
                        autoComplete="date"
                        aria-invalid={!!errors.date}
                        placeholder="Tanggal"
                        onChange={(e) => setData('date', e.target.value)}
                    />

                    <InputError message={errors.date} />
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="note">Catatan</Label>
                    <Textarea
                        id="note"
                        name="note"
                        value={data.note}
                        className="block h-20 w-full"
                        autoComplete="note"
                        aria-invalid={!!errors.note}
                        placeholder="Catatan"
                        onChange={(e) => setData('note', e.target.value)}
                    />

                    <InputError message={errors.note} />
                </div>
            </div>
        </ResponsiveDialog>
    );
}
