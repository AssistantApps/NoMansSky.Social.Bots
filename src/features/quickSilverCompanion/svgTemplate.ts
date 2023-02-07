import { CommunityMissionViewModel } from "../../contracts/generated/communityMissionViewModel";
import { formatDate } from "../../helper/dateHelper";
import { communityMissionSvgTemplate } from "./communityMission.svg.template";

export const getCommunityMissionSvgFromTemplate = (viewModel: CommunityMissionViewModel): string => {
    const percentageCompleteAdjusted = Math.round(viewModel.percentage * 67);

    const compiledTemplate = communityMissionSvgTemplate
        .replace('{currentTier}', viewModel.currentTier.toString())
        .replace('{totalTiers}', viewModel.totalTiers.toString())
        .replace('{percentageComplete}', viewModel.percentage.toString())
        .replace('{percentageCompleteAdjusted}', (percentageCompleteAdjusted / 100).toString())
        .replace('{dateCreated}', formatDate(new Date(), 'YYYY-MM-DD HH:mm'));

    return compiledTemplate;
}