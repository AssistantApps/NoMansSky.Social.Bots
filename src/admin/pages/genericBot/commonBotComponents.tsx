
import { Divider, GridItem } from '@hope-ui/solid';
import { Component } from 'solid-js';

export const SmallScreenOnlyDivider: Component = () => {
    return (
        <GridItem pt="1.5em" colSpan={{
            "@initial": "4",
            "@lg": "2",
        }} display={{
            "@initial": "unset",
            "@lg": "none",
        }}>
            <Divider />
        </GridItem>
    );
}