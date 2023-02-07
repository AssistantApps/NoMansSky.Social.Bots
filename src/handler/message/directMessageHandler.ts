import { BotType } from "../../constants/enum/botType";
import { MastodonClientMeta } from "../../contracts/mastoClientMeta";
import { MastodonMessageEventData } from "../../contracts/mastodonMessageEvent";
import { quickSilverCompanionHandler } from "../../features/quickSilverCompanion/quickSilverCompanion";
import { randomDialogHandler } from "../../features/randomDialog/randomDialog";

export const onDirectMessageHandler = async (clientMeta: MastodonClientMeta, payload: MastodonMessageEventData) => {
    const botType = clientMeta.type;

    if (botType == BotType.ariadne || botType == BotType.ariadne1) {
        await randomDialogHandler(clientMeta, payload)
    }
    if (botType == BotType.qsCompanion) {
        await quickSilverCompanionHandler(clientMeta, payload)
    }
}