import { MastodonClientMeta } from "../contracts/mastoClientMeta";
import { MastodonMakeToot } from "../contracts/mastodonMakeToot";

export const sendBasicToot = (mastoClient: MastodonClientMeta, message: string, id: string | null = null) => {
    const params: MastodonMakeToot = {
        status: message
    }

    if (id != null) {
        params.in_reply_to_id = id;
    }

    sendToot(mastoClient, params);
}

export const sendToot = (mastoClient: MastodonClientMeta, params: MastodonMakeToot) => {
    mastoClient.client.post('statuses', params, (error: any, data: any) => {
        if (error) {
            console.error(mastoClient.name, error);
        }
    });
}