// Components
import { Head, useForm } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { FormEventHandler } from 'react';

import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { useLang } from '@/hooks/use-lang';
import AuthLayout from '@/layouts/auth-layout';

export default function VerifyEmail({ status }: { status?: string }) {
    const { post, processing } = useForm({});

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route('verification.send'));
    };

    const verifyTextSuccess = useLang('text', 'verify_email_success');

    return (
        <AuthLayout title={useLang('text', 'verify_email')} description={useLang('text', 'verify_email_description')}>
            <Head title="Email verification" />

            {status === 'verification-link-sent' && <div className="mb-4 text-center text-sm font-medium text-green-600">{verifyTextSuccess}</div>}

            <form onSubmit={submit} className="space-y-6 text-center">
                <Button disabled={processing} variant="secondary">
                    {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                    {useLang('button', 'resend_email_verification')}
                </Button>

                <TextLink href={route('logout')} method="post" className="mx-auto block text-sm">
                    {useLang('button', 'logout')}
                </TextLink>
            </form>
        </AuthLayout>
    );
}
