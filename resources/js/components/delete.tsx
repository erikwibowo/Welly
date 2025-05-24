import { useLang } from '@/hooks/use-lang';
import { usePermission } from '@/hooks/use-permission';
import { useForm } from '@inertiajs/react';
import { Loader2, TrashIcon } from 'lucide-react';
import { FormEventHandler, useState } from 'react';
import ResponsiveDialog from './responsive-dialog';
import { Button } from './ui/button';
import { DropdownMenuItem } from './ui/dropdown-menu';

export default function Delete({
    title,
    permissions,
    description,
    routes,
    id,
    type,
}: {
    title: string;
    permissions: string[];
    description: string;
    routes: string;
    id: number;
    type?: 'dropdown' | 'modal';
}) {
    const [open, setOpen] = useState(false);

    const { delete: destroy, processing } = useForm();

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        destroy(route(routes, id), {
            onSuccess: () => {
                setOpen(false);
            },
        });
    };

    const deleteText = useLang('text', 'delete');

    return (
        <ResponsiveDialog
            open={open}
            onOpenChange={setOpen}
            title={deleteText + ' ' + title}
            trigger={
                usePermission(permissions) &&
                (type === 'modal' ? (
                    <Button variant="ghost" className="!text-destructive hover:!text-destructive flex w-full items-center justify-start rounded-none">
                        <TrashIcon className="icon-destructive" /> {deleteText}
                    </Button>
                ) : (
                    <DropdownMenuItem
                        onSelect={(e) => e.preventDefault()}
                        className="!text-destructive hover:!bg-destructive/20 hover:!text-destructive"
                    >
                        <TrashIcon className="icon-destructive" /> {deleteText}
                    </DropdownMenuItem>
                ))
            }
            submit={submit}
            footer={
                <>
                    <Button size="lg" onClick={() => setOpen(false)} type="button" variant="outline">
                        {useLang('button', 'cancel')}
                    </Button>
                    <Button size="lg" onClick={submit} disabled={processing} type="submit" variant="destructive">
                        {processing ? <Loader2 className="size-4 animate-spin" /> : <TrashIcon className="icon fill-background/30" />}
                        {deleteText}
                    </Button>
                </>
            }
        >
            <p className="text-sm">
                <b>{description}</b>
                <br />
                {useLang('text', 'delete_confirmation')}
            </p>
        </ResponsiveDialog>
    );
}
