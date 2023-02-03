export interface MastodonMessageEventData {
    id: string;
    type: string;
    created_at: Date;
    account: Account;
    status: Status;
}

export interface Account {
    id: string;
    username: string;
    acct: string;
    display_name: string;
    locked: boolean;
    bot: boolean;
    discoverable: boolean;
    group: boolean;
    created_at: Date;
    note: string;
    url: string;
    avatar: string;
    avatar_static: string;
    header: string;
    header_static: string;
    followers_count: number;
    following_count: number;
    statuses_count: number;
    last_status_at: Date;
    noindex: boolean;
    emojis: any[];
    fields: any[];
}

export interface Status {
    id: string;
    created_at: Date;
    in_reply_to_id: null;
    in_reply_to_account_id: null;
    sensitive: boolean;
    spoiler_text: string;
    visibility: 'public' | 'unlisted' | 'private' | 'direct';
    language: string;
    uri: string;
    url: string;
    replies_count: number;
    reblogs_count: number;
    favourites_count: number;
    edited_at: null;
    favourited: boolean;
    reblogged: boolean;
    muted: boolean;
    bookmarked: boolean;
    content: string;
    filtered: any[];
    reblog: null;
    application: any[];
    account: any[];
    media_attachments: any[];
    mentions: any[];
    tags: any[];
    emojis: any[];
    card: null;
    poll: null;
}
