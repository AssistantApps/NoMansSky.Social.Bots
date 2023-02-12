
import { Center, GridItem } from '@hope-ui/solid';
import { useNavigate, useParams } from '@solidjs/router';
import { Component, createEffect, createSignal, onMount, Show, useContext } from 'solid-js';
import { BotType } from '../../constants/enum/botType';
import { NetworkState } from '../../constants/enum/networkState';
import { getLog } from '../../services/internal/logService';
import { PageHeader } from '../components/common/pageHeader';
import { CenterLoading, LoadingSpinner } from '../components/core/loading';
import { routes } from '../constants/route';
import { CredentialsContext } from '../context/credentials.context';
import { ResponsiveCustomGrid } from '../layout/responsiveCustomGrid';

export const GenericBotPage: Component = () => {
    const params = useParams();
    const navigate = useNavigate();
    const creds = useContext(CredentialsContext);
    const [networkState, setNetworkState] = createSignal(NetworkState.Loading);
    const [botName, setBotName] = createSignal('Bot');

    createEffect(() => {
        setNetworkState(NetworkState.Loading);
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

        getLatestToots(botType);
    }, [params.id]);

    const getLatestToots = (botType: BotType) => {
        const botCredsIndex = (creds?.accounts ?? []).findIndex(acc => acc.type === botType);
        if (botCredsIndex < 0) {
            return;
        }
        const botCreds = creds!.accounts[botCredsIndex];

        try {
            window.loadMasto({
                container_body_id: 'bot-timeline',
                instance_uri: 'https://nomanssky.social',
                user_id: botCreds.userId,
                profile_name: botCreds.profileName,
                toots_limit: 5,
            });
        } catch { }

        setBotName(botCreds.profileName);
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
                <GridItem colSpan={8}>
                    <PageHeader text={botName()}></PageHeader>
                </GridItem>
                <GridItem colSpan={4}></GridItem>
                <GridItem colSpan={4} rowSpan={6}>
                    {/* <Button colorScheme="primary" width="100%" onclick={getLatestToots}>🔃 Refresh Toots</Button> */}
                    <div id="bot-timeline" class="mt-body" style="width: 100%">
                        <Center minH="100vh">
                            <LoadingSpinner />
                        </Center>
                    </div>
                </GridItem>
                <GridItem colSpan={4} />
            </Show>
        </ResponsiveCustomGrid>
    );
};

export default GenericBotPage;