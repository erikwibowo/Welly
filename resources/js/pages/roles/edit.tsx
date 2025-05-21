import InputError from '@/components/input-error';
import ResponsiveDialog from '@/components/responsive-dialog';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useLang } from '@/hooks/use-lang';
import { usePermission } from '@/hooks/use-permission';
import { PermissionGroup } from '@/types';
import { useForm } from '@inertiajs/react';
import { Loader2, PencilIcon, SaveIcon } from 'lucide-react';
import { FormEventHandler, useState } from 'react';

export default function Edit({ title, permissions, role }: { title: string; permissions: PermissionGroup[]; role: App.Models.Role }) {
    const [open, setOpen] = useState(false);

    const { data, setData, put, processing, errors, clearErrors, reset } = useForm({
        name: role.name,
        guard_name: role.guard_name,
        permissions: role.permissions?.map((p) => p.id) ?? [],
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        put(route('role.update', role.id), {
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
                usePermission(['role update']) && (
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
                        aria-invalid={!!errors.guard_name}
                        placeholder="Guard"
                        disabled
                        onChange={(e) => setData('guard_name', e.target.value)}
                    />

                    <InputError message={errors.guard_name} />
                </div>
                <div className="flex flex-col space-y-2">
                    <Label htmlFor="permission">
                        {data.permissions.length > 0 && <span>({data.permissions.length}) </span>}
                        {useLang('label', 'permission')}
                    </Label>
                    <InputError message={errors.permissions} />
                    <Label className="flex items-center gap-2 pt-2" htmlFor="select-all-permission">
                        <Checkbox
                            id="select-all-permission"
                            checked={data.permissions.length === permissions.reduce((total, data) => total + data.data.length, 0)}
                            onCheckedChange={(value) =>
                                setData((prev) =>
                                    value
                                        ? {
                                              ...prev,
                                              permissions: permissions
                                                  .map((p) => p.data)
                                                  .flat()
                                                  .map((p) => Number(p.id)),
                                          }
                                        : { ...prev, permissions: [] },
                                )
                            }
                        />
                        {useLang('label', 'select_all')}
                    </Label>
                    {permissions.map((permission) => (
                        <div className="text-sm" key={permission.group}>
                            <p className="text-semibold py-2 capitalize">{permission.group}</p>
                            <div className="flex flex-wrap items-center gap-4">
                                {permission.data.map((p: { id: string; name: string }) => (
                                    <Label className="flex items-center gap-2" htmlFor={p.id} key={p.name}>
                                        <Checkbox
                                            checked={data.permissions.includes(Number(p.id))}
                                            onCheckedChange={(value) => {
                                                setData((prev) =>
                                                    value
                                                        ? {
                                                              ...prev,
                                                              permissions: [...prev.permissions, Number(p.id)],
                                                          }
                                                        : {
                                                              ...prev,
                                                              permissions: prev.permissions.filter((id) => id !== Number(p.id)),
                                                          },
                                                );
                                            }}
                                            id={p.id}
                                        />
                                        {p.name === 'delete' ? <span className="text-destructive font-bold">{p.name}</span> : <span>{p.name}</span>}
                                    </Label>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </ResponsiveDialog>
    );
}
