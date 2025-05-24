export function numberFormat(value: number) {
    return Intl.NumberFormat('id-ID', {
        style: 'decimal',
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
    }).format(value);
}

export function dateFormat(value?: string) {
    if (value) {
        const date = new Date(value);
        return Intl.DateTimeFormat('id-ID', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        }).format(date);
    }
    return value;
}

export function shortDateFormat(value?: string) {
    if (value) {
        const date = new Date(value);
        return Intl.DateTimeFormat('id-ID', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
        }).format(date);
    }
    return value;
}
