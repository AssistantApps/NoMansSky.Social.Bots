import 'reflect-metadata';
import { Container } from "typedi";

import devCreds from './assets/data/credentials.dev.json';
import prodCreds from './assets/data/credentials.json';
import { dontSetupListenersBotTypes } from './constants/enum/botType';
import { MastodonClientMeta } from './contracts/mastoClientMeta';
import { setupConnectedInterval } from './features/checkClientsAreConnected';
import { setupListenersForClientMeta } from './helper/clientHelper';
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
        if (dontSetupListenersBotTypes().includes(cred.type)) continue;

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
        setupListenersForClientMeta(mastoClient);
    }

    getLog().i("Setup complete...");

    setUpCustomHttpServer({
        authToken: credentialObj.apiAuthToken,
    });

    const checkClientsInterval = setupConnectedInterval();
    getLog().i(`Setup client checker... ${checkClientsInterval.toString()}`);
}

main();