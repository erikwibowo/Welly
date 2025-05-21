import Heading from '@/components/heading';
import { useLang } from '@/hooks/use-lang';
import { Link } from '@inertiajs/react';
import { Key, Trash, User } from 'lucide-react';
import { type PropsWithChildren } from 'react';

export default function SettingsLayout({ children }: PropsWithChildren) {
    // When server-side rendering, we only render the layout on the client...

    const profileGroup = useLang('text', 'profile');
    const passwordGroup = useLang('text', 'password');
    const deleteGroup = useLang('text', 'delete');
    const profileDescription = useLang('text', 'profile_description');

    if (typeof window === 'undefined') {
        return null;
    }

    const currentPath = window.location.pathname;

    const groups = [
        { group: profileGroup, value: 'profile', href: '/profiles/profile', icon: User },
        { group: passwordGroup, value: 'password', href: '/profiles/password', icon: Key },
        { group: deleteGroup, value: 'delete', href: '/profiles/delete', icon: Trash },
    ];

    return (
        <div className="">
            <Heading title={profileGroup} description={profileDescription} />
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
