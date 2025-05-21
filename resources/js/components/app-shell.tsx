import { SidebarProvider } from '@/components/ui/sidebar';
import { useAppearance } from '@/hooks/use-appearance';
import { useLang } from '@/hooks/use-lang';
import { SharedData } from '@/types';
import { usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { Toaster, toast } from 'sonner';

interface AppShellProps {
    children: React.ReactNode;
    variant?: 'header' | 'sidebar';
}

export function AppShell({ children, variant = 'header' }: AppShellProps) {
    const [isOpen, setIsOpen] = useState(() => (typeof window !== 'undefined' ? localStorage.getItem('sidebar') !== 'false' : true));

    const message = usePage<SharedData>().props.message;

    const notification = useLang('banner', 'notification');

    const { appearance } = useAppearance();

    useEffect(() => {
        if (message.message) {
            if (message.type === 'success') {
                toast.success(notification.toUpperCase(), {
                    description: <div dangerouslySetInnerHTML={{ __html: message.message }} />,
                });
            }
            if (message.type === 'info') {
                toast.info(notification.toUpperCase(), {
                    description: <div dangerouslySetInnerHTML={{ __html: message.message }} />,
                });
            }
            if (message.type === 'warning') {
                toast.warning(notification.toUpperCase(), {
                    description: <div dangerouslySetInnerHTML={{ __html: message.message }} />,
                });
            }
            if (message.type === 'destructive') {
                toast.error(notification.toUpperCase(), {
                    description: <div dangerouslySetInnerHTML={{ __html: message.message }} />,
                });
            }
        }
    }, [message, notification]);

    const handleSidebarChange = (open: boolean) => {
        setIsOpen(open);

        if (typeof window !== 'undefined') {
            localStorage.setItem('sidebar', String(open));
        }
    };

    if (variant === 'header') {
        return <div className="container mx-auto flex min-h-[100dvh] flex-col">{children}</div>;
    }

    return (
        <SidebarProvider defaultOpen={isOpen} open={isOpen} onOpenChange={handleSidebarChange}>
            {children}
            <Toaster position="top-right" expand={false} richColors theme={appearance} />
        </SidebarProvider>
    );
}
