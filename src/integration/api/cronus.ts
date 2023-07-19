import Koa from 'koa';

import { cronusRandomReviewCompileTemplate, cronusRandomReviewToot } from '../../features/cronusRandomReview/cronusRandomReview';
import { getLog } from "../../services/internal/logService";
import { getMemory } from '../../services/internal/inMemoryService';
import { getMastodonService } from '../../services/external/mastodon/mastodonService';
import { BotType } from '../../constants/enum/botType';
import { getBufferFromSvg } from '../../helper/fileHelper';
import { isRequestAuthed } from './guard/hasAuth';
import { MastodonMakeToot } from '../../contracts/mastodonMakeToot';
import { randomIntFromRange } from '../../helper/randomHelper';
import { cronusRandomIntroDialog } from '../../features/cronusRandomReview/cronusRandomDialog';

export const cronusRandom = (authToken: string) => async (ctx: Koa.DefaultContext, next: () => Promise<any>) => {
    getLog().i('cronusRandom');
    const isAuthed = await isRequestAuthed(authToken, ctx, next);
    if (isAuthed == false) return;

    const inMemoryService = getMemory();
    const mastoService = getMastodonService();
    const cronus = inMemoryService.getMastodonClient(BotType.cronus);
    if (cronus == null) {
        getLog().e('Could not find mastoClient');
        return;
    }

    const template = await cronusRandomReviewCompileTemplate();
    const cronusRandomIntroDialogIndex = randomIntFromRange(0, cronusRandomIntroDialog.length);
    const selectedDialogItem = cronusRandomIntroDialog[cronusRandomIntroDialogIndex];
    const params: MastodonMakeToot = {
        status: selectedDialogItem,
        visibility: 'public',
    }

    await cronusRandomReviewToot({
        clientMeta: cronus,
        compiledTemplate: template,
        mastodonService: mastoService,
        tootParams: params,
    });

    ctx.body = template;
    ctx.set('Content-Type', 'image/svg+xml');

    await next();
}

export const cronusRandomPng = (authToken: string) => async (ctx: Koa.DefaultContext, next: () => Promise<any>) => {
    getLog().i('cronusRandom');
    const isAuthed = await isRequestAuthed(authToken, ctx, next);
    if (isAuthed == false) return;

    const template = await cronusRandomReviewCompileTemplate();

    ctx.body = getBufferFromSvg(template);
    ctx.set('Content-Type', 'image/png');

    await next();
}
