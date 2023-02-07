import { Container, Service, Inject } from "typedi";

import { ConfigService } from "../internal/configService";
// import { ResultWithValueAndPagination } from '../../contracts/resultWithValue';
import { BaseApiService } from './baseApiService';
// import { VersionViewModel } from '../../contracts/generated/AssistantApps/ViewModel/Version/versionViewModel';
// import { VersionSearchViewModel } from '../../contracts/generated/AssistantApps/ViewModel/Version/versionSearchViewModel';
// import { DonationViewModel } from '../../contracts/generated/AssistantApps/ViewModel/donationViewModel';

@Service()
export class AssistantAppsApiService extends BaseApiService {
    constructor(@Inject() config: ConfigService) {
        super(config.getAssistantAppsUrl());
    }

    // async getWhatIsNewItems(search: VersionSearchViewModel): Promise<ResultWithValueAndPagination<Array<VersionViewModel>>> {
    //     const result = await this.post<Array<VersionViewModel>, VersionSearchViewModel>(
    //         'Version/Search', search,
    //         (response: any) => {
    //             return {
    //                 ...response.data,
    //                 isSuccess: true,
    //                 errorMessage: '',
    //             };
    //         });

    //     return result as ResultWithValueAndPagination<Array<VersionViewModel>>;
    // }

    // async getDonators(page: number): Promise<ResultWithValueAndPagination<Array<DonationViewModel>>> {
    //     const apiResult: any = await this.get<Array<DonationViewModel>>(`Donation?page=${page}`);
    //     return apiResult.value;
    // }
}

export const getAssistantAppsApi = () => Container.get(AssistantAppsApiService);
