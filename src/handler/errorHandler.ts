import { MastodonClientMeta } from "../contracts/mastoClientMeta";

export const onErrorHandler = (clientMeta: MastodonClientMeta) => (err: any) => {
    console.error(clientMeta.name, err);
}