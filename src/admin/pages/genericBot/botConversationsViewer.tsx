import { Avatar, Box, Button, Center, createDisclosure, GridItem, HStack, Image, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, UnorderedList, VStack } from "@hope-ui/solid";
import { Component, createSignal, For, Show } from 'solid-js';

import { NetworkState } from '../../../constants/enum/networkState';
import { ICredentialItem } from '../../../contracts/credential';
import { MastodonConversation } from "../../../contracts/mastodonConversation";
import { getMastodonApi } from '../../../services/api/mastodonApiService';
import { getLog } from "../../../services/internal/logService";
import { CenterLoading, LoadingSpinner } from "../../components/core/loading";

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

        const mastodonService = getMastodonApi();
        const convosResult = await mastodonService.getConversations(botMeta.accessToken);
        if (convosResult.isSuccess == false) {
            getLog().e(props.botMeta.name, 'Could not fetch conversations', convosResult.errorMessage);
            setNetworkState(NetworkState.Error);
        }

        const convosArr: Array<MastodonConversation> = convosResult.value;
        setConvos(convosArr);
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
                            <VStack class="conversations" justifyContent="flex-start" alignItems="flex-start">
                                <For each={convos()}>{
                                    (convo) => {
                                        let innerHtml = convo.last_status.content;
                                        for (const emojiObj of convo.last_status.emojis) {
                                            innerHtml = innerHtml.replaceAll(`:${emojiObj.shortcode}:`, `<img src="${emojiObj.static_url}" class="emoji" alt="${emojiObj.shortcode}" />`)
                                        }

                                        return (
                                            <HStack class="convo">
                                                <Avatar src={convo.last_status.account.avatar} />
                                                <Box class="content" ml={10} flexGrow={4}>
                                                    <div innerHTML={innerHtml} />
                                                </Box>
                                            </HStack>
                                        );
                                    }
                                }</For>
                            </VStack>
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