import './styles/index.css';

import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import type { Content, Editor } from '@tiptap/react';
import { EditorContent } from '@tiptap/react';
import { LinkBubbleMenu } from './components/bubble-menu/link-bubble-menu';
import { MeasuredContainer } from './components/measured-container';
import { SectionFive } from './components/section/five';
import { SectionFour } from './components/section/four';
import SectionHighlight from './components/section/highlight';
import { SectionOne } from './components/section/one';
import { SectionThree } from './components/section/three';
import { SectionTwo } from './components/section/two';
import type { UseMinimalTiptapEditorProps } from './hooks/use-minimal-tiptap';
import { useMinimalTiptapEditor } from './hooks/use-minimal-tiptap';

export interface MinimalTiptapProps extends Omit<UseMinimalTiptapEditorProps, 'onUpdate'> {
    value?: Content;
    onChange?: (value: Content) => void;
    className?: string;
    editorContentClassName?: string;
}

const Toolbar = ({ editor }: { editor: Editor }) => (
    <div className="bg-background/60 sticky top-0 z-50 border-b p-1 backdrop-blur">
        <div className="flex items-center gap-1 overflow-x-auto p-1">
            <SectionOne editor={editor} activeLevels={[1, 2, 3, 4, 5, 6]} />

            <Separator orientation="vertical" className="mx-2" />

            <SectionTwo
                editor={editor}
                activeActions={[
                    'bold',
                    'italic',
                    'underline',
                    'strikethrough',
                    'alignleft',
                    'aligncenter',
                    'alignright',
                    'alignjustify',
                    'code',
                    'clearFormatting',
                ]}
                mainActionCount={8}
            />

            <Separator orientation="vertical" className="mx-2" />

            <SectionThree editor={editor} />
            <SectionHighlight editor={editor} />

            <Separator orientation="vertical" className="mx-2" />

            <SectionFour editor={editor} activeActions={['orderedList', 'bulletList']} mainActionCount={0} />

            <Separator orientation="vertical" className="mx-2" />

            <SectionFive editor={editor} activeActions={['codeBlock', 'blockquote', 'horizontalRule']} mainActionCount={0} />
        </div>
    </div>
);

export const MinimalTiptapEditor = ({ value, onChange, className, editorContentClassName, ...props }: MinimalTiptapProps) => {
    const editor = useMinimalTiptapEditor({
        value,
        onUpdate: onChange,
        ...props,
    });

    if (!editor) {
        return null;
    }

    return (
        <MeasuredContainer
            as="div"
            name="editor"
            className={cn(
                'border-input focus-within:border-ring focus-within:ring-ring/50 min-data-[orientation=vertical]:h-72 flex h-auto w-full flex-col overflow-hidden rounded-md border shadow-xs focus-within:ring-[3px]',
                className,
            )}
        >
            <Toolbar editor={editor} />
            <EditorContent editor={editor} className={cn('minimal-tiptap-editor', editorContentClassName)} />
            <LinkBubbleMenu editor={editor} />
        </MeasuredContainer>
    );
};

MinimalTiptapEditor.displayName = 'MinimalTiptapEditor';

export default MinimalTiptapEditor;
