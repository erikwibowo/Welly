import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useAppearance } from '@/hooks/use-appearance';
import { useLang } from '@/hooks/use-lang';
import { Monitor, Moon, Sun } from 'lucide-react';
import { HTMLAttributes } from 'react';

export default function AppearanceToggleDropdown({ className = '', ...props }: HTMLAttributes<HTMLDivElement>) {
    const { appearance, updateAppearance } = useAppearance();

    const getCurrentIcon = () => {
        switch (appearance) {
            case 'dark':
                return <Moon className="icon" />;
            case 'light':
                return <Sun className="icon" />;
            default:
                return <Monitor className="icon" />;
        }
    };

    return (
        <div className={className} {...props}>
            <DropdownMenu modal={false}>
                <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="icon" className="h-9 w-9 rounded-md">
                        {getCurrentIcon()}
                        <span className="sr-only">Toggle theme</span>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuItem
                        onClick={() => {
                            updateAppearance('light');
                        }}
                    >
                        <span className="flex items-center gap-2">
                            <Sun className="icon" />
                            {useLang('text', 'light')}
                        </span>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                        onClick={() => {
                            updateAppearance('dark');
                        }}
                    >
                        <span className="flex items-center gap-2">
                            <Moon className="icon" />
                            {useLang('text', 'dark')}
                        </span>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                        onClick={() => {
                            updateAppearance('system');
                        }}
                    >
                        <span className="flex items-center gap-2">
                            <Monitor className="icon" />
                            {useLang('text', 'system')}
                        </span>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
}
