import { mastodon } from "masto"
import { MastodonField } from "../contracts/mastodonAccount"

export const mapFieldToDto = (orig: mastodon.v1.AccountField): MastodonField => {
    return {
        name: orig.name,
        value: orig.value,
        verified_at: orig.verifiedAt == null ? null : new Date(orig.verifiedAt),
    }
}