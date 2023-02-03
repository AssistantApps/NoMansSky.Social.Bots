import { MastodonClientMeta } from "../contracts/mastoClientMeta";
import { MastodonMessageEvent } from "../contracts/mastodonEvent";
import { MastodonMessageEventData } from "../contracts/mastodonMessageEvent";
import { onDirectMessageHandler } from "./message/directMessageHandler";

export const onMessageHandler = (clientMeta: MastodonClientMeta) => (payload: MastodonMessageEvent<MastodonMessageEventData>) => {
    if (payload.data?.account?.bot == true) {
        console.warn(`Bot account: ${payload.event}`);
        console.warn(payload.data);
        return;
    }

    if (payload.event == 'notification') {
        if (payload.data.type == 'mention') {
            onDirectMessageHandler(clientMeta, payload.data);
            return;
        }
    }

    console.info('unhandled payload event: ', payload.event);
}