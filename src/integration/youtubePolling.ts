const rss = require('rss-converter');
import { readFileSync } from 'fs';
import fetch from "node-fetch";

import { IYoutubePostCredentialItem } from "../contracts/credential";
import { IYoutubeVideoFeed } from "../contracts/youtubeVideoFeed";
import { DatabaseService, getDatabaseService } from "../services/external/database/databaseService";
import { getMastodonService } from "../services/external/mastodon/mastodonService";
import { getLog } from "../services/internal/logService";
import { MastodonMakeToot } from '../contracts/mastodonMakeToot';

const pollInterval = 300000; // 1 per 5 minutes
const baseYtFeedUrl = 'https://www.youtube.com/feeds/videos.xml?channel_id=';

export const setUpYoutubePolling = async (youtubeChannelsToToot: Array<IYoutubePostCredentialItem>) => {
    getLog().i("Starting up YT polling");

    setInterval(async () => {
        const dbServ = getDatabaseService();
        for (const youtubeChannel of youtubeChannelsToToot) {
            try {
                await handleYtChannelWatch(dbServ, youtubeChannel);
            } catch (e) {
                console.error(`failed to fetch YT data for '${youtubeChannel.name}'`)
            }
        }
    }, pollInterval);

    getLog().i('YT polling setup complete.');
}

const handleYtChannelWatch = async (dbServ: DatabaseService, youtubeChannel: IYoutubePostCredentialItem) => {
    if (youtubeChannel.accessToken == null || youtubeChannel.accessToken.length < 1) {
        return;
    }

    const rssTask = rss.toJson(`${baseYtFeedUrl}${youtubeChannel.channelId}`);

    let feed: IYoutubeVideoFeed = await rssTask;
    const vids = [...feed.items];
    vids.sort((a, b) => new Date(b.published).getTime() - new Date(a.published).getTime());

    if (vids.length < 1) return;
    const latestVid = vids[0];

    const latestDbVid = await dbServ.getYoutubeVideoByChannelAndVideoId(youtubeChannel.channelId, latestVid.id);
    if (latestDbVid != null) {
        return;
    }

    const dbTask = dbServ.addYoutubeVideoForChannelId(youtubeChannel.channelId, latestVid.id, latestVid.published);

    console.log(`New vid from ${latestVid.author.name}! ${latestVid.media_group.media_content_url}`);
    const mastoService = getMastodonService();
    const actualClient = await mastoService.createClient(youtubeChannel as any);
    const clientMeta = {
        name: `YtPolling - ${latestVid.author.name}`,
        client: actualClient
    } as any;

    const fimg = await fetch(latestVid.media_group.media_thumbnail_url);
    const imageBuffer = Buffer.from(await fimg.arrayBuffer());

    const hashtags = youtubeChannel.customHashtags ?? '#NoMansSky';
    const tootParams: MastodonMakeToot = {
        status: `${latestVid.title} \n\n${latestVid.media_group.media_content_url} \n\n${hashtags}`
    };
    await mastoService.sendTootWithMedia(clientMeta, imageBuffer, tootParams);

    await dbTask;
}
