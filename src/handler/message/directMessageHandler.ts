import { mastodon } from "masto";

import { botsThatUseRandomDialog, BotType } from "../../constants/enum/botType";
import { quickSilverCompanionMentionHandler } from "../../features/quickSilverCompanion/quickSilverCompanion";
import { randomDialogHandler } from "../../features/randomDialog/randomDialog";
import { getMastodonService } from "../../services/external/mastodon/mastodonService";
import { getMemory } from "../../services/internal/inMemoryService";
import { getLog } from "../../services/internal/logService";

export const onDirectMessageHandler = async (botName: string, botType: BotType, payload: mastodon.v1.Notification) => {
    const mastodonService = getMastodonService();
    const memoryService = getMemory();

    const clientMeta = memoryService.getMastodonClient(botType);
    if (clientMeta == null) {
        getLog().e(`${botName} - Could not find mastoClient in onDirectMessageHandler`);
        return;
    }

    if (botsThatUseRandomDialog().includes(botType)) {
        getLog().i(`${botName} - Random dialog handler`);
        await randomDialogHandler(clientMeta, payload, mastodonService);
    }

    if (botType == BotType.qsCompanion) {
        await quickSilverCompanionMentionHandler(clientMeta, payload, mastodonService);
    }
}