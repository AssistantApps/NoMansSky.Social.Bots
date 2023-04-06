import Koa from 'koa';

import { cronusRandomReviewCompileTemplate } from '../../features/cronusRandomReview/cronusRandomReview';
import { getLog } from "../../services/internal/logService";

export const cronusRandom = (authToken: string) => async (ctx: Koa.DefaultContext, next: () => Promise<any>) => {
    getLog().i('cronusRandom');
    const currentAuthHeader = ctx.get('Authorization') ?? '';
    if (currentAuthHeader.localeCompare(authToken) != 0) {
        ctx.body = '<h1>Unauthorized</h1>';
        await next();
        return;
    }

    // const inMemoryService = getMemory();
    // const mastoService = getMastodonService();
    // const cronus = inMemoryService.getMastodonClient(BotType.qsCompanion);
    // if (cronus == null) {
    //     getLog().e('Could not find mastoClient');
    //     return;
    // }

    const template = await cronusRandomReviewCompileTemplate();

    ctx.body = template;
    ctx.set('Content-Type', 'image/svg+xml');

    await next();
}
