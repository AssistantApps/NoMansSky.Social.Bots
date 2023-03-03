import { mastodon } from "masto"
import { MastodonDomainBlock } from "../contracts/mastodonDomainBlock"

export const mapDomainBlockToDto = (orig: mastodon.v1.Admin.DomainBlock): MastodonDomainBlock => {
    return {
        id: orig.id,
        domain: orig.domain,
        created_at: new Date(orig.createdAt),
        severity: orig.severity,
        reject_media: orig.rejectMedia,
        reject_reports: orig.rejectReposts,
        private_comment: orig.privateComment,
        public_comment: orig.publicComment,
        obfuscate: orig.obfuscate,
    }
}