import { BotType } from "../constants/enum/botType";
import { getMastodonService } from "../services/external/mastodon/mastodonService";
import { getMemory } from "../services/internal/inMemoryService";
import { getLog } from "../services/internal/logService";

export const onErrorHandler = (botName: string, botType: BotType) => (err: any) => {
    getLog().e(botName, err);
    if (err.toString().includes('aborted')) {
        getLog().i('error does contain `aborted`');
    }

    getLog().i('reconnecting');
    const inMemoryService = getMemory();
    const mastoService = getMastodonService();

    inMemoryService.setMastodonClient(botType, (existing) => {
        return {
            ...existing,
            client: mastoService.createClient(existing as any),
        }
    });
    getLog().i(`${botName} - should be reconnected`);
}