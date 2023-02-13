import 'reflect-metadata';
import Router from '@koa/router';
import Koa from 'koa';

import { getLog } from "../services/internal/logService";

interface IHttpServerProps {
    authToken: string;
    onQuicksilverPush: () => Promise<void>
}

export const setUpCustomHttpServer = (props: IHttpServerProps) => {
    getLog().i("Starting up http server");
    const app = new Koa();

    // route definitions
    const router = new Router();
    router.get('/', defaultEndpoint);
    router.get('/qs', qsEndpoint(props.authToken, props.onQuicksilverPush));

    app.use(router.routes());

    getLog().i("HTTP setup complete...");

    app.listen(3000);
}

const defaultEndpoint = async (ctx: Koa.DefaultContext, next: () => Promise<any>) => {
    ctx.body = '<p>You should <b>not</b> be here... Well done I guess 🤔</p>';

    await next();
}

const qsEndpoint = (
    authToken: string,
    onQuicksilverPush: () => Promise<void>
) => async (ctx: Koa.DefaultContext, next: () => Promise<any>) => {
    const currentAuthHeader = ctx.get('Authorization') ?? '';
    if (currentAuthHeader.localeCompare(authToken) != 0) {
        ctx.body = '<h1>Unauthorized</h1>';
        await next();
        return;
    }

    await onQuicksilverPush();

    ctx.body = '<p><b>Quicksilver companion</b> handler triggered</p>';

    await next();
}