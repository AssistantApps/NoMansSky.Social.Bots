
import { GridItem, IconButton, Text, Textarea } from '@hope-ui/solid';
import { Component, createSignal, onMount } from 'solid-js';
import { PageHeader } from '../components/common/pageHeader';
import { tauriMethod } from '../constants/tauri';
import { copyTextToClipboard } from '../helper/browserHelper';
import { encrypt } from '../helper/encryptHelper';
import { callTauri } from '../helper/tauriHelper';
import { ResponsiveCustomGrid } from '../layout/responsiveCustomGrid';


export const UtilPage: Component = () => {
    const [credsString, setCredsString] = createSignal('');
    const [secretKey, setSecretKey] = createSignal('');

    onMount(() => {
        loadDeps();
    })

    const loadDeps = async () => {
        const secretKey = await callTauri(tauriMethod.encryptKey, '');
        setSecretKey(secretKey);
    }

    return (
        <ResponsiveCustomGrid>
            <GridItem colSpan={4}>
                <PageHeader text="Utilities"></PageHeader>
            </GridItem>
            <GridItem colSpan={4}>
                <Text>Quick encrypt</Text>
            </GridItem>
            <GridItem colSpan={2}>
                <Textarea
                    minH="40vh"
                    placeholder="Paste text here"
                    onInput={(event) => setCredsString(encrypt(secretKey(), (event as any)?.target?.value ?? ''))}
                ></Textarea>
            </GridItem>
            <GridItem colSpan={2} position="relative">
                <Textarea
                    minH="40vh"
                    placeholder="Copy encrypted text from here"
                >{credsString()}</Textarea>
                <IconButton
                    colorScheme="info"
                    aria-label="Copy encr"
                    borderRadius="2em"
                    class="copy-fab"
                    onClick={() => copyTextToClipboard(credsString())}
                    icon={<span>📋</span>}
                />
            </GridItem>
        </ResponsiveCustomGrid>
    );
};

export default UtilPage;