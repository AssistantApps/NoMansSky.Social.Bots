import { GameItemService, } from 'assistantapps-nomanssky-info';
import { createReadStream, writeFileSync } from 'fs';

import { MastodonClientMeta } from "../../contracts/mastoClientMeta";
import { MastodonMakeToot } from "../../contracts/mastodonMakeToot";
import { MastodonMessageEventData } from "../../contracts/mastodonMessageEvent";
import { getBase64FromAssistantNmsImage, getBufferFromSvg, getTempFile } from '../../helper/fileHelper';
import { randomIntFromRange } from '../../helper/randomHelper';
import { getAssistantNmsApi } from "../../services/api/assistantNmsApiService";
import { getDatabaseService } from '../../services/external/database/databaseService';
import { IMastodonService } from '../../services/external/mastodon/mastodonService.interface';
import { getLog } from "../../services/internal/logService";
import { cronusRandomReviewAvailableBackgrounds, cronusRandomReviewSvgTemplate } from './cronusRandomReview.svg.template';

export const cronusRandomReviewMentionHandler = async (
    clientMeta: MastodonClientMeta,
    payload: MastodonMessageEventData,
    mastodonService: IMastodonService
) => {
    const databaseService = getDatabaseService();

    // const scheduledDate = new Date();
    // scheduledDate.setMinutes(scheduledDate.getMinutes() + 2);

    // const assistantNmsApi = getAssistantNmsApi();
    // const cmResult = await assistantNmsApi.getCommunityMission();
    // if (cmResult.isSuccess == false) {
    //     getLog().e(clientMeta.name, 'Could not fetch Community Mission', cmResult.errorMessage);
    //     // TODO maybe send a message to user
    // }

    // const dataService = new DataService();
    // const qsStoreItems = await dataService.getQuicksilverStore();

    // let compiledTemplate: string | null = null;
    // let messageToSend = `Greetings traveller`;
    // if (username != null) {
    //     messageToSend += ` @${username}. `;
    // } else {
    //     messageToSend += `! `;
    // }
    // messageToSend = `\nThe Space Anomaly is accumulating research data from Travellers across multiple realities. `;

    // try {
    //     const current = qsStoreItems.find((qs: QuicksilverStore) => qs.MissionId == cmResult.value.missionId);
    //     const itemId = current?.Items?.[(cmResult.value.currentTier - 1)]?.ItemId;
    //     if (itemId == null) throw 'Item not found by tier';

    //     const gameItemService = new GameItemService();
    //     const itemData = await gameItemService.getItemDetails(itemId);
    //     if (itemData == null) throw 'Item not found by id';

    //     const shareLink = `https://app.nmsassistant.com/link/en/${itemData.Id}.html`;
    //     messageToSend = messageToSend + `\n\nCurrent item being researched: ${itemData.Name}.\n${shareLink}`;

    //     const imgDestData = await getBase64FromAssistantNmsImage(itemData.Icon);

    //     compiledTemplate = communityMissionSvgTemplate({
    //         ...cmResult.value,
    //         itemName: itemData.Name,
    //         qsCost: itemData.BaseValueUnits,
    //         itemImgData: imgDestData,
    //     });
    // }
    // catch (ex) {
    //     getLog().e(clientMeta.name, 'error getting community mission details', ex);
    // }

    // if (compiledTemplate == null) {
    //     getLog().e(clientMeta.name, 'error getting community mission details', 'compiledTemplate == null');
    //     return;
    // }

    // const params: MastodonMakeToot = {
    //     status: messageToSend,
    //     in_reply_to_id: replyToId,
    //     visibility: visibility,
    //     scheduled_at: scheduledDate.toISOString(),
    // }
    // const mediaIdCache = getTempFile('qsCompanion-', 'json');
    // try {
    //     const mediaIdCacheContent: any = readFileSync(mediaIdCache);
    //     const mediaIdCacheArr = JSON.parse(mediaIdCacheContent);
    //     if (Array.isArray(mediaIdCacheArr)) {
    //         sendToot(clientMeta, {
    //             ...params,
    //             media_ids: mediaIdCacheArr,
    //         });
    //         return;
    //     }
    // }
    // catch (_) {
    // }

    // try {
    //     getBufferFromSvg(
    //         'qsCompanion-',
    //         compiledTemplate,
    //         (outputFilePath: string) => {
    //             const fileStream = createReadStream(outputFilePath);
    //             mastodonService.uploadTootMedia(clientMeta, fileStream).then((mediaId) => {
    //                 // const mediaIdCacheContent = JSON.stringify([mediaId]);
    //                 // writeFileSync(mediaIdCache, mediaIdCacheContent);

    //                 mastodonService.sendToot(clientMeta, {
    //                     ...params,
    //                     media_ids: [mediaId],
    //                 });
    //                 getLog().i(clientMeta.name, 'quicksilver companion response', params);
    //             });
    //         }
    //     );
    // }
    // catch (ex) {
    //     getLog().e(clientMeta.name, 'error generating community mission image', ex);
    // }
}


export const cronusRandomReviewCompileTemplate = async (): Promise<string> => {
    const selectedBackgroundIndex = randomIntFromRange(0, cronusRandomReviewAvailableBackgrounds.length);

    const gameItemService = new GameItemService();
    const cooking = await gameItemService.getJsonList('Cooking.lang.json');
    const cookingIndex = randomIntFromRange(0, cooking.length);
    const selectedCookingItem = cooking[cookingIndex];

    const cookingValue = selectedCookingItem.CookingValue;
    const cookingPerc: string = ((cookingValue + 1) * cookingValue * 47).toFixed(0);

    const compiledTemplate = await cronusRandomReviewSvgTemplate({
        selectedBackground: cronusRandomReviewAvailableBackgrounds[selectedBackgroundIndex],
        reviewDialog: 'this is a test image',
        iconPath: selectedCookingItem.Icon,
        itemName: selectedCookingItem.Name,
        naniteValue: cookingPerc,
        starValue: cookingValue * 5,
    });

    const outputFilePathsvg = getTempFile('cronus', 'svg');
    writeFileSync(outputFilePathsvg, compiledTemplate);

    return compiledTemplate;
}
