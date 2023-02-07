import { Container, Service } from "typedi";

import { GithubDialog } from "../../contracts/github/githubDialog";
import { ResultWithValue } from '../../contracts/resultWithValue';
import { anyObject } from "../../helper/typescriptHacks";
import { BaseApiService } from './baseApiService';

@Service()
export class GithubFileService extends BaseApiService {

    getDialogFile = (): Promise<ResultWithValue<GithubDialog>> =>
        this._getFile<GithubDialog>('https://raw.githubusercontent.com/AssistantApps/NoMansSky.Social.Bots/main/src/assets/data/dialogs.json');

    async _getFile<T>(fullUrl: string): Promise<ResultWithValue<T>> {
        const fileContentResult = await this.get<string>(fullUrl);
        if (!fileContentResult.isSuccess) {
            return {
                ...fileContentResult,
                value: anyObject,
            }
        }

        const fileObj: any = JSON.parse(fileContentResult.value);
        return fileObj;
    }
}

export const getGithubFileService = () => Container.get(GithubFileService);
