import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { Editor } from '@tiptap/react';
import * as React from 'react';

interface YoutubeEditBlockProps {
    editor: Editor;
    close: () => void;
}

export const YoutubeEditBlock: React.FC<YoutubeEditBlockProps> = ({ editor, close }) => {
    const [link, setLink] = React.useState('');

    const handleSubmit = React.useCallback(
        (e: React.FormEvent<HTMLFormElement>) => {
            e.preventDefault();
            e.stopPropagation();

            if (link) {
                editor.commands.setYoutubeVideo({
                    src: link,
                    height: 480,
                });
                close();
            }
        },
        [editor, link, close],
    );

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-1">
                <Label htmlFor="image-link">Youtube Link</Label>
                <div className="flex">
                    <Input
                        id="image-link"
                        type="url"
                        required
                        placeholder="https://youtube.com/watch?v=example"
                        value={link}
                        className="grow"
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setLink(e.target.value)}
                    />
                    <Button type="submit" className="ml-2">
                        Submit
                    </Button>
                </div>
            </div>
        </form>
    );
};

export default YoutubeEditBlock;
