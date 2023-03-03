import { mastodon } from "masto"
import { MastodonNotification } from "../contracts/mastodonNotification"
import { mapAccountToDto } from "./mastodonAccountMapper"
import { mapStatusToDto } from "./mastodonStatusMapper"

export const mapNotificationToDto = (orig: mastodon.v1.Notification): MastodonNotification => {
    return {
        id: orig.id,
        type: orig.type,
        createdAt: orig.createdAt,
        account: mapAccountToDto(orig.account),
        status: mapStatusToDto(orig.status),
    }
}