import { Container, Service, Token } from "typedi";
import { anyObject } from "../../helper/typescriptHacks";

@Service()
export class ConfigService {
    getMastodonUrl = (): string => this.get<string>('MASTODON_API_URL');
    getMastodonTimeout = (): number => this.get<number>('MASTODON_TIMEOUT_MS');
    getAssistantNMSUrl = (): string => this.get<string>('ANMS_API_URL');
    getAssistantAppsUrl = (): string => this.get<string>('AA_API_URL');
    getEncryptionKey = (): string => this.get<string>('ENCRYPTION_KEY');
    getXataApiKey = (): string => this.get<string>('XATA_API_KEY');
    getXataDbUrl = (): string => this.get<string>('XATA_DB_URL');
    getXataFallbackBranch = (): string => this.get<string>('XATA_FALLBACK_BRANCH');

    get<T>(property: string): T {
        let correctedProp = '';
        let envObj = anyObject;

        if (this.isVite()) {
            correctedProp = `VITE_${property}`
            envObj = import.meta.env;
        } else {
            correctedProp = property;
            envObj = process.env;
        }

        // console.log({ envObj });
        // console.log(correctedProp);
        return (envObj?.[correctedProp] ?? '') as T;
    };

    isVite = () => import.meta != null;
    isProd = () => this.get<string>('NODE_ENV') === 'production';
}

export const BOT_PATH = new Token<string>('BOT_PATH');
export const getBotPath = () => Container.get(BOT_PATH);

export const getConfig = () => Container.get(ConfigService);
