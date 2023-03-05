import { MastodonClientMeta } from "../contracts/mastoClientMeta";
import { onDisconnectHandler, onErrorHandler } from "../handler/errorHandler";
import { onNotificationHandler, onConversationHandler } from "../handler/messageHandler";
import { getMastodonService } from "../services/external/mastodon/mastodonService";
import { getMemory } from "../services/internal/inMemoryService";
import { getLog } from "../services/internal/logService";

export const setupListenersForClientMeta = async (mastoClient: MastodonClientMeta) => {
    const botName = mastoClient.name;
    getLog().i(botName, 'Setting up listeners for bot');

    const mastodonService = getMastodonService();
    const stream = await mastodonService.getStream(mastoClient);
    stream.on('notification', onNotificationHandler(botName, mastoClient.type));
    stream.on('conversation', onConversationHandler(botName, mastoClient.type));
    (stream as any).ws.on('error', onErrorHandler(botName, mastoClient.type));
    (stream as any).ws.on('close', onDisconnectHandler(botName, mastoClient.type));

    const inMemoryService = getMemory();

    inMemoryService.setMastodonClient(mastoClient.type, (existing) => {
        try {
            if (existing.stream != null) {
                getLog().i(botName, 'removeAllListeners');
                existing.stream.removeAllListeners();
                existing.stream.disconnect();
            }
        }
        catch (err: any) {
            getLog().e('setupListenersForClientMeta', err);
        }
        return {
            ...existing,
            client: mastoClient.client,
            stream: stream,
        }
    });
}

export const reCreateClientAndListeners = async (mastoClient: MastodonClientMeta) => {
    const mastoService = getMastodonService();

    const client = await mastoService.createClient(mastoClient as any);
    setupListenersForClientMeta({
        ...mastoClient,
        client: client
    })
}