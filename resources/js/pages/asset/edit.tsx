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
import { Loader2, PencilIcon, SaveIcon } from 'lucide-react';
import { FormEventHandler, useState } from 'react';

export default function Edit({ title, asset, type }: { title: string; asset: App.Models.Asset; type?: 'dropdown' | 'modal' }) {
    const [open, setOpen] = useState(false);

    const { data, setData, put, processing, errors, clearErrors, reset } = useForm({
        name: asset.name,
        owner: asset.owner,
        initial_value: asset.initial_value,
        type: asset.type,
        note: asset.note ?? '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        put(route('asset.update', asset.id), {
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
                usePermission(['asset update']) &&
                (type == 'modal' ? (
                    <Button className="flex w-full items-center justify-start rounded-none" variant="ghost">
                        <PencilIcon className="icon" /> {editText}
                    </Button>
                ) : (
                    <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                        <PencilIcon className="icon" /> {editText}
                    </DropdownMenuItem>
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
                            setData('type', value as 'asset' | 'liability');
                        }}
                        value={String(data.type)}
                    >
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Pilih Jenis" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="asset">Aset</SelectItem>
                            <SelectItem value="liability">Liabilitas</SelectItem>
                        </SelectContent>
                    </Select>
                    <InputError message={errors.type} />
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="name">{useLang('label', 'name')}</Label>
                    <Input
                        id="name"
                        name="name"
                        value={data.name}
                        className="block w-full"
                        autoComplete="name"
                        aria-invalid={!!errors.name}
                        placeholder={useLang('label', 'name')}
                        onChange={(e) => setData('name', e.target.value)}
                    />

                    <InputError message={errors.name} />
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="owner">Pemilik</Label>
                    <Input
                        id="owner"
                        name="owner"
                        value={data.owner}
                        className="block w-full"
                        autoComplete="owner"
                        aria-invalid={!!errors.owner}
                        placeholder="Pemilik"
                        onChange={(e) => setData('owner', e.target.value)}
                    />

                    <InputError message={errors.owner} />
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="initial_value">Saldo Awal</Label>
                    <Input
                        id="initial_value"
                        name="initial_value"
                        type="number"
                        inputMode="numeric"
                        value={data.initial_value}
                        className="block w-full"
                        autoComplete="initial_value"
                        aria-invalid={!!errors.initial_value}
                        placeholder="Saldo Awal"
                        onChange={(e) => setData('initial_value', Number(e.target.value))}
                    />

                    <InputError message={errors.initial_value} />
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
