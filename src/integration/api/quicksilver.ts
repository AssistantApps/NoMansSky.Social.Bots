import Koa from 'koa';

import { BotType } from '../../constants/enum/botType';
import { CommunityMissionViewModel } from '../../contracts/generated/communityMissionViewModel';
import { MastodonMakeToot } from '../../contracts/mastodonMakeToot';
import { quickSilverCompanionGetDataFromEndpointAndToot, quickSilverCompanionToot } from '../../features/quickSilverCompanion/quickSilverCompanion';
import { getMastodonService } from '../../services/external/mastodon/mastodonService';
import { getMemory } from '../../services/internal/inMemoryService';
import { getLog } from "../../services/internal/logService";

export const qsEndpoint = (authToken: string) => async (ctx: Koa.DefaultContext, next: () => Promise<any>) => {
    getLog().i('qsEndpoint');
    const currentAuthHeader = ctx.get('Authorization') ?? '';
    if (currentAuthHeader.localeCompare(authToken) != 0) {
        ctx.body = '<h1>Unauthorized</h1>';
        await next();
        return;
    }

    const inMemoryService = getMemory();
    const mastoService = getMastodonService();
    const qsMeta = inMemoryService.getMastodonClient(BotType.qsCompanion);
    if (qsMeta == null) {
        getLog().e('Could not find mastoClient');
        return;
    }

    await quickSilverCompanionGetDataFromEndpointAndToot(qsMeta, mastoService);

    ctx.body = '<p><b>Quicksilver companion</b> handler triggered</p>';

    await next();
}

export const qsEndpointFromTracker = (authToken: string) => async (ctx: Koa.DefaultContext, next: () => Promise<any>) => {
    getLog().i('qsEndpointFromTracker');
    const currentAuthHeader = ctx.get('Authorization') ?? '';
    if (currentAuthHeader.localeCompare(authToken) != 0) {
        ctx.body = '<h1>Unauthorized</h1>';
        await next();
        return;
    }

    const bodyParams: CommunityMissionViewModel = ctx.request.body;

    const inMemoryService = getMemory();
    const mastoService = getMastodonService();
    const qsMeta = inMemoryService.getMastodonClient(BotType.qsCompanion);
    if (qsMeta == null) {
        getLog().e('Could not find mastoClient');
        return;
    }

    let messageToSend = `Greetings traveller`;
    messageToSend += `\nThe Space Anomaly is accumulating research data from Travellers across multiple realities. `;

    const tootParams: MastodonMakeToot = {
        status: `Greetings traveller `,
        visibility: 'public',
    }

    await quickSilverCompanionToot({
        clientMeta: qsMeta,
        mastodonService: mastoService,
        communityMissionData: bodyParams,
        tootParams,
    });

    ctx.body = '<p><b>Quicksilver companion</b> handler triggered with manual community mission data</p>';

    await next();
}