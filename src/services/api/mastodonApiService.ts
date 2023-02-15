import { Container, Service } from "typedi";

import { getLinkQueryParams } from "../../admin/helper/linkHeaderHelper";
import { MastodonAnnouncement } from "../../contracts/mastodonAnnouncement";
import { MastodonConversation } from "../../contracts/mastodonConversation";
import { MastodonDomainBlock } from "../../contracts/mastodonDomainBlock";
import { MastodonMakeToot } from "../../contracts/mastodonMakeToot";
import { Result, ResultWithValue, ResultWithValueAndPageLink } from "../../contracts/resultWithValue";
import { BaseApiService } from "./baseApiService";

@Service()
export class MastodonApiService extends BaseApiService {
    constructor() {
        super('https://nomanssky.social/api');
    }

    createToot = (accessToken: string, params: MastodonMakeToot): Promise<Result> => {
        return this.post('v1/statuses', params, () => ({
            headers: {
                'Authorization': `Bearer ${accessToken}`,
            }
        }));
    }

    getConversations = (accessToken: string): Promise<ResultWithValue<Array<MastodonConversation>>> => {
        return this.get<Array<MastodonConversation>>('v1/conversations', () => ({
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        }));
    }

    getAnnouncements = (accessToken: string, withDismissed: boolean = false): Promise<ResultWithValue<Array<MastodonAnnouncement>>> => {
        let url = 'v1/announcements';
        if (withDismissed) url += '?with_dismissed=true'
        return this.get<Array<MastodonAnnouncement>>(url, () => ({
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        }));
    }

    getDomainBlocks = async (
        accessToken: string,
        extraQuery: string,
        pageSize: number = 25
    ): Promise<ResultWithValueAndPageLink<Array<MastodonDomainBlock>>> => {
        let url = `v1/admin/domain_blocks?limit=${pageSize}`;
        if (extraQuery.length > 0) {
            url += `&${extraQuery}`;
        }
        const response: any = await this.get<Array<MastodonDomainBlock>>(url, () => ({
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        }),
            (response) => {
                const linkArr = getLinkQueryParams(response.headers['link']);
                return {
                    isSuccess: true,
                    value: response.data,
                    prevPage: linkArr[0],
                    nextPage: linkArr[1],
                    errorMessage: ''
                };
            });

        return response;
    }

    unblockDomain = async (id: string): Promise<Result> => {
        let url = `v1/admin/domain_blocks/${id}`;
        return this.delete(url);
    }
}

export const getMastodonApi = () => Container.get(MastodonApiService);
