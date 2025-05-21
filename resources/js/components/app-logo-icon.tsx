import { SharedData } from '@/types';
import { usePage } from '@inertiajs/react';
import { ImgHTMLAttributes } from 'react';

export default function AppLogoIcon(props: ImgHTMLAttributes<HTMLImageElement>) {
    return (
        <>
            <img
                src={usePage<SharedData>().props.app.settings.full_path_logo}
                alt="Logo"
                className={'block h-4 w-4 dark:hidden ' + props.className}
            />
            <img
                src={usePage<SharedData>().props.app.settings.full_path_logo_dark}
                alt="Logo"
                className={'hidden h-4 w-4 dark:block ' + props.className}
            />
        </>
    );
}
