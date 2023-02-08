import fs from "fs";
import { ICredential } from "../../contracts/credential";
import { MastodonClientMeta } from "../../contracts/mastoClientMeta";
import { MastodonMakeToot } from "../../contracts/mastodonMakeToot";

export interface IMastodonService {
    createClient(cred: ICredential): any;

    sendBasicToot(mastoClient: MastodonClientMeta, message: string, id: string | null): Promise<any>;
    sendToot(mastoClient: MastodonClientMeta, params: MastodonMakeToot): Promise<any>;
    uploadTootMedia(mastoClient: MastodonClientMeta, file: fs.ReadStream): Promise<string>;
    sendTootWithMedia(mastoClient: MastodonClientMeta, file: fs.ReadStream, params: MastodonMakeToot): Promise<any>;
}
