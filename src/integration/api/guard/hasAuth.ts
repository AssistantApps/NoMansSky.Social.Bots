import Koa from 'koa';

import { getLog } from "../../../services/internal/logService";

export const isRequestAuthed = async (authToken: string, ctx: Koa.DefaultContext, next: () => Promise<any>): Promise<boolean> => {
    const currentAuthHeader = ctx.get('Authorization') ?? '';
    if (currentAuthHeader.localeCompare(authToken) != 0) {
        getLog().i('Auth Guard - not authenticated');
        ctx.body = '<h1>Unauthorized</h1>';
        await next();
        return false;
    }

    return true;
}
