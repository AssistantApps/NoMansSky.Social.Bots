import { mastodon } from "masto"
import { MastodonAccount } from "../contracts/mastodonAccount"
import { mapEmojiToDto } from "./mastodonEmojiMapper"
import { mapFieldToDto } from "./mastodonFieldMapper"

export const mapAccountToDto = (orig: mastodon.v1.Account): MastodonAccount => {
    return {
        id: orig.id,
        username: orig.username,
        acct: orig.acct,
        display_name: orig.displayName,
        locked: orig.locked,
        bot: orig.bot ?? false,
        discoverable: orig.discoverable,
        created_at: new Date(orig.createdAt),
        note: orig.note,
        url: orig.url,
        avatar: orig.avatar,
        avatar_static: orig.avatarStatic,
        header: orig.header,
        header_static: orig.headerStatic,
        followers_count: orig.followersCount,
        following_count: orig.followingCount,
        statuses_count: orig.statusesCount,
        last_status_at: new Date(orig.lastStatusAt),
        // noindex: orig.noindex,
        emojis: orig.emojis.map(mapEmojiToDto),
        fields: orig.fields?.map(mapFieldToDto),
    }
}