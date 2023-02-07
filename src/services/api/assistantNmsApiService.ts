import { Container, Inject, Service } from "typedi";

import { CommunityMissionViewModel } from '../../contracts/generated/communityMissionViewModel';
import { ItemDetailsViewModel } from "../../contracts/generated/itemDetailsViewModel";
import { ResultWithValue } from '../../contracts/resultWithValue';
import { ConfigService } from "../internal/configService";
import { BaseApiService } from './baseApiService';

@Service()
export class AssistantNmsApiService extends BaseApiService {
    constructor(@Inject() config: ConfigService) {
        super(config.getAssistantNMSUrl());
    }

    async getCommunityMission(): Promise<ResultWithValue<CommunityMissionViewModel>> {
        return await this.get<CommunityMissionViewModel>('HelloGames/CommunityMission/');
    }

    async getGameItemInfo(appId: string, lang: string = 'en'): Promise<ResultWithValue<ItemDetailsViewModel>> {
        return await this.get<ItemDetailsViewModel>(`ItemInfo/${appId}/${lang}`);
    }
}

export const getAssistantNmsApi = () => Container.get(AssistantNmsApiService);
