import { IYoutubeVideoFeedItem } from "./youtubeVideoFeedItem";

export interface IYoutubeVideoFeed {
    id: string;
    yt_channelId: string;
    title: string;
    author: {
        name: string;
        uri: string;
    },
    published: Date;
    items: Array<IYoutubeVideoFeedItem>;
}