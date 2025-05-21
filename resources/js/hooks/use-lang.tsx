import { SharedData } from '@/types';
import { usePage } from '@inertiajs/react';

export function useLang(path: string, key: string) {
    const { languages } = usePage<SharedData>().props.app;
    return languages.original[path][key] || key;
}
