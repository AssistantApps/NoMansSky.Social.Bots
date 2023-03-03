import { Avatar, Box, Button, Center, createDisclosure, GridItem, HStack, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, VStack } from "@hope-ui/solid";
import { Component, createSignal, For, Show } from 'solid-js';

import { NetworkState } from '../../../constants/enum/networkState';
import { ICredentialItem } from '../../../contracts/credential';
import { MastodonConversation } from "../../../contracts/mastodonConversation";
import { getLog } from "../../../services/internal/logService";
import { LoadingSpinner } from "../../components/core/loading";
import { getMastoServiceAndClientMetaFromCred } from "../../helper/mastodonHelper";

interface IProps {
    botMeta: ICredentialItem;
}

export const BotConversationsViewer: Component<IProps> = (props: IProps) => {
    const { isOpen, onOpen, onClose } = createDisclosure();
    const [networkState, setNetworkState] = createSignal(NetworkState.Loading);
    const [convos, setConvos] = createSignal<Array<MastodonConversation>>([]);

    const openModalAndLoadConvos = async (botMeta: ICredentialItem) => {
        setNetworkState(NetworkState.Loading);
        onOpen();

        const [mastodonService, tempClient] = await getMastoServiceAndClientMetaFromCred(botMeta);
        if (tempClient == null) return;

        const convosResult = await mastodonService.getConversations(tempClient);
        if (convosResult.isSuccess == false) {
            getLog().e(botMeta.name, 'Could not fetch conversations', convosResult.errorMessage);
            setNetworkState(NetworkState.Error);
            return;
        }

        setConvos(convosResult.value);
        setNetworkState(NetworkState.Success);
    }

    return (
        <>
            <GridItem data-key={props.botMeta.type} pt="1.5em" colSpan={2}>
                <Button
                    colorScheme="accent"
                    width="100%"
                    onClick={() => openModalAndLoadConvos(props.botMeta)}
                >🐘 Display latest conversations!</Button>
            </GridItem>

            <Modal size="4xl" opened={isOpen()} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalCloseButton />
                    <ModalHeader>Conversations</ModalHeader>
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
                            <Show when={convos().length > 0} fallback={<Center>No Items</Center>}>
                                <VStack class="conversations" justifyContent="flex-start" alignItems="flex-start">
                                    <For each={convos()}>{
                                        (convo) => {
                                            if (convo.last_status == null) {
                                                <HStack class="convo">
                                                    <Avatar src="/assets/img/quicksilverCompanion.png" />
                                                    <Box class="content limit-height" ml={10} flexGrow={4}>
                                                        <span>Last status is null 🤷</span>
                                                    </Box>
                                                </HStack>
                                            }

                                            let innerHtml = convo.last_status?.content ?? '';
                                            for (const emojiObj of (convo.last_status?.emojis ?? [])) {
                                                innerHtml = innerHtml.replaceAll(`:${emojiObj.shortcode}:`, `<img src="${emojiObj.static_url}" class="emoji" alt="${emojiObj.shortcode}" />`)
                                            }

                                            return (
                                                <HStack class="convo">
                                                    <Avatar src={convo.last_status?.account?.avatar} />
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