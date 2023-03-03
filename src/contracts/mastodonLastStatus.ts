import { MastodonAccount, MastodonEmoji } from "./mastodonAccount";


export interface MastodonLastStatus {
    id: string;
    created_at: Date;
    in_reply_to_id?: null | string;
    in_reply_to_account_id?: null | string;
    sensitive: boolean;
    spoiler_text: string;
    visibility: string;
    language?: string | null;
    uri: string;
    url?: string | null;
    replies_count: number;
    reblogs_count: number;
    favourites_count: number;
    // edited_at: null;
    favourited: boolean;
    reblogged: boolean;
    muted: boolean;
    bookmarked: boolean;
    content: string;
    // filtered: any[];
    // reblog: null;
    application?: MastodonApplication;
    account: MastodonAccount;
    media_attachments: any[];
    mentions: Array<MastodonMention>;
    tags: any[];
    emojis: Array<MastodonEmoji>;
    // card: null;
    // poll: null;
}

export interface MastodonApplication {
    name: string;
    website?: null | string;
}

export interface MastodonMention {
    id: string;
    username: string;
    url: string;
    acct: string;
}
