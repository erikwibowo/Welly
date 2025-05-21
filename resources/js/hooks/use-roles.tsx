import { SharedData } from '@/types';
import { usePage } from '@inertiajs/react';

export function useRoles(roles: string[] | null) {
    const { auth } = usePage<SharedData>().props;
    const allRoles = auth.user.roles ?? [];

    if (roles === null) {
        return true;
    }
    return roles.some((item) => allRoles.map((role) => role.name).includes(item));
}
