import { SharedData } from '@/types';
import { usePage } from '@inertiajs/react';

export function usePermission(permissions: string[] | null) {
    const { auth } = usePage<SharedData>().props;
    const allPermissions = auth.permissions;

    if (permissions === null) {
        return true;
    }
    return permissions.some((item) => allPermissions[item]);
}
