export interface MastodonDomainBlock {
    id: string;
    domain: string;
    created_at: Date;
    severity: string;
    reject_media: boolean;
    reject_reports: boolean;
    private_comment: string;
    public_comment: string;
    obfuscate: boolean;
}
