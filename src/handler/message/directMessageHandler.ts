import { botsThatUsRandomDialog, BotType } from "../../constants/enum/botType";
import { MastodonClientMeta } from "../../contracts/mastoClientMeta";
import { MastodonMessageEventData } from "../../contracts/mastodonMessageEvent";
import { quickSilverCompanionMentionHandler } from "../../features/quickSilverCompanion/quickSilverCompanion";
import { randomDialogHandler } from "../../features/randomDialog/randomDialog";
import { getMastodonService } from "../../services/external/mastodon/mastodonService";

export const onDirectMessageHandler = async (clientMeta: MastodonClientMeta, payload: MastodonMessageEventData) => {
    const botType = clientMeta.type;
    const mastodonService = getMastodonService();

    if (botsThatUsRandomDialog().includes(botType)) {
        await randomDialogHandler(clientMeta, payload, mastodonService);
    }

    if (botType == BotType.qsCompanion) {
        await quickSilverCompanionMentionHandler(clientMeta, payload, mastodonService);
    }
}