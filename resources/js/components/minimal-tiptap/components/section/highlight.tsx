import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import type { toggleVariants } from '@/components/ui/toggle';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import type { Editor } from '@tiptap/react';
import type { VariantProps } from 'class-variance-authority';
import { CheckIcon, ChevronDown, HighlighterIcon } from 'lucide-react';
import * as React from 'react';
import { useTheme } from '../../hooks/use-theme';
import { ToolbarButton } from '../toolbar-button';

interface ColorItem {
    cssVar: string;
    label: string;
    darkLabel?: string;
}

interface ColorPalette {
    label: string;
    colors: ColorItem[];
    inverse: string;
}

const COLORS: ColorPalette[] = [
    {
        label: 'Palette 1',
        inverse: 'hsl(var(--background))',
        colors: [
            { cssVar: 'hsl(var(--transparent))', label: 'Default' },
            { cssVar: 'var(--mt-accent-bold-blue)', label: 'Bold blue' },
            { cssVar: 'var(--mt-accent-bold-teal)', label: 'Bold teal' },
            { cssVar: 'var(--mt-accent-bold-green)', label: 'Bold green' },
            { cssVar: 'var(--mt-accent-bold-orange)', label: 'Bold orange' },
            { cssVar: 'var(--mt-accent-bold-red)', label: 'Bold red' },
            { cssVar: 'var(--mt-accent-bold-purple)', label: 'Bold purple' },
        ],
    },
    {
        label: 'Palette 2',
        inverse: 'hsl(var(--background))',
        colors: [
            { cssVar: 'var(--mt-accent-gray)', label: 'Gray' },
            { cssVar: 'var(--mt-accent-blue)', label: 'Blue' },
            { cssVar: 'var(--mt-accent-teal)', label: 'Teal' },
            { cssVar: 'var(--mt-accent-green)', label: 'Green' },
            { cssVar: 'var(--mt-accent-orange)', label: 'Orange' },
            { cssVar: 'var(--mt-accent-red)', label: 'Red' },
            { cssVar: 'var(--mt-accent-purple)', label: 'Purple' },
        ],
    },
    {
        label: 'Palette 3',
        inverse: 'hsl(var(--foreground))',
        colors: [
            { cssVar: 'hsl(var(--background))', label: 'White', darkLabel: 'Black' },
            { cssVar: 'var(--mt-accent-blue-subtler)', label: 'Blue subtle' },
            { cssVar: 'var(--mt-accent-teal-subtler)', label: 'Teal subtle' },
            { cssVar: 'var(--mt-accent-green-subtler)', label: 'Green subtle' },
            { cssVar: 'var(--mt-accent-yellow-subtler)', label: 'Yellow subtle' },
            { cssVar: 'var(--mt-accent-red-subtler)', label: 'Red subtle' },
            { cssVar: 'var(--mt-accent-purple-subtler)', label: 'Purple subtle' },
        ],
    },
];

const MemoizedHighlightButton = React.memo<{
    color: ColorItem;
    isSelected: boolean;
    inverse: string;
    onClick: (value: string) => void;
}>(({ color, isSelected, inverse, onClick }) => {
    const isDarkMode = useTheme();
    const label = isDarkMode && color.darkLabel ? color.darkLabel : color.label;

    return (
        <Tooltip>
            <TooltipTrigger asChild>
                <ToggleGroupItem
                    tabIndex={0}
                    className="relative size-7 rounded-md p-0"
                    value={color.cssVar}
                    aria-label={label}
                    style={{ backgroundColor: color.cssVar }}
                    onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                        e.preventDefault();
                        onClick(color.cssVar);
                    }}
                >
                    {isSelected && <CheckIcon className="absolute inset-0 m-auto size-6" style={{ color: inverse }} />}
                </ToggleGroupItem>
            </TooltipTrigger>
            <TooltipContent side="bottom">
                <p>{label}</p>
            </TooltipContent>
        </Tooltip>
    );
});

MemoizedHighlightButton.displayName = 'MemoizedHighlightButton';

const MemoizeHighlightColor = React.memo<{
    palette: ColorPalette;
    selectedColor: string;
    inverse: string;
    onColorChange: (value: string) => void;
}>(({ palette, selectedColor, inverse, onColorChange }) => (
    <ToggleGroup
        type="single"
        value={selectedColor}
        onValueChange={(value: string) => {
            if (value) onColorChange(value);
        }}
        className="gap-1.5"
    >
        {palette.colors.map((color, index) => (
            <MemoizedHighlightButton
                key={index}
                inverse={inverse}
                color={color}
                isSelected={selectedColor === color.cssVar}
                onClick={onColorChange}
            />
        ))}
    </ToggleGroup>
));

MemoizeHighlightColor.displayName = 'MemoizeHighlightColor';

interface SectionHighlightProps extends VariantProps<typeof toggleVariants> {
    editor: Editor;
}

export const SectionHighlight: React.FC<SectionHighlightProps> = ({ editor, size, variant }) => {
    const color = editor.getAttributes('textStyle')?.color || 'hsl(var(--transparent))';
    const [selectedColor, setSelectedColor] = React.useState(color);

    const handleColorChange = React.useCallback(
        (value: string) => {
            setSelectedColor(value);
            editor.chain().toggleHighlight({ color: value }).run();
        },
        [editor],
    );

    React.useEffect(() => {
        setSelectedColor(color);
    }, [color]);

    return (
        <Popover>
            <PopoverTrigger asChild>
                <ToolbarButton tooltip="Highlight color" aria-label="Highlight color" className="gap-0" size={size} variant={variant}>
                    <HighlighterIcon className="icon" />
                    <ChevronDown className="icon" />
                </ToolbarButton>
            </PopoverTrigger>
            <PopoverContent align="start" className="w-full">
                <div className="space-y-1.5">
                    {COLORS.map((palette, index) => (
                        <MemoizeHighlightColor
                            key={index}
                            palette={palette}
                            inverse={palette.inverse}
                            selectedColor={selectedColor}
                            onColorChange={handleColorChange}
                        />
                    ))}
                </div>
            </PopoverContent>
        </Popover>
    );
};

SectionHighlight.displayName = 'SectionHighlight';

export default SectionHighlight;
