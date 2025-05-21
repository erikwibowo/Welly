import { DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { UserInfo } from '@/components/user-info';
import { useLang } from '@/hooks/use-lang';
import { useMobileNavigation } from '@/hooks/use-mobile-navigation';
import { usePermission } from '@/hooks/use-permission';
import { Link, useForm } from '@inertiajs/react';
import { Loader2, LogOut, Settings, UserIcon } from 'lucide-react';
import { FormEventHandler, useState } from 'react';
import ResponsiveDialog from './responsive-dialog';
import { Button } from './ui/button';

interface UserMenuContentProps {
    user: App.Models.User;
}

export function UserMenuContent({ user }: UserMenuContentProps) {
    const cleanup = useMobileNavigation();
    const [open, setOpen] = useState(false);

    const { post, processing } = useForm();

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('logout'), {
            onSuccess: () => {
                setOpen(false);
            },
        });
    };

    const settingText = useLang('text', 'setting');

    return (
        <>
            <DropdownMenuLabel className="p-0 font-normal">
                <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                    <UserInfo user={user} showEmail={true} />
                </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
                <DropdownMenuItem asChild>
                    <Link className="block w-full" href={route('profile.edit')} as="button" prefetch onClick={cleanup}>
                        <UserIcon className="icon mr-2" />
                        {useLang('text', 'profile')}
                    </Link>
                </DropdownMenuItem>
                {usePermission(['setting read']) && (
                    <DropdownMenuItem asChild>
                        <Link className="block w-full" href={route('setting.index')} as="button" prefetch onClick={cleanup}>
                            <Settings className="icon mr-2" />
                            {settingText}
                        </Link>
                    </DropdownMenuItem>
                )}
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <ResponsiveDialog
                open={open}
                onOpenChange={setOpen}
                title={useLang('text', 'logout_confirmation')}
                trigger={
                    <DropdownMenuItem
                        onSelect={(e) => e.preventDefault()}
                        className="!text-destructive hover:!bg-destructive/20 hover:!text-destructive"
                    >
                        <LogOut className="icon-destructive" /> {useLang('button', 'logout')}
                    </DropdownMenuItem>
                }
                submit={submit}
                footer={
                    <>
                        <Button size="lg" onClick={() => setOpen(false)} type="button" variant="outline">
                            {useLang('button', 'cancel')}
                        </Button>
                        <Button size="lg" onClick={submit} disabled={processing} type="submit" variant="destructive">
                            {processing ? <Loader2 className="size-4 animate-spin" /> : <LogOut className="icon !fill-background/30" />}
                            {useLang('button', 'logout')}
                        </Button>
                    </>
                }
            >
                <p className="text-sm">{useLang('text', 'logout_description')}</p>
            </ResponsiveDialog>
        </>
    );
}
