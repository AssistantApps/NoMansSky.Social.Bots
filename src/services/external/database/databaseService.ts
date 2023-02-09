import { Container, Inject, Service } from "typedi";
import { XataClient } from "../../../integration/xata";
import { ConfigService } from "../../internal/configService";
import { IDatabaseService } from "./databaseService.interface";
import { CronusSeasonSelection } from "./entity/cronusSeasonSelection";

@Service()
export class DatabaseService implements IDatabaseService {
    private xata: XataClient;

    constructor(@Inject() config: ConfigService) {
        const dbUrl = config.getXataDbUrl();
        this.xata = new XataClient({
            apiKey: config.getXataApiKey(),
            databaseURL: config.getXataDbUrl(),
            branch: config.getXataFallbackBranch(),
        });
    }

    addCronusSeasonSelection = async (seasonId: number, appId: string): Promise<CronusSeasonSelection> => {
        const newRecord = await this.xata.db.CronusSeasonSelections.create({
            appId,
            seasonId,
            selectedDate: new Date(),
        });
        return newRecord;
    };

    getAllCronusSeasonSelections = async (): Promise<Array<CronusSeasonSelection>> =>
        this.xata.db.CronusSeasonSelections.getAll();

    getAllCronusSelectionsForSeason = async (seasonId: number): Promise<Array<CronusSeasonSelection>> =>
        this.xata.db.CronusSeasonSelections.getAll();
}

export const getDatabaseService = () => Container.get(DatabaseService);

