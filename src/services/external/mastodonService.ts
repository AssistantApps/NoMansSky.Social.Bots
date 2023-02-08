import fs from "fs";
import { Container, Inject, Service } from "typedi";
import { ICredential } from "../../contracts/credential";
import { MastodonClientMeta } from "../../contracts/mastoClientMeta";
import { MastodonMakeToot } from "../../contracts/mastodonMakeToot";
import { ConfigService } from "../internal/configService";
import { getLog } from "../internal/logService";

const Mastodon = require('mastodon-api');

@Service()
export class MastodonService {
    @Inject()
    config: ConfigService;

    createClient(cred: ICredential): any {
        return new Mastodon({
            client_key: cred.clientKey,
            client_secret: cred.clientSecret,
            access_token: cred.accessToken,
            timeout_ms: this.config.getMastodonTimeout(),
            api_url: this.config.getMastodonUrl(),
        });
    };
}

export const getMastodonService = () => Container.get(MastodonService);


export const sendBasicToot = (mastoClient: MastodonClientMeta, message: string, id: string | null = null): Promise<any> => {
    const params: MastodonMakeToot = {
        status: message
    }

    if (id != null) {
        params.in_reply_to_id = id;
    }

    return sendToot(mastoClient, params);
}

export const sendToot = (mastoClient: MastodonClientMeta, params: MastodonMakeToot): Promise<any> => {
    return mastoClient.client.post('statuses', params, (error: any, data: any) => {
        if (error) {
            getLog().e(mastoClient.name, error);
        }
    });
}


export const uploadTootMedia = async (mastoClient: MastodonClientMeta, file: fs.ReadStream): Promise<string> => {
    const resp = await mastoClient.client.post('media', { file });
    return resp.data.id;
}


export const sendTootWithMedia = (mastoClient: MastodonClientMeta, file: fs.ReadStream, params: MastodonMakeToot): Promise<any> => {
    return mastoClient.client.post('media', { file }).then((resp: any) => {
        const id = resp.data.id;
        mastoClient.client.post('statuses', { ...params, media_ids: [id] })
    });
}