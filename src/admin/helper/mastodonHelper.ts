import { ICredential, ICredentialItem } from "../../contracts/credential";
import { MastodonClientMeta } from "../../contracts/mastoClientMeta";
import { anyObject } from "../../helper/typescriptHacks";
import { getMastodonService, MastodonService } from "../../services/external/mastodon/mastodonService";

export const getMastoServiceAndClientMeta = async (
    creds: ICredential | undefined
): Promise<[MastodonService, MastodonClientMeta | null]> => {

    const localMastodonService = getMastodonService();

    if (
        creds == null ||
        creds.accounts == null ||
        creds.accounts.length < 1
    ) {
        return [localMastodonService, null];
    }
    const cred = creds.accounts[0];
    return getMastoServiceAndClientMetaFromCred(cred);
}

export const getMastoServiceAndClientMetaFromCred = async (
    cred: ICredentialItem | undefined
): Promise<[MastodonService, MastodonClientMeta | null]> => {

    const localMastodonService = getMastodonService();

    if (cred == null) {
        return [localMastodonService, null];
    }

    const tempClient = await localMastodonService.createClient(cred);
    const clientMeta: MastodonClientMeta = {
        name: cred.name,
        type: cred.type as any,
        dialog: cred.dialog,
        client: tempClient,
        stream: anyObject,
    };
    return [localMastodonService, clientMeta];
}