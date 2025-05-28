import FileDropzone from '@/components/file-dropzone';
import InputError from '@/components/input-error';
import ResponsiveDialog from '@/components/responsive-dialog';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useLang } from '@/hooks/use-lang';
import { useIsMobile } from '@/hooks/use-mobile';
import { usePermission } from '@/hooks/use-permission';
import { cn } from '@/lib/utils';
import { useForm } from '@inertiajs/react';
import { Loader2, PlusIcon, SaveIcon } from 'lucide-react';
import { FormEventHandler, useState } from 'react';

export default function Create({
    title,
    roles,
    withRoles = true,
    source = 'user',
}: {
    title: string;
    roles?: App.Models.Role[];
    withRoles?: boolean;
    source?: 'user' | 'profile';
}) {
    const [open, setOpen] = useState(false);
    const isMobile = useIsMobile();

    const { data, setData, post, processing, errors, clearErrors, reset } = useForm<{
        image: File | null;
        name: string;
        email: string;
        password: string;
        password_confirmation: string;
        roles: string[];
        source: 'user' | 'profile';
    }>({
        image: null,
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        roles: [],
        source: source,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('user.store'), {
            onFinish: () => {
                reset('password', 'password_confirmation');
            },
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
    const roleText = useLang('label', 'role');
    const selectAllText = useLang('label', 'select_all');

    return (
        <ResponsiveDialog
            open={open}
            onOpenChange={setOpen}
            onClose={() => closeModal()}
            title={createText + ' ' + title}
            trigger={
                usePermission(['user create']) &&
                (!isMobile ? (
                    <Button>
                        <PlusIcon className="icon" /> {createText}
                    </Button>
                ) : (
                    <Button className={cn('fixed right-4 z-20 h-12 w-12 rounded-lg shadow-lg', source === 'profile' ? 'bottom-20' : 'bottom-24')}>
                        <PlusIcon className="size-6" />
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
                    <Label htmlFor="profile" className="capitalize">
                        {useLang('label', 'photo')}
                    </Label>
                    <FileDropzone
                        id="profile"
                        maxFiles={1}
                        className="h-52 w-full"
                        onFilesRemoved={() => setData('image', null)}
                        onFilesSelected={(files) => setData('image', files[0])}
                        acceptedTypes={['image/*']}
                    />

                    <InputError message={errors.image} />
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="name">{useLang('label', 'full_name')}</Label>
                    <Input
                        id="name"
                        name="name"
                        value={data.name}
                        className="block w-full"
                        aria-invalid={!!errors.name}
                        autoComplete="name"
                        placeholder={useLang('placeholder', 'full_name')}
                        onChange={(e) => setData('name', e.target.value)}
                    />

                    <InputError message={errors.name} />
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="email">{useLang('label', 'email')}</Label>
                    <Input
                        id="email"
                        type="email"
                        name="email"
                        value={data.email}
                        className="block w-full"
                        autoComplete="username"
                        aria-invalid={!!errors.email}
                        placeholder={useLang('placeholder', 'email')}
                        onChange={(e) => setData('email', e.target.value)}
                    />

                    <InputError message={errors.email} />
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="password">{useLang('label', 'password')}</Label>
                    <Input
                        id="password"
                        type="password"
                        name="password"
                        value={data.password}
                        className="block w-full"
                        autoComplete="current-password"
                        aria-invalid={!!errors.password}
                        placeholder={useLang('placeholder', 'password')}
                        onChange={(e) => setData('password', e.target.value)}
                    />

                    <InputError message={errors.password} />
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="password_confirmation">{useLang('label', 'confirm_password')}</Label>
                    <Input
                        id="password_confirmation"
                        type="password"
                        name="password_confirmation"
                        value={data.password_confirmation}
                        className="block w-full"
                        autoComplete="new-password"
                        aria-invalid={!!errors.password_confirmation}
                        placeholder={useLang('placeholder', 'password')}
                        onChange={(e) => setData('password_confirmation', e.target.value)}
                    />

                    <InputError message={errors.password_confirmation} className="mt-2" />
                </div>

                {withRoles && roles && (
                    <div className="flex flex-col space-y-2">
                        <Label>
                            {data.roles.length > 0 && <span>({data.roles.length}) </span>}
                            {roleText}
                        </Label>
                        <InputError message={errors.roles} />
                        <Label className="flex items-center gap-2 pt-2" htmlFor="select-all-role">
                            <Checkbox
                                id="select-all-role"
                                checked={data.roles.length === roles.length}
                                onCheckedChange={(value) =>
                                    setData((prev) =>
                                        value
                                            ? {
                                                  ...prev,
                                                  roles: roles.map((role) => role.name),
                                              }
                                            : { ...prev, roles: [] },
                                    )
                                }
                            />
                            {selectAllText}
                        </Label>
                        {roles.map((role) => (
                            <div className="pt-2" key={role.name}>
                                <Label className="flex items-center gap-2" htmlFor={role.name}>
                                    <Checkbox
                                        checked={data.roles.includes(role.name)}
                                        id={role.name}
                                        onCheckedChange={(value) =>
                                            setData((prev) =>
                                                value
                                                    ? {
                                                          ...prev,
                                                          roles: [...prev.roles, role.name],
                                                      }
                                                    : {
                                                          ...prev,
                                                          roles: prev.roles.filter((r) => r !== role.name),
                                                      },
                                            )
                                        }
                                    />
                                    {role.name === 'delete' ? (
                                        <span className="text-destructive font-bold">{role.name}</span>
                                    ) : (
                                        <span>{role.name}</span>
                                    )}
                                </Label>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </ResponsiveDialog>
    );
}
