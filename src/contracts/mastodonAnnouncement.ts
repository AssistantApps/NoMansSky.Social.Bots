import { Emoji } from "./mastodonAccount";

export interface MastodonAnnouncement {
    id: string;
    content: string;
    starts_at: Date;
    ends_at: Date;
    all_day: boolean;
    published_at: Date;
    updated_at: Date;
    read: boolean;
    mentions: any[];
    statuses: any[];
    tags: any[];
    emojis: Emoji[];
    reactions: Reaction[];
}

export interface Reaction {
    name: string;
    count: number;
    me: boolean;
    url: string;
    static_url: string;
}
