import "reflect-metadata";
import { Container } from "typedi";

import prodCreds from './assets/data/credentials.json';
import devCreds from './assets/data/credentials.dev.json';
import { MastodonClientMeta } from './contracts/mastoClientMeta';
import { onErrorHandler } from './handler/errorHandler';
import { onMessageHandler } from './handler/messageHandler';
import { getMastodonService } from "./services/external/mastodonService";
import { getLog } from "./services/internal/logService";
import { BOT_PATH, getConfig } from "./services/internal/configService";
import { setUpCustomHttpServer } from "./integration/httpServer";
import { BotType } from "./constants/enum/botType";
import { quickSilverCompanionHandler } from "./features/quickSilverCompanion/quickSilverCompanion";

require('dotenv').config();

const mastoClients: Array<MastodonClientMeta> = [];

const main = async () => {
    Container.set(BOT_PATH, __dirname);
    getLog().i("Starting up bot accounts");

    const mastoService = getMastodonService();

    const accounts = getConfig().isProd()
        ? prodCreds.accounts
        : devCreds.accounts;

    for (const cred of accounts) {
        const credAsAny: any = (cred as any);
        mastoClients.push({
            ...credAsAny,
            client: mastoService.createClient(credAsAny),
            listener: null,
        });
        getLog().i(`\t${cred.name} client ✔`);
    }

    for (const mastoClient of mastoClients) {
        const listener: any = mastoClient.client.stream('streaming/user');
        listener.on('error', onErrorHandler(mastoClient));
        listener.on('message', onMessageHandler(mastoClient));
        mastoClient.listener = listener;
    }

    getLog().i("Setup complete...");

    setUpCustomHttpServer({
        onQuicksilverPush: async () => {
            const qsMetaIndex = mastoClients.findIndex(mc => mc.type === BotType.qsCompanion);
            if (qsMetaIndex < 0) {
                getLog().e('Could not find mastoClient');
                return;
            }

            const qsMeta = mastoClients[qsMetaIndex];
            await quickSilverCompanionHandler(qsMeta.client, mastoService)
        },
    });
}

main();