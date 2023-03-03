
import { Box, Button, FormControl, FormLabel, GridItem, HStack, Image, Input, Select, SelectContent, SelectIcon, SelectListbox, SelectOption, SelectOptionIndicator, SelectOptionText, SelectTrigger, SelectValue, Spacer, VStack } from '@hope-ui/solid';
import { Component, createSignal, For } from 'solid-js';
import { NetworkState } from '../../../constants/enum/networkState';
import { ICredentialItem } from '../../../contracts/credential';
import { MastodonMakeToot } from '../../../contracts/mastodonMakeToot';
import { getMastoServiceAndClientMetaFromCred } from '../../helper/mastodonHelper';

interface IProps {
    botMeta: ICredentialItem;
}

export const GenericBotPageSendMessage: Component<IProps> = (props: IProps) => {
    const visibilityOpts = ['public', 'private', 'unlisted'];
    const [networkState, setNetworkState] = createSignal(NetworkState.Pending);
    const [tootMessage, setTootMessage] = createSignal('');
    const [visibility, setVisibility] = createSignal<any>(visibilityOpts[0]);

    const sendToot = async () => {
        setNetworkState(NetworkState.Loading);

        const [mastodonService, tempClient] = await getMastoServiceAndClientMetaFromCred(props.botMeta);
        if (tempClient == null) return;

        const params: MastodonMakeToot = {
            status: tootMessage(),
            visibility: visibility(),
        }
        await mastodonService.sendToot(tempClient, params);
        setNetworkState(NetworkState.Success);
    }

    return (
        <GridItem colSpan={{
            "@initial": "4",
            "@xl": "2",
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
                        <Input
                            id="message"
                            type="text"
                            onInput={(event) => {
                                setTootMessage((event as any)?.target?.value ?? '');
                            }}
                        />
                    </FormControl>
                </HStack>
                <HStack justifyContent="flex-end">
                    <Spacer flexGrow={4} />
                    <Box flexGrow={1}>
                        <Select
                            value={visibility()}
                            onChange={setVisibility}>
                            <SelectTrigger>
                                <SelectValue />
                                <SelectIcon />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectListbox>
                                    <For each={visibilityOpts}>
                                        {item => (
                                            <SelectOption value={item}>
                                                <SelectOptionText>{item}</SelectOptionText>
                                                <SelectOptionIndicator />
                                            </SelectOption>
                                        )}
                                    </For>
                                </SelectListbox>
                            </SelectContent>
                        </Select>
                    </Box>
                    <Box m={5} />
                    <Button type="submit"
                        flexGrow={1}
                        loading={networkState() === NetworkState.Loading}
                        onClick={(event: any) => {
                            event?.preventDefault?.();
                            sendToot();
                        }}
                    >Submit</Button>
                </HStack>
            </VStack>
        </GridItem>
    );
};
