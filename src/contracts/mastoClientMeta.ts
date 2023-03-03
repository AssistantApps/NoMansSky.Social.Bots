import { mastodon, WsEvents } from "masto";
import { BotType } from "../constants/enum/botType";

export interface MastodonClientMeta {
    name: string;
    type: BotType;
    dialog: string;
    client: mastodon.Client;
    stream: WsEvents;
}
