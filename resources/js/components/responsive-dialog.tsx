import { useIsMobile } from '@/hooks/use-mobile';
import React, { FormEventHandler, PropsWithChildren } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Drawer, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from './ui/drawer';

export default function ResponsiveDialog({
    open,
    onOpenChange,
    onClose,
    title,
    description,
    trigger,
    submit,
    children,
    footer,
    className,
}: PropsWithChildren<{
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onClose?: () => void;
    title: string;
    description?: React.ReactNode;
    trigger: React.ReactNode;
    submit: FormEventHandler;
    footer: React.ReactNode;
    className?: string;
}>) {
    const isMobile = useIsMobile();

    const handleClose = () => {
        onOpenChange(!open);
        if (onClose) {
            onClose();
        }
    };

    if (!isMobile) {
        return (
            <Dialog
                open={open}
                onOpenChange={() => {
                    handleClose();
                    setTimeout(() => (document.body.style.pointerEvents = ''), 100);
                }}
            >
                <DialogTrigger asChild>{trigger}</DialogTrigger>
                <DialogContent
                    onFocus={(e: React.FocusEvent) => e.preventDefault()}
                    className={'max-h-[96dvh] overflow-y-auto' + (className ? ' ' + className : ' max-w-md')}
                    onInteractOutside={(e) => {
                        e.preventDefault();
                    }}
                >
                    <form onSubmit={submit} className="space-y-4">
                        <DialogHeader>
                            <DialogTitle className="capitalize">{title}</DialogTitle>
                            <DialogDescription>{description}</DialogDescription>
                        </DialogHeader>
                        {children}
                        <DialogFooter>{footer}</DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        );
    }

    return (
        <Drawer
            repositionInputs={false}
            open={open}
            autoFocus={false}
            onOpenChange={() => {
                handleClose();
                setTimeout(() => (document.body.style.pointerEvents = ''), 100);
            }}
        >
            <DrawerTrigger asChild>{trigger}</DrawerTrigger>
            <DrawerContent
                onFocus={(e: React.FocusEvent) => e.preventDefault()}
                className="max-h-[96dvh]"
                onInteractOutside={(e: { preventDefault: () => void }) => {
                    e.preventDefault();
                }}
            >
                <form onSubmit={submit} className="space-y-4 overflow-y-auto">
                    <DrawerHeader className="text-left">
                        <DrawerTitle>{title}</DrawerTitle>
                        <DrawerDescription>{description}</DrawerDescription>
                    </DrawerHeader>
                    <div className="px-4">{children}</div>
                    <DrawerFooter className="mb-4">{footer}</DrawerFooter>
                </form>
            </DrawerContent>
        </Drawer>
    );
}
