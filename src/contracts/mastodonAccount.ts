export interface MastodonAccount {
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
    last_status_at: Date | null;
    noindex?: boolean;
    emojis: Emoji[];
    fields: Field[];
}


export interface Emoji {
    shortcode: string;
    url: string;
    static_url: string;
    visible_in_picker: boolean;
}

export interface Field {
    name: string;
    value: string;
    verified_at: Date | null;
}