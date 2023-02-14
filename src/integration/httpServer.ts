import 'reflect-metadata';
import Router from '@koa/router';
import Koa from 'koa';

import { getLog } from "../services/internal/logService";
import { getMemory } from '../services/internal/inMemoryService';
import { BotType } from '../constants/enum/botType';
import { quickSilverCompanionHandler } from '../features/quickSilverCompanion/quickSilverCompanion';
import { getMastodonService } from '../services/external/mastodon/mastodonService';
import { getConfig } from '../services/internal/configService';

interface IHttpServerProps {
    authToken: string;
}

export const setUpCustomHttpServer = (props: IHttpServerProps) => {
    getLog().i("Starting up http server");
    const app = new Koa();

    // route definitions
    const router = new Router();
    router.get('/', defaultEndpoint);
    router.get('/qs', qsEndpoint(props.authToken));

    app.use(router.routes());

    const port = getConfig().getApiPort();
    app.listen(port);
    getLog().i(`HTTP setup complete. Available at http://localhost:${port}`);
}

const defaultEndpoint = async (ctx: Koa.DefaultContext, next: () => Promise<any>) => {
    ctx.body = '<p>You should <b>not</b> be here... Well done I guess 🤔</p>';

    await next();
}

const qsEndpoint = (authToken: string) => async (ctx: Koa.DefaultContext, next: () => Promise<any>) => {
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

    await quickSilverCompanionHandler(qsMeta, mastoService);

    ctx.body = '<p><b>Quicksilver companion</b> handler triggered</p>';

    await next();
}