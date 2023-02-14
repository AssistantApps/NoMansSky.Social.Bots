import { Container, Service } from "typedi";
import { MastodonConversation } from "../../contracts/mastodonConversation";
import { ResultWithValue } from "../../contracts/resultWithValue";
import { BaseApiService } from "./baseApiService";

@Service()
export class MastodonApiService extends BaseApiService {
    constructor() {
        super('https://nomanssky.social/api');
    }

    getConversations = (accessToken: string): Promise<ResultWithValue<Array<MastodonConversation>>> => {
        return this.get<Array<MastodonConversation>>('v1/conversations', () => ({
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        }));
    }
}

export const getMastodonApi = () => Container.get(MastodonApiService);
