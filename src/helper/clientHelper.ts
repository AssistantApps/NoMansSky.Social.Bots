import { MastodonClientMeta } from "../contracts/mastoClientMeta";
import { onErrorHandler } from "../handler/errorHandler";
import { onMessageHandler } from "../handler/messageHandler";
import { getMastodonService } from "../services/external/mastodon/mastodonService";
import { getMemory } from "../services/internal/inMemoryService";

export const setupListenersForClientMeta = (mastoClient: MastodonClientMeta) => {
    const listener: any = mastoClient.client.stream('streaming/user');
    listener.on('error', onErrorHandler(mastoClient.name, mastoClient.type));
    listener.on('message', onMessageHandler(mastoClient.name, mastoClient.type));

    const inMemoryService = getMemory();

    inMemoryService.setMastodonClient(mastoClient.type, (existing) => {
        return {
            ...existing,
            client: mastoClient.client,
            listener,
        }
    });
}

export const reCreateClientAndListeners = (mastoClient: MastodonClientMeta) => {
    const mastoService = getMastodonService();

    const client = mastoService.createClient(mastoClient as any);
    setupListenersForClientMeta({
        ...mastoClient,
        client: client
    })
}