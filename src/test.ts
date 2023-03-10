import 'reflect-metadata';
import { Container } from "typedi";

import { BotType } from "./constants/enum/botType";
import { MastodonClientMeta } from './contracts/mastoClientMeta';
import { quickSilverCompanionMentionHandler } from "./features/quickSilverCompanion/quickSilverCompanion";
import { randomDialogHandler } from "./features/randomDialog/randomDialog";
import { anyObject } from "./helper/typescriptHacks";
import { MockMastodonService } from "./services/external/mastodon/mastodonService.mock";
import { BOT_PATH } from "./services/internal/configService";
import { getLog } from "./services/internal/logService";

require('dotenv').config();

const fakeClientMeta: MastodonClientMeta = {
    type: BotType.unknown,
    name: 'test',
    dialog: 'ariadne',
    client: anyObject,
    stream: anyObject,
};
const fakePayload: any = {
    account: {
        username: 'tester name',
    },
    status: {
        id: 'toot id',
        visibility: 'public',
    },
};
const fakeMastodonService = new MockMastodonService();

const testMain = async () => {

    Container.set(BOT_PATH, __dirname);

    // await testQuicksilverCompanion();
    await testRandomDialogHandler();

    getLog().i("Test complete...");
}

const testQuicksilverCompanion = async () => {
    await quickSilverCompanionMentionHandler(fakeClientMeta, fakePayload, fakeMastodonService);
}

const testRandomDialogHandler = async () => {
    await randomDialogHandler(fakeClientMeta, fakePayload, fakeMastodonService);
}

testMain();