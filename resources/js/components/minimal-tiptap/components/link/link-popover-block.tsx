import { Separator } from '@/components/ui/separator';
import { CopyIcon, ExternalLinkIcon, Link2OffIcon } from 'lucide-react';
import * as React from 'react';
import { ToolbarButton } from '../toolbar-button';

interface LinkPopoverBlockProps {
    url: string;
    onClear: () => void;
    onEdit: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

export const LinkPopoverBlock: React.FC<LinkPopoverBlockProps> = ({ url, onClear, onEdit }) => {
    const [copyTitle, setCopyTitle] = React.useState<string>('Copy');

    const handleCopy = React.useCallback(
        (e: React.MouseEvent<HTMLButtonElement>) => {
            e.preventDefault();
            navigator.clipboard
                .writeText(url)
                .then(() => {
                    setCopyTitle('Copied!');
                    setTimeout(() => setCopyTitle('Copy'), 1000);
                })
                .catch(console.error);
        },
        [url],
    );

    const handleOpenLink = React.useCallback(() => {
        window.open(url, '_blank', 'noopener,noreferrer');
    }, [url]);

    return (
        <div className="bg-background flex h-10 overflow-hidden rounded p-2 shadow-lg">
            <div className="inline-flex items-center gap-1">
                <ToolbarButton tooltip="Edit link" onClick={onEdit} className="w-auto px-2">
                    Edit link
                </ToolbarButton>
                <Separator orientation="vertical" className="mx-2" />
                <ToolbarButton tooltip="Open link in a new tab" onClick={handleOpenLink}>
                    <ExternalLinkIcon className="icon" />
                </ToolbarButton>
                <Separator orientation="vertical" className="mx-2" />
                <ToolbarButton tooltip="Clear link" onClick={onClear}>
                    <Link2OffIcon className="icon" />
                </ToolbarButton>
                <Separator orientation="vertical" className="mx-2" />
                <ToolbarButton
                    tooltip={copyTitle}
                    onClick={handleCopy}
                    tooltipOptions={{
                        onPointerDownOutside: (e) => {
                            if (e.target === e.currentTarget) e.preventDefault();
                        },
                    }}
                >
                    <CopyIcon className="icon" />
                </ToolbarButton>
            </div>
        </div>
    );
};
