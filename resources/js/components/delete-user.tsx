import { useForm } from '@inertiajs/react';
import { FormEventHandler, useRef, useState } from 'react';

import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import HeadingSmall from '@/components/heading-small';

import { useLang } from '@/hooks/use-lang';
import { Loader2, Trash } from 'lucide-react';
import ResponsiveDialog from './responsive-dialog';

export default function DeleteUser() {
    const passwordInput = useRef<HTMLInputElement>(null);
    const [open, setOpen] = useState(false);

    const { data, setData, delete: destroy, processing, reset, errors, clearErrors } = useForm<Required<{ password: string }>>({ password: '' });

    const deleteUser: FormEventHandler = (e) => {
        e.preventDefault();

        destroy(route('profile.destroy'), {
            preserveScroll: true,
            onSuccess: () => closeModal(),
            onError: () => passwordInput.current?.focus(),
            onFinish: () => reset(),
        });
    };

    const closeModal = () => {
        clearErrors();
        reset();
    };

    return (
        <div className="space-y-6">
            <HeadingSmall title={useLang('text', 'delete_account')} description={useLang('text', 'delete_account_description')} />
            <div className="space-y-4 rounded-lg border border-red-100 bg-red-50 p-4 dark:border-red-200/10 dark:bg-red-700/10">
                <div className="relative space-y-0.5 text-red-600 dark:text-red-100">
                    <p className="font-medium">{useLang('text', 'warning')}</p>
                    <p className="text-sm">{useLang('text', 'warning_description')}</p>
                </div>

                <ResponsiveDialog
                    open={open}
                    onOpenChange={setOpen}
                    onClose={() => closeModal()}
                    title={useLang('text', 'delete_account_confirmation')}
                    description={useLang('text', 'delete_account_warning')}
                    trigger={<Button variant="destructive">{useLang('button', 'delete_account')}</Button>}
                    submit={deleteUser}
                    footer={
                        <>
                            <Button size="lg" onClick={() => setOpen(false)} type="button" variant="outline">
                                {useLang('button', 'cancel')}
                            </Button>
                            <Button size="lg" disabled={processing} variant="destructive" type="submit">
                                {processing ? <Loader2 className="size-4 animate-spin" /> : <Trash className="icon fill-background/30" />}
                                {useLang('button', 'delete')}
                            </Button>
                        </>
                    }
                >
                    <div className="grid gap-2">
                        <Label htmlFor="password">{useLang('label', 'password')}</Label>

                        <Input
                            id="password"
                            type="password"
                            name="password"
                            ref={passwordInput}
                            value={data.password}
                            onChange={(e) => setData('password', e.target.value)}
                            placeholder={useLang('placeholder', 'password')}
                            autoComplete="current-password"
                            aria-invalid={!!errors.password}
                        />

                        <InputError message={errors.password} />
                    </div>
                </ResponsiveDialog>
            </div>
        </div>
    );
}
