import { join } from "path";
import { getBase64FromAssistantNmsImage, getBase64FromFile } from "../../helper/fileHelper";
import { getBotPath } from "../../services/internal/configService";

export const cronusRandomReviewAvailableBackgrounds = [
  'bg1.jpg',
  'bg2.jpg',
  'bg3.jpg',
];

interface IProps {
  selectedBackground: string;
  reviewDialog: string;
  iconPath: string;
  itemName: string;
  naniteValue: string;
  starValue: number;
}

export const cronusRandomReviewSvgTemplate = async (props: IProps) => {
  const dirname = getBotPath();
  const imagesPath = join(dirname, 'src', 'assets', 'img');

  const selectedBackgroundPath = join(imagesPath, 'cronus', props.selectedBackground);
  const backgroundBase64 = getBase64FromFile(selectedBackgroundPath);

  const cronusLogoPath = join(imagesPath, 'cronus', 'cronus.png');
  const cronusLogoBase64 = getBase64FromFile(cronusLogoPath);

  const nanitePath = join(imagesPath, 'nanite.png');
  const naniteBase64 = getBase64FromFile(nanitePath);

  const gameItemBase64 = await getBase64FromAssistantNmsImage(props.iconPath);

  const compiledTemplate = `<?xml version="1.0" encoding="utf-8"?>
  <svg version="1.1" width="700" height="400"
      xmlns="http://www.w3.org/2000/svg">
  
      <defs>
          <pattern id="bg" patternUnits="userSpaceOnUse" width="700" height="400">
              <image href="${backgroundBase64}" x="0" y="0" width="700" height="400" />
          </pattern>
          <linearGradient id="star-colour">
              <stop stop-color="#80cbc4" />
          </linearGradient>
          <linearGradient id="star-bg-colour">
              <stop offset="5%" stop-color="#000000" />
              <stop offset="67%" stop-color="transparent" />
          </linearGradient>
          <linearGradient id="item-bg-colour">
              <stop stop-color="#bb3830" />
          </linearGradient>
      </defs>
      <g>
          <rect x="0" y="0" width="700" height="400" rx="15" fill="url(#bg)" />
          <rect x="0" y="0" width="700" height="400" rx="15" fill="#000000" fill-opacity="0.7" />
  
          <rect x="200" y="32" width="400" height="68" rx="15" fill="url(#star-bg-colour)" />
  
          <image x="1" y="10" width="170" height="170" href="${cronusLogoBase64}" />
  
          <g stroke="url(#star-colour)" fill="url(#star-colour)">
              ${generateStarList(props.starValue)}
          </g>
  
          <rect x="13" y="215" width="145" height="145" stroke="white" rx="5" fill="url(#item-bg-colour)" />
          <image x="13" y="215" width="145" height="145" href="${gameItemBase64}" />
  
          ${generateReviewText(props.reviewDialog)}
  
          <text x="200" y="272" width="450" font-size="35" text-anchor="start" fill="white">${props.itemName}</text>
  
          <text x="200" y="320" width="50" font-size="25" text-anchor="start" fill="white">± ${props.naniteValue}</text>
          <image x="250" y="292" width="42" height="42" href="${naniteBase64}" />
  
          <text x="690" y="390" font-size="10" text-anchor="end" fill="white">nomanssky.social</text>
      </g>
  </svg>
  `;

  return compiledTemplate;
}

const generateStarList = (starValue: number) => {
  let result = '';
  for (let starIndex = 0; starIndex < 5; starIndex++) {
    const xCoord = 110 + (starIndex * 35)
    const diff = starValue - starIndex;
    if (diff >= 1) {
      result += generateStar(xCoord, StarType.full);
      continue;
    }
    if (diff >= 0.5) {
      result += generateStar(xCoord, StarType.half);
      continue;
    }

    result += generateStar(xCoord, StarType.outline);
  }
  return result;
}

const generateStar = (xCoord: number, starType: StarType) => {
  const starArr = [
    `<path transform="scale(2) translate(${xCoord} 20)" fill="transparent" d="M12 .587l3.668 7.568 8.332 1.151-6.064 5.828 1.48 8.279-7.416-3.967-7.417 3.967 1.481-8.279-6.064-5.828 8.332-1.151z"/>`
  ];
  if (starType == StarType.full) {
    starArr.push(
      `<path transform="scale(2) translate(${xCoord} 20)" d="M12 .587l3.668 7.568 8.332 1.151-6.064 5.828 1.48 8.279-7.416-3.967-7.417 3.967 1.481-8.279-6.064-5.828 8.332-1.151z"/>`,
    );
  }

  if (starType == StarType.half) {
    starArr.push(
      `<path transform="scale(2) translate(${xCoord} 20)" d="M 12 0.587 L 12.013 19.436 L 4.583 23.413 L 6.064 15.134 L 0 9.306 L 8.332 8.155 L 12 0.587 Z"/>`,
    );
  }
  starArr.push('');

  return starArr.join('\n');
}

enum StarType {
  full,
  half,
  outline,
}


const generateReviewText = (reviewText: string) => {
  let result = '';

  const reviewSegments: Array<string> = [reviewText.substring(0, 40)];
  if (reviewText.length > 40) {
    reviewSegments.push(reviewText.substring(40, 80));
  }
  if (reviewText.length > 80) {
    reviewSegments.push(reviewText.substring(80, 120));
  }

  for (let reviewSegIndex = 0; reviewSegIndex < reviewSegments.length; reviewSegIndex++) {
    const reviewSegment = reviewSegments[reviewSegIndex];
    const yCoord = 150 + (reviewSegIndex * 35);
    result += `<text x="200" y="${yCoord}" width="450" font-size="25" text-anchor="start" fill="white">${reviewSegment}</text>`;
  }

  return result;
}