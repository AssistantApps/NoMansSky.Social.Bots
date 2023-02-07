import { CommunityMissionViewModel } from "../../contracts/generated/communityMissionViewModel";
import { formatDate } from "../../helper/dateHelper";

interface IProps extends CommunityMissionViewModel {
  imageUrl: string;
  itemName: string;
  qsCost: number;
}

export const communityMissionSvgTemplate = (viewModel: IProps) => {
  const percentageCompleteAdjusted = Math.round(viewModel.percentage * 67);

  const template = `<svg version="1.1" width="700" height="400"
  xmlns="http://www.w3.org/2000/svg">
  <rect width="100%" height="100%" rx="15" fill="#303030" />
  <image x="1" y="10" width="170" height="170" href="https://github.com/AssistantApps/NoMansSky.Social.Bots/blob/main/src/assets/img/communityMission.png" />


  <!-- START CM status -->
  <text x="60%" y="17.5%" width="65%" font-size="30" text-anchor="middle" fill="white" font-family="Arial, Helvetica, sans-serif">Research progress - Tier {currentTier} / {totalTiers}</text>

  <!-- START CM progress bar -->
  <rect x="27%" y="27.5%" width="67%" height="10%" rx="10" fill="#000000" />
  <rect x="27%" y="27.5%" width="{percentageCompleteAdjusted}%" height="10%" rx="10" fill="#E4A200" />
  <text x="60%" y="35%" width="65%" font-size="30" text-anchor="middle" fill="white" font-family="Arial, Helvetica, sans-serif">{percentageComplete}%</text>

  <!--  -->
  <rect x="6%" y="49%" width="88%" height="1%" rx="5" fill="#222222" />
  <!--  -->

  <!-- START item details -->
  <image x="1" y="50%" width="170" height="170" href="{imageUrl}" />
  <text x="27%" y="67%" width="65%" font-size="30" text-anchor="start" fill="white" font-family="Arial, Helvetica, sans-serif">{itemName}</text>
  <text x="34%" y="78%" width="65%" font-size="25" text-anchor="start" fill="white" font-family="Arial, Helvetica, sans-serif">{qsCost}</text>
  <image x="27%" y="71%" width="6%" href="https://github.com/AssistantApps/NoMansSky.Social.Bots/blob/main/src/assets/img/quicksilver.png" />
  <!-- END item details -->

  <text x="98.5%" y="96%" font-size="10" text-anchor="end" fill="white" font-family="Arial, Helvetica, sans-serif">{dateCreated}</text>
</svg>`;

  const compiledTemplate = template
    .replace('{currentTier}', viewModel.currentTier.toString())
    .replace('{totalTiers}', viewModel.totalTiers.toString())
    .replace('{percentageComplete}', viewModel.percentage.toString())
    .replace('{percentageCompleteAdjusted}', (percentageCompleteAdjusted / 100).toString())
    .replace('{imageUrl}', viewModel.imageUrl)
    .replace('{itemName}', viewModel.itemName)
    .replace('{qsCost}', viewModel.qsCost.toString())
    .replace('{dateCreated}', formatDate(new Date(), 'YYYY-MM-DD HH:mm'));

  return compiledTemplate;
}
