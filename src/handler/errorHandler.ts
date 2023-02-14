import { MastodonClientMeta } from "../contracts/mastoClientMeta";
import { getMastodonService } from "../services/external/mastodon/mastodonService";
import { getLog } from "../services/internal/logService";

export const onErrorHandler = (clientMeta: MastodonClientMeta) => (err: any) => {
    getLog().e(clientMeta.name, err);
    if (err.toString().includes('aborted')) {
        getLog().i('error does contain `aborted`');
    }
    getLog().i('reconnecting');
    const mastoService = getMastodonService();
    clientMeta.client = mastoService.createClient(clientMeta as any);
    getLog().i(`${clientMeta.name} should be reconnected`);
}