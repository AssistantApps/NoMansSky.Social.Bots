import { MastodonClientMeta } from "../../contracts/mastoClientMeta";
import { MastodonMakeToot } from "../../contracts/mastodonMakeToot";
import { MastodonMessageEventData } from "../../contracts/mastodonMessageEvent";
import { sendToot } from "../../helper/sendToot";

export const onDirectMessageHandler = (clientMeta: MastodonClientMeta, payload: MastodonMessageEventData) => {
    const scheduledDate = new Date();
    scheduledDate.setMinutes(scheduledDate.getMinutes() + 2);

    const params: MastodonMakeToot = {
        status: `@${payload.account.username} You are the imposter!`,
        in_reply_to_id: payload.status.id,
        visibility: payload.status.visibility,
        scheduled_at: scheduledDate.toISOString(),
    }
    console.info(clientMeta.name, 'direct message', params);
    sendToot(clientMeta, params);
}