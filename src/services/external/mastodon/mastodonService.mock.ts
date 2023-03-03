import fs from "fs";
import { ICredentialItem } from "../../../contracts/credential";
import { MastodonClientMeta } from "../../../contracts/mastoClientMeta";
import { MastodonMakeToot } from "../../../contracts/mastodonMakeToot";
import { anyObject } from "../../../helper/typescriptHacks";
import { getLog } from "../../internal/logService";
import { IMastodonService } from "./mastodonService.interface";

export class MockMastodonService implements IMastodonService {

    createClient(cred: ICredentialItem): Promise<any> {
        getLog().i(cred);
        return new Promise((_) => (anyObject));
    };

    sendBasicToot = (mastoClient: MastodonClientMeta, message: string, id: string | null = null): Promise<any> => {
        const params: MastodonMakeToot = {
            status: message
        }

        if (id != null) {
            params.inReplyToId = id;
        }

        return this.sendToot(mastoClient, params);
    }

    sendToot = (mastoClient: MastodonClientMeta, params: MastodonMakeToot): Promise<any> => {
        return new Promise(resolve => resolve({

        }));
    }

    uploadTootMedia = async (mastoClient: MastodonClientMeta, file: Buffer): Promise<string> => {
        return 'thisIsAnId';
    }


    sendTootWithMedia = (mastoClient: MastodonClientMeta, file: Buffer, params: MastodonMakeToot): Promise<any> => {
        return new Promise(resolve => resolve({

        }));
    }
}

