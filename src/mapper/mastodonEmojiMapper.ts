import { mastodon } from "masto"
import { Emoji } from "../contracts/mastodonAccount"

export const mapEmojiToDto = (orig: mastodon.v1.CustomEmoji): Emoji => {
    return {
        shortcode: orig.shortcode,
        url: orig.url,
        static_url: orig.staticUrl,
        visible_in_picker: orig.visibleInPicker,
    }
}