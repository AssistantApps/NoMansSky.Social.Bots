export interface MastodonMakeToot {
    status: string;
    mediaIds?: Array<string>;
    poll?: MastodonMakeTootPoll;
    inReplyToId?: string;
    sensitive?: boolean;
    spoilerText?: string;
    visibility?: 'public' | 'unlisted' | 'private' | 'direct';
    language?: string;
    scheduledAt?: string; //2020-07-10 15:00:00.000
}

export interface MastodonMakeTootPoll {
    options: Array<string>;
    expiresIn: number; //Duration in seconds
    multiple?: boolean;
    hideTotals?: boolean;
}