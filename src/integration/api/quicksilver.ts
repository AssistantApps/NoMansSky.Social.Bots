import Koa from 'koa';

import { BotType } from '../../constants/enum/botType';
import { CommunityMissionViewModel } from '../../contracts/generated/communityMissionViewModel';
import { MastodonMakeToot } from '../../contracts/mastodonMakeToot';
import { quickSilverCompanionCompiledTemplate, quickSilverCompanionGetDataFromEndpointAndToot, quickSilverCompanionGetItemFromCm, quickSilverCompanionToot } from '../../features/quickSilverCompanion/quickSilverCompanion';
import { getAssistantNmsApi } from '../../services/api/assistantNmsApiService';
import { getMastodonService } from '../../services/external/mastodon/mastodonService';
import { getMemory } from '../../services/internal/inMemoryService';
import { getLog } from "../../services/internal/logService";
import { getBufferFromSvg } from '../../helper/fileHelper';

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

    const bodyParams: any = ctx.request.body;
    const mappedBodyParams: CommunityMissionViewModel = {
        missionId: bodyParams.MissionId,
        currentTier: bodyParams.CurrentTier,
        percentage: bodyParams.Percentage,
        totalTiers: bodyParams.TotalTiers,
    };

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
        communityMissionData: mappedBodyParams,
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

    const compiledTemplate = await qsEndpointViewBuffer();

    ctx.body = compiledTemplate;
    ctx.set('Content-Type', 'image/svg+xml');

    await next();
}

export const qsEndpointViewPng = (authToken: string) => async (ctx: Koa.DefaultContext, next: () => Promise<any>) => {
    getLog().i('qsEndpointViewPng');
    const currentAuthHeader = ctx.get('Authorization') ?? '';
    if (currentAuthHeader.localeCompare(authToken) != 0) {
        ctx.body = '<h1>Unauthorized</h1>';
        await next();
        return;
    }

    const compiledTemplate = await qsEndpointViewBuffer();
    if (compiledTemplate == null) {
        ctx.body = '<h1>Compiled template is null</h1>';
        await next();
        return;
    }

    ctx.body = getBufferFromSvg(compiledTemplate);
    ctx.set('Content-Type', 'image/png');

    await next();
}

export const qsEndpointViewBuffer = async () => {

    const assistantNmsApi = getAssistantNmsApi();
    const cmResult = await assistantNmsApi.getCommunityMission();
    if (cmResult.isSuccess == false) {
        getLog().e('qsEndpointViewBuffer', 'Could not fetch Community Mission', cmResult.errorMessage);
    }

    const itemData = await quickSilverCompanionGetItemFromCm({
        botName: 'qsEndpointViewBuffer',
        communityMissionData: cmResult.value,
    });

    if (itemData == null) {
        getLog().e('qsEndpointViewBuffer', 'Item not found by id');
        return;
    }

    const compiledTemplate = await quickSilverCompanionCompiledTemplate({
        botName: 'qsEndpointViewBuffer',
        itemName: itemData.Name,
        itemIcon: itemData.Icon,
        itemBaseValueUnits: itemData.BaseValueUnits,
        communityMissionData: cmResult.value,
    });

    return compiledTemplate;
}