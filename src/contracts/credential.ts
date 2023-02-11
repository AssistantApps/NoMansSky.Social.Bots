import { BotType } from "../constants/enum/botType";

export interface ICredential {
    apiAuthToken: string;
    accounts: Array<ICredentialItem>;
}

export interface ICredentialItem {
    name: string;
    type: BotType;
    dialog: string;
    userId: number;
    profileName: string;
    clientKey: string;
    clientSecret: string;
    accessToken: string;
}