// Components
import { Head, useForm } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { FormEventHandler } from 'react';

import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useLang } from '@/hooks/use-lang';
import AuthLayout from '@/layouts/auth-layout';

export default function ConfirmPassword() {
    const { data, setData, post, processing, errors, reset } = useForm<Required<{ password: string }>>({
        password: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route('password.confirm'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <AuthLayout title={useLang('text', 'confirm_your_password')} description={useLang('text', 'confirm_password_description')}>
            <Head title={useLang('text', 'confirm_password')} />

            <form onSubmit={submit}>
                <div className="space-y-6">
                    <div className="grid gap-2">
                        <Label htmlFor="password">{useLang('label', 'password')}</Label>
                        <Input
                            id="password"
                            type="password"
                            name="password"
                            placeholder={useLang('placeholder', 'password')}
                            autoComplete="current-password"
                            aria-invalid={!!errors.password}
                            value={data.password}
                            onChange={(e) => setData('password', e.target.value)}
                        />

                        <InputError message={errors.password} />
                    </div>

                    <div className="flex items-center">
                        <Button className="w-full" disabled={processing}>
                            {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                            {useLang('button', 'confirm')}
                        </Button>
                    </div>
                </div>
            </form>
        </AuthLayout>
    );
}
