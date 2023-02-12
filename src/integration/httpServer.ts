import "reflect-metadata";
import Koa from 'koa';
import Router from '@koa/router';

import { getLog } from "../services/internal/logService";

interface IHttpServerProps {
    onQuicksilverPush: () => Promise<void>
}

export const setUpCustomHttpServer = (props: IHttpServerProps) => {
    getLog().i("Starting up http server");
    const app = new Koa();

    // route definitions
    const router = new Router();
    router.get('/', defaultEndpoint);
    router.get('/qs', qsEndpoint(props.onQuicksilverPush));

    app.use(router.routes());

    getLog().i("HTTP setup complete...");

    app.listen(3000);
}

const defaultEndpoint = async (ctx: Koa.DefaultContext, next: () => Promise<any>) => {
    ctx.body = '<p>You should <b>not</b> be here... Well done I guess 🤔</p>';

    await next();
}

const qsEndpoint = (onQuicksilverPush: () => Promise<void>) => async (ctx: Koa.DefaultContext, next: () => Promise<any>) => {
    // TODO check authHeader

    await onQuicksilverPush();

    ctx.body = '<p><b>Quicksilver companion</b> handler triggered</p>';

    await next();
}