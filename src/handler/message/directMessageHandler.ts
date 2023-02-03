import { MastodonClientMeta } from "../../contracts/mastoClientMeta";
import { MastodonMakeToot } from "../../contracts/mastodonMakeToot";
import { MastodonMessageEventData } from "../../contracts/mastodonMessageEvent";
import { randomIntFromRange } from "../../helper/randomHelper";
import { sendToot } from "../../helper/sendToot";

export const onDirectMessageHandler = async (clientMeta: MastodonClientMeta, payload: MastodonMessageEventData) => {
    const scheduledDate = new Date();
    scheduledDate.setMinutes(scheduledDate.getMinutes() + 2);

    let dialogOptions = ['Hello Traveller!'];
    if (clientMeta.name != null) {
        try {
            const json = await import(`../../assets/npcDialog/${clientMeta.name}`);
            dialogOptions = json.default;
        }
        catch (_) {
            //
        }
    }

    const dialogOptionIndex = randomIntFromRange(0, 1);
    const params: MastodonMakeToot = {
        status: `@${payload.account.username} ` + dialogOptions[dialogOptionIndex],
        in_reply_to_id: payload.status.id,
        visibility: payload.status.visibility,
        scheduled_at: scheduledDate.toISOString(),
    }
    console.info(clientMeta.name, 'direct message', params);
    sendToot(clientMeta, params);
}