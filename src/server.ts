import 'reflect-metadata';
import { Container } from "typedi";

import devCreds from './assets/data/credentials.dev.json';
import prodCreds from './assets/data/credentials.json';
import { dontSetupListenersBotTypes } from './constants/enum/botType';
import { ICredential } from './contracts/credential';
import { MastodonClientMeta } from './contracts/mastoClientMeta';
import { setupListenersForClientMeta } from './helper/clientHelper';
import { setUpCustomHttpServer } from "./integration/httpServer";
import { getMastodonService } from "./services/external/mastodon/mastodonService";
import { BOT_PATH, getConfig } from "./services/internal/configService";
import { getMemory } from './services/internal/inMemoryService';
import { getLog } from "./services/internal/logService";
import { setUpYoutubePolling } from './integration/youtubePolling';

require('dotenv').config();

const main = async () => {
    Container.set(BOT_PATH, __dirname);
    getLog().i("Starting up bot accounts");

    const mastoService = getMastodonService();
    const inMemoryService = getMemory();

    const credentialObj: ICredential = getConfig().isProd()
        ? prodCreds
        : devCreds;

    const mastoClients: Array<MastodonClientMeta> = [];
    for (const cred of credentialObj.accounts) {
        if (dontSetupListenersBotTypes().includes(cred.type)) continue;

        const credAsAny: any = (cred as any);
        const actualClient = await mastoService.createClient(credAsAny);
        mastoClients.push({
            ...credAsAny,
            client: actualClient,
            stream: null,
        });
        getLog().i(`\t${cred.name} ✔`);
    }
    inMemoryService.setMastodonClients(mastoClients);

    getLog().i('Setting up bot listeners');
    for (const mastoClient of mastoClients) {
        await setupListenersForClientMeta(mastoClient);
    }

    getLog().i("Bot setups complete...\n");

    setUpCustomHttpServer({
        authToken: credentialObj.apiAuthToken,
    });

    setUpYoutubePolling(credentialObj.youtubeChannelsToToot);

    // const checkClientsInterval = setupConnectedInterval();
    // getLog().i(`Setup client checker... ${checkClientsInterval.toString()}`);
}

main();