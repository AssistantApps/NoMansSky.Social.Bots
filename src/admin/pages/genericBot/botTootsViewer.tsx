import { Button, Center, createDisclosure, GridItem, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay } from "@hope-ui/solid";
import { Component } from 'solid-js';

import { ICredentialItem } from '../../../contracts/credential';
import { timeout } from "../../../helper/asyncHelper";
import { LoadingSpinner } from "../../components/core/loading";

interface IProps {
    botMeta: ICredentialItem;
}

export const BotTootsViewer: Component<IProps> = (props: IProps) => {
    const { isOpen, onOpen, onClose } = createDisclosure();

    const getLatestToots = async (botMeta: ICredentialItem) => {
        onOpen();
        await timeout(100);
        try {
            (window as any).loadMasto({
                container_body_id: 'bot-timeline',
                instance_uri: 'https://nomanssky.social',
                user_id: botMeta.userId,
                profile_name: botMeta.profileName,
                toots_limit: 5,
            });
        } catch { }
    }

    return (
        <>
            <GridItem data-key={props.botMeta.type} pt="1.5em" colSpan={2}>
                <Button
                    colorScheme="accent"
                    width="100%"
                    onClick={() => getLatestToots(props.botMeta)}
                >🐘 Display latest Toots!</Button>
            </GridItem>

            <Modal size="xl" opened={isOpen()} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalCloseButton />
                    <ModalHeader>Latest Toots!</ModalHeader>
                    <ModalBody>
                        <div id="bot-timeline" class="mt-body" style="width: 100%">
                            <Center minH="50vh" width="100%">
                                <LoadingSpinner />
                            </Center>
                        </div>
                    </ModalBody>
                    <ModalFooter>
                        <Button onClick={onClose}>Close</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
}