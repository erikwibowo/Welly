import InputError from '@/components/input-error';
import AppLayout from '@/layouts/app-layout';
import SettingLayout from '@/layouts/settings/layout';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';

import HeadingSmall from '@/components/heading-small';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useLang } from '@/hooks/use-lang';
import { Loader2, Save } from 'lucide-react';

export default function Contact({ setting }: { setting: App.Models.Setting }) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: useLang('text', 'contact_title'),
            href: '/settings/contact',
        },
    ];
    const { data, setData, errors, patch, processing } = useForm({
        app_email: setting.app_email,
        app_phone: setting.app_phone,
        app_whatsapp: setting.app_whatsapp,
        app_facebook: setting.app_facebook,
        app_instagram: setting.app_instagram,
        app_twitter: setting.app_twitter,
        app_tiktok: setting.app_tiktok,
        app_address: setting.app_address,
        source: 'contact',
    });

    const updatePassword: FormEventHandler = (e) => {
        e.preventDefault();
        patch(route('setting.update', setting.id), {
            preserveScroll: true,
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={useLang('text', 'contact_title')} />

            <SettingLayout>
                <div className="space-y-6">
                    <HeadingSmall title={useLang('text', 'contact_title')} description={useLang('text', 'contact_description')} />

                    <form onSubmit={updatePassword} className="space-y-6">
                        <div className="grid gap-2">
                            <Label htmlFor="app_email" className="capitalize">
                                {useLang('label', 'email')}
                            </Label>

                            <Input
                                id="app_email"
                                className="block w-full"
                                value={data.app_email || ''}
                                onChange={(e) => setData('app_email', e.target.value)}
                                autoComplete="name"
                                aria-invalid={!!errors.app_email}
                                placeholder={useLang('placeholder', 'email')}
                            />

                            <InputError message={errors.app_email} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="app_phone" className="capitalize">
                                {useLang('label', 'phone')}
                            </Label>

                            <Input
                                id="app_phone"
                                className="block w-full"
                                value={data.app_phone || ''}
                                onChange={(e) => setData('app_phone', e.target.value)}
                                autoComplete="name"
                                aria-invalid={!!errors.app_phone}
                                placeholder={useLang('placeholder', 'phone')}
                            />

                            <InputError message={errors.app_phone} />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="app_whatsapp" className="capitalize">
                                Whatsapp
                            </Label>

                            <Input
                                id="app_whatsapp"
                                className="block w-full"
                                value={data.app_whatsapp || ''}
                                onChange={(e) => setData('app_whatsapp', e.target.value)}
                                autoComplete="name"
                                aria-invalid={!!errors.app_whatsapp}
                                placeholder="Whatsapp"
                            />

                            <InputError message={errors.app_whatsapp} />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="app_facebook" className="capitalize">
                                Facebook
                            </Label>

                            <Input
                                id="app_facebook"
                                className="block w-full"
                                value={data.app_facebook || ''}
                                onChange={(e) => setData('app_facebook', e.target.value)}
                                autoComplete="name"
                                aria-invalid={!!errors.app_facebook}
                                placeholder="Facebook"
                            />

                            <InputError message={errors.app_facebook} />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="app_instagram" className="capitalize">
                                Instagram
                            </Label>

                            <Input
                                id="app_instagram"
                                className="block w-full"
                                value={data.app_instagram || ''}
                                onChange={(e) => setData('app_instagram', e.target.value)}
                                autoComplete="name"
                                aria-invalid={!!errors.app_instagram}
                                placeholder="Instagram"
                            />

                            <InputError message={errors.app_instagram} />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="app_twitter" className="capitalize">
                                Twitter
                            </Label>

                            <Input
                                id="app_twitter"
                                className="block w-full"
                                value={data.app_twitter || ''}
                                onChange={(e) => setData('app_twitter', e.target.value)}
                                autoComplete="name"
                                aria-invalid={!!errors.app_twitter}
                                placeholder="Twitter"
                            />

                            <InputError message={errors.app_twitter} />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="app_tiktok" className="capitalize">
                                Tiktok
                            </Label>

                            <Input
                                id="app_tiktok"
                                className="block w-full"
                                value={data.app_tiktok || ''}
                                onChange={(e) => setData('app_tiktok', e.target.value)}
                                autoComplete="name"
                                aria-invalid={!!errors.app_tiktok}
                                placeholder="Tiktok"
                            />

                            <InputError message={errors.app_tiktok} />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="app_address" className="capitalize">
                                {useLang('label', 'address')}
                            </Label>

                            <Textarea
                                id="app_address"
                                className="block w-full"
                                value={data.app_address || ''}
                                onChange={(e) => setData('app_address', e.target.value)}
                                rows={4}
                                autoComplete="name"
                                aria-invalid={!!errors.app_address}
                                placeholder={useLang('placeholder', 'address')}
                            />

                            <InputError message={errors.app_address} />
                        </div>

                        <div className="flex items-center gap-4">
                            <Button disabled={processing}>
                                {processing ? <Loader2 className="size-4 animate-spin" /> : <Save className="icon" />}
                                {useLang('button', 'save')}
                            </Button>
                        </div>
                    </form>
                </div>
            </SettingLayout>
        </AppLayout>
    );
}
