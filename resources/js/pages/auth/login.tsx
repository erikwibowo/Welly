import { Head, useForm } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { FormEventHandler } from 'react';

import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useLang } from '@/hooks/use-lang';
import AuthLayout from '@/layouts/auth-layout';

type LoginForm = {
    email: string;
    password: string;
    remember: boolean;
};

interface LoginProps {
    status?: string;
    canResetPassword: boolean;
}

export default function Login({ status, canResetPassword }: LoginProps) {
    const { data, setData, post, processing, errors, reset } = useForm<Required<LoginForm>>({
        email: '',
        password: '',
        remember: false,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    const forgotPasswordText = useLang('text', 'forgot_password');

    return (
        <AuthLayout title={useLang('text', 'login_title')} description={useLang('text', 'login_description')}>
            <Head title={useLang('text', 'login')} />

            {status && <div className="text-success mb-4 text-center text-sm font-medium">{status}</div>}
            <form className="flex flex-col gap-6" onSubmit={submit}>
                <div className="grid gap-6">
                    <div className="grid gap-2">
                        <Label htmlFor="email">{useLang('label', 'email')}</Label>
                        <Input
                            id="email"
                            type="email"
                            required
                            aria-invalid={!!errors.email}
                            tabIndex={1}
                            autoComplete="email"
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                            placeholder={useLang('placeholder', 'email')}
                        />
                        <InputError message={errors.email} />
                    </div>

                    <div className="grid gap-2">
                        <div className="flex items-center">
                            <Label htmlFor="password">{useLang('label', 'password')}</Label>
                            {canResetPassword && (
                                <TextLink href={route('password.request')} className="ml-auto text-sm" tabIndex={5}>
                                    {forgotPasswordText}?
                                </TextLink>
                            )}
                        </div>
                        <Input
                            id="password"
                            type="password"
                            required
                            tabIndex={2}
                            autoComplete="current-password"
                            aria-invalid={!!errors.password}
                            value={data.password}
                            onChange={(e) => setData('password', e.target.value)}
                            placeholder={useLang('placeholder', 'password')}
                        />
                        <InputError message={errors.password} />
                    </div>

                    <div className="flex items-center space-x-3">
                        <Checkbox
                            id="remember"
                            name="remember"
                            checked={data.remember}
                            onClick={() => setData('remember', !data.remember)}
                            tabIndex={3}
                        />
                        <Label htmlFor="remember">{useLang('text', 'remember_me')}</Label>
                    </div>

                    <Button type="submit" className="mt-4 w-full" tabIndex={4} disabled={processing}>
                        {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                        {useLang('button', 'login')}
                    </Button>
                </div>

                <div className="text-muted-foreground text-center text-sm">
                    {useLang('text', 'notyet_registered')}{' '}
                    <TextLink href={route('register')} tabIndex={5}>
                        {useLang('text', 'register')}
                    </TextLink>
                </div>
            </form>
        </AuthLayout>
    );
}
