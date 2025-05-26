import InputError from '@/components/input-error';
import ResponsiveDialog from '@/components/responsive-dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useLang } from '@/hooks/use-lang';
import { useIsMobile } from '@/hooks/use-mobile';
import { usePermission } from '@/hooks/use-permission';
import { useForm } from '@inertiajs/react';
import { Loader2, Plus, SaveIcon } from 'lucide-react';
import { FormEventHandler, useState } from 'react';

export default function Create({ title }: { title: string }) {
    const [open, setOpen] = useState(false);
    const isMobile = useIsMobile();

    const { data, setData, post, processing, errors, clearErrors, reset } = useForm({
        name: '',
        type: 'income',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('category.store'), {
            onSuccess: () => {
                closeModal();
            },
        });
    };

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
                usePermission(['category create']) &&
                (!isMobile ? (
                    <Button>
                        <Plus className="icon" /> {createText}
                    </Button>
                ) : (
                    <Button className="fixed right-4 bottom-24 z-[51] h-12 w-12 rounded-lg shadow-lg">
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
                    <Label htmlFor="type">Jenis</Label>
                    <Select
                        onValueChange={(value) => {
                            setData('type', value);
                        }}
                        value={String(data.type)}
                    >
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Per Page" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="income">Pemasukan</SelectItem>
                            <SelectItem value="expense">Pengeluaran</SelectItem>
                        </SelectContent>
                    </Select>
                    <InputError message={errors.type} />
                </div>
            </div>
        </ResponsiveDialog>
    );
}
