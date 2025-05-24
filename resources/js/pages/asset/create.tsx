import InputError from '@/components/input-error';
import ResponsiveDialog from '@/components/responsive-dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
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
        owner: '',
        initial_value: 0,
        note: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('asset.store'), {
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
                usePermission(['asset create']) &&
                (!isMobile ? (
                    <Button>
                        <Plus className="icon" /> {createText}
                    </Button>
                ) : (
                    <Button className="fixed right-4 bottom-32 z-10 h-12 w-12 rounded-lg shadow-lg">
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
                    <Label htmlFor="initial_value">Nilai</Label>
                    <Input
                        id="initial_value"
                        name="initial_value"
                        value={data.initial_value}
                        className="block w-full"
                        autoComplete="initial_value"
                        aria-invalid={!!errors.initial_value}
                        placeholder="Nilai"
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
