import { FormControl, FormLabel, GridItem, Input, InputGroup, InputRightElement } from "@hope-ui/solid";
import { Component } from 'solid-js';

import { ICredentialItem } from '../../../contracts/credential';
import { copyTextToClipboard } from "../../helper/browserHelper";

interface IProps {
    botMeta: ICredentialItem;
}

export const BotCredentials: Component<IProps> = (props: IProps) => {

    return (
        <>
            <GridItem pt="1.5em" colSpan={2}>
                <FormControl>
                    <FormLabel for="email">Email</FormLabel>
                    <InputGroup>
                        <Input
                            id="email"
                            type="text"
                            disabled
                            value={props.botMeta.email}
                        />
                        <InputRightElement
                            cursor="pointer"
                            onClick={() => copyTextToClipboard(props.botMeta.email)}
                        >📋</InputRightElement>
                    </InputGroup>
                </FormControl>
            </GridItem>
            <GridItem pt="1.5em" colSpan={2}>
                <FormControl>
                    <FormLabel for="password">Password</FormLabel>
                    <InputGroup>
                        <Input
                            id="password"
                            type="password"
                            disabled={true}
                            value={props.botMeta.password}
                        />
                        <InputRightElement
                            cursor="pointer"
                            onClick={() => copyTextToClipboard(props.botMeta.password)}
                        >📋</InputRightElement>
                    </InputGroup>
                </FormControl>
            </GridItem>
        </>
    );
}