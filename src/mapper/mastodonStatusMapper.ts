import { mastodon } from "masto";
import { MastodonLastStatus } from "../contracts/mastodonLastStatus";
import { mapAccountToDto } from "./mastodonAccountMapper";
import { mapEmojiToDto } from "./mastodonEmojiMapper";

export const mapStatusToDto = (orig?: mastodon.v1.Status | null): MastodonLastStatus | undefined => {
    if (orig == null) return undefined;
    return {
        id: orig.id,
        created_at: new Date(orig.createdAt),
        in_reply_to_id: orig.inReplyToId,
        in_reply_to_account_id: orig.inReplyToAccountId,
        sensitive: orig.sensitive,
        spoiler_text: orig.spoilerText,
        visibility: orig.visibility,
        language: orig.language,
        uri: orig.uri,
        url: orig.url,
        replies_count: orig.repliesCount,
        reblogs_count: orig.reblogsCount,
        favourites_count: orig.favouritesCount,
        // edited_at: orig.editedAt,
        favourited: orig.favourited ?? false,
        reblogged: orig.reblogged ?? false,
        muted: orig.muted ?? false,
        bookmarked: orig.bookmarked ?? false,
        content: orig.content,
        // filtered: orig.filtered,
        // reblog: orig.reblog,
        application: orig.application,
        account: mapAccountToDto(orig.account),
        media_attachments: orig.mediaAttachments,
        mentions: orig.mentions,
        tags: orig.tags,
        emojis: orig.emojis.map(mapEmojiToDto),
        // card: orig.card,
        // poll: orig.poll,
    }
}