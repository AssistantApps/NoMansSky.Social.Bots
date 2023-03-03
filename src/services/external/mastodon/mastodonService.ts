import { login, mastodon, WsEvents } from 'masto';
import { Container, Service } from "typedi";

import { ICredentialItem } from "../../../contracts/credential";
import { MastodonClientMeta } from "../../../contracts/mastoClientMeta";
import { MastodonAnnouncement } from "../../../contracts/mastodonAnnouncement";
import { MastodonMakeToot } from "../../../contracts/mastodonMakeToot";
import { Result, ResultWithValue } from "../../../contracts/resultWithValue";
import { mapAnnouncementToDto } from "../../../mapper/mastodonAnnouncementMapper";
import { ConfigService, getConfig } from "../../internal/configService";
import { getLog } from "../../internal/logService";
import { IMastodonService } from "./mastodonService.interface";

@Service()
export class MastodonService implements IMastodonService {
    private _config: ConfigService;

    constructor() {
        const localConfig = getConfig();
        this._config = localConfig;
    }

    createClient(cred: ICredentialItem): Promise<mastodon.Client> {
        getLog().i('createClient', cred.name, cred.type);
        // const t = await login({
        return login({
            url: this._config.getMastodonUrl(),
            accessToken: cred.accessToken,
            timeout: this._config.getMastodonTimeout(),
        });
        // const ttt = await t.v1.stream.streamPublicTimeline()
        // t.v1.statuses.create()
    };

    getStream = (mastoClient: MastodonClientMeta): Promise<WsEvents> => mastoClient.client.v1.stream.streamUser();

    sendBasicToot = (mastoClient: MastodonClientMeta, message: string, id: string | null = null): Promise<any> => {
        const params: MastodonMakeToot = {
            status: message
        }

        if (id != null) {
            params.inReplyToId = id;
        }

        return this.sendToot(mastoClient, params);
    }

    sendToot = async (mastoClient: MastodonClientMeta, params: MastodonMakeToot): Promise<any> => {
        try {
            await mastoClient.client.v1.statuses.create({
                ...params,
                mediaIds: undefined,
            });
        } catch (error: any) {
            getLog().e(mastoClient.name, 'sendToot', error);
        }
    }

    uploadTootMedia = async (mastoClient: MastodonClientMeta, file: Buffer): Promise<string> => {
        const mediaResp = await mastoClient.client.v2.mediaAttachments.create({
            file: new Blob([file]),
        });
        return mediaResp.id;
    }

    sendTootWithMedia = async (mastoClient: MastodonClientMeta, file: Buffer, params: MastodonMakeToot): Promise<any> => {
        try {
            const mediaId = await this.uploadTootMedia(mastoClient, file);

            await mastoClient.client.v1.statuses.create({
                ...params,
                mediaIds: [mediaId],
                poll: undefined,
            });
        } catch (error: any) {
            getLog().e(mastoClient.name, 'sendTootWithMedia', error);
        }
    }

    preferences = (mastoClient: MastodonClientMeta) => mastoClient.client.v1.preferences.fetch();


    getConversations = async (mastoClient: MastodonClientMeta): Promise<ResultWithValue<Array<mastodon.v1.Conversation>>> => {
        try {
            const convos = await mastoClient.client.v1.conversations.list();
            return {
                isSuccess: true,
                value: convos,
                errorMessage: '',
            }
        } catch (error: any) {
            getLog().e(mastoClient.name, 'getConversations', error);
            return {
                isSuccess: false,
                value: [],
                errorMessage: error.toString(),
            }
        }
    }

    getAnnouncements = async (mastoClient: MastodonClientMeta, withDismissed: boolean = false): Promise<ResultWithValue<Array<MastodonAnnouncement>>> => {
        try {
            const announcements = await mastoClient.client.v1.announcements.list();
            return {
                isSuccess: true,
                value: announcements.map(mapAnnouncementToDto),
                errorMessage: '',
            }
        } catch (error: any) {
            getLog().e(mastoClient.name, 'getAnnouncements', error);
            return {
                isSuccess: false,
                value: [],
                errorMessage: error.toString(),
            }
        }
    }

    getDomainBlocks = (
        mastoClient: MastodonClientMeta,
        extraQuery: string,
        pageSize: number = 25
    ): any => {
        // try {
        const paginator = mastoClient.client.v1.admin.domainBlocks.list({
            limit: pageSize,
            // sinceId
        });
        return paginator;

        //     const domainBlocks = await paginator.next();
        //     return {
        //         isSuccess: true,
        //         value: (domainBlocks.value ?? []).map(mapDomainBlockToDto),
        //         prevPage: 'string',
        //         nextPage: 'string',
        //         errorMessage: '',
        //     }
        // } catch (error: any) {
        //     getLog().e(mastoClient.name, 'getDomainBlocks', error);
        //     return {
        //         isSuccess: false,
        //         value: [],
        //         prevPage: 'string',
        //         nextPage: 'string',
        //         errorMessage: error.toString(),
        //     }
        // }


        // let url = `v1/admin/domain_blocks?limit=${pageSize}`;
        // if (extraQuery.length > 0) {
        //     url += `&${extraQuery}`;
        // }
        // const response: any = await this.get<Array<MastodonDomainBlock>>(url, () => ({
        //     headers: {
        //         'Authorization': `Bearer ${accessToken}`
        //     }
        // }),
        //     (response) => {
        //         const linkArr = getLinkQueryParams(response.headers['link']);
        //         return {
        //             isSuccess: true,
        //             value: response.data,
        //             prevPage: linkArr[0],
        //             nextPage: linkArr[1],
        //             errorMessage: ''
        //         };
        //     });

        // return response;
    }

    unblockDomain = async (mastoClient: MastodonClientMeta, id: string): Promise<Result> => {
        try {
            await mastoClient.client.v1.admin.domainBlocks.remove(id);
            return {
                isSuccess: true,
                errorMessage: '',
            }
        } catch (error: any) {
            getLog().e(mastoClient.name, 'unblockDomain', error);
            return {
                isSuccess: false,
                errorMessage: error.toString(),
            }
        };
    }
}

export const getMastodonService = () => Container.get(MastodonService);
