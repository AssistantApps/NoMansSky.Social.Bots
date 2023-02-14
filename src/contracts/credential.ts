import { BotType } from "../constants/enum/botType";

export interface ICredential {
    apiUrl: string;
    apiAuthToken: string;
    accounts: Array<ICredentialItem>;
}

export interface ICredentialItem {
    name: string;
    type: BotType;
    dialog: string;
    userId: string;
    profileName: string;
    imageUrl: string;
    clientKey: string;
    clientSecret: string;
    accessToken: string;
}