import Koa from 'koa';

import { BotType } from '../../constants/enum/botType';
import { SteamBranch } from '../../contracts/generated/steamBranch';
import { MastodonMakeToot } from '../../contracts/mastodonMakeToot';
import { steamDBFetchAndCompileTemplate, steamDBToot } from '../../features/steamDatabase/steamDbHandlers';
import { getMastodonService } from '../../services/external/mastodon/mastodonService';
import { getMemory } from '../../services/internal/inMemoryService';
import { getLog } from "../../services/internal/logService";

export const steamDbSvg = (authToken: string) => async (ctx: Koa.DefaultContext, next: () => Promise<any>) => {
    getLog().i('steamDbSvg');
    const currentAuthHeader = ctx.get('Authorization') ?? '';
    if (currentAuthHeader.localeCompare(authToken) != 0) {
        ctx.body = '<h1>Unauthorized</h1>';
        await next();
        return;
    }

    const template = await steamDBFetchAndCompileTemplate();

    ctx.body = template;
    ctx.set('Content-Type', 'image/svg+xml');

    await next();
}

export const steamDbSvgFromTracker = (authToken: string) => async (ctx: Koa.DefaultContext, next: () => Promise<any>) => {
    getLog().i('steamDbSvgFromTracker');
    const currentAuthHeader = ctx.get('Authorization') ?? '';
    if (currentAuthHeader.localeCompare(authToken) != 0) {
        ctx.body = '<h1>Unauthorized</h1>';
        await next();
        return;
    }

    const bodyParams: any = ctx.request.body;
    const mappedBodyParams: Array<SteamBranch> = bodyParams;

    const inMemoryService = getMemory();
    const mastoService = getMastodonService();
    const qsMeta = inMemoryService.getMastodonClient(BotType.assistantnmstracker);
    if (qsMeta == null) {
        getLog().e('Could not find mastoClient');
        return;
    }

    let messageToSend = 'Movement detected on the No Man\'s Sky Steam Branches!';
    messageToSend += `\nhttps://steamdb.info/app/275850/depots/ \n\n#NoMansSky `;

    const tootParams: MastodonMakeToot = {
        status: messageToSend,
        visibility: 'public',
    }

    await steamDBToot({
        clientMeta: qsMeta,
        mastodonService: mastoService,
        branches: mappedBodyParams,
        tootParams,
    });

    ctx.body = '<p><b>Steam DB</b> handler triggered with manual community mission data</p>';

    await next();
}
