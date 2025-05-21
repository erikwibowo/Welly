import { type BreadcrumbItem, type SharedData } from '@/types';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { FormEventHandler, useState } from 'react';

import FileDropzone from '@/components/file-dropzone';
import HeadingSmall from '@/components/heading-small';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useLang } from '@/hooks/use-lang';
import AppLayout from '@/layouts/app-layout';
import ProfileLayout from '@/layouts/profiles/layout';
import { Loader2, Save, Trash } from 'lucide-react';

export default function Profile({ mustVerifyEmail, status }: { mustVerifyEmail: boolean; status?: string }) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: useLang('text', 'profile_title'),
            href: '/profiles/profile',
        },
    ];
    const { auth } = usePage<SharedData>().props;
    const [image, setImage] = useState<string | undefined>(auth.user.full_path_image);

    const { data, setData, post, errors, processing } = useForm<{
        image?: File | null;
        remove_image?: boolean;
        name: string;
        email: string;
        _method: string;
    }>({
        image: null,
        remove_image: false,
        name: auth.user.name,
        email: auth.user.email,
        _method: 'patch',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route('profile.update'), {
            preserveScroll: true,
        });
    };

    const unverifiedEmailText = useLang('text', 'email_unverified');
    const clickHereText = useLang('text', 'click_here_to_resend_email');
    const verificationLinkSentText = useLang('text', 'a_new_verification_links');

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={useLang('text', 'profile_title')} />

            <ProfileLayout>
                <div className="space-y-6">
                    <HeadingSmall title={useLang('text', 'profile_title')} description={useLang('text', 'profile_caption')} />

                    <form onSubmit={submit} className="space-y-6">
                        <div className="grid gap-2">
                            <Label htmlFor="profile" className="capitalize">
                                {useLang('label', 'photo')}
                            </Label>
                            {image ? (
                                <div className="relative">
                                    <img className="m-auto h-52 w-fit rounded-md object-cover object-center" src={image} alt="Profile Image" />

                                    <Button
                                        className="absolute top-4 right-4 shrink-0"
                                        variant="destructive"
                                        size="icon"
                                        onClick={() => {
                                            setData('image', null);
                                            setImage(undefined);
                                            setData('remove_image', true);
                                        }}
                                    >
                                        <Trash className="icon !fill-background/30" />
                                    </Button>
                                </div>
                            ) : (
                                <FileDropzone
                                    id="profile"
                                    maxFiles={1}
                                    className="h-52 w-full"
                                    onFilesSelected={(files) => setData('image', files[0])}
                                    acceptedTypes={['image/*']}
                                />
                            )}

                            <InputError message={errors.image} />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="name">{useLang('label', 'name')}</Label>

                            <Input
                                id="name"
                                className="mt-1 block w-full"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                required
                                autoComplete="name"
                                aria-invalid={!!errors.name}
                                placeholder={useLang('placeholder', 'full_name')}
                            />

                            <InputError className="mt-2" message={errors.name} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="email">{useLang('label', 'email')}</Label>

                            <Input
                                id="email"
                                type="email"
                                className="mt-1 block w-full"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                required
                                autoComplete="username"
                                aria-invalid={!!errors.email}
                                placeholder={useLang('placeholder', 'email')}
                            />

                            <InputError className="mt-2" message={errors.email} />
                        </div>

                        {mustVerifyEmail && auth.user.email_verified_at === null && (
                            <div>
                                <p className="text-muted-foreground -mt-4 text-sm">
                                    {unverifiedEmailText}{' '}
                                    <Link
                                        href={route('verification.send')}
                                        method="post"
                                        as="button"
                                        className="text-foreground underline decoration-neutral-300 underline-offset-4 transition-colors duration-300 ease-out hover:decoration-current! dark:decoration-neutral-500"
                                    >
                                        {clickHereText}
                                    </Link>
                                </p>

                                {status === 'verification-link-sent' && (
                                    <div className="mt-2 text-sm font-medium text-green-600">{verificationLinkSentText}</div>
                                )}
                            </div>
                        )}

                        <div className="flex items-center gap-4">
                            <Button disabled={processing}>
                                {processing ? <Loader2 className="size-4 animate-spin" /> : <Save className="icon" />}
                                {useLang('button', 'save')}
                            </Button>
                        </div>
                    </form>
                </div>
            </ProfileLayout>
        </AppLayout>
    );
}
