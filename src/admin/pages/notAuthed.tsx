
import { Box, Button, Center, Textarea } from '@hope-ui/solid';
import { Component, createSignal } from 'solid-js';
import { ICredential } from '../../contracts/credential';
import { getConfig } from '../../services/internal/configService';
import { getLog } from '../../services/internal/logService';
import { PageHeader } from '../components/common/pageHeader';
import { decrypt } from '../helper/encryptHelper';

interface IProps {
    setCredentials: (creds: ICredential) => void
}

export const NotAuthedPage: Component<IProps> = (props: IProps) => {
    const [credsString, setCredsString] = createSignal('');

    const setCredentials = () => {
        let decrypted = '';
        try {
            const secretKey = getConfig().getEncryptionKey();
            decrypted = decrypt(secretKey, credsString());
        } catch (err) {
            getLog().e('Could not decrypt, going to assume that you pasted JSON');
            decrypted = credsString();
        }

        try {
            const jsonObj = JSON.parse(decrypted);
            props.setCredentials(jsonObj);
        } catch (err) {
            getLog().e(err);
        }
    }

    return (
        <Box mx="2em">
            <PageHeader text="Not authorized"></PageHeader>

            <Box m={20}></Box>
            <Textarea minH="50vh" onInput={(event) => setCredsString((event as any)?.target?.value ?? '')}></Textarea>
            <Box m={20}></Box>

            <Center>
                <Button
                    colorScheme="primary"
                    disabled={credsString().length < 1}
                    onClick={() => setCredentials()}
                >Set credentials</Button>
            </Center>
        </Box>
    );
};

export default NotAuthedPage;