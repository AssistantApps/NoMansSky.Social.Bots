import { Readable } from 'stream';
import { DataService, GameItemModel, GameItemService, QuicksilverStore } from 'assistantapps-nomanssky-info';

import { GithubDialogLines, GithubDialogType } from "../../contracts/github/githubDialog";
import { MastodonClientMeta } from "../../contracts/mastoClientMeta";
import { MastodonMakeToot } from "../../contracts/mastodonMakeToot";
import { MastodonMessageEventData } from "../../contracts/mastodonMessageEvent";
import { randomIntFromRange } from "../../helper/randomHelper";
import { getAssistantNmsApi } from "../../services/api/assistantNmsApiService";
import { getGithubFileService } from "../../services/api/githubFileService";
import { sendToot, sendTootWithMedia } from "../../services/external/mastodonService";
import { getLog } from "../../services/internal/logService";
import { getCommunityMissionSvgFromTemplate } from './svgTemplate';
import { anyObject } from '../../helper/typescriptHacks';

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
    }
    catch (ex) {
        getLog().e(clientMeta.name, 'error getting community mission details', ex);
    }


    const params: MastodonMakeToot = {
        status: messageToSend,
        in_reply_to_id: payload.status.id,
        visibility: payload.status.visibility,
        scheduled_at: scheduledDate.toISOString(),
    }
    const compiledTemplate = getCommunityMissionSvgFromTemplate(cmResult.value);
    const stream: any = Readable.from([compiledTemplate]);
    await sendTootWithMedia(clientMeta, stream, params);

    getLog().i(clientMeta.name, 'quicksilver companion response', params);
}