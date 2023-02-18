import { DataService, GameItemService, QuicksilverStore } from 'assistantapps-nomanssky-info';
import { createReadStream } from 'fs';
import { CommunityMissionViewModel } from '../../contracts/generated/communityMissionViewModel';

import { MastodonClientMeta } from "../../contracts/mastoClientMeta";
import { MastodonMakeToot } from "../../contracts/mastodonMakeToot";
import { MastodonMessageEventData } from "../../contracts/mastodonMessageEvent";
import { getBase64FromAssistantNmsImage, getBufferFromSvg } from '../../helper/fileHelper';
import { getAssistantNmsApi } from "../../services/api/assistantNmsApiService";
import { IMastodonService } from '../../services/external/mastodon/mastodonService.interface';
import { getLog } from "../../services/internal/logService";
import { communityMissionSvgTemplate } from './communityMission.svg.template';

export const quickSilverCompanionMentionHandler = async (
    clientMeta: MastodonClientMeta,
    payload: MastodonMessageEventData,
    mastodonService: IMastodonService
) => {
    quickSilverCompanionGetDataFromEndpointAndToot(
        clientMeta,
        mastodonService,
        payload.status.id,
        payload.status.visibility,
        payload.account.username
    );
}

export const quickSilverCompanionGetDataFromEndpointAndToot = async (
    clientMeta: MastodonClientMeta,
    mastodonService: IMastodonService,
    replyToId?: string,
    visibility: "public" | "unlisted" | "private" | "direct" | undefined = 'public',
    username?: string,
) => {
    const scheduledDate = new Date();
    scheduledDate.setMinutes(scheduledDate.getMinutes() + 2);

    const assistantNmsApi = getAssistantNmsApi();
    const cmResult = await assistantNmsApi.getCommunityMission();
    if (cmResult.isSuccess == false) {
        getLog().e(clientMeta.name, 'Could not fetch Community Mission', cmResult.errorMessage);
        // TODO maybe send a message to user
    }

    let messageToSend = `Greetings traveller`;
    if (username != null) {
        messageToSend += ` @${username}. `;
    } else {
        messageToSend += `s! `;
    }
    messageToSend += `\nThe Space Anomaly is accumulating research data from Travellers across multiple realities. `;

    const params: MastodonMakeToot = {
        status: messageToSend,
        visibility: visibility,
        scheduled_at: scheduledDate.toISOString(),
    }

    if (replyToId != null) {
        params.in_reply_to_id = replyToId;
    }

    await quickSilverCompanionToot({
        clientMeta: clientMeta,
        mastodonService: mastodonService,
        communityMissionData: cmResult.value,
        tootParams: params,
    });
}


export const quickSilverCompanionToot = async (props: {
    clientMeta: MastodonClientMeta,
    mastodonService: IMastodonService,
    communityMissionData: CommunityMissionViewModel,
    tootParams: MastodonMakeToot
}) => {

    const dataService = new DataService();
    const qsStoreItems = await dataService.getQuicksilverStore();

    const { missionId, currentTier } = props.communityMissionData;
    const current = qsStoreItems.find((qs: QuicksilverStore) => qs.MissionId == missionId);
    const itemId = current?.Items?.[(currentTier - 1)]?.ItemId;
    if (itemId == null) {
        getLog().e(props.clientMeta.name, 'Item not found by tier');
        return;
    }

    const gameItemService = new GameItemService();
    const itemData = await gameItemService.getItemDetails(itemId);
    if (itemData == null) {
        getLog().e(props.clientMeta.name, 'Item not found by id');
        return;
    }

    const shareLink = `https://app.nmsassistant.com/link/en/${itemData.Id}.html`;
    props.tootParams.status = props.tootParams.status + `\n\nCurrent item being researched: ${itemData.Name}.\n${shareLink}`;

    let compiledTemplate: string | null = null;
    try {
        const imgDestData = await getBase64FromAssistantNmsImage(itemData.Icon);

        compiledTemplate = communityMissionSvgTemplate({
            ...props.communityMissionData,
            itemName: itemData.Name,
            qsCost: itemData.BaseValueUnits,
            itemImgData: imgDestData,
        });
    }
    catch (ex) {
        getLog().e(props.clientMeta.name, 'error getting community mission details', ex);
    }

    if (compiledTemplate == null) {
        getLog().e(props.clientMeta.name, 'error community mission details', 'compiledTemplate == null');
        return;
    }

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

    try {
        getBufferFromSvg(
            'qsCompanion-',
            compiledTemplate,
            (outputFilePath: string) => {
                const fileStream = createReadStream(outputFilePath);
                props.mastodonService.uploadTootMedia(props.clientMeta, fileStream).then((mediaId) => {
                    // const mediaIdCacheContent = JSON.stringify([mediaId]);
                    // writeFileSync(mediaIdCache, mediaIdCacheContent);

                    props.mastodonService.sendToot(props.clientMeta, {
                        ...props.tootParams,
                        media_ids: [mediaId],
                    });
                    getLog().i(props.clientMeta.name, 'quicksilver companion response', props.tootParams);
                });
            }
        );
    }
    catch (ex) {
        getLog().e(props.clientMeta.name, 'error generating community mission image', ex);
    }
}