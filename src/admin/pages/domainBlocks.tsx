
import { Box, Button, Center, GridItem, Select, SelectContent, SelectIcon, SelectListbox, SelectOption, SelectOptionIndicator, SelectOptionText, SelectTrigger, SelectValue, Table, Tbody, Td, Tfoot, Th, Thead, Tooltip, Tr, VStack } from '@hope-ui/solid';
import { Component, createEffect, createSignal, For, onMount, Show, useContext } from 'solid-js';
import { NetworkState } from '../../constants/enum/networkState';
import { MastodonDomainBlock } from '../../contracts/mastodonDomainBlock';
import { getLog } from '../../services/internal/logService';
import { PageHeader } from '../components/common/pageHeader';
import { CenterLoading } from '../components/core/loading';
import { CredentialsContext } from '../context/credentials.context';
import { getMastoServiceAndClientMeta } from '../helper/mastodonHelper';
import { ResponsiveCustomGrid } from '../layout/responsiveCustomGrid';


export const DomainBlocksPage: Component = () => {
    const pageSizeOptions = [15, 30, 50, 100, 200];
    const creds = useContext(CredentialsContext);
    const [networkState, setNetworkState] = createSignal(NetworkState.Loading);
    const [domainBlocks, setDomainBlocks] = createSignal<Array<MastodonDomainBlock>>([]);
    const [paginator, setPaginator] = createSignal<any>();
    const [pageSize, setPageSize] = createSignal<number>(pageSizeOptions[0]);
    const [page, setPage] = createSignal<number>(1);

    onMount(() => {
        setup();
    });

    createEffect(() => {
        getDomainBlocks();
        page();
    });

    // createEffect(() => {
    //     setup();
    //     pageSize();
    // });

    const setup = async () => {
        const [mastodonService, tempClient] = await getMastoServiceAndClientMeta(creds);
        if (tempClient == null) return;

        const paginator = mastodonService.getDomainBlocks(tempClient, '', pageSize());
        setPaginator(paginator);
    }

    const getDomainBlocks = async () => {
        const localPaginator = paginator();
        if (localPaginator == null) return;
        console.log('getDomainBlocks', localPaginator);

        const domainBlocksResult = await localPaginator;
        if (domainBlocksResult == null || domainBlocksResult.length == null || domainBlocksResult.length < 1) {
            getLog().e('Could not fetch domain blocks', domainBlocksResult.errorMessage);
            setNetworkState(NetworkState.Error);
        }

        setPaginator(localPaginator);
        setDomainBlocks(domainBlocksResult);
        setNetworkState(NetworkState.Success);
    }

    const deleteDomainBlocks = (id: string) => async () => {
        const [mastodonService, tempClient] = await getMastoServiceAndClientMeta(creds);
        if (tempClient == null) return;

        await mastodonService.unblockDomain(tempClient, id);
        await getDomainBlocks();
    }

    const renderDomainRow = (domainBlock: MastodonDomainBlock) => {
        return (
            <Tr>
                <Td>
                    <Tooltip label={domainBlock.private_comment}><span>{domainBlock.domain}</span></Tooltip>
                </Td>
                <Td textAlign="center" class="noselect">
                    <Show when={domainBlock.private_comment}>
                        <Tooltip label="Private Comment"><span>💬</span></Tooltip>
                    </Show>
                    &nbsp;
                    <Show when={domainBlock.reject_media}>
                        <Tooltip label="Reject media"><span>📼</span></Tooltip>
                    </Show>
                    &nbsp;
                    <Show when={domainBlock.reject_reports}>
                        <Tooltip label="Reject reports"><span>📈</span></Tooltip>
                    </Show>
                    &nbsp;
                    <Show when={domainBlock.severity}>
                        <Tooltip label={domainBlock.severity}><span>📛</span></Tooltip>
                    </Show>
                </Td>
                <Td numeric class="noselect">
                    <Tooltip label="Remove block">
                        <span class="pointer" onClick={deleteDomainBlocks(domainBlock.id)}>❌</span>
                    </Tooltip>
                </Td>
            </Tr>
        );
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
                    <PageHeader text="Domains that are blocked"></PageHeader>
                </GridItem>
                <GridItem colSpan={4}>
                    <Show when={domainBlocks().length > 0} fallback={<Center minH="25vh">No Items</Center>}>
                        <VStack justifyContent="flex-start" alignItems="flex-start">
                            <Table dense highlightOnHover striped="even">
                                <Thead>
                                    <Tr class="noselect">
                                        <Th>Domain</Th>
                                        <Th textAlign="center">Restrictions</Th>
                                        <Th></Th>
                                    </Tr>
                                </Thead>
                                <Tbody>
                                    <For each={domainBlocks()}>{renderDomainRow}</For>
                                </Tbody>
                                <Tfoot class="noselect">
                                    <Th></Th>
                                    <Th textAlign="center">
                                        <Button
                                            mr={10}
                                            disabled={page() < 2}
                                            onClick={() => {
                                                // setCurrentLink(prevLink());
                                                setPage((prev) => (prev - 1));
                                            }}
                                            colorScheme="warning"
                                            transform="rotate(180deg)"
                                        >➤</Button>
                                        Page: {page}
                                        <Button
                                            ml={10}
                                            colorScheme="warning"
                                            onClick={() => {
                                                // setCurrentLink(nextLink());
                                                setPage((prev) => (prev + 1));
                                            }}
                                        >➤</Button>
                                    </Th>
                                    <Th>
                                        <Select
                                            value={pageSize()}
                                            onChange={(value) => {
                                                setPageSize(value);
                                                setPage(1);
                                            }}>
                                            <SelectTrigger>
                                                <SelectValue />
                                                <SelectIcon />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectListbox>
                                                    <For each={pageSizeOptions}>
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
                                    </Th>
                                </Tfoot>
                            </Table>
                        </VStack>
                    </Show>
                </GridItem>
                <Box m="3em" />
            </Show>
        </ResponsiveCustomGrid>
    );
};

export default DomainBlocksPage;