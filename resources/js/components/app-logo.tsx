import { SharedData } from '@/types';
import { usePage } from '@inertiajs/react';
import AppLogoIcon from './app-logo-icon';

export default function AppLogo() {
    return (
        <div className="flex items-center justify-start gap-1">
            <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-md">
                <AppLogoIcon />
            </div>
            <div className="ml-1 grid flex-1 text-left text-sm">
                <span className="mb-0.5 truncate leading-3.75 font-semibold">
                    {usePage<SharedData>().props.app.settings.app_name} <br />
                    <small className="text-muted-foreground text-xs font-normal">{usePage<SharedData>().props.app.settings.app_tagline}</small>
                </span>
            </div>
        </div>
    );
}
