import { Container, Service } from "typedi";

import { GithubDialog } from "../../contracts/github/githubDialog";
import { GithubVersion } from "../../contracts/github/version";
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

    getVersionFile = (): Promise<ResultWithValue<GithubVersion>> =>
        this._getFile<GithubVersion>('/AssistantApps/NoMansSky.Social.Bots/main/public/assets/data/admin-version.json');

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
