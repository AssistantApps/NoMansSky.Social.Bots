import { MastodonAccount } from "./mastodonAccount";
import { MastodonLastStatus } from "./mastodonLastStatus";

export interface MastodonNotification {
    id: string;
    type: MastodonNotificationType;
    createdAt: string;
    account: MastodonAccount;
    status?: MastodonLastStatus;
}

export type MastodonNotificationType = 'mention' | 'status' | 'reblog' | 'follow' | 'follow_request' | 'favourite' | 'poll' | 'update' | 'admin.sign_up' | 'admin.report';
