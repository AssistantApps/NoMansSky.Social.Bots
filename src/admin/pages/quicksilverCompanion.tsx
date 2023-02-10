
import { Center, Grid, GridItem } from '@hope-ui/solid';
import { Component, onMount } from 'solid-js';
import { PageHeader } from '../components/common/pageHeader';
import { LoadingSpinner } from '../components/core/loading';

export const QuicksilverCompanionPage: Component = () => {

    onMount(() => {
        getLatestToots();
    });

    const getLatestToots = () => {
        window.loadMasto({
            container_body_id: 'qs-timeline',
            instance_uri: 'https://nomanssky.social',
            user_id: '109824079953810227',
            profile_name: '@quicksilverCompanion',
            toots_limit: 5,
        });
    }

    return (
        <Grid gap="$4"
            templateColumns={{
                "@initial": "repeat(4, 1fr)",
                "@lg": "repeat(8, 1fr)",
            }}
            width="100%"
        >
            <GridItem colSpan={8}>
                <PageHeader text="Quicksilver Synthesis Companion"></PageHeader>
            </GridItem>
            <GridItem colSpan={4}></GridItem>
            <GridItem colSpan={4} rowSpan={6}>
                {/* <Button colorScheme="primary" width="100%" onclick={getLatestToots}>🔃 Refresh Toots</Button> */}
                <div id="qs-timeline" class="mt-body" style="width: 100%">
                    <Center minH="100vh">
                        <LoadingSpinner />
                    </Center>
                </div>
            </GridItem>
            <GridItem colSpan={4} />
        </Grid>
    );
};

export default QuicksilverCompanionPage;