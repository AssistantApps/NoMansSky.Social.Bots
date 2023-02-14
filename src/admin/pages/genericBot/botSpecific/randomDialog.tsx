
import { Center, GridItem, Heading, ListItem, UnorderedList } from '@hope-ui/solid';
import { Component, createSignal, For, onMount, Show } from 'solid-js';
import { NetworkState } from '../../../../constants/enum/networkState';
import { ExternalUrls } from '../../../../constants/externalUrls';
import { ICredentialItem } from '../../../../contracts/credential';
import { GithubDialogLines } from '../../../../contracts/github/githubDialog';
import { getGithubFileService } from '../../../../services/api/githubFileService';
import { getLog } from '../../../../services/internal/logService';
import { BasicLink } from '../../../components/core/link';
import { LoadingSpinner } from '../../../components/core/loading';

interface IProps {
    botMeta: ICredentialItem;
}

export const RandomDialogBotSpecific: Component<IProps> = (props: IProps) => {
    const [networkState, setNetworkState] = createSignal(NetworkState.Loading);
    const [dialogOptions, setDialogOptions] = createSignal<Array<GithubDialogLines>>([]);

    onMount(() => {
        loadMessages(props.botMeta.dialog);
    });

    const loadMessages = async (dialogKey: string) => {

        const githubFileService = getGithubFileService();
        const dialogsResult = await githubFileService.getDialogFile();
        if (dialogsResult.isSuccess == false) {
            getLog().e(props.botMeta.name, 'Could not fetch github file', dialogsResult.errorMessage);
            setNetworkState(NetworkState.Error);
        }

        const dialogs: Array<GithubDialogLines> | null | undefined = (dialogsResult.value as any)[dialogKey];
        if (dialogs != null && dialogs.length > 0) {
            setDialogOptions(dialogs);
            setNetworkState(NetworkState.Success);
        }
    }

    return (
        <>
            <Show when={networkState() == NetworkState.Error}>
                <Center>Something went wrong</Center>
            </Show>
            <Show when={networkState() == NetworkState.Loading}>
                <GridItem colSpan={4}>
                    <Center>
                        <LoadingSpinner />
                    </Center>
                </GridItem>
            </Show>
            <Show when={networkState() == NetworkState.Success}>
                <GridItem colSpan={4}>
                    <Heading>Current possible dialog options:</Heading>
                    <UnorderedList>
                        <For each={dialogOptions()}>{
                            (dialogOpt) => {
                                return (
                                    <ListItem>{dialogOpt.type} - {dialogOpt.message}</ListItem>
                                );
                            }
                        }</For>
                    </UnorderedList>
                    <Center mt="1em">
                        <BasicLink href={ExternalUrls.dialogJson}>Edit the dialog options in the JSON file ↗</BasicLink>
                    </Center>
                </GridItem>
            </Show>
        </>
    );
};
