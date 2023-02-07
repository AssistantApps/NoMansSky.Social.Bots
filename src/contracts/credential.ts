import { BotType } from "../constants/enum/botType";

export interface ICredential {
    name: string;
    type: BotType;
    dialog: string;
    clientKey: string;
    clientSecret: string;
    accessToken: string;
}