import { mastodon } from 'masto';

import { BotType } from "../constants/enum/botType";
import { getLog } from "../services/internal/logService";
import { onDirectMessageHandler } from "./message/directMessageHandler";

export const onNotificationHandler = (botName: string, botType: BotType) => async (payload: mastodon.v1.Notification) => {
    if (payload.account.bot == true) {
        getLog().w(botName, 'Bot account event');
        return;
    }

    if (payload.type == 'mention') {
        getLog().i(botName, 'notification: mention');
        await onDirectMessageHandler(botName, botType, payload);
        return;
    }

    getLog().i(botName, 'unhandled notification event: ', payload.type);
}

export const onConversationHandler = (botName: string, botType: BotType) => async (payload: mastodon.v1.Conversation) => {
    // if (payload.account.bot == true) {
    //     getLog().w(botName, 'Bot account event');
    //     return;
    // }

    // if (payload.type == 'mention') {
    //     getLog().i(botName, 'notification: mention');
    //     await onDirectMessageHandler(botName, botType, payload);
    //     return;
    // }

    getLog().i(botName, 'unhandled notification event: ', payload);
}