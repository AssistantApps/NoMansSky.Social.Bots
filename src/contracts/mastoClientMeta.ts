import { BotType } from "../constants/enum/botType";

export interface MastodonClientMeta {
    name: string;
    type: BotType;
    dialog: string;
    client: any;
    listener: any;
}