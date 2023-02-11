
import { Box, Button, Center, Textarea } from '@hope-ui/solid';
import { Component, createSignal } from 'solid-js';
import { ICredential } from '../../contracts/credential';
import { getLog } from '../../services/internal/logService';
import { PageHeader } from '../components/common/pageHeader';

interface IProps {
    setCredentials: (creds: ICredential) => void
}

export const NotAuthedPage: Component<IProps> = (props: IProps) => {
    const [credsString, setCredsString] = createSignal('');

    const setCredentials = () => {
        try {
            const jsonObj = JSON.parse(credsString());
            props.setCredentials(jsonObj);
        } catch (err) {
            getLog().e(err);
        }
    }

    return (
        <>
            <PageHeader text="Not authorized"></PageHeader>

            <Box m={20}></Box>
            <Textarea minH="70vh" onInput={(event) => setCredsString((event as any)?.target?.value ?? '')}></Textarea>
            <Box m={20}></Box>

            <Center>
                <Button
                    colorScheme="primary"
                    disabled={credsString().length < 1}
                    onClick={() => setCredentials()}
                >Set credentials</Button>
            </Center>
        </>
    );
};

export default NotAuthedPage;