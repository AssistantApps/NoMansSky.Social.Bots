import cors from '@koa/cors';
import Router from '@koa/router';
import Koa from 'koa';
import bodyParser from 'koa-bodyparser';

import { getConfig } from '../services/internal/configService';
import { getLog } from "../services/internal/logService";
import { cronusRandom } from './api/cronus';
import { defaultEndpoint, versionEndpoint } from './api/misc';
import { qsEndpoint, qsEndpointFromTracker, qsEndpointViewSvg, qsEndpointViewPng } from './api/quicksilver';
import { steamDbPng, steamDbSvg, steamDbSvgFromTracker } from './api/steamDb';

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
    router.post('/qs-anmstracker', qsEndpointFromTracker(props.authToken));
    router.post('/qs-manual', qsEndpointFromTracker(props.authToken)); // eventually remove this
    router.post('/qs-view', qsEndpointViewSvg(props.authToken));
    router.post('/qs-view-png', qsEndpointViewPng(props.authToken));
    router.post('/cronus-random', cronusRandom(props.authToken));
    router.post('/steamdb', steamDbSvg(props.authToken));
    router.post('/steamdb-png', steamDbPng(props.authToken));
    router.post('/steamdb-anmstracker', steamDbSvgFromTracker(props.authToken));
    router.get('/version', versionEndpoint(props.authToken));

    app.use(bodyParser());
    app.use(router.routes());
    app.use(cors());

    const port = getConfig().getApiPort();
    app.listen(port);
    getLog().i(`HTTP setup complete. Available at http://localhost:${port}\n`);
}
