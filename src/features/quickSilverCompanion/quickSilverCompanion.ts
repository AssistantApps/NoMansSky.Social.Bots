import { DataService, GameItemModel, GameItemService, QuicksilverStore } from 'assistantapps-nomanssky-info';
import { readFileSync } from 'fs';
import { mastodon } from 'masto';

import { CommunityMissionViewModel } from '../../contracts/generated/communityMissionViewModel';
import { MastodonClientMeta } from "../../contracts/mastoClientMeta";
import { MastodonMakeToot } from "../../contracts/mastodonMakeToot";
import { getBase64FromAssistantNmsImage, writePngFromSvg } from '../../helper/fileHelper';
import { getAssistantNmsApi } from "../../services/api/assistantNmsApiService";
import { IMastodonService } from '../../services/external/mastodon/mastodonService.interface';
import { getLog } from "../../services/internal/logService";
import { communityMissionSvgTemplate } from './communityMission.svg.template';

export const quickSilverCompanionMentionHandler = async (
    clientMeta: MastodonClientMeta,
    payload: mastodon.v1.Notification,
    mastodonService: IMastodonService
) => {
    quickSilverCompanionGetDataFromEndpointAndToot(
        clientMeta,
        mastodonService,
        payload.status?.id,
        payload.status?.visibility,
        payload.account.acct
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
        scheduledAt: scheduledDate.toISOString(),
    }

    if (replyToId != null) {
        params.inReplyToId = replyToId;
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

    const itemData = await quickSilverCompanionGetItemFromCm({
        botName: props.clientMeta.name,
        communityMissionData: props.communityMissionData,
    });

    if (itemData == null) {
        getLog().e(props.clientMeta.name, 'quickSilverCompanionToot - itemData is null');
        return;
    }

    const shareLink = `https://app.nmsassistant.com/link/en/${itemData.Id}.html`;
    props.tootParams.status = props.tootParams.status + `\n\nCurrent item being researched: ${itemData.Name}.\n${shareLink}\n\n#NoMansSky`;

    let compiledTemplate: string | undefined;
    try {
        compiledTemplate = await quickSilverCompanionCompiledTemplate({
            botName: props.clientMeta.name,
            itemName: itemData.Name,
            itemIcon: itemData.Icon,
            itemBaseValueUnits: itemData.BaseValueUnits,
            communityMissionData: props.communityMissionData,
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
        writePngFromSvg(
            'qsCompanion-',
            compiledTemplate,
            (outputFilePath: string) => {
                const fileStream = readFileSync(outputFilePath);
                props.mastodonService.sendTootWithMedia(props.clientMeta, fileStream, props.tootParams);
                getLog().i(props.clientMeta.name, 'quicksilver companion response', props.tootParams);

            }
        );
    }
    catch (ex) {
        getLog().e(props.clientMeta.name, 'error generating community mission image', ex);
    }
}

export const quickSilverCompanionCompiledTemplate = async (props: {
    botName: string,
    itemName: string,
    itemIcon: string,
    itemBaseValueUnits: number,
    communityMissionData: CommunityMissionViewModel,
}): Promise<string | undefined> => {

    const imgDestData = await getBase64FromAssistantNmsImage(props.itemIcon);

    const compiledTemplate = communityMissionSvgTemplate({
        ...props.communityMissionData,
        itemName: props.itemName,
        qsCost: props.itemBaseValueUnits,
        itemImgData: imgDestData,
    });

    return compiledTemplate;
}

export const quickSilverCompanionGetItemFromCm = async (props: {
    botName: string,
    communityMissionData: CommunityMissionViewModel,
}): Promise<GameItemModel | undefined> => {

    const dataService = new DataService();
    const qsStoreItems = await dataService.getQuicksilverStore();

    const { missionId, currentTier } = props.communityMissionData;
    const current = qsStoreItems.find((qs: QuicksilverStore) => qs.MissionId == missionId);
    const itemId = current?.Items?.[(currentTier - 1)]?.ItemId;
    if (itemId == null) {
        getLog().e(props.botName, 'quickSilverCompanionGetItemFromCm', 'Item not found by tier', { missionId, currentTier });
        return;
    }

    const gameItemService = new GameItemService();
    const itemData = await gameItemService.getItemDetails(itemId);

    return itemData;
}