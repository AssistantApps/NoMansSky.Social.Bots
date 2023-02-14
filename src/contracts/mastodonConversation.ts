import { Emoji, MastodonAccount } from "./mastodonAccount";

export interface MastodonConversation {
    id: string;
    unread: boolean;
    accounts: Array<MastodonAccount>;
    last_status: LastStatus;
}

export interface LastStatus {
    id: string;
    created_at: Date;
    in_reply_to_id: null | string;
    in_reply_to_account_id: null | string;
    sensitive: boolean;
    spoiler_text: string;
    visibility: string;
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
    application?: Application;
    account: MastodonAccount;
    media_attachments: any[];
    mentions: Mention[];
    tags: any[];
    emojis: Emoji[];
    card: null;
    poll: null;
}

export interface Application {
    name: string;
    website: null | string;
}

export interface Mention {
    id: string;
    username: string;
    url: string;
    acct: string;
}
