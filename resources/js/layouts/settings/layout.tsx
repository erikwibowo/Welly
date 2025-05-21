import Heading from '@/components/heading';
import { useLang } from '@/hooks/use-lang';
import { Link } from '@inertiajs/react';
import { Contact, Image, Info, Palette, Search } from 'lucide-react';
import { type PropsWithChildren } from 'react';

export default function SettingsLayout({ children }: PropsWithChildren) {
    // When server-side rendering, we only render the layout on the client...
    const generalTab = useLang('text', 'general');
    const seoTab = useLang('text', 'seo');
    const imageTab = useLang('text', 'image');
    const contactTab = useLang('text', 'contact');
    const appearanceTab = useLang('text', 'appearance');
    const settingText = useLang('text', 'setting');
    const settingDescription = useLang('text', 'setting_description');

    if (typeof window === 'undefined') {
        return null;
    }

    const currentPath = window.location.pathname;

    const groups = [
        { group: generalTab, href: '/settings/general', icon: Info },
        { group: seoTab, href: '/settings/seo', icon: Search },
        { group: imageTab, href: '/settings/image', icon: Image },
        { group: contactTab, href: '/settings/contact', icon: Contact },
        { group: appearanceTab, href: '/settings/appearance', icon: Palette },
    ];

    return (
        <div className="">
            <Heading title={settingText} description={settingDescription} />
            <div className="border-b text-sm">
                <ul className="flex flex-wrap">
                    {groups?.map((tab, index) => {
                        return (
                            <li key={index}>
                                <Link
                                    href={tab.href}
                                    prefetch
                                    className={`flex items-center gap-2 border-b-2 p-2 text-left capitalize ${
                                        currentPath === tab.href
                                            ? 'border-primary text-primary font-semibold'
                                            : 'text-muted-foreground hover:border-primary/50 border-transparent'
                                    }`}
                                >
                                    <tab.icon className="icon" />
                                    {tab.group}
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            </div>
            <div className="py-4 md:max-w-2xl">
                <section className="max-w-xl space-y-12">{children}</section>
            </div>
        </div>
    );
}
