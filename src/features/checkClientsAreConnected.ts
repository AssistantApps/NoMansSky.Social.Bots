import { reCreateClientAndListeners } from "../helper/clientHelper";
import { getMastodonService } from "../services/external/mastodon/mastodonService";
import { getMemory } from "../services/internal/inMemoryService";
import { getLog } from "../services/internal/logService";

const secondsInMilli = 1000;
const minuteInMilli = 60 * secondsInMilli;

export const setupConnectedInterval = () => {
    const interval = setInterval(areClientsStillConnected, (5 * minuteInMilli));
    return interval;
}

const areClientsStillConnected = async () => {
    getLog().i('areClientsStillConnected check');
    const inMemoryService = getMemory();
    const mastoService = getMastodonService();

    const mastoClients = inMemoryService.getAllMastodonClients();
    for (const mastoClient of mastoClients) {
        try {
            const botPref = await mastoService.preferences(mastoClient);
            getLog().i(`${mastoClient.name} - preference - ${botPref["posting:default:visibility"]}`);
        } catch (err: any) {
            getLog().e('areClientsStillConnected', err);
            getLog().i('reconnecting');

            const currentClient = inMemoryService.getMastodonClient(mastoClient.type);
            if (currentClient != null) {
                reCreateClientAndListeners(currentClient);
                getLog().i(`${mastoClient.name} - should be reconnected`);
            }
        }
    }
}
