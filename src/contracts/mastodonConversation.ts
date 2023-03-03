import { MastodonAccount } from "./mastodonAccount";
import { MastodonLastStatus } from "./mastodonLastStatus";

export interface MastodonConversation {
    id: string;
    unread: boolean;
    accounts: Array<MastodonAccount>;
    last_status?: MastodonLastStatus;
}