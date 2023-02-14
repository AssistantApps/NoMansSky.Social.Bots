
import { Box, Button, FormControl, FormLabel, GridItem, HStack, Image, Input, VStack } from '@hope-ui/solid';
import { Component, createSignal } from 'solid-js';
import { NetworkState } from '../../../constants/enum/networkState';
import { ICredentialItem } from '../../../contracts/credential';

interface IProps {
    botMeta: ICredentialItem;
}

export const GenericBotPageSendMessage: Component<IProps> = (props: IProps) => {
    const [networkState, setNetworkState] = createSignal(NetworkState.Pending);


    return (
        <GridItem colSpan={{
            "@initial": "4",
            "@lg": "2",
        }}>
            <VStack
                as="form"
                spacing="$5"
                alignItems="stretch"
            >
                <HStack>
                    <Image src={props.botMeta.imageUrl} alt={props.botMeta.profileName} borderRadius="10px" mt="1em" maxH="50px" />
                    <Box m="10px" />
                    <FormControl>
                        <FormLabel for="message">Message to send as <i>{props.botMeta.profileName}</i></FormLabel>
                        <Input id="message" type="text" />
                    </FormControl>
                </HStack>
                <HStack justifyContent="flex-end">
                    <Button type="submit">
                        Submit (Not working yet)
                    </Button>
                </HStack>
            </VStack>
        </GridItem>
    );
};
