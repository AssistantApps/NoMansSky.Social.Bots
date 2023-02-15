
import { Divider, GridItem } from '@hope-ui/solid';
import { Component } from 'solid-js';

export const SmallScreenOnlyDivider: Component = () => {
    return (
        <GridItem pt="1.5em" colSpan={{
            "@initial": "4",
            "@xl": "4",
        }} display={{
            "@initial": "unset",
        }}>
            <Divider />
        </GridItem>
    );
}