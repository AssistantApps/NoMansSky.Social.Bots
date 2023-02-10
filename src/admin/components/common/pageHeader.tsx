import { ElementType, Flex, Text, TextProps, VStack, Image, Box, Heading } from "@hope-ui/solid";
import { Component } from "solid-js";
import { SidebarNavLink } from "./sidebarNavLink";
import logo from "../../../assets/img/logo.svg";
import { routes } from "../../constants/route";

interface IProps {
    text: string
}

export const PageHeader: Component<IProps> = (props: IProps) => {

    return (
        <Flex
            class="page-title"
            direction="row"
            justifyContent="center"
            paddingTop="2em"
        >
            <Heading size="3xl">{props.text}</Heading>
        </Flex>
    );
}