import cors from '@koa/cors';
import Router from '@koa/router';
import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import 'reflect-metadata';

import { version } from '../../package.json';
import adminVersion from '../assets/data/admin-version.json';
import { BotType } from '../constants/enum/botType';
import { CommunityMissionViewModel } from '../contracts/generated/communityMissionViewModel';
import { MastodonMakeToot } from '../contracts/mastodonMakeToot';
import { quickSilverCompanionGetDataFromEndpointAndToot, quickSilverCompanionToot } from '../features/quickSilverCompanion/quickSilverCompanion';
import { getMastodonService } from '../services/external/mastodon/mastodonService';
import { getConfig } from '../services/internal/configService';
import { getMemory } from '../services/internal/inMemoryService';
import { getLog } from "../services/internal/logService";

interface IHttpServerProps {
    authToken: string;
}

export const setUpCustomHttpServer = (props: IHttpServerProps) => {
    getLog().i("Starting up http server");
    const app = new Koa();

    // route definitions
    const router = new Router();
    router.get('/', defaultEndpoint);
    router.post('/qs', qsEndpoint(props.authToken));
    router.post('/qs-manual', qsEndpointFromTracker(props.authToken));
    router.get('/version', versionEndpoint(props.authToken));

    app.use(router.routes());
    app.use(cors());
    app.use(bodyParser());

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

    await quickSilverCompanionGetDataFromEndpointAndToot(qsMeta, mastoService);

    ctx.body = '<p><b>Quicksilver companion</b> handler triggered</p>';

    await next();
}

const qsEndpointFromTracker = (authToken: string) => async (ctx: Koa.DefaultContext, next: () => Promise<any>) => {
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

    const bodyParams: CommunityMissionViewModel = ctx.request.body;

    let messageToSend = `Greetings traveller`;
    messageToSend += `\nThe Space Anomaly is accumulating research data from Travellers across multiple realities. `;

    const tootParams: MastodonMakeToot = {
        status: `Greetings traveller `,
        visibility: 'public',
    }

    await quickSilverCompanionToot({
        clientMeta: qsMeta,
        mastodonService: mastoService,
        communityMissionData: bodyParams,
        tootParams,
    });

    ctx.body = '<p><b>Quicksilver companion</b> handler triggered with manual community mission data</p>';

    await next();
}

const versionEndpoint = (authToken: string) => async (ctx: Koa.DefaultContext, next: () => Promise<any>) => {
    const currentAuthHeader = ctx.get('Authorization') ?? '';
    const isAdmin = currentAuthHeader.localeCompare(authToken) == 0;

    let output = `DOCKER_BUILD_VERSION: ${getConfig().buildVersion() ?? '???'}\n`;
    output += `packageVersion: ${version ?? '???'}\n`;
    output += `adminVersionCode: ${adminVersion.code ?? '???'}\n`;
    output += `adminVersionName: ${adminVersion.name ?? '???'}\n`;
    output += '\nAuthenticate properties:\n\n';

    if (isAdmin) {
        for (const processKey in process.env) {
            if (Object.prototype.hasOwnProperty.call(process.env, processKey)) {
                const element = process.env[processKey];
                output += `${processKey}: ${element}\n`;
            }
        }
    }

    ctx.body = output;

    await next();
}