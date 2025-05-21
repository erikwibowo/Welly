import InputError from '@/components/input-error';
import AppLayout from '@/layouts/app-layout';
import SettingLayout from '@/layouts/settings/layout';
import { SharedData, type BreadcrumbItem } from '@/types';
import { Head, useForm, usePage } from '@inertiajs/react';
import { FormEventHandler, useState } from 'react';

import FileDropzone from '@/components/file-dropzone';
import HeadingSmall from '@/components/heading-small';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useLang } from '@/hooks/use-lang';
import { Loader2, Save, Trash } from 'lucide-react';

export default function Seo({ setting }: { setting: App.Models.Setting }) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: useLang('text', 'image_title'),
            href: '/settings/image',
        },
    ];
    const [app_favicon, setAppFavicon] = useState<string | undefined>(setting.full_path_favicon);
    const [app_logo, setAppLogo] = useState<string | undefined>(setting.full_path_logo);
    const [app_logo_dark, setAppLogoDark] = useState<string | undefined>(setting.full_path_logo_dark);
    const { setData, errors, post, processing } = useForm<{
        app_favicon?: File | null;
        app_logo?: File | null;
        app_logo_dark?: File | null;
        source: string;
        _method: string;
    }>({
        app_favicon: null,
        app_logo: null,
        app_logo_dark: null,
        source: 'image',
        _method: 'patch',
    });

    const updatePassword: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('setting.update', setting.id), {
            preserveScroll: true,
        });
    };

    const appName = usePage<SharedData>().props.app.settings.app_name;
    const dashboardText = useLang('text', 'dashboard');

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={useLang('text', 'image_title')} />

            <SettingLayout>
                <div className="space-y-6">
                    <HeadingSmall title={useLang('text', 'image_title')} description={useLang('text', 'image_description')} />

                    <form onSubmit={updatePassword} className="space-y-6">
                        <div className="grid gap-2">
                            <Label htmlFor="app_favicon" className="capitalize">
                                Favicon
                            </Label>

                            {app_favicon ? (
                                <div className="relative flex h-fit items-center justify-center">
                                    <div className="flex w-full items-center gap-4 rounded-t-xl border-x-2 border-t-2 py-2 pr-16 pl-2 text-wrap">
                                        <img className="h-8 w-8 rounded object-cover object-center" src={app_favicon} alt="Banner" />
                                        <span className="truncate text-sm font-semibold">
                                            {dashboardText} - {appName}
                                        </span>
                                    </div>

                                    <Button
                                        className="absolute top-4 right-4 shrink-0"
                                        variant="destructive"
                                        size="icon"
                                        onClick={() => {
                                            setData('app_favicon', null);
                                            setAppFavicon(undefined);
                                        }}
                                    >
                                        <Trash className="icon !fill-background/30" />
                                    </Button>
                                </div>
                            ) : (
                                <FileDropzone id="app_favicon" maxFiles={1} onFilesSelected={(files) => setData('app_favicon', files[0])} />
                            )}

                            <InputError message={errors.app_favicon} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="app_logo" className="capitalize">
                                Logo
                            </Label>

                            {app_logo ? (
                                <div className="relative h-fit">
                                    <img className="mx-auto w-fit rounded object-cover object-center" src={app_logo} alt="Banner" />

                                    <Button
                                        className="absolute top-4 right-4 shrink-0"
                                        variant="destructive"
                                        size="icon"
                                        onClick={() => {
                                            setData('app_logo', null);
                                            setAppLogo(undefined);
                                        }}
                                    >
                                        <Trash className="icon !fill-background/30" />
                                    </Button>
                                </div>
                            ) : (
                                <FileDropzone id="app_logo" maxFiles={1} onFilesSelected={(files) => setData('app_logo', files[0])} />
                            )}

                            <InputError message={errors.app_logo} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="app_logo_dark" className="capitalize">
                                Logo {useLang('text', 'dark')}
                            </Label>

                            {app_logo_dark ? (
                                <div className="relative h-fit">
                                    <img className="mx-auto w-fit rounded object-cover object-center" src={app_logo_dark} alt="Banner" />

                                    <Button
                                        className="absolute top-4 right-4 shrink-0"
                                        variant="destructive"
                                        size="icon"
                                        onClick={() => {
                                            setData('app_logo_dark', null);
                                            setAppLogoDark(undefined);
                                        }}
                                    >
                                        <Trash className="icon !fill-background/30" />
                                    </Button>
                                </div>
                            ) : (
                                <FileDropzone id="app_logo_dark" maxFiles={1} onFilesSelected={(files) => setData('app_logo_dark', files[0])} />
                            )}

                            <InputError message={errors.app_logo_dark} />
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
