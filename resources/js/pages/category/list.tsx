import Delete from '@/components/delete';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuLabel, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useLang } from '@/hooks/use-lang';
import { cn } from '@/lib/utils';
import { SharedData } from '@/types';
import { usePage } from '@inertiajs/react';
import { Separator } from '@radix-ui/react-dropdown-menu';
import { EllipsisIcon, Tags } from 'lucide-react';
import Edit from './edit';

export default function List({ title, className, categories }: { title?: string; className?: string; categories: App.Models.Category[] }) {
    const actionColumnLang = useLang('column', 'action');
    const { auth } = usePage<SharedData>().props;
    return categories?.map((category, index) => (
        <div className={cn('m-0 border-b px-4 py-1.5 last:border-none', className)} key={index}>
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div
                        className={cn(
                            'flex size-10 items-center justify-center rounded-full',
                            category.type === 'income'
                                ? 'bg-success/10 text-success'
                                : category.type === 'expense'
                                  ? 'bg-destructive/10 text-destructive'
                                  : 'bg-info/10 text-info',
                        )}
                    >
                        <Tags className="size-6" />
                    </div>
                    <div className="flex flex-col">
                        <h4 className="line-clamp-1 font-medium">{category.name}</h4>
                        <p className="text-muted-foreground text-sm">{category.type_view}</p>
                    </div>
                </div>
                <div className="flex flex-col items-end">
                    <DropdownMenu modal={false}>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                                <EllipsisIcon className="icon" />
                                <span className="sr-only">{actionColumnLang}</span>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>
                                <p className="max-w-40 truncate font-semibold">{category.name}</p>
                            </DropdownMenuLabel>
                            {auth.user.id == category.user_id && (
                                <>
                                    <Separator className="my-1" />
                                    <Edit title={title ?? '-'} category={category} />
                                    <Delete
                                        title={title ?? '-'}
                                        permissions={['category delete']}
                                        routes="category.destroy"
                                        description={category.name}
                                        id={category.id}
                                    />
                                </>
                            )}
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
        </div>
    ));
}
