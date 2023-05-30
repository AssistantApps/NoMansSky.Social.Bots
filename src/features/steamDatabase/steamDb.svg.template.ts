import { SteamBranch } from "../../contracts/generated/steamBranch";
import { timeAgo } from "../../helper/dateHelper";


interface IProps {
  branches: Array<SteamBranch>;
}

export const steamDBSvgTemplate = async (props: IProps) => {
  const compiledTemplate = `<?xml version="1.0" encoding="utf-8" ?>
  <svg version="1.1" width="700" height="360" xmlns="http://www.w3.org/2000/svg">
        <g>
            <rect x="0" y="0" width="700" height="360" fill="#161920" />
            <rect
        x="25"
        y="25"
        width="650"
        height="300"
        rx="15"
        fill="#161920"
        stroke="white"
      />
            <line
        x1="250"
        y1="25"
        x2="250"
        y2="325"
        fill="#161920"
        stroke="white"
      />
            <line
        x1="450"
        y1="25"
        x2="450"
        y2="325"
        fill="#161920"
        stroke="white"
      />
  
  <!-- Headings start -->
  
            <line
        x1="25"
        y1="100"
        x2="675"
        y2="100"
        fill="#161920"
        stroke="white"
      />
      
            <text
        x="45"
        y="73"
        font-size="30"
        font-weight="700"
        fill="white"
      >Name</text>
            <text
        x="270"
        y="73"
        font-size="30"
        font-weight="700"
        fill="white"
      >BuildId</text>
            <text
        x="470"
        y="73"
        font-size="30"
        font-weight="700"
        fill="white"
      >Time Updated</text>
  
  <!-- Headings end -->
  
  <!-- row start -->
  
  ${generateRows(props.branches)}  
  
  <!-- row end -->
  
    
            <text
        x="675"
        y="345"
        font-size="10"
        text-anchor="end"
        fill="white"
      >nomanssky.social</text>
        </g>
    </svg>  
  `;

  return compiledTemplate;
}

const generateRows = (branches: Array<SteamBranch>) => {
  let rows = '';
  const sortedBranches = branches.sort((a, b) =>
    new Date(b.lastUpdate).getTime() -
    new Date(a.lastUpdate).getTime()
  ).slice(0, 3);
  for (let rowIndex = 0; rowIndex < sortedBranches.length; rowIndex++) {
    const branch = sortedBranches[rowIndex];
    rows += generateRow(branch, rowIndex);
  }
  return rows;
};

const generateRow = (branch: SteamBranch, index: number) => {
  const baseRowY = 100 + (index * 75);
  return `
    <line
    x1="25"
    y1="${baseRowY}"
    x2="675"
    y2="${baseRowY}"
    fill="#161920"
    stroke="white"
  />
  
        <text x="45" y="${baseRowY + 50}" font-size="30" fill="#00aff4">${branch.name}</text>
        <text x="270" y="${baseRowY + 50}" font-size="30" fill="#00aff4">${branch.buildId}</text>
        <text x="470" y="${baseRowY + 50}" font-size="30" fill="white">${timeAgo(branch.lastUpdate)}</text>
    `;
}