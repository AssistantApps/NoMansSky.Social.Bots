import { mastodon } from "masto"
import { MastodonReaction } from "../contracts/mastodonAnnouncement"

export const mapReactionToDto = (orig: mastodon.v1.Reaction): MastodonReaction => {
    return {
        name: orig.name,
        count: orig.count,
        me: orig.me,
        url: orig.url,
        static_url: orig.staticUrl,
    }
}