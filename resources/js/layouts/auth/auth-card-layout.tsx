import AppLogo from '@/components/app-logo';
import AppearanceToggleDropdown from '@/components/appearance-dropdown';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from '@inertiajs/react';
import { type PropsWithChildren } from 'react';

export default function AuthCardLayout({
    children,
    title,
    description,
}: PropsWithChildren<{
    name?: string;
    title?: string;
    description?: string;
}>) {
    return (
        <div className="bg-background flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
            <div className="flex w-full max-w-md flex-col gap-6">
                <div className="flex flex-col gap-6">
                    <Card className="rounded-xl">
                        <CardHeader>
                            <CardTitle className="text-xl">
                                <div className="relative z-20 mb-8 flex items-center justify-between">
                                    <Link href={route('home')}>
                                        <AppLogo />
                                    </Link>
                                    <AppearanceToggleDropdown />
                                </div>
                                {title}
                            </CardTitle>
                            <CardDescription>{description}</CardDescription>
                        </CardHeader>
                        <CardContent>{children}</CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
