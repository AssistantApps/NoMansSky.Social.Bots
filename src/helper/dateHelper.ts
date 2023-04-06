import dayjs from 'dayjs';

export const formatDate = (date: Date, format: string = 'YYYY/MM/DD'): string => {
    try {
        return dayjs(date).format(format);
    }
    catch {
        return '';
    }
}

export const timeAgo = (date: Date): string => {
    const relativeTime = require('dayjs/plugin/relativeTime');
    dayjs.extend(relativeTime);

    try {
        return (dayjs(date) as any).from(new Date());
    }
    catch {
        return '';
    }
}