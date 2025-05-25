import InputError from '@/components/input-error';
import ResponsiveDialog from '@/components/responsive-dialog';
import { Button } from '@/components/ui/button';
import { DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useLang } from '@/hooks/use-lang';
import { usePermission } from '@/hooks/use-permission';
import { useForm } from '@inertiajs/react';
import axios from 'axios';
import { addHours } from 'date-fns';
import { CalendarIcon, Loader2, PencilIcon, SaveIcon } from 'lucide-react';
import { FormEventHandler, useEffect, useState } from 'react';

import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { shortDateFormat } from '@/utils/formatter';

export default function Edit({
    title,
    transaction,
    froms,
    tos,
}: {
    title: string;
    transaction: App.Models.Transaction;
    froms: App.Models.Asset[];
    tos: App.Models.Asset[];
}) {
    const [open, setOpen] = useState(false);
    const [categories, setCategories] = useState<App.Models.Category[]>([]);

    const { data, setData, put, processing, errors, clearErrors, reset } = useForm<{
        type: 'income' | 'expense' | 'transfer';
        category_id: number | null;
        from_asset_id: number;
        to_asset_id: number | null;
        date: Date;
        amount: number;
        note: string;
    }>({
        type: transaction.type as 'income' | 'expense' | 'transfer',
        category_id: transaction.category_id ?? null,
        from_asset_id: transaction.from_asset_id,
        to_asset_id: transaction.to_asset_id ?? null,
        date: new Date(transaction.date),
        amount: transaction.amount,
        note: transaction.note ?? '',
    });

    useEffect(() => {
        if (data.type) {
            setData('category_id', transaction.category_id ?? null);
            setCategories([]);
            axios
                .get(route('category.get-category'), {
                    params: {
                        type: data.type,
                    },
                })
                .then((response: { data: App.Models.Category[] }) => {
                    setCategories(response.data);
                })
                .catch((error: unknown) => {
                    console.error(error);
                });
        }
    }, [setData, data.type, transaction.category_id]);

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        put(route('transaction.update', transaction.id), {
            onSuccess: () => {
                closeModal();
            },
            preserveState: (page) => Object.keys(page.props.errors).length > 0,
        });
    };

    const editText = useLang('text', 'edit');

    const closeModal = () => {
        reset();
        clearErrors();
        setOpen(!open);
    };

    return (
        <ResponsiveDialog
            open={open}
            onOpenChange={setOpen}
            onClose={() => closeModal()}
            title={editText + ' ' + title}
            trigger={
                usePermission(['transaction update']) && (
                    <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                        <PencilIcon className="icon" /> {editText}
                    </DropdownMenuItem>
                )
            }
            submit={submit}
            footer={
                <>
                    <Button size="lg" onClick={() => setOpen(false)} type="button" variant="outline">
                        {useLang('button', 'cancel')}
                    </Button>
                    <Button disabled={processing} type="submit">
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
                            setData('type', value as 'income' | 'expense' | 'transfer');
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
                                setData('category_id', Number(value));
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
                            setData('from_asset_id', Number(value));
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
                                setData('to_asset_id', Number(value));
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
                        inputMode="numeric"
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
                    <Popover modal={true}>
                        <PopoverTrigger asChild>
                            <Button
                                variant={'outline'}
                                className={cn(
                                    'dark:bg-input/30 border-input w-full justify-between border bg-transparent text-left font-normal',
                                    'focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]',
                                    !data.date && 'text-muted-foreground',
                                )}
                            >
                                {data.date ? shortDateFormat(data.date.toString()) : <span>Pilih Tanggal</span>}
                                <CalendarIcon className="text-muted-foreground/60 size-4" />
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                            <Calendar
                                mode="single"
                                selected={data.date}
                                onSelect={(date) => {
                                    if (date) {
                                        setData('date', addHours(date, 7));
                                    } else {
                                        setData('date', new Date(transaction.date));
                                    }
                                }}
                                disabled={(date) => date > addHours(new Date(), 7)}
                                defaultMonth={new Date(data.date)}
                            />
                        </PopoverContent>
                    </Popover>

                    <InputError message={errors.date} />
                </div>

                <InputError message={errors.date} />
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
