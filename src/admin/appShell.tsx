import { Box, Container, Flex, hope, Progress, ProgressIndicator } from "@hope-ui/solid";
import { Route, Routes } from "@solidjs/router";
import { Component, lazy, Suspense } from 'solid-js';
import { Portal } from "solid-js/web";
import { Sidebar } from './components/common/sidebar';
import { CenterLoading } from './components/core/loading';
import { routes } from './constants/route';

const HomePage = lazy(() => import("./pages/home"));
const QuicksilverCompanionPage = lazy(() => import("./pages/quicksilverCompanion"));
const AboutPage = lazy(() => import("./pages/about"));

export const AppShell: Component = () => {
    return (
        <Container flexGrow={1}>
            <Flex>
                <Sidebar />
                <hope.main w="$full">
                    <Suspense fallback={<CenterLoading />} >
                        <Routes>
                            <Route path={routes.home} component={HomePage} />
                            <Route path={routes.quicksilver} component={QuicksilverCompanionPage} />
                            <Route path={routes.about} component={AboutPage} />
                        </Routes>

                        {/* <Footer /> */}
                    </Suspense>
                </hope.main>
            </Flex>
        </Container>
    );
};