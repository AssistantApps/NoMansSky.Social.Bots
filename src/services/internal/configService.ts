import { Container, Service, Token } from "typedi";

@Service()
export class ConfigService {
    getMastodonUrl = (): string => this.get<string>('MASTODON_API_URL');
    getMastodonTimeout = (): number => this.get<number>('MASTODON_TIMEOUT_MS');
    getAssistantNMSUrl = (): string => this.get<string>('ANMS_API_URL');
    getAssistantAppsUrl = (): string => this.get<string>('AA_API_URL');

    get<T>(property: string): T {
        return (process.env?.[property] ?? '') as T;
    };

    isProd = () => (process.env.NODE_ENV === 'production');
}

export const BOT_PATH = new Token<string>('BOT_PATH');
export const getBotPath = () => Container.get(BOT_PATH);

export const getConfig = () => Container.get(ConfigService);
