import { Box, Container, Flex, hope } from "@hope-ui/solid";
import { Route, Routes } from "@solidjs/router";
import { Component, createSignal, lazy, onMount, Show, Suspense } from 'solid-js';
import { NetworkState } from "../constants/enum/networkState";
import { ICredential } from "../contracts/credential";
import { getLog } from "../services/internal/logService";
import { Sidebar } from './components/common/sidebar';
import { CenterLoading } from './components/core/loading';
import { routes } from './constants/route';
import { tauriFile } from "./constants/tauri";
import { CredentialsContext } from './context/credentials.context';
import { loadTauriResource } from "./helper/tauriHelper";

const HomePage = lazy(() => import("./pages/home"));
const GenericBot = lazy(() => import("./pages/genericBot"));
const AboutPage = lazy(() => import("./pages/about"));
const NotAuthedPage = lazy(() => import("./pages/notAuthed"));

export const AppShell: Component = () => {
    const [networkState, setNetworkState] = createSignal(NetworkState.Loading);
    const [credentials, setCredentials] = createSignal<ICredential>();

    onMount(() => {
        loadConfig();
    });

    const loadConfig = async () => {
        try {
            const resourceString = await loadTauriResource(tauriFile.config);
            const arrayContent = JSON.parse(resourceString);
            setCredentials(arrayContent);
            setNetworkState(NetworkState.Success);
        } catch (err) {
            getLog().e(err);
            setNetworkState(NetworkState.Error);
        }
    }

    return (
        <Box px="3em">
            <Show when={networkState() == NetworkState.Error}>
                <NotAuthedPage setCredentials={(newCreds) => {
                    setCredentials(newCreds);
                    setNetworkState(NetworkState.Success);
                }} />
            </Show>
            <Show when={networkState() == NetworkState.Loading}>
                <CenterLoading />
            </Show>
            <Show when={networkState() == NetworkState.Success}>
                <CredentialsContext.Provider value={credentials()}>
                    <Flex>
                        <Sidebar />
                        <hope.main w="$full">
                            <Suspense fallback={<CenterLoading />} >
                                <Routes>
                                    <Route path={routes.home} component={HomePage} />
                                    <Route path={routes.genericBot} component={GenericBot} />
                                    <Route path={routes.genericBotWithId} component={GenericBot} />
                                    <Route path={routes.about} component={AboutPage} />
                                </Routes>

                                {/* <Footer /> */}
                            </Suspense>
                        </hope.main>
                    </Flex>
                </CredentialsContext.Provider>
            </Show>
        </Box>
    );
};