import Koa from 'koa';

import { BotType } from '../../constants/enum/botType';
import { CommunityMissionViewModel } from '../../contracts/generated/communityMissionViewModel';
import { MastodonMakeToot } from '../../contracts/mastodonMakeToot';
import { quickSilverCompanionCompiledTemplate, quickSilverCompanionGetDataFromEndpointAndToot, quickSilverCompanionGetItemFromCm, quickSilverCompanionToot } from '../../features/quickSilverCompanion/quickSilverCompanion';
import { getAssistantNmsApi } from '../../services/api/assistantNmsApiService';
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

export const qsEndpointViewSvg = (authToken: string) => async (ctx: Koa.DefaultContext, next: () => Promise<any>) => {
    getLog().i('qsEndpointViewSvg');
    const currentAuthHeader = ctx.get('Authorization') ?? '';
    if (currentAuthHeader.localeCompare(authToken) != 0) {
        ctx.body = '<h1>Unauthorized</h1>';
        await next();
        return;
    }

    const assistantNmsApi = getAssistantNmsApi();
    const cmResult = await assistantNmsApi.getCommunityMission();
    if (cmResult.isSuccess == false) {
        getLog().e('qsEndpointViewSvg', 'Could not fetch Community Mission', cmResult.errorMessage);
    }

    const itemData = await quickSilverCompanionGetItemFromCm({
        botName: 'qsEndpointViewSvg',
        communityMissionData: cmResult.value,
    });

    if (itemData == null) {
        getLog().e('qsEndpointViewSvg', 'Item not found by id');
        return;
    }

    const compiledTemplate = await quickSilverCompanionCompiledTemplate({
        botName: 'qsEndpointViewSvg',
        itemName: itemData.Name,
        itemIcon: itemData.Icon,
        itemBaseValueUnits: itemData.BaseValueUnits,
        communityMissionData: cmResult.value,
    });

    ctx.body = compiledTemplate;
    ctx.set('Content-Type', 'image/svg+xml');

    await next();
}