import { DataService, GameItemService, QuicksilverStore } from 'assistantapps-nomanssky-info';
import { createReadStream, existsSync, writeFileSync } from 'fs';
import { join } from 'path';

import { MastodonClientMeta } from "../../contracts/mastoClientMeta";
import { MastodonMakeToot } from "../../contracts/mastodonMakeToot";
import { MastodonMessageEventData } from "../../contracts/mastodonMessageEvent";
import { getStreamFromSvg } from '../../helper/fileHelper';
import { getAssistantNmsApi } from "../../services/api/assistantNmsApiService";
import { sendTootWithMedia } from "../../services/external/mastodonService";
import { getBotPath } from '../../services/internal/configService';
import { getLog } from "../../services/internal/logService";
import { communityMissionSvgTemplate } from './communityMission.svg.template';

export const quickSilverCompanionHandler = async (clientMeta: MastodonClientMeta, payload: MastodonMessageEventData) => {
    const scheduledDate = new Date();
    scheduledDate.setMinutes(scheduledDate.getMinutes() + 2);

    const assistantNmsApi = getAssistantNmsApi();
    const cmResult = await assistantNmsApi.getCommunityMission();
    if (cmResult.isSuccess == false) {
        getLog().e(clientMeta.name, 'Could not fetch Community Mission', cmResult.errorMessage);
        // TODO maybe send a message to user
    }

    const dataService = new DataService();
    const qsStoreItems = await dataService.getQuicksilverStore();

    let compiledTemplate: string | null = null;
    let messageToSend = `@${payload.account.username} Greetings Traveller. \nThe Space Anomaly is accumulating research data from Travellers across multiple realities. `;
    try {
        const current = qsStoreItems.find((qs: QuicksilverStore) => qs.MissionId == cmResult.value.missionId);
        const itemId = current?.Items?.[(cmResult.value.currentTier - 1)]?.ItemId;
        if (itemId == null) throw 'Item not found by tier';

        const gameItemService = new GameItemService();
        const itemData = await gameItemService.getItemDetails(itemId);
        if (itemData == null) throw 'Item not found by id';

        const shareLink = `https://app.nmsassistant.com/link/en/${itemData.Id}.html`;
        messageToSend = messageToSend + `\n\nCurrent item being researched: "${itemData.Name}".\n${shareLink}`;

        compiledTemplate = communityMissionSvgTemplate({
            ...cmResult.value,
            itemName: itemData.Name,
            qsCost: itemData.BaseValueUnits,
            imageUrl: `https://app.nmsassistant.com/assets/images/${itemData.Icon}`,
        });
    }
    catch (ex) {
        getLog().e(clientMeta.name, 'error getting community mission details', ex);
    }

    if (compiledTemplate == null) {
        getLog().e(clientMeta.name, 'error getting community mission details', 'compiledTemplate == null');
        return;
    }


    const params: MastodonMakeToot = {
        status: messageToSend,
        in_reply_to_id: payload.status.id,
        visibility: payload.status.visibility,
        scheduled_at: scheduledDate.toISOString(),
    }
    try {
        const fileStream = await getStreamFromSvg('qsCompanion-', compiledTemplate);
        await sendTootWithMedia(clientMeta, fileStream, params);
    }
    catch (ex) {
        getLog().e(clientMeta.name, 'error generating community mission image', ex);
    }

    getLog().i(clientMeta.name, 'quicksilver companion response', params);
}