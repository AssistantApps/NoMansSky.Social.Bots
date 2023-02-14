import { Container, Service, Token } from "typedi";
import { BotType } from "../../constants/enum/botType";
import { MastodonClientMeta } from "../../contracts/mastoClientMeta";

@Service()
export class InMemoryService {
    private _clients: Array<MastodonClientMeta> = [];

    setMastodonClients = (mastoClients: Array<MastodonClientMeta>) => {
        this._clients = mastoClients;
    }
    setMastodonClient = (botType: BotType, manipulate: (existingMeta: MastodonClientMeta) => MastodonClientMeta): void => {
        const clientIndex = this._clients.findIndex(mc => mc.type === botType);
        if (clientIndex < 0) {
            console.error('Could not find mastoClient');
            return;
        }

        this._clients[clientIndex] = manipulate(this._clients[clientIndex]);
    }

    getAllMastodonClients = (): Array<MastodonClientMeta> => this._clients;
    getMastodonClient = (botType: BotType): MastodonClientMeta | undefined => {
        const clientIndex = this._clients.findIndex(mc => mc.type === botType);
        if (clientIndex < 0) {
            console.error('Could not find mastoClient');
            return;
        }

        return this._clients[clientIndex];
    }
}

export const getMemory = () => Container.get(InMemoryService);
