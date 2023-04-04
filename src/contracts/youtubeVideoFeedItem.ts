export interface IYoutubeVideoFeedItem {
    id: string;
    yt_videoId: string;
    yt_channelId: string;
    title: string;
    link: string;
    author: IYoutubeVideoFeedItemAuthor;
    published: Date;
    updated: Date;
    media_group: IYoutubeVideoFeedItemMedia;
}

export interface IYoutubeVideoFeedItemAuthor {
    name: string;
    uri: string;
}

export interface IYoutubeVideoFeedItemMedia {
    media_title: string;
    media_description: string;
    media_community: any;
    media_content_url: string;
    media_content_type: string;
    media_thumbnail_url: string;
}