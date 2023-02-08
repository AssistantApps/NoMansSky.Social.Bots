import "reflect-metadata";
import Koa from 'koa';
import Router from '@koa/router';

import { getLog } from "../services/internal/logService";

export const setUpCustomHttpServer = (): Koa => {
    getLog().i("Starting up bot accounts");
    const app = new Koa();

    // route definitions
    const router = new Router();
    router.get('/', defaultEndpoint);

    app.use(router.routes());

    getLog().i("Setup complete...");

    return app;
}

const defaultEndpoint = async (ctx: Koa.DefaultContext, next: () => Promise<any>) => {
    ctx.body = '<p>You should <b>not</b> be here... Well done I guess 🤔</p>';

    await next();
}