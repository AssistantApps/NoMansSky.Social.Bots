import 'reflect-metadata';

import devCreds from './assets/data/credentials.dev.json';
import { MastodonClientMeta } from './contracts/mastoClientMeta';
import { setUpCustomHttpServer } from "./integration/httpServer";
import { getMemory } from './services/internal/inMemoryService';

require('dotenv').config();

const main = async () => {
    const inMemoryService = getMemory();

    const credentialObj = devCreds;

    const mastoClients: Array<MastodonClientMeta> = [];
    inMemoryService.setMastodonClients(mastoClients);

    setUpCustomHttpServer({
        authToken: credentialObj.apiAuthToken,
    });

    setInterval(function () {
        console.log("timer that keeps nodejs processing running");
    }, 1000 * 60 * 60);
}

main();