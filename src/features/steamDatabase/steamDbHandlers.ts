import { readFileSync, writeFileSync } from 'fs';

import { SteamBranch } from '../../contracts/generated/steamBranch';
import { MastodonClientMeta } from "../../contracts/mastoClientMeta";
import { MastodonMakeToot } from "../../contracts/mastodonMakeToot";
import { getTempFile, writePngFromSvg } from '../../helper/fileHelper';
import { getAssistantAppsApi } from '../../services/api/assistantAppsApiService';
import { IMastodonService } from '../../services/external/mastodon/mastodonService.interface';
import { getLog } from "../../services/internal/logService";
import { steamDBSvgTemplate } from './steamDb.svg.template';

export const steamDBToot = async (props: {
    clientMeta: MastodonClientMeta,
    mastodonService: IMastodonService,
    branches: Array<SteamBranch>,
    tootParams: MastodonMakeToot
}) => {

    let compiledTemplate: string | undefined;
    try {
        compiledTemplate = await steamDBSvgTemplate({
            branches: props.branches,
        });
    }
    catch (ex) {
        getLog().e(props.clientMeta.name, 'error getting steamDb', ex);
    }

    if (compiledTemplate == null) {
        getLog().e(props.clientMeta.name, 'error steamDb', 'compiledTemplate == null');
        return;
    }

    try {
        writePngFromSvg(
            'steamdb-',
            compiledTemplate,
            (outputFilePath: string) => {
                const fileStream = readFileSync(outputFilePath);
                props.mastodonService.sendTootWithMedia(props.clientMeta, fileStream, props.tootParams);
                getLog().i(props.clientMeta.name, 'steamDb response', props.tootParams);

            }
        );
    }
    catch (ex) {
        getLog().e(props.clientMeta.name, 'error generating steamDb image', ex);
    }
}

export const steamDBFetchAndCompileTemplate = async (): Promise<string> => {
    const assistantApi = getAssistantAppsApi();
    const branchesResult = await assistantApi.getSteamBranches();
    if (branchesResult.isSuccess == false) {
        getLog().e('Could not fetch Steam Branches', branchesResult.errorMessage);
    }

    const compiledTemplate = await steamDBSvgTemplate({
        branches: branchesResult.value,
    });

    const outputFilePathsvg = getTempFile('steamDb', 'svg');
    writeFileSync(outputFilePathsvg, compiledTemplate);

    return compiledTemplate;
}
