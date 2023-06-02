import { CommunityMissionViewModel } from "../../contracts/generated/communityMissionViewModel";
import { convertDateToUTC, formatDate } from "../../helper/dateHelper";
import { communityMissionImageData } from "./communityMission.png";
import { quicksilverImageData } from "./quicksilver.png";

interface IProps extends CommunityMissionViewModel {
  itemName: string;
  itemImgData: string;
  qsCost: number;
}

export const communityMissionSvgTemplate = (props: IProps) => {
  const percentageCompleteAdjusted = Math.round(props.percentage * 67);

  const template = `<svg version="1.1" width="700" height="400"
  xmlns="http://www.w3.org/2000/svg">
  <rect width="100%" height="100%" rx="15" fill="#303030" />
  <image x="1" y="10" width="170" height="170" href="{communityMission.png}" />


  <!-- START CM status -->
  <text x="60%" y="19%" width="65%" font-size="30" text-anchor="middle" fill="white" {fontFamily}>Research progress - Tier {currentTier} / {totalTiers}</text>

  <!-- START CM progress bar -->
  <rect x="27%" y="27.5%" width="67%" height="10%" rx="10" fill="#000000" />
  <rect x="27%" y="27.5%" width="{percentageCompleteAdjusted}%" height="10%" rx="10" fill="#E4A200" />
  <text x="60%" y="35%" width="65%" font-size="30" text-anchor="middle" fill="white" {fontFamily}>{percentageComplete}%</text>

  <!--  -->
  <rect x="6%" y="49%" width="88%" height="1%" rx="5" fill="#222222" />
  <!--  -->

  <!-- START item details -->
  <image x="1" y="52%" width="170" height="170" href="{imageUrl}" />
  <text x="27%" y="71%" width="65%" font-size="30" text-anchor="start" fill="white" {fontFamily}>{itemName}</text>
  <text x="34%" y="82%" width="65%" font-size="25" text-anchor="start" fill="white" {fontFamily}>{qsCost}</text>
  <image x="27%" y="75%" width="42" height="42" href="{quicksilver.png}" />
  <!-- END item details -->

  <text x="1.5%" y="96%" font-size="10" text-anchor="end" fill="white" {fontFamily}>nomanssky.social</text>
  <text x="98.5%" y="96%" font-size="10" text-anchor="end" fill="white" {fontFamily}>{dateCreated}</text>
</svg>`;

  const compiledTemplate = template
    .replace('{communityMission.png}', communityMissionImageData)
    .replace('{currentTier}', props.currentTier.toString())
    .replace('{totalTiers}', props.totalTiers.toString())
    .replace('{percentageComplete}', props.percentage.toString())
    .replace('{percentageCompleteAdjusted}', (percentageCompleteAdjusted / 100).toString())
    .replace('{quicksilver.png}', quicksilverImageData)
    .replace('{imageUrl}', props.itemImgData)
    .replace('{itemName}', props.itemName)
    .replace('{qsCost}', props.qsCost.toString())
    .replaceAll(' {fontFamily}', '')//'font-family="Arial, Helvetica, sans-serif"')
    .replace('{dateCreated}', formatDate(convertDateToUTC(new Date()), 'YYYY-MM-DD HH:mm') + ' UTC');

  return compiledTemplate;
}
