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
            console.error('InMemoryService - Could not find mastoClient');
            return;
        }

        const newClient = manipulate(this._clients[clientIndex]);
        this._clients[clientIndex] = newClient;
    }

    getAllMastodonClients = (): Array<MastodonClientMeta> => this._clients;
    getMastodonClient = (botType: BotType): MastodonClientMeta | undefined => {
        const clientIndex = this._clients.findIndex(mc => mc.type === botType);
        if (clientIndex < 0) {
            console.error('InMemoryService - Could not find mastoClient');
            return;
        }

        return this._clients[clientIndex];
    }
}

export const getMemory = () => Container.get(InMemoryService);
