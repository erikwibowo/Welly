import { useLang } from '@/hooks/use-lang';
import { numberFormat } from '@/utils/formatter';
import { Link } from '@inertiajs/react';
import { ChevronsLeft, ChevronsRight } from 'lucide-react';
import { Button } from './ui/button';

export default function Pagination<T>({ data }: { data: App.Paginate<T> }) {
    const fromText = useLang('text', 'from');
    return (
        data.data.length > 0 && (
            <div className="flex w-full flex-wrap items-center justify-between gap-4 px-4 text-sm">
                <p>
                    {numberFormat(data.from)} - {numberFormat(data.to)} {fromText} {numberFormat(data.total)}
                </p>
                <div className="hidden items-center gap-1 md:flex">
                    {data.links.map((link, index) => (
                        <Link key={index} href={link.url}>
                            <Button
                                dangerouslySetInnerHTML={{
                                    __html: isNaN(Number(link.label)) ? link.label : numberFormat(Number(link.label)),
                                }}
                                variant={link.active ? 'default' : 'outline'}
                                size="sm"
                            />
                        </Link>
                    ))}
                </div>
                <div className="flex items-center gap-1 md:hidden">
                    <Link href={data.prev_page_url}>
                        <Button variant="outline" size="sm">
                            <ChevronsLeft className="icon" />
                        </Button>
                    </Link>
                    <Button size="sm">{numberFormat(data.current_page)}</Button>
                    <Link href={data.next_page_url}>
                        <Button variant="outline" size="sm">
                            <ChevronsRight className="icon" />
                        </Button>
                    </Link>
                </div>
            </div>
        )
    );
}
