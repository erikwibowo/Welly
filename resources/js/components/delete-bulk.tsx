import { useLang } from '@/hooks/use-lang';
import { usePermission } from '@/hooks/use-permission';
import { useForm } from '@inertiajs/react';
import { Loader2, TrashIcon } from 'lucide-react';
import { FormEventHandler, useState } from 'react';
import ResponsiveDialog from './responsive-dialog';
import { Button } from './ui/button';
import { DropdownMenuItem } from './ui/dropdown-menu';

export default function DeleteBulk({
    title,
    routes,
    permissions,
    id,
    onDeleteSuccess,
}: {
    title: string;
    routes: string;
    permissions: string[];
    id: Array<number>;
    onDeleteSuccess: () => void;
}) {
    const [open, setOpen] = useState(false);

    const { post, processing } = useForm({
        id: id,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route(routes), {
            onSuccess: () => {
                setOpen(false);
                onDeleteSuccess();
            },
        });
    };

    const deleteText = useLang('text', 'delete');
    const deleteSomeText = useLang('text', 'delete_some');

    return (
        <ResponsiveDialog
            open={open}
            onOpenChange={setOpen}
            title={deleteSomeText + ' ' + title}
            trigger={
                usePermission(permissions) && (
                    <DropdownMenuItem
                        onSelect={(e) => e.preventDefault()}
                        className="!text-destructive hover:!bg-destructive/20 hover:!text-destructive"
                    >
                        <TrashIcon className="icon-destructive" /> {deleteText}
                    </DropdownMenuItem>
                )
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
                <b>
                    {deleteText} {id.length} data
                </b>
                <br />
                {useLang('text', 'delete_confirmation')}
            </p>
        </ResponsiveDialog>
    );
}
