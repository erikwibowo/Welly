import InputError from '@/components/input-error';
import AppLayout from '@/layouts/app-layout';
import SettingLayout from '@/layouts/settings/layout';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { FormEventHandler, useState } from 'react';

import FileDropzone from '@/components/file-dropzone';
import HeadingSmall from '@/components/heading-small';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { useLang } from '@/hooks/use-lang';
import { Loader2, Save, Trash } from 'lucide-react';

export default function Seo({ setting }: { setting: App.Models.Setting }) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: useLang('text', 'seo_title'),
            href: '/settings/seo',
        },
    ];
    const [meta_banner, setMetaBanner] = useState<string | undefined>(setting.full_path_banner);
    const { data, setData, errors, patch, processing } = useForm<{
        seo_enabled: boolean;
        meta_title: string;
        meta_description: string;
        meta_banner?: File | null;
        meta_keywords: string;
        meta_author: string;
        source: string;
    }>({
        seo_enabled: Boolean(setting.seo_enabled),
        meta_title: setting.meta_title,
        meta_description: setting.meta_description,
        meta_banner: null,
        meta_keywords: setting.meta_keywords,
        meta_author: setting.meta_author,
        source: 'seo',
    });

    const updatePassword: FormEventHandler = (e) => {
        e.preventDefault();
        patch(route('setting.update', setting.id), {
            preserveScroll: true,
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={useLang('text', 'seo_title')} />

            <SettingLayout>
                <div className="space-y-6">
                    <div className="flex flex-row items-center justify-between">
                        <HeadingSmall title={useLang('text', 'seo_title')} description={useLang('text', 'seo_description')} />
                        <div>
                            <Switch
                                checked={data.seo_enabled}
                                onCheckedChange={(checked) => {
                                    setData('seo_enabled', checked);
                                }}
                            />
                        </div>
                    </div>
                    <form onSubmit={updatePassword} className="space-y-6">
                        {data.seo_enabled && (
                            <div className="space-y-6">
                                <div className="grid gap-2">
                                    <Label htmlFor="meta_title" className="capitalize">
                                        Meta Title
                                    </Label>

                                    <Input
                                        id="meta_title"
                                        className="block w-full"
                                        value={data.meta_title}
                                        onChange={(e) => setData('meta_title', e.target.value)}
                                        autoComplete="meta_title"
                                        aria-invalid={!!errors.meta_title}
                                        placeholder="Meta Title"
                                    />

                                    <InputError message={errors.meta_title} />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="meta_description" className="capitalize">
                                        Meta Description
                                    </Label>

                                    <Textarea
                                        id="meta_description"
                                        className="block w-full"
                                        value={data.meta_description}
                                        onChange={(e) => setData('meta_description', e.target.value)}
                                        rows={4}
                                        autoComplete="meta_description"
                                        aria-invalid={!!errors.meta_description}
                                        placeholder="Meta Description"
                                    />

                                    <InputError message={errors.meta_description} />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="meta_banner" className="capitalize">
                                        Banner
                                    </Label>
                                    {meta_banner ? (
                                        <div className="relative">
                                            <img className="h-60 w-full rounded object-cover object-center shadow" src={meta_banner} alt="Banner" />

                                            <Button
                                                className="absolute top-4 right-4 shrink-0"
                                                variant="destructive"
                                                size="icon"
                                                onClick={() => {
                                                    setData('meta_banner', null);
                                                    setMetaBanner(undefined);
                                                }}
                                            >
                                                <Trash className="icon !fill-background/30" />
                                            </Button>
                                        </div>
                                    ) : (
                                        <FileDropzone id="meta_banner" maxFiles={1} onFilesSelected={(files) => setData('meta_banner', files[0])} />
                                    )}

                                    <InputError message={errors.meta_banner} />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="meta_keywords" className="capitalize">
                                        Meta Keywords
                                    </Label>

                                    <Textarea
                                        id="meta_keywords"
                                        className="block w-full"
                                        value={data.meta_keywords}
                                        onChange={(e) => setData('meta_keywords', e.target.value)}
                                        rows={4}
                                        autoComplete="meta_keywords"
                                        aria-invalid={!!errors.meta_keywords}
                                        placeholder="Meta Keywords"
                                    />

                                    <InputError message={errors.meta_keywords} />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="meta_author" className="capitalize">
                                        Meta Author
                                    </Label>

                                    <Input
                                        id="meta_author"
                                        className="block w-full"
                                        value={data.meta_author}
                                        onChange={(e) => setData('meta_author', e.target.value)}
                                        autoComplete="meta_author"
                                        aria-invalid={!!errors.meta_author}
                                        placeholder="Meta Author"
                                    />

                                    <InputError message={errors.meta_author} />
                                </div>
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
            </SettingLayout>
        </AppLayout>
    );
}
