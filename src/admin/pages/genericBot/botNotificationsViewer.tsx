import { Avatar, Box, Button, Center, createDisclosure, GridItem, HStack, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Tooltip, VStack } from "@hope-ui/solid";
import { mastodon } from "masto";
import { Component, createSignal, For, Show } from 'solid-js';

import { NetworkState } from '../../../constants/enum/networkState';
import { ICredentialItem } from '../../../contracts/credential';
import { MastodonNotification } from "../../../contracts/mastodonNotification";
import { getLog } from "../../../services/internal/logService";
import { LoadingSpinner } from "../../components/core/loading";
import { getMastoServiceAndClientMetaFromCred } from "../../helper/mastodonHelper";

interface IProps {
    botMeta: ICredentialItem;
}

export const BotNotificationsViewer: Component<IProps> = (props: IProps) => {
    const { isOpen, onOpen, onClose } = createDisclosure();
    const [networkState, setNetworkState] = createSignal(NetworkState.Loading);
    const [notifications, setNotifications] = createSignal<Array<MastodonNotification>>([]);

    const openModalAndLoadConvos = async (botMeta: ICredentialItem) => {
        setNetworkState(NetworkState.Loading);
        onOpen();

        const [mastodonService, tempClient] = await getMastoServiceAndClientMetaFromCred(botMeta);
        if (tempClient == null) return;

        const notificationsResult = await mastodonService.getNotifications(tempClient);
        if (notificationsResult.isSuccess == false) {
            getLog().e(botMeta.name, 'Could not fetch notifications', notificationsResult.errorMessage);
            setNetworkState(NetworkState.Error);
            return;
        }

        setNotifications(notificationsResult.value);
        setNetworkState(NetworkState.Success);
    }

    return (
        <>
            <GridItem data-key={props.botMeta.type} pt="1.5em" colSpan={2}>
                <Button
                    colorScheme="accent"
                    width="100%"
                    onClick={() => openModalAndLoadConvos(props.botMeta)}
                >🐘 Display latest notifications!</Button>
            </GridItem>

            <Modal size="4xl" opened={isOpen()} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalCloseButton />
                    <ModalHeader>Notifications</ModalHeader>
                    <ModalBody>
                        <Show when={networkState() == NetworkState.Error}>
                            <Center>Something went wrong</Center>
                        </Show>
                        <Show when={networkState() == NetworkState.Loading}>
                            <Center minH="50vh" width="100%">
                                <LoadingSpinner />
                            </Center>
                        </Show>
                        <Show when={networkState() == NetworkState.Success}>
                            <Show when={notifications().length > 0} fallback={<Center>No Items</Center>}>
                                <VStack class="conversations" justifyContent="flex-start" alignItems="flex-start">
                                    <For each={notifications()}>{
                                        (notification) => {
                                            if (notification.status == null) {
                                                <HStack class="convo">
                                                    <Avatar src="/assets/img/quicksilverCompanion.png" />
                                                    <Box class="content limit-height" ml={10} flexGrow={4}>
                                                        <span>Last status is null 🤷</span>
                                                    </Box>
                                                </HStack>
                                            }

                                            let profileName = 'unknown';
                                            let profilePic = '/assets/img/quicksilverCompanion.png';
                                            let innerHtml = 'Nothing to see here...';
                                            if (notification.type == 'mention') {
                                                profileName = notification.status?.account?.display_name ?? profileName;
                                                profilePic = notification.status?.account?.avatar ?? profilePic;
                                                innerHtml = `Mention 💬<br/>${notification.status?.content}`;
                                            }
                                            if (notification.type == 'status') {
                                                profileName = notification.status?.account?.display_name ?? profileName;
                                                profilePic = notification.status?.account?.avatar ?? profilePic;
                                                innerHtml = notification.status?.content ?? innerHtml;
                                            }
                                            if (notification.type == 'reblog') {
                                                profileName = notification.account.display_name;
                                                profilePic = notification.account.avatar;
                                                innerHtml = `Boosted 🚀 <br/>${notification.status?.content ?? 'a toot'}`;
                                            }
                                            if (notification.type == 'follow') {
                                                profileName = notification.account.display_name;
                                                profilePic = notification.account.avatar;
                                                innerHtml = `New Follow! 🫂 <br/> ${notification.account.display_name}`;
                                            }
                                            if (notification.type == 'follow_request') {
                                                profileName = notification.status?.account?.display_name ?? profileName;
                                                profilePic = notification.status?.account?.avatar ?? profilePic;
                                                innerHtml = 'Wants to Follow!';
                                            }
                                            if (notification.type == 'favourite') {
                                                profileName = notification.account.display_name;
                                                profilePic = notification.account.avatar;
                                                innerHtml = `Favourited ⭐ <br/>${notification.status?.content ?? 'a toot'}`;
                                            }
                                            if (notification.type == 'poll') {
                                                profileName = notification.account.display_name;
                                                profilePic = notification.account.avatar;
                                                innerHtml = `Poll 📊 <br/>${notification.status?.content ?? 'a toot'}`;
                                            }
                                            if (notification.type == 'update') {
                                                profileName = notification.status?.account?.display_name ?? profileName;
                                                profilePic = notification.status?.account?.avatar ?? profilePic;
                                                innerHtml = `Mention 💬<br/>${notification.status?.content}`;
                                            }
                                            if (notification.type == 'admin.sign_up') {
                                                profileName = notification.account.display_name;
                                                profilePic = notification.account.avatar;
                                                innerHtml = `New user sign up! ✨ <br />${profileName}`;
                                            }
                                            if (notification.type == 'admin.report') {
                                                profileName = notification.account.display_name;
                                                profilePic = notification.account.avatar;
                                                innerHtml = `Admin report? 🔥⛔ <br />${profileName}`;
                                            }


                                            for (const emojiObj of (notification.status?.emojis ?? [])) {
                                                innerHtml = innerHtml.replaceAll(`:${emojiObj.shortcode}:`, `<img src="${emojiObj.static_url}" class="emoji" alt="${emojiObj.shortcode}" />`)
                                            }

                                            return (
                                                <HStack class="notification">
                                                    <Tooltip label={profileName}>
                                                        <Avatar src={profilePic} backgroundColor="transparent" />
                                                    </Tooltip>
                                                    <Box class="content limit-height" ml={10} flexGrow={4}>
                                                        <div innerHTML={innerHtml} />
                                                    </Box>
                                                </HStack>
                                            );
                                        }
                                    }</For>
                                </VStack>
                            </Show>
                        </Show>
                    </ModalBody>
                    <ModalFooter>
                        <Button onClick={onClose}>Close</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
}