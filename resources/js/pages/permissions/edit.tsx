import InputError from '@/components/input-error';
import ResponsiveDialog from '@/components/responsive-dialog';
import { Button } from '@/components/ui/button';
import { DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useLang } from '@/hooks/use-lang';
import { usePermission } from '@/hooks/use-permission';
import { useForm } from '@inertiajs/react';
import { Loader2, PencilIcon, SaveIcon } from 'lucide-react';
import { FormEventHandler, useState } from 'react';

export default function Edit({ title, permission }: { title: string; permission: App.Models.Permission }) {
    const [open, setOpen] = useState(false);

    const { data, setData, put, processing, errors, clearErrors, reset } = useForm({
        name: permission.name,
        guard_name: permission.guard_name,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        put(route('permission.update', permission.id), {
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
                usePermission(['permission update']) && (
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
                        placeholder={useLang('placeholder', 'name')}
                        onChange={(e) => setData('name', e.target.value)}
                    />

                    <InputError message={errors.name} />
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="guard_name">Guard</Label>
                    <Input
                        id="guard_name"
                        type="text"
                        name="guard_name"
                        value={data.guard_name}
                        className="block w-full"
                        autoComplete="guard_name"
                        placeholder="Guard"
                        disabled
                        onChange={(e) => setData('guard_name', e.target.value)}
                    />

                    <InputError message={errors.guard_name} />
                </div>
            </div>
        </ResponsiveDialog>
    );
}
