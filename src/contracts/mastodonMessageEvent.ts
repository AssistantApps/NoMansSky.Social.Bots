import { Emoji, MastodonAccount } from "./mastodonAccount";

export interface MastodonMessageEventData {
    id: string;
    type: string;
    created_at: Date;
    account: MastodonAccount;
    status: Status;
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
    emojis: Emoji[];
    card: null;
    poll: null;
}
