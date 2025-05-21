import AppLogo from '@/components/app-logo';
import AppearanceToggleDropdown from '@/components/appearance-dropdown';
import { Link } from '@inertiajs/react';
import { type PropsWithChildren } from 'react';

interface AuthLayoutProps {
    name?: string;
    title?: string;
    description?: string;
}

export default function AuthSimpleLayout({ children, title, description }: PropsWithChildren<AuthLayoutProps>) {
    return (
        <div className="bg-background flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
            <div className="w-full max-w-sm">
                <div className="flex flex-col gap-8">
                    <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[400px]">
                        <div className="relative z-20 mb-8 gap-4 flex items-center justify-between">
                            <Link href={route('home')}>
                                <AppLogo />
                            </Link>
                            <AppearanceToggleDropdown />
                        </div>
                        <div className="flex flex-col items-start gap-2 text-left">
                            <h1 className="text-xl font-medium">{title}</h1>
                            <p className="text-muted-foreground text-sm text-balance">{description}</p>
                        </div>
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
}
