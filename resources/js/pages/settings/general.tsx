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

export default function General({ setting }: { setting: App.Models.Setting }) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: useLang('text', 'general_title'),
            href: '/settings/general',
        },
    ];
    const { data, setData, errors, patch, processing } = useForm({
        app_name: setting.app_name,
        app_short_name: setting.app_short_name,
        app_version: setting.app_version,
        app_tagline: setting.app_tagline,
        app_description: setting.app_description,
        source: 'general',
    });

    const updatePassword: FormEventHandler = (e) => {
        e.preventDefault();
        patch(route('setting.update', setting.id), {
            preserveScroll: true,
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={useLang('text', 'general_title')} />

            <SettingLayout>
                <div className="space-y-6">
                    <HeadingSmall title={useLang('text', 'general_title')} description={useLang('text', 'general_description')} />

                    <form onSubmit={updatePassword} className="space-y-6">
                        <div className="grid gap-2">
                            <Label htmlFor="app_name" className="capitalize">
                                {useLang('label', 'name')}
                            </Label>

                            <Input
                                id="app_name"
                                className="block w-full"
                                value={data.app_name}
                                onChange={(e) => setData('app_name', e.target.value)}
                                autoComplete="app_name"
                                aria-invalid={!!errors.app_name}
                                placeholder={useLang('placeholder', 'name')}
                            />

                            <InputError message={errors.app_name} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="app_short_name" className="capitalize">
                                {useLang('label', 'short_name')}
                            </Label>

                            <Input
                                id="app_short_name"
                                className="block w-full"
                                value={data.app_short_name}
                                onChange={(e) => setData('app_short_name', e.target.value)}
                                autoComplete="app_short_name"
                                aria-invalid={!!errors.app_short_name}
                                placeholder={useLang('placeholder', 'short_name')}
                            />

                            <InputError message={errors.app_short_name} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="app_version" className="capitalize">
                                {useLang('label', 'version')}
                            </Label>

                            <Input
                                id="app_version"
                                className="block w-full"
                                value={data.app_version}
                                onChange={(e) => setData('app_version', e.target.value)}
                                autoComplete="app_version"
                                aria-invalid={!!errors.app_version}
                                placeholder={useLang('placeholder', 'version')}
                            />

                            <InputError message={errors.app_version} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="app_tagline" className="capitalize">
                                {useLang('label', 'tagline')}
                            </Label>

                            <Textarea
                                id="app_tagline"
                                className="block w-full"
                                value={data.app_tagline || ''}
                                onChange={(e) => setData('app_tagline', e.target.value)}
                                rows={4}
                                autoComplete="app_tagline"
                                aria-invalid={!!errors.app_tagline}
                                placeholder={useLang('placeholder', 'tagline')}
                            />

                            <InputError message={errors.app_tagline} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="app_description" className="capitalize">
                                {useLang('label', 'description')}
                            </Label>

                            <Textarea
                                id="app_description"
                                className="block w-full"
                                value={data.app_description}
                                onChange={(e) => setData('app_description', e.target.value)}
                                rows={4}
                                autoComplete="app_description"
                                aria-invalid={!!errors.app_description}
                                placeholder={useLang('placeholder', 'description')}
                            />

                            <InputError message={errors.app_description} />
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
