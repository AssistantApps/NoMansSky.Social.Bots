
import { Button, Center, Divider, FormControl, Image, FormLabel, GridItem, HStack, Input, VStack, Box, Tag } from '@hope-ui/solid';
import { useNavigate, useParams } from '@solidjs/router';
import { Component, createEffect, createSignal, For, onMount, Show, useContext } from 'solid-js';
import { NetworkState } from '../../constants/enum/networkState';
import { MastodonAnnouncement } from '../../contracts/mastodonAnnouncement';
import { getMastodonApi } from '../../services/api/mastodonApiService';
import { getLog } from '../../services/internal/logService';
import { PageHeader } from '../components/common/pageHeader';
import { CenterLoading } from '../components/core/loading';
import { CredentialsContext } from '../context/credentials.context';
import { ResponsiveCustomGrid } from '../layout/responsiveCustomGrid';


export const AnnouncementsPage: Component = () => {
    const creds = useContext(CredentialsContext);
    const [networkState, setNetworkState] = createSignal(NetworkState.Loading);
    const [announcements, setAnnouncements] = createSignal<Array<MastodonAnnouncement>>([]);

    onMount(() => {
        getAnnouncements();
    });

    const getAnnouncements = async () => {
        if (
            creds == null ||
            creds.accounts == null ||
            creds.accounts.length < 1
        ) {
            return;
        }
        const botMeta = creds.accounts[0];
        const mastodonService = getMastodonApi();
        const announcementsResult = await mastodonService.getAnnouncements(botMeta.accessToken, true);
        if (announcementsResult.isSuccess == false) {
            getLog().e('Could not fetch announcements', announcementsResult.errorMessage);
            setNetworkState(NetworkState.Error);
        }

        setAnnouncements(announcementsResult.value);
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
                    <PageHeader text="Announcements"></PageHeader>
                </GridItem>
                <GridItem colSpan={4}>
                    <Show when={announcements().length > 0} fallback={<Center minH="25vh">No Items</Center>}>
                        <VStack class="conversations" justifyContent="flex-start" alignItems="flex-start">
                            <For each={announcements()}>{
                                (announcement) => {
                                    let innerHtml = announcement.content;
                                    for (const emojiObj of announcement.emojis) {
                                        innerHtml = innerHtml.replaceAll(`:${emojiObj.shortcode}:`, `<img src="${emojiObj.static_url}" class="emoji" alt="${emojiObj.shortcode}" />`)
                                    }

                                    return (
                                        <HStack class="convo">
                                            <Center>📢</Center>
                                            <Box class="content" ml={10} flexGrow={4}>
                                                <div innerHTML={innerHtml} />
                                                <HStack>
                                                    <For each={announcement.reactions}>{
                                                        (reaction) => (
                                                            <Tag p="1em"><img src={reaction.static_url} class="emoji" alt={reaction.name} /></Tag>
                                                        )
                                                    }</For>
                                                </HStack>
                                            </Box>
                                        </HStack>
                                    );
                                }
                            }</For>
                        </VStack>
                    </Show>
                </GridItem>
                <Box m="3em" />
            </Show>
        </ResponsiveCustomGrid>
    );
};

export default AnnouncementsPage;