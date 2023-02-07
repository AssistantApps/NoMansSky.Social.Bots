import { MastodonClientMeta } from "../contracts/mastoClientMeta";
import { MastodonMessageEvent } from "../contracts/mastodonEvent";
import { MastodonMessageEventData } from "../contracts/mastodonMessageEvent";
import { getLog } from "../services/internal/logService";
import { onDirectMessageHandler } from "./message/directMessageHandler";

export const onMessageHandler = (clientMeta: MastodonClientMeta) => async (payload: MastodonMessageEvent<MastodonMessageEventData>) => {
    if (payload.data?.account?.bot == true) {
        getLog().w(clientMeta.name, `Bot account event: '${payload.event}'`);
        return;
    }

    if (payload.event == 'notification') {
        if (payload.data.type == 'mention') {
            await onDirectMessageHandler(clientMeta, payload.data);
            return;
        }
    }

    getLog().i(clientMeta.name, 'unhandled payload event: ', payload.event);
}