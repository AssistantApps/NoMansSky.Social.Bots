
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
                        Submit
                    </Button>
                </HStack>
            </VStack>
        </GridItem>
    );
};
