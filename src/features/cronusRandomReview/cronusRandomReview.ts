import { GameItemService, } from 'assistantapps-nomanssky-info';
import { createReadStream, readFileSync, writeFileSync } from 'fs';

import { MastodonClientMeta } from "../../contracts/mastoClientMeta";
import { MastodonMakeToot } from "../../contracts/mastodonMakeToot";
import { MastodonMessageEventData } from "../../contracts/mastodonMessageEvent";
import { getBase64FromAssistantNmsImage, getBufferFromSvg, getTempFile, writePngFromSvg } from '../../helper/fileHelper';
import { randomIntFromRange } from '../../helper/randomHelper';
import { getAssistantNmsApi } from "../../services/api/assistantNmsApiService";
import { getDatabaseService } from '../../services/external/database/databaseService';
import { IMastodonService } from '../../services/external/mastodon/mastodonService.interface';
import { getLog } from "../../services/internal/logService";
import { cronusRandomReviewAvailableBackgrounds, cronusRandomReviewSvgTemplate } from './cronusRandomReview.svg.template';
import { cronusRandomDialog } from './cronusRandomDialog';

export const cronusRandomReviewToot = async (props: {
    clientMeta: MastodonClientMeta,
    mastodonService: IMastodonService,
    compiledTemplate: string,
    tootParams: MastodonMakeToot
}) => {

    try {
        writePngFromSvg(
            'cronus-random-',
            props.compiledTemplate,
            (outputFilePath: string) => {
                const fileStream = readFileSync(outputFilePath);
                props.mastodonService.sendTootWithMedia(props.clientMeta, fileStream, props.tootParams);
                getLog().i(props.clientMeta.name, 'cronus random response', props.tootParams);

            }
        );
    }
    catch (ex) {
        getLog().e(props.clientMeta.name, 'error generating steamDb image', ex);
    }
}


export const cronusRandomReviewCompileTemplate = async (): Promise<string> => {
    const selectedBackgroundIndex = randomIntFromRange(0, cronusRandomReviewAvailableBackgrounds.length);

    const gameItemService = new GameItemService();
    const cooking = await gameItemService.getJsonList('Cooking.lang.json');
    const cookingIndex = randomIntFromRange(0, cooking.length);
    const selectedCookingItem = cooking[cookingIndex];

    const cookingValue = selectedCookingItem.CookingValue;
    const cookingPerc: string = ((cookingValue + 1) * cookingValue * 47).toFixed(0);
    const starValue: number = (cookingValue * 5);

    const randomDialogOptions: Array<string> = cronusRandomDialog[starValue.toFixed(0)];
    const randomDialogOptionIndex = randomIntFromRange(0, randomDialogOptions.length);
    const selectedRandomDialogOption = randomDialogOptions[randomDialogOptionIndex];

    const compiledTemplate = await cronusRandomReviewSvgTemplate({
        selectedBackground: cronusRandomReviewAvailableBackgrounds[selectedBackgroundIndex],
        reviewDialog: selectedRandomDialogOption,
        iconPath: selectedCookingItem.Icon,
        itemName: selectedCookingItem.Name,
        naniteValue: cookingPerc,
        starValue: starValue,
    });

    const outputFilePathsvg = getTempFile('cronus', 'svg');
    writeFileSync(outputFilePathsvg, compiledTemplate);

    return compiledTemplate;
}
