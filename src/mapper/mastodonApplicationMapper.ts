import { mastodon } from "masto"
import { MastodonApplication } from "../contracts/mastodonLastStatus"

export const mapApplicationToDto = (orig: mastodon.v1.Application): MastodonApplication => {
    return {
        name: orig.name,
        website: orig.website,
    }
}