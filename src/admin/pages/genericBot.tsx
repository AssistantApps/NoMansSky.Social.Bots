
import { Center, GridItem } from '@hope-ui/solid';
import { useNavigate, useParams } from '@solidjs/router';
import { Component, createSignal, onMount, useContext } from 'solid-js';
import { BotType } from '../../constants/enum/botType';
import { PageHeader } from '../components/common/pageHeader';
import { LoadingSpinner } from '../components/core/loading';
import { routes } from '../constants/route';
import { CredentialsContext } from '../context/credentials.context';
import { ResponsiveCustomGrid } from '../layout/responsiveCustomGrid';

export const GenericBotPage: Component = () => {
    const params = useParams();
    const navigate = useNavigate();
    const creds = useContext(CredentialsContext);
    const [botName, setBotName] = createSignal('Bot');

    onMount(() => {
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
            navigate(routes.home, { replace: true })
            return;
        }

        getLatestToots(botType);
    });

    const getLatestToots = (botType: BotType) => {
        const botCredsIndex = (creds?.accounts ?? []).findIndex(acc => acc.type === botType);
        if (botCredsIndex < 0) {
            return;
        }
        const botCreds = creds!.accounts[botCredsIndex];

        window.loadMasto({
            container_body_id: 'bot-timeline',
            instance_uri: 'https://nomanssky.social',
            user_id: botCreds.userId,
            profile_name: botCreds.profileName,
            toots_limit: 5,
        });

        setBotName(botCreds.profileName);
    }

    return (
        <ResponsiveCustomGrid>
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
        </ResponsiveCustomGrid>
    );
};

export default GenericBotPage;