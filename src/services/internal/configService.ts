import { Container, Service, Token } from "typedi";

@Service()
export class ConfigService {
    getMastodonUrl = (): string => this.get<string>('VITE_MASTODON_API_URL');
    getMastodonTimeout = (): number => this.get<number>('VITE_MASTODON_TIMEOUT_MS');
    getAssistantNMSUrl = (): string => this.get<string>('VITE_ANMS_API_URL');
    getAssistantAppsUrl = (): string => this.get<string>('VITE_AA_API_URL');

    getEncryptionKey = (): string => this.get<string>('VITE_ENCRYPTION_KEY');
    getApiPort = (): number => this.get<number>('VITE_API_PORT');

    getXataApiKey = (): string => this.get<string>('XATA_API_KEY');
    getXataDbUrl = (): string => this.get<string>('XATA_DB_URL');
    getXataFallbackBranch = (): string => this.get<string>('XATA_FALLBACK_BRANCH');

    get<T>(property: string): T {
        return (process?.env?.[property] ?? '') as T;
    };

    isProd = () => this.get<string>('NODE_ENV') === 'production';
    buildVersion = () => this.get<string>('BUILD_VERSION');
}

export const BOT_PATH = new Token<string>('BOT_PATH');
export const getBotPath = () => Container.get(BOT_PATH);

export const getConfig = () => Container.get(ConfigService);
