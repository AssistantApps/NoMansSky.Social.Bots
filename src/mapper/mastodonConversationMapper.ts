import { mastodon } from "masto"
import { MastodonConversation } from "../contracts/mastodonConversation"
import { mapAccountToDto } from "./mastodonAccountMapper"
import { mapStatusToDto } from "./mastodonStatusMapper"

export const mapConversationToDto = (orig: mastodon.v1.Conversation): MastodonConversation => {
    return {
        id: orig.id,
        unread: orig.unread,
        accounts: orig.accounts.map(mapAccountToDto),
        last_status: mapStatusToDto(orig.lastStatus),
    }
}