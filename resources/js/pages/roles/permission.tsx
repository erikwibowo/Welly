import ResponsiveDialog from '@/components/responsive-dialog';
import { Button } from '@/components/ui/button';
import { useLang } from '@/hooks/use-lang';
import { PermissionGroup } from '@/types';
import { useState } from 'react';

export default function Permission({
    title,
    role,
    permissions,
    source = 'role',
}: {
    title: string;
    role: App.Models.Role;
    permissions?: PermissionGroup[];
    source?: string;
}) {
    const [open, setOpen] = useState(false);

    const groupedData: { group: string; data: { name: string }[] }[] = [];
    let currentGroup: string | null = null;

    role.permissions?.forEach((permission) => {
        const groupName = permission.name.split(' ')[0];
        const action = permission.name.split(' ')[1];

        if (currentGroup !== groupName) {
            currentGroup = groupName;
            groupedData.push({
                group: currentGroup || '',
                data: [{ name: action }],
            });
        } else {
            const groupIndex = groupedData.findIndex((group) => group.group === groupName);
            if (groupIndex !== -1) {
                groupedData[groupIndex].data.push({ name: action });
            }
        }
    });

    groupedData.forEach((group) => {
        group.data.sort((a, b) => a.name.localeCompare(b.name));
    });

    groupedData.sort((a, b) => a.group.localeCompare(b.group));

    const permissionText = useLang('text', 'permission');
    const allPermissionText = useLang('text', 'all_permission');
    const noPermissionText = useLang('text', 'no_permission');

    return (
        <ResponsiveDialog
            open={open}
            onOpenChange={setOpen}
            title={title}
            trigger={
                <Button size="xs" className="capitalize">
                    {source === 'role'
                        ? role.permissions?.length == 0
                            ? noPermissionText
                            : role.permissions?.length === permissions?.reduce((acc, group) => acc + group.data.length, 0)
                              ? allPermissionText
                              : role.permissions?.length + ' ' + permissionText
                        : role.name}
                </Button>
            }
            submit={() => {}}
            footer={
                <>
                    <Button size="lg" onClick={() => setOpen(false)} type="button" variant="outline">
                        {useLang('button', 'close')}
                    </Button>
                </>
            }
        >
            <div className="flex">
                <div className="space-y-4">
                    {groupedData?.map((group) => (
                        <div key={group.group}>
                            <p className="font-medium capitalize">{group.group}</p>
                            <ul className="flex gap-4">
                                {group.data.map((permission) => (
                                    <li key={permission.name}>
                                        {permission.name === 'delete' ? (
                                            <span className="text-destructive">{permission.name}</span>
                                        ) : (
                                            <span>{permission.name}</span>
                                        )}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </div>
        </ResponsiveDialog>
    );
}
