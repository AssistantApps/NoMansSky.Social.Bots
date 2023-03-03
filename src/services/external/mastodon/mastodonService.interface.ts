import fs from "fs";
import { ICredentialItem } from "../../../contracts/credential";
import { MastodonClientMeta } from "../../../contracts/mastoClientMeta";
import { MastodonMakeToot } from "../../../contracts/mastodonMakeToot";

export interface IMastodonService {
    createClient(cred: ICredentialItem): Promise<any>;

    sendBasicToot(mastoClient: MastodonClientMeta, message: string, id: string | null): Promise<any>;
    sendToot(mastoClient: MastodonClientMeta, params: MastodonMakeToot): Promise<any>;

    uploadTootMedia(mastoClient: MastodonClientMeta, file: Buffer): Promise<string>;
    sendTootWithMedia(mastoClient: MastodonClientMeta, file: Buffer, params: MastodonMakeToot): Promise<any>;
}
