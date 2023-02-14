
import { Button, Center, Divider, FormControl, Image, FormLabel, GridItem, HStack, Input, VStack, Box } from '@hope-ui/solid';
import { useNavigate, useParams } from '@solidjs/router';
import { Component, createEffect, createSignal, onMount, Show, useContext } from 'solid-js';
import { BotType } from '../../../constants/enum/botType';
import { NetworkState } from '../../../constants/enum/networkState';
import { ICredentialItem } from '../../../contracts/credential';
import { getLog } from '../../../services/internal/logService';
import { PageHeader } from '../../components/common/pageHeader';
import { CenterLoading, LoadingSpinner } from '../../components/core/loading';
import { routes } from '../../constants/route';
import { CredentialsContext } from '../../context/credentials.context';
import { ResponsiveCustomGrid } from '../../layout/responsiveCustomGrid';
import { BotMessageViewer } from './botMessageViewer';
import { SpecificBotComponents } from './botSpecific/botSpecific';
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

    const getLatestToots = (botmeta?: ICredentialItem) => {
        if (botmeta == null) return;

        try {
            (window as any).loadMasto({
                container_body_id: 'bot-timeline',
                instance_uri: 'https://nomanssky.social',
                user_id: botmeta.userId,
                profile_name: botmeta.profileName,
                toots_limit: 5,
            });
        } catch { }
    }

    const renderTimeLine = (botType: BotType) => {
        return (
            <GridItem data-key={botType} pt="1.5em" colSpan={{
                "@initial": "4",
                "@lg": "2",
            }}>
                <div id="bot-timeline" class="mt-body" style="width: 100%">
                    <Button colorScheme="accent" width="100%" onClick={() => getLatestToots(botMeta())}>🐘 Display latest Toots!</Button>
                </div>
            </GridItem>
        );
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

                <BotMessageViewer
                    botMeta={botMeta()!}
                />

                <SpecificBotComponents
                    botMeta={botMeta()!}
                />

                <GenericBotPageSendMessage
                    botMeta={botMeta()!}
                />

                <SmallScreenOnlyDivider />

                {renderTimeLine(botMeta()!.type)}
                <GridItem />
                <Box m="3em" />
            </Show>
        </ResponsiveCustomGrid>
    );
};

export default GenericBotPage;