
import { IconButton } from '@hope-ui/solid';
import { Component, createSignal, onMount } from 'solid-js';
import { NetworkState } from '../../../constants/enum/networkState';
import { ICredentialItem } from '../../../contracts/credential';
import { anyObject } from '../../../helper/typescriptHacks';
import { getMastodonApi, MastodonApiService } from '../../../services/api/mastodonApiService';

interface IProps {
    botMeta: ICredentialItem;
}

export const BotMessageViewer: Component<IProps> = (props: IProps) => {
    const [networkState, setNetworkState] = createSignal(NetworkState.Loading);
    const [mastoService, setMastoService] = createSignal<MastodonApiService>(anyObject);

    onMount(() => {
        const mastoService = getMastodonApi();
        setMastoService(mastoService);
    });

    const loadConversations = async (botMeta: ICredentialItem) => {
        const mastodonService = mastoService();
        const convos = await mastodonService.getConversations(botMeta.accessToken);
        console.log({ convos });
    }

    return (
        <IconButton
            colorScheme="warning"
            aria-label="Close drawer"
            borderRadius="2em"
            class="message-icon"
            onClick={() => loadConversations(props.botMeta)}
            icon={<span>✉</span>}
        />
    );
}