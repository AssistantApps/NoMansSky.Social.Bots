import 'reflect-metadata';
import { Container } from 'typedi';

import devCreds from './assets/data/credentials.dev.json';
import prodCreds from './assets/data/credentials.json';
import { ICredential } from './contracts/credential';
import { MastodonClientMeta } from './contracts/mastoClientMeta';
import { setUpCustomHttpServer } from "./integration/httpServer";
import { setUpYoutubePolling } from './integration/youtubePolling';
import { BOT_PATH, getConfig } from './services/internal/configService';
import { getMemory } from './services/internal/inMemoryService';

require('dotenv').config();

const main = async () => {
    Container.set(BOT_PATH, __dirname);
    const inMemoryService = getMemory();

    const credentialObj: ICredential = getConfig().isProd()
        ? prodCreds
        : devCreds;

    const mastoClients: Array<MastodonClientMeta> = [];
    inMemoryService.setMastodonClients(mastoClients);

    setUpCustomHttpServer({
        authToken: credentialObj.apiAuthToken,
    });

    setUpYoutubePolling(credentialObj.youtubeChannelsToToot);

    setInterval(function () {
        console.log("timer that keeps nodejs processing running");
    }, 1000 * 60 * 60);
}

main();