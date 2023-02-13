import { Grid } from '@hope-ui/solid';
import { Component, JSX } from 'solid-js';

interface IProps {
    children: JSX.Element;
}

export const ResponsiveCustomGrid: Component<IProps> = (props: IProps) => {

    return (
        <Grid gap="$4"
            templateColumns={"repeat(4, 1fr)"}
            width="100%"
        >
            {props.children}
        </Grid>
    );
}