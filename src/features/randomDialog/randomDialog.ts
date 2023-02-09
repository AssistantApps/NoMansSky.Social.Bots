import { GithubDialogLines, GithubDialogType } from "../../contracts/github/githubDialog";
import { MastodonClientMeta } from "../../contracts/mastoClientMeta";
import { MastodonMakeToot } from "../../contracts/mastodonMakeToot";
import { MastodonMessageEventData } from "../../contracts/mastodonMessageEvent";
import { randomIntFromRange } from "../../helper/randomHelper";
import { getGithubFileService } from "../../services/api/githubFileService";
import { IMastodonService } from "../../services/external/mastodon/mastodonService.interface";
import { getLog } from "../../services/internal/logService";

export const randomDialogHandler = async (
    clientMeta: MastodonClientMeta,
    payload: MastodonMessageEventData,
    mastodonService: IMastodonService
) => {
    const scheduledDate = new Date();
    scheduledDate.setMinutes(scheduledDate.getMinutes() + 2);

    const githubFileService = getGithubFileService();
    const dialogsResult = await githubFileService.getDialogFile();
    if (dialogsResult.isSuccess == false) {
        getLog().e(clientMeta.name, 'Could not fetch github file', dialogsResult.errorMessage);
        // TODO maybe send a message to user
    }

    let dialogOptions: Array<GithubDialogLines> = [{
        type: GithubDialogType.message,
        message: 'Hello Traveller!',
    }];
    if (clientMeta.name != null) {
        const dialogs: Array<GithubDialogLines> | null | undefined = (dialogsResult.value as any)[clientMeta.dialog];
        if (dialogs != null && dialogs.length > 0) {
            dialogOptions = dialogs;
        }
    }

    const dialogOptionIndex = randomIntFromRange(0, dialogOptions.length);
    const selectedDialogOption = dialogOptions[dialogOptionIndex];

    if (selectedDialogOption.type == GithubDialogType.message) {
        const params: MastodonMakeToot = {
            status: `@${payload.account.username} ${selectedDialogOption.message}`,
            in_reply_to_id: payload.status.id,
            visibility: payload.status.visibility,
            scheduled_at: scheduledDate.toISOString(),
        }
        getLog().i(clientMeta.name, 'random dialog response', params);
        await mastodonService.sendToot(clientMeta, params);
        return;
    }

    getLog().e(clientMeta.name, 'Unhandled dialog type', selectedDialogOption.type);
}