export interface MastodonMessageEvent<T> {
    event: string;
    data: T;
}