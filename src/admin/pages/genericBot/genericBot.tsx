
import { Box, Center, GridItem } from '@hope-ui/solid';
import { useNavigate, useParams } from '@solidjs/router';
import { Component, createEffect, createSignal, Show, useContext } from 'solid-js';
import { BotType } from '../../../constants/enum/botType';
import { NetworkState } from '../../../constants/enum/networkState';
import { ICredentialItem } from '../../../contracts/credential';
import { getLog } from '../../../services/internal/logService';
import { PageHeader } from '../../components/common/pageHeader';
import { CenterLoading } from '../../components/core/loading';
import { routes } from '../../constants/route';
import { CredentialsContext } from '../../context/credentials.context';
import { ResponsiveCustomGrid } from '../../layout/responsiveCustomGrid';
import { BotConversationsViewer } from './botConversationsViewer';
import { BotCredentials } from './botCredentials';
import { BotNotificationsViewer } from './botNotificationsViewer';
import { SpecificBotComponents } from './botSpecific/botSpecific';
import { BotTootsViewer } from './botTootsViewer';
import { SmallScreenOnlyDivider } from './commonBotComponents';
import { GenericBotPageSendMessage } from './sendMessage';

export const GenericBotPage: Component = () => {
    const params = useParams();
    const navigate = useNavigate();
    const creds = useContext(CredentialsContext);
    const [networkState, setNetworkState] = createSignal(NetworkState.Loading);
    const [botMeta, setBotMeta] = createSignal<ICredentialItem>();

    createEffect(() => {
        setNetworkState(NetworkState.Loading);
        initializePage();
    }, [params.id]);

    const initializePage = () => {
        getLog().i('initializePage');
        const invalidCreds = (
            creds == null ||
            creds.accounts == null ||
            creds.accounts.length < 1 ||
            creds.apiAuthToken == null
        );
        let invalidBotType = false;
        let botType: BotType = BotType.unknown;

        try {
            const paramBotType = params.id;
            botType = (paramBotType as BotType);
            invalidBotType = (
                paramBotType == null ||
                botType == null ||
                botType === BotType.unknown
            );
        } catch (_) {
            invalidBotType = true;
        }

        if (invalidCreds || invalidBotType) {
            getLog().e('something went wrong', { invalidCreds, invalidBotType })
            navigate(routes.home, { replace: true })
            return;
        }

        const botCredsIndex = (creds?.accounts ?? []).findIndex(acc => acc.type === botType);
        if (botCredsIndex < 0) {
            return;
        }
        const botCreds = creds!.accounts[botCredsIndex];

        setBotMeta(botCreds);
        setNetworkState(NetworkState.Success);
    }

    return (
        <ResponsiveCustomGrid>
            <Show when={networkState() == NetworkState.Error}>
                <Center>Something went wrong</Center>
            </Show>
            <Show when={networkState() == NetworkState.Loading}>
                <GridItem colSpan={4}>
                    <CenterLoading />
                </GridItem>
            </Show>
            <Show when={networkState() == NetworkState.Success}>
                <GridItem colSpan={4}>
                    <PageHeader text={botMeta()!.name}></PageHeader>
                </GridItem>

                <SpecificBotComponents
                    botMeta={botMeta()!}
                />

                <GenericBotPageSendMessage
                    botMeta={botMeta()!}
                />

                <SmallScreenOnlyDivider />

                <BotTootsViewer
                    botMeta={botMeta()!}
                />

                <BotConversationsViewer
                    botMeta={botMeta()!}
                />

                <BotNotificationsViewer
                    botMeta={botMeta()!}
                />

                <SmallScreenOnlyDivider />

                <BotCredentials
                    botMeta={botMeta()!}
                />

                <GridItem />
                <Box m="3em" />
            </Show>
        </ResponsiveCustomGrid>
    );
};

export default GenericBotPage;