import Koa from 'koa';

import { BotType } from '../../constants/enum/botType';
import { SteamBranch } from '../../contracts/generated/steamBranch';
import { MastodonMakeToot } from '../../contracts/mastodonMakeToot';
import { steamDBFetchAndCompileTemplate, steamDBToot } from '../../features/steamDatabase/steamDbHandlers';
import { getMastodonService } from '../../services/external/mastodon/mastodonService';
import { getMemory } from '../../services/internal/inMemoryService';
import { getLog } from "../../services/internal/logService";
import { getBufferFromSvg } from '../../helper/fileHelper';
import { steamDBSvgTemplate } from '../../features/steamDatabase/steamDb.svg.template';

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

export const steamDbPng = (authToken: string) => async (ctx: Koa.DefaultContext, next: () => Promise<any>) => {
    getLog().i('steamDbPng');
    const currentAuthHeader = ctx.get('Authorization') ?? '';
    if (currentAuthHeader.localeCompare(authToken) != 0) {
        ctx.body = '<h1>Unauthorized</h1>';
        await next();
        return;
    }

    const compiledTemplate = await steamDBFetchAndCompileTemplate();

    const buffer = getBufferFromSvg(compiledTemplate);

    ctx.body = buffer;
    ctx.set('Content-Type', 'image/png');

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


    let compiledTemplate: string | undefined;
    try {
        compiledTemplate = await steamDBSvgTemplate({
            branches: mappedBodyParams,
        });
    }
    catch (ex) {
        getLog().e(qsMeta.name, 'error getting steamDb', ex);
    }

    if (compiledTemplate == null) {
        getLog().e(qsMeta.name, 'error steamDb', 'compiledTemplate == null');
        return;
    }

    await steamDBToot({
        clientMeta: qsMeta,
        mastodonService: mastoService,
        compiledTemplate: compiledTemplate,
        tootParams,
    });

    const buffer = getBufferFromSvg(compiledTemplate);

    ctx.body = buffer;

    await next();
}
