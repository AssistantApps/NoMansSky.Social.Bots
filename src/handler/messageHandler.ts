import { BotType } from "../constants/enum/botType";
import { MastodonMessageEvent } from "../contracts/mastodonEvent";
import { MastodonMessageEventData } from "../contracts/mastodonMessageEvent";
import { getLog } from "../services/internal/logService";
import { onDirectMessageHandler } from "./message/directMessageHandler";

export const onMessageHandler = (botName: string, botType: BotType) => async (payload: MastodonMessageEvent<MastodonMessageEventData>) => {
    if (payload.data?.account?.bot == true) {
        getLog().w(botName, `Bot account event: '${payload.event}'`);
        return;
    }

    if (payload.event == 'notification') {
        if (payload.data.type == 'mention') {
            await onDirectMessageHandler(botName, botType, payload.data);
            return;
        }
    }

    getLog().i(botName, 'unhandled payload event: ', payload.event);
}