import { Head } from '@inertiajs/react';

import AppearanceTabs from '@/components/appearance-tabs';
import HeadingSmall from '@/components/heading-small';
import { type BreadcrumbItem } from '@/types';

import { useLang } from '@/hooks/use-lang';
import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';

export default function Appearance() {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: useLang('text', 'appearance_title'),
            href: '/settings/appearance',
        },
    ];
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={useLang('text', 'appearance_title')} />

            <SettingsLayout>
                <div className="space-y-6">
                    <HeadingSmall title={useLang('text', 'appearance_title')} description={useLang('text', 'appearance_description')} />
                    <AppearanceTabs />
                </div>
            </SettingsLayout>
        </AppLayout>
    );
}
