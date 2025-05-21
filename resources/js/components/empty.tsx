import { useLang } from '@/hooks/use-lang';
import Robot from '@/illustrations/robot';

export default function Empty({ show }: { show: boolean }) {
    const notFoundText = useLang('text', 'data_not_found');
    return (
        show && (
            <div className="flex w-full flex-col items-center justify-center space-y-4 p-8">
                <Robot className="h-auto w-60 opacity-60" />
                <p className="text-muted-foreground text-lg">{notFoundText}</p>
            </div>
        )
    );
}
