import { CronusSeasonSelection } from "./entity/cronusSeasonSelection";

export interface IDatabaseService {
    addCronusSeasonSelection(seasonId: number, appId: string): Promise<CronusSeasonSelection>;
    getAllCronusSeasonSelections(): Promise<Array<CronusSeasonSelection>>;
    getAllCronusSelectionsForSeason(seasonId: number): Promise<Array<CronusSeasonSelection>>;
}

