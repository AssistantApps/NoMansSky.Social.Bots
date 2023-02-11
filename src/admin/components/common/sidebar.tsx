import { ElementType, Flex, Text, TextProps, VStack, Image, Box, IconButton } from "@hope-ui/solid";
import { Component, createSignal, For, useContext } from "solid-js";
import { SidebarNavLink } from "./sidebarNavLink";
import logo from "../../../assets/img/logo.svg";
import { routes } from "../../constants/route";
import { Link } from "@solidjs/router";
import { CredentialsContext } from "../../context/credentials.context";
import { allBotTypes } from "../../../constants/enum/botType";

export const Sidebar: Component = () => {
    const creds = useContext(CredentialsContext);
    const [isHidden, setHidden] = createSignal(false);

    const SidebarTitle = <C extends ElementType = "p">(props: TextProps<C>) => {
        return (
            <Text as="span"
                fontSize="$sm"
                fontWeight="$bold"
                textTransform="uppercase"
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
            class={isHidden() ? 'hide-scrollbar expand' : 'hide-scrollbar close'}
            position="sticky"
            display="flex"
            direction="column"
            flexShrink="0"
            width={isHidden() ? '0' : '$60'}
            height="100vh"
            p={isHidden() ? '0' : '$6'}
        >
            <>
                <Box class="content" opacity={isHidden() ? '0' : '1'}>
                    <Link href={routes.home}>
                        <Image src={logo} />
                    </Link>
                    <Box m={20} />
                    <SidebarTitle mb="$2">Quick links</SidebarTitle>
                    <VStack alignItems="flex-start" spacing="$1" mb="$6">
                        <SidebarNavLink href={routes.about}>About</SidebarNavLink>
                    </VStack>
                    <Box m={20} />
                    <SidebarTitle mb="$2">Bot links</SidebarTitle>
                    <VStack alignItems="flex-start" spacing="$1" mb="$6">
                        <For each={allBotTypes()}>{
                            (botProp) => {
                                const botCredsIndex = (creds?.accounts ?? []).findIndex(acc => acc.type === botProp);
                                if (botCredsIndex < 0) {
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
                    class={isHidden() ? 'drawer-icon expand' : 'drawer-icon close'}
                    onClick={() => setHidden(!isHidden())}
                    icon={<span>➤</span>}
                />
            </>
        </Flex>
    );
}