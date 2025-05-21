import { useLang } from '@/hooks/use-lang';
import { Heart } from 'lucide-react';

export function Footer() {
    return (
        <footer className="sticky top-[100dvh] border-t text-sm">
            <div className="container mx-auto flex flex-wrap items-center justify-between px-4 py-2">
                <p>
                    <b className="text-primary">Laravel Streact</b>. {useLang('text', 'made_with')}{' '}
                    <Heart className="inline-block h-4 w-4 fill-rose-600 text-red-500 dark:fill-rose-400" /> {useLang('text', 'by')}{' '}
                    <a
                        target="_blank"
                        rel="noreferrer noopener"
                        className="font-semibold text-green-600 hover:underline dark:text-green-400"
                        href="https://erikwibowo.com"
                    >
                        Erik Wibowo
                    </a>
                </p>
                <p>
                    &copy; 2020 - {new Date().getFullYear()} {useLang('text', 'all_rights_reserved')}
                </p>
            </div>
        </footer>
    );
}
