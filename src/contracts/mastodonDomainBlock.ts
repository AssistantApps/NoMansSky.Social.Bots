export interface MastodonDomainBlock {
    id: string;
    domain: string;
    created_at: Date;
    severity: string;
    reject_media: boolean;
    reject_reports: boolean;
    private_comment?: string | null;
    public_comment?: string | null;
    obfuscate: boolean;
}
