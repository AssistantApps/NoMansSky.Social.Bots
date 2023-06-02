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
        const currentDateInUTC = convertDateToUTC(new Date());
        return (dayjs(date) as any).from(currentDateInUTC);
    }
    catch {
        return '';
    }
}

export const convertDateToUTC = (date: Date): Date => {
    const utc = new Date(date.getTime() + date.getTimezoneOffset() * 60000);
    return utc;
}