import { Container, Service } from "typedi";

import { GithubDialog } from "../../contracts/github/githubDialog";
import { ResultWithValue } from '../../contracts/resultWithValue';
import { anyObject } from "../../helper/typescriptHacks";
import { BaseApiService } from './baseApiService';

@Service()
export class GithubFileService extends BaseApiService {
    constructor() {
        super('https://raw.githubusercontent.com');
    }

    getDialogFile = (): Promise<ResultWithValue<GithubDialog>> =>
        this._getFile<GithubDialog>('/AssistantApps/NoMansSky.Social.Bots/main/src/assets/data/dialogs.json');

    async _getFile<T>(fullUrl: string): Promise<ResultWithValue<T>> {
        const fileContentResult = await this.get<T>(fullUrl);
        if (!fileContentResult.isSuccess) {
            return {
                ...fileContentResult,
                value: anyObject,
            }
        }
        return fileContentResult;
    }
}

export const getGithubFileService = () => Container.get(GithubFileService);
