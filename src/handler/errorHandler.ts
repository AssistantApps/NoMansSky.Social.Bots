import { BotType } from "../constants/enum/botType";
import { reCreateClientAndListeners } from "../helper/clientHelper";
import { getMemory } from "../services/internal/inMemoryService";
import { getLog } from "../services/internal/logService";

export const onErrorHandler = (botName: string, botType: BotType) => (err: any) => {
    getLog().e(botName, err);
    if (err.toString().includes('aborted')) {

        getLog().i('reconnecting');
        const inMemoryService = getMemory();

        const currentClient = inMemoryService.getMastodonClient(botType);
        if (currentClient != null) {
            reCreateClientAndListeners(currentClient);
            getLog().i(`${botName} - should be reconnected`);
        }
    }
}