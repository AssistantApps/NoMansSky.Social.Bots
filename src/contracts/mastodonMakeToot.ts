export interface MastodonMakeToot {
    status: string;
    media_ids?: Array<string>;
    poll?: Array<MastodonMakeTootPoll>;
    in_reply_to_id?: string;
    sensitive?: boolean;
    spoiler_text?: string;
    visibility?: 'public' | 'unlisted' | 'private' | 'direct';
    language?: string;
    scheduled_at?: string; //2020-07-10 15:00:00.000
}

export interface MastodonMakeTootPoll {
    options: Array<MastodonMakeTootPollOption>;
    expires_in: number; //Duration in seconds
    multiple: boolean;
    hide_totals: boolean;
}
export interface MastodonMakeTootPollOption {
    title: string;
}