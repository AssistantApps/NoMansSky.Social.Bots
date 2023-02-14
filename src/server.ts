import 'reflect-metadata';
import { Container } from "typedi";

import devCreds from './assets/data/credentials.dev.json';
import prodCreds from './assets/data/credentials.json';
import { MastodonClientMeta } from './contracts/mastoClientMeta';
import { onErrorHandler } from './handler/errorHandler';
import { onMessageHandler } from './handler/messageHandler';
import { setUpCustomHttpServer } from "./integration/httpServer";
import { getMastodonService } from "./services/external/mastodon/mastodonService";
import { BOT_PATH, getConfig } from "./services/internal/configService";
import { getMemory } from './services/internal/inMemoryService';
import { getLog } from "./services/internal/logService";

require('dotenv').config();

const main = async () => {
    Container.set(BOT_PATH, __dirname);
    getLog().i("Starting up bot accounts");

    const mastoService = getMastodonService();
    const inMemoryService = getMemory();

    const credentialObj = getConfig().isProd()
        ? prodCreds
        : devCreds;

    const mastoClients: Array<MastodonClientMeta> = [];
    for (const cred of credentialObj.accounts) {
        const credAsAny: any = (cred as any);
        mastoClients.push({
            ...credAsAny,
            client: mastoService.createClient(credAsAny),
            listener: null,
        });
        getLog().i(`\t${cred.name} client ✔`);
    }
    inMemoryService.setMastodonClients(mastoClients);

    for (const mastoClient of mastoClients) {
        const listener: any = mastoClient.client.stream('streaming/user');
        listener.on('error', onErrorHandler(mastoClient.name, mastoClient.type));
        listener.on('message', onMessageHandler(mastoClient.name, mastoClient.type));
        mastoClient.listener = listener;
    }

    getLog().i("Setup complete...");

    setUpCustomHttpServer({
        authToken: credentialObj.apiAuthToken,
    });
}

main();