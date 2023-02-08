import fs from "fs";
import { ICredential } from "../../contracts/credential";
import { MastodonClientMeta } from "../../contracts/mastoClientMeta";
import { MastodonMakeToot } from "../../contracts/mastodonMakeToot";
import { getLog } from "../internal/logService";
import { IMastodonService } from "./mastodonService.interface";

export class MockMastodonService implements IMastodonService {

    createClient(cred: ICredential): any {
        getLog().i(cred);
        return {

        };
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
        return new Promise(resolve => resolve({

        }));
    }


    uploadTootMedia = async (mastoClient: MastodonClientMeta, file: fs.ReadStream): Promise<string> => {
        return 'thisIsAnId';
    }


    sendTootWithMedia = (mastoClient: MastodonClientMeta, file: fs.ReadStream, params: MastodonMakeToot): Promise<any> => {
        return new Promise(resolve => resolve({

        }));
    }
}

