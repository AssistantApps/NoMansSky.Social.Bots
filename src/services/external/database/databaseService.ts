import { Container, Inject, Service } from "typedi";
import { XataClient, CronusSeasonSelections, YoutubeVideoNotificationsRecord } from "../../../integration/xata";
import { ConfigService } from "../../internal/configService";

@Service()
export class DatabaseService {
    private xata: XataClient;

    constructor(@Inject() config: ConfigService) {
        const dbUrl = config.getXataDbUrl();
        this.xata = new XataClient({
            apiKey: config.getXataApiKey(),
            databaseURL: config.getXataDbUrl(),
            branch: config.getXataFallbackBranch(),
        });
    }

    addCronusSeasonSelection = async (seasonId: number, appId: string): Promise<CronusSeasonSelections> => {
        const newRecord = await this.xata.db.CronusSeasonSelections.create({
            appId,
            seasonId,
            selectedDate: new Date(),
        });
        return newRecord;
    };

    getAllCronusSeasonSelections = async (): Promise<Array<CronusSeasonSelections>> =>
        this.xata.db.CronusSeasonSelections.getAll();

    getAllCronusSelectionsForSeason = async (seasonId: number): Promise<Array<CronusSeasonSelections | null>> =>
        this.xata.db.CronusSeasonSelections
            .filter({ seasonId })
            .getAll();

    getYoutubeVideoByChannelAndVideoId = async (channelId: string, videoId: string): Promise<YoutubeVideoNotificationsRecord | null> =>
        this.xata.db.YoutubeVideoNotifications
            .filter({ channelId, videoId })
            .sort('publishDate', 'desc')
            .getFirst();

    addYoutubeVideoForChannelId = async (channelId: string, videoId: string, publishDate: Date): Promise<YoutubeVideoNotificationsRecord> => {
        const newRecord = await this.xata.db.YoutubeVideoNotifications.create({
            channelId,
            videoId,
            publishDate,
        });
        return newRecord;
    };
}

export const getDatabaseService = () => Container.get(DatabaseService);

