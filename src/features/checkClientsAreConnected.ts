import { getMastodonService } from "../services/external/mastodon/mastodonService";
import { getMemory } from "../services/internal/inMemoryService";

const secondsInMilli = 1000;
const minuteInMilli = 60 * secondsInMilli;

export const setupConnectedInterval = () => {
    const interval = setInterval(areClientsStillConnected, (5 * minuteInMilli));
    return interval;
}

const areClientsStillConnected = async () => {
    const inMemoryService = getMemory();
    const mastoService = getMastodonService();

    const mastoClients = inMemoryService.getAllMastodonClients();
    for (const mastoClient of mastoClients) {
        await mastoService.preferences(mastoClient);
    }
}
