import { Container, Service } from "typedi";

import { Result } from '../../contracts/resultWithValue';
import { BaseApiService } from './baseApiService';

@Service()
export class NmsSocialApiService extends BaseApiService {
    constructor() {
        super('https://api.nomanssky.social');
    }

    triggerQuicksilverMerchant(apiAuthToken: string): Promise<Result> {
        return this.post('qs', {}, () => ({
            headers: {
                'Authorization': apiAuthToken,
            }
        }));
    }
}

export const getNmsSocialApi = () => Container.get(NmsSocialApiService);
