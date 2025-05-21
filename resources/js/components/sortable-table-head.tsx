import { ChevronsUpDown } from 'lucide-react';
import { PropsWithChildren } from 'react';
import { TableHead } from './ui/table';

export default function SortableTableHead({
    field,
    onSort,
    children,
}: PropsWithChildren<{
    field: string;
    onSort: (column: string) => void;
}>) {
    return (
        <TableHead className="cursor-pointer" onClick={() => onSort(field)}>
            <div className="flex w-full items-center justify-between gap-4">
                {children}
                <ChevronsUpDown className="icon opacity-20" />
            </div>
        </TableHead>
    );
}
