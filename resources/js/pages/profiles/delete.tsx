import { Head } from '@inertiajs/react';

import { type BreadcrumbItem } from '@/types';

import DeleteUser from '@/components/delete-user';
import { useLang } from '@/hooks/use-lang';
import AppLayout from '@/layouts/app-layout';
import ProfileLayout from '@/layouts/profiles/layout';

export default function Delete() {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: useLang('text', 'delete_account'),
            href: '/profiles/delete',
        },
    ];
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={useLang('text', 'delete_account')} />

            <ProfileLayout>
                <DeleteUser />
            </ProfileLayout>
        </AppLayout>
    );
}
