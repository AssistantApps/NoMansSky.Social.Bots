import { Box, Center, Flex, hope } from "@hope-ui/solid";
import { Route, Routes } from "@solidjs/router";
import { Component, createSignal, lazy, onMount, Show, Suspense } from 'solid-js';

import { NetworkState } from "../constants/enum/networkState";
import { ICredential } from "../contracts/credential";
import { getLog } from "../services/internal/logService";
import { Sidebar } from './components/common/sidebar';
import { CenterLoading, LoadingSpinner } from './components/core/loading';
import { routes } from './constants/route';
import { tauriFile, tauriMethod } from "./constants/tauri";
import { CredentialsContext } from './context/credentials.context';
import { decrypt } from "./helper/encryptHelper";
import { callTauri, loadTauriResource } from "./helper/tauriHelper";
import { RedirectToHome } from "./pages/home";

const HomePage = lazy(() => import("./pages/home"));
const GenericBot = lazy(() => import("./pages/genericBot/genericBot"));
const AnnouncementsPage = lazy(() => import("./pages/announcements"));
const DomainBlocksPage = lazy(() => import("./pages/domainBlocks"));
const UtilPage = lazy(() => import("./pages/util"));
const AboutPage = lazy(() => import("./pages/about"));
const NotAuthedPage = lazy(() => import("./pages/notAuthed"));

export const AppShell: Component = () => {
    const [networkState, setNetworkState] = createSignal(NetworkState.Loading);
    const [credentials, setCredentials] = createSignal<ICredential>();

    onMount(() => {
        loadAndCompareVersions();
    });

    const loadAndCompareVersions = async () => {
        let localCreds: ICredential | null = null;
        try {
            const secretKey = await callTauri(tauriMethod.encryptKey, '');
            const resourceString = await loadTauriResource(tauriFile.config);
            const decrypted = decrypt(secretKey, resourceString);
            localCreds = JSON.parse(decrypted);

            // const credStr = JSON.stringify(localCreds);
            // getLog().i(encrypt(secretKey, credStr));
        } catch (err) {
            getLog().e(err);
            setNetworkState(NetworkState.Error);
            return;
        }

        if (localCreds == null) {
            getLog().e('localcreds are empty');
            setNetworkState(NetworkState.Error);
        }

        // const githubFileService = getGithubFileService();
        // const versionResult = await githubFileService.getVersionFile();

        // if (versionResult.isSuccess && versionResult.value.code > adminVersion.code) {
        //     const isConfirmed = await confirmationPopup({
        //         title: 'Use the latest Admin UI?',
        //         confirmButtonText: 'Use the latest!',
        //     });
        //     if (isConfirmed) {
        //         await CopyPopup({
        //             title: 'Click to copy credentials',
        //             description: 'Then paste the creds into the next page',
        //             textToCopy: JSON.stringify(localCreds),
        //         });
        //         setTimeout(() => {
        //             window.location.href = 'https://admin.nomanssky.social/';
        //         }, 1);
        //     }
        // }

        setCredentials(localCreds!);
        setNetworkState(NetworkState.Success);
    }

    return (
        <Box>
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
                    <Flex maxH="100vh">
                        <Sidebar />
                        <hope.main w="$full" px="3em" overflowY="auto">
                            <Suspense fallback={<Center width="100%" height="100vh">            <LoadingSpinner />        </Center>} >
                                <Routes>
                                    <Route path={routes.actualHome} component={HomePage} />
                                    <Route path={routes.genericBot} component={GenericBot} />
                                    <Route path={routes.genericBotWithId} component={GenericBot} />
                                    <Route path={routes.announcements} component={AnnouncementsPage} />
                                    <Route path={routes.domainBlocks} component={DomainBlocksPage} />
                                    <Route path={routes.util} component={UtilPage} />
                                    <Route path={routes.about} component={AboutPage} />

                                    <Route path={"*"} element={<RedirectToHome />} />
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