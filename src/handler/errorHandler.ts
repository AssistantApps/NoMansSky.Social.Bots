import { MastodonClientMeta } from "../contracts/mastoClientMeta";
import { getLog } from "../services/internal/logService";

export const onErrorHandler = (clientMeta: MastodonClientMeta) => (err: any) => {
    getLog().e(clientMeta.name, err);
}