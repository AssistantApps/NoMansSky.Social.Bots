import fs from "fs";
import { Container, Inject, Service } from "typedi";
import { ICredentialItem } from "../../../contracts/credential";
import { MastodonClientMeta } from "../../../contracts/mastoClientMeta";
import { MastodonMakeToot } from "../../../contracts/mastodonMakeToot";
import { ConfigService } from "../../internal/configService";
import { getLog } from "../../internal/logService";
import { IMastodonService } from "./mastodonService.interface";

const Mastodon = require('mastodon-api');

@Service()
export class MastodonService implements IMastodonService {
    @Inject()
    config: ConfigService;

    createClient(cred: ICredentialItem): any {
        return new Mastodon({
            client_key: cred.clientKey,
            client_secret: cred.clientSecret,
            access_token: cred.accessToken,
            timeout_ms: this.config.getMastodonTimeout(),
            api_url: this.config.getMastodonUrl(),
        });
    };

    sendBasicToot = (mastoClient: MastodonClientMeta, message: string, id: string | null = null): Promise<any> => {
        const params: MastodonMakeToot = {
            status: message
        }

        if (id != null) {
            params.in_reply_to_id = id;
        }

        return this.sendToot(mastoClient, params);
    }

    sendToot = (mastoClient: MastodonClientMeta, params: MastodonMakeToot): Promise<any> => {
        return mastoClient.client.post('statuses', params, (error: any, data: any) => {
            if (error) {
                getLog().e(mastoClient.name, error);
            }
        });
    }


    uploadTootMedia = async (mastoClient: MastodonClientMeta, file: fs.ReadStream): Promise<string> => {
        const resp = await mastoClient.client.post('media', { file });
        return resp.data.id;
    }


    sendTootWithMedia = (mastoClient: MastodonClientMeta, file: fs.ReadStream, params: MastodonMakeToot): Promise<any> => {
        return mastoClient.client.post('media', { file }).then((resp: any) => {
            const id = resp.data.id;
            this.sendToot(mastoClient, { ...params, media_ids: [id] });
        });
    }
}

export const getMastodonService = () => Container.get(MastodonService);
