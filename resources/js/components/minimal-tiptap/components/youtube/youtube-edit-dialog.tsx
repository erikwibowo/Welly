import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import type { toggleVariants } from '@/components/ui/toggle';
import type { Editor } from '@tiptap/react';
import type { VariantProps } from 'class-variance-authority';
import { VideoIcon } from 'lucide-react';
import { useState } from 'react';
import { ToolbarButton } from '../toolbar-button';
import { YoutubeEditBlock } from './youtube-edit-block';

interface YoutubeEditDialogrops extends VariantProps<typeof toggleVariants> {
    editor: Editor;
}

const YoutubeEditDialog = ({ editor, size, variant }: YoutubeEditDialogrops) => {
    const [open, setOpen] = useState(false);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <ToolbarButton isActive={editor.isActive('youtube')} tooltip="Youtube Video" aria-label="Youtube Video" size={size} variant={variant}>
                    <VideoIcon className="icon" />
                </ToolbarButton>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg gap-0">
                <DialogHeader className="mb-0">
                    <DialogTitle>Insert Youtube Video</DialogTitle>
                    <DialogDescription className="sr-only">
                        Insert a Youtube video by providing the link to the video. The video will be embedded in the editor.
                    </DialogDescription>
                </DialogHeader>
                <YoutubeEditBlock editor={editor} close={() => setOpen(false)} />
            </DialogContent>
        </Dialog>
    );
};

export { YoutubeEditDialog };
