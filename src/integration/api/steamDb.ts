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
import { isRequestAuthed } from './guard/hasAuth';

export const steamDbSvg = (authToken: string) => async (ctx: Koa.DefaultContext, next: () => Promise<any>) => {
    getLog().i('steamDbSvg');
    const isAuthed = await isRequestAuthed(authToken, ctx, next);
    if (isAuthed == false) return;

    const template = await steamDBFetchAndCompileTemplate();

    ctx.body = template;
    ctx.set('Content-Type', 'image/svg+xml');

    await next();
}

export const steamDbPng = (authToken: string) => async (ctx: Koa.DefaultContext, next: () => Promise<any>) => {
    getLog().i('steamDbPng');
    const isAuthed = await isRequestAuthed(authToken, ctx, next);
    if (isAuthed == false) return;

    const compiledTemplate = await steamDBFetchAndCompileTemplate();

    const buffer = getBufferFromSvg(compiledTemplate);

    ctx.body = buffer;
    ctx.set('Content-Type', 'image/png');

    await next();
}

export const steamDbSvgFromTracker = (authToken: string) => async (ctx: Koa.DefaultContext, next: () => Promise<any>) => {
    getLog().i('steamDbSvgFromTracker');
    const isAuthed = await isRequestAuthed(authToken, ctx, next);
    if (isAuthed == false) return;

    const bodyParams: any = ctx.request.body;
    const mappedBodyParams: Array<SteamBranch> = bodyParams;

    const inMemoryService = getMemory();
    const mastoService = getMastodonService();
    const nadaMeta = inMemoryService.getMastodonClient(BotType.nada);
    if (nadaMeta == null) {
        getLog().e('Could not find mastoClient');
        return;
    }

    let messageToSend = 'Traveler-Entity, I have detected a disturbance in... another reality?';
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
        getLog().e(nadaMeta.name, 'error getting steamDb', ex);
    }

    if (compiledTemplate == null) {
        getLog().e(nadaMeta.name, 'error steamDb', 'compiledTemplate == null');
        return;
    }

    await steamDBToot({
        clientMeta: nadaMeta,
        mastodonService: mastoService,
        compiledTemplate: compiledTemplate,
        tootParams,
    });

    const buffer = getBufferFromSvg(compiledTemplate);

    ctx.body = buffer;
    ctx.set('Content-Type', 'image/png');

    await next();
}
