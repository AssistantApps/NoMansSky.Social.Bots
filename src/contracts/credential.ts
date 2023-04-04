import { BotType } from "../constants/enum/botType";

export interface ICredential {
    // apiUrl: string;
    apiAuthToken: string;
    accounts: Array<ICredentialItem>;
    youtubeChannelsToToot: Array<IYoutubePostCredentialItem>;
}

export interface ICredentialItem {
    name: string;
    type: BotType | string;
    dialog: string;
    userId: string;
    profileName: string;
    email: string;
    password: string;
    imageUrl: string;
    clientKey: string;
    clientSecret: string;
    accessToken: string;
}

export interface IYoutubePostCredentialItem {
    name: string;
    channelId: string;
    accessToken: string;
    customHashtags?: string;
}