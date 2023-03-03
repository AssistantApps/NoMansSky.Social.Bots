import { mastodon } from "masto"
import { MastodonAnnouncement } from "../contracts/mastodonAnnouncement"
import { mapEmojiToDto } from "./mastodonEmojiMapper"
import { mapReactionToDto } from "./mastodonReactionMapper"

export const mapAnnouncementToDto = (orig: mastodon.v1.Announcement): MastodonAnnouncement => {
    return {
        id: orig.id,
        content: orig.content,
        starts_at: new Date(orig.startsAt),
        ends_at: new Date(orig.endsAt),
        all_day: orig.allDay,
        published_at: new Date(orig.publishedAt),
        updated_at: new Date(orig.updatedAt),
        read: true,//orig.read,
        mentions: orig.mentions,
        statuses: orig.statuses,
        tags: orig.tags,
        emojis: orig.emojis.map(mapEmojiToDto),
        reactions: orig.reactions.map(mapReactionToDto),
    }
}