import { Box, Center, Divider, ElementType, Flex, Heading, IconButton, Image, Text, TextProps, VStack } from "@hope-ui/solid";
import { Component, createSignal, For, useContext } from "solid-js";

import { Link } from "@solidjs/router";
import adminVersion from '../../../assets/data/admin-version.json';
import { sidebarBotTypes } from "../../../constants/enum/botType";
import { getLog } from "../../../services/internal/logService";
import { routes } from "../../constants/route";
import { CredentialsContext } from "../../context/credentials.context";
import { SidebarNavLink } from "./sidebarNavLink";

export const Sidebar: Component = () => {
    const creds = useContext(CredentialsContext);
    const [isHidden, setHidden] = createSignal(false);

    const SidebarTitle = <C extends ElementType = "p">(props: TextProps<C>) => {
        return (
            <Text
                fontSize="$sm"
                fontWeight="$bold"
                textTransform="uppercase"
                mb="$2"
                {...props}
            />
        );
    }

    // const MainNavSubtitle = <C extends ElementType = "p">(props: TextProps<C>) => {
    //     return (
    //         <Text
    //             as="span"
    //             color="$primary10"
    //             fontSize="$xs"
    //             fontWeight="$semibold"
    //             textTransform="uppercase"
    //             {...props}
    //         />
    //     );
    // }

    return (
        <Flex
            as="nav"
            class={isHidden() ? 'hide-scrollbar noselect expand' : 'hide-scrollbar noselect close'}
            position="sticky"
            display="flex"
            direction="column"
            flexShrink="0"
            width={isHidden() ? '$10' : '$72'}
            height="100vh"
            p={isHidden() ? '0' : '$6'}
        >
            <>
                <Box class="content" opacity={isHidden() ? '0' : '1'}>
                    <Box position="relative">
                        <Link href={routes.home}>
                            <Flex>
                                <Image src="/assets/img/logox100.png" alt="logo" width="25%" />
                                <Box m="$2" />
                                <Center>
                                    <Heading>NMS Social <br />Admin app</Heading>
                                </Center>
                            </Flex>
                            <Box m={20} />
                            <Divider />
                        </Link>
                        <Text class='version'>{adminVersion.name}</Text>
                    </Box>
                    <Box m={20} />
                    <SidebarTitle>Quick links</SidebarTitle>
                    <VStack alignItems="flex-start" spacing="$1" mb="$6">
                        <SidebarNavLink href={routes.actualHome}>Home</SidebarNavLink>
                        <SidebarNavLink href={routes.announcements}>Announcements</SidebarNavLink>
                        <SidebarNavLink href={routes.domainBlocks}>Domain Blocks</SidebarNavLink>
                        <SidebarNavLink href={routes.util}>Utilities</SidebarNavLink>
                    </VStack>
                    <Box m={20} />
                    <SidebarTitle>Bot links</SidebarTitle>
                    <VStack alignItems="flex-start" spacing="$1" mb="$6">
                        <For each={sidebarBotTypes()}>{
                            (botProp) => {
                                const botCredsIndex = (creds?.accounts ?? []).findIndex(acc => acc.type === botProp);
                                if (botCredsIndex < 0) {
                                    getLog().e(`Could not find bot ${botProp}`)
                                    return;
                                }
                                const botCreds = creds!.accounts[botCredsIndex];
                                return (
                                    <SidebarNavLink href={routes.genericBotWithId.replace(routes.genericBotParam, botProp)}>
                                        {botCreds.name}
                                    </SidebarNavLink>
                                );
                            }
                        }</For>
                    </VStack>
                </Box>
                <IconButton
                    colorScheme="primary"
                    aria-label="Close drawer"
                    borderRadius="2em"
                    class={isHidden() ? 'drawer-icon expand' : 'drawer-icon close'}
                    onClick={() => setHidden(!isHidden())}
                    icon={<span>☰</span>}
                />
            </>
        </Flex>
    );
}