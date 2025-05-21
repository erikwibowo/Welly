import type { toggleVariants } from '@/components/ui/toggle';
import type { Editor } from '@tiptap/react';
import type { VariantProps } from 'class-variance-authority';
import {
    ALargeSmallIcon,
    AlignCenterIcon,
    AlignJustifyIcon,
    AlignLeftIcon,
    AlignRightIcon,
    BoldIcon,
    CodeIcon,
    EllipsisIcon,
    ItalicIcon,
    StrikethroughIcon,
    UnderlineIcon,
} from 'lucide-react';
import * as React from 'react';
import type { FormatAction } from '../../types';
import { ToolbarSection } from '../toolbar-section';

type TextStyleAction =
    | 'bold'
    | 'italic'
    | 'underline'
    | 'strikethrough'
    | 'alignleft'
    | 'aligncenter'
    | 'alignright'
    | 'alignjustify'
    | 'code'
    | 'clearFormatting';

interface TextStyle extends FormatAction {
    value: TextStyleAction;
}

const formatActions: TextStyle[] = [
    {
        value: 'bold',
        label: 'Bold',
        icon: <BoldIcon className="icon" />,
        action: (editor) => editor.chain().focus().toggleBold().run(),
        isActive: (editor) => editor.isActive('bold'),
        canExecute: (editor) => editor.can().chain().focus().toggleBold().run() && !editor.isActive('codeBlock'),
        shortcuts: ['mod', 'B'],
    },
    {
        value: 'italic',
        label: 'Italic',
        icon: <ItalicIcon className="icon" />,
        action: (editor) => editor.chain().focus().toggleItalic().run(),
        isActive: (editor) => editor.isActive('italic'),
        canExecute: (editor) => editor.can().chain().focus().toggleItalic().run() && !editor.isActive('codeBlock'),
        shortcuts: ['mod', 'I'],
    },
    {
        value: 'underline',
        label: 'Underline',
        icon: <UnderlineIcon className="icon" />,
        action: (editor) => editor.chain().focus().toggleUnderline().run(),
        isActive: (editor) => editor.isActive('underline'),
        canExecute: (editor) => editor.can().chain().focus().toggleUnderline().run() && !editor.isActive('codeBlock'),
        shortcuts: ['mod', 'U'],
    },
    {
        value: 'alignleft',
        label: 'Align Left',
        icon: <AlignLeftIcon className="icon" />,
        action: (editor) => editor.chain().focus().setTextAlign('left').run(),
        isActive: (editor) => editor.isActive({ textAlign: 'left' }),
        canExecute: (editor) => editor.can().chain().focus().toggleTextAlign('left').run() && !editor.isActive('codeBlock'),
        shortcuts: ['mod', 'shift', 'L'],
    },
    {
        value: 'aligncenter',
        label: 'Align Center',
        icon: <AlignCenterIcon className="icon" />,
        action: (editor) => editor.chain().focus().setTextAlign('center').run(),
        isActive: (editor) => editor.isActive({ textAlign: 'center' }),
        canExecute: (editor) => editor.can().chain().focus().toggleTextAlign('center').run() && !editor.isActive('codeBlock'),
        shortcuts: ['mod', 'shift', 'C'],
    },
    {
        value: 'alignright',
        label: 'Align Right',
        icon: <AlignRightIcon className="icon" />,
        action: (editor) => editor.chain().focus().setTextAlign('right').run(),
        isActive: (editor) => editor.isActive({ textAlign: 'right' }),
        canExecute: (editor) => editor.can().chain().focus().toggleTextAlign('right').run() && !editor.isActive('codeBlock'),
        shortcuts: ['mod', 'shift', 'R'],
    },
    {
        value: 'alignjustify',
        label: 'Align Justify',
        icon: <AlignJustifyIcon className="icon" />,
        action: (editor) => editor.chain().focus().setTextAlign('justify').run(),
        isActive: (editor) => editor.isActive({ textAlign: 'justify' }),
        canExecute: (editor) => editor.can().chain().focus().toggleTextAlign('justify').run() && !editor.isActive('codeBlock'),
        shortcuts: ['mod', 'shift', 'J'],
    },
    {
        value: 'strikethrough',
        label: 'Strikethrough',
        icon: <StrikethroughIcon className="icon" />,
        action: (editor) => editor.chain().focus().toggleStrike().run(),
        isActive: (editor) => editor.isActive('strike'),
        canExecute: (editor) => editor.can().chain().focus().toggleStrike().run() && !editor.isActive('codeBlock'),
        shortcuts: ['mod', 'shift', 'S'],
    },
    {
        value: 'code',
        label: 'Code',
        icon: <CodeIcon className="icon" />,
        action: (editor) => editor.chain().focus().toggleCode().run(),
        isActive: (editor) => editor.isActive('code'),
        canExecute: (editor) => editor.can().chain().focus().toggleCode().run() && !editor.isActive('codeBlock'),
        shortcuts: ['mod', 'E'],
    },
    {
        value: 'clearFormatting',
        label: 'Clear formatting',
        icon: <ALargeSmallIcon className="icon" />,
        action: (editor) => editor.chain().focus().unsetAllMarks().run(),
        isActive: () => false,
        canExecute: (editor) => editor.can().chain().focus().unsetAllMarks().run() && !editor.isActive('codeBlock'),
        shortcuts: ['mod', '\\'],
    },
];

interface SectionTwoProps extends VariantProps<typeof toggleVariants> {
    editor: Editor;
    activeActions?: TextStyleAction[];
    mainActionCount?: number;
}

export const SectionTwo: React.FC<SectionTwoProps> = ({
    editor,
    activeActions = formatActions.map((action) => action.value),
    mainActionCount = 2,
    size,
    variant,
}) => {
    return (
        <ToolbarSection
            editor={editor}
            actions={formatActions}
            activeActions={activeActions}
            mainActionCount={mainActionCount}
            dropdownIcon={<EllipsisIcon className="icon" />}
            dropdownTooltip="More formatting"
            dropdownClassName="w-8"
            size={size}
            variant={variant}
        />
    );
};

SectionTwo.displayName = 'SectionTwo';

export default SectionTwo;
