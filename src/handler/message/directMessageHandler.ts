import { botsThatUsRandomDialog, BotType } from "../../constants/enum/botType";
import { MastodonMessageEventData } from "../../contracts/mastodonMessageEvent";
import { quickSilverCompanionMentionHandler } from "../../features/quickSilverCompanion/quickSilverCompanion";
import { randomDialogHandler } from "../../features/randomDialog/randomDialog";
import { getMastodonService } from "../../services/external/mastodon/mastodonService";
import { getMemory } from "../../services/internal/inMemoryService";
import { getLog } from "../../services/internal/logService";

export const onDirectMessageHandler = async (botName: string, botType: BotType, payload: MastodonMessageEventData) => {
    const mastodonService = getMastodonService();
    const memoryService = getMemory();

    const clientMeta = memoryService.getMastodonClient(botType);
    if (clientMeta == null) {
        getLog().e(`${botName} - Could not find mastoClient in onDirectMessageHandler`);
        return;
    }

    if (botsThatUsRandomDialog().includes(botType)) {
        await randomDialogHandler(clientMeta, payload, mastodonService);
    }

    if (botType == BotType.qsCompanion) {
        await quickSilverCompanionMentionHandler(clientMeta, payload, mastodonService);
    }
}