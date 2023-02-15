
import { Button, GridItem } from '@hope-ui/solid';
import { Component, createSignal, useContext } from 'solid-js';

import { NetworkState } from '../../../../constants/enum/networkState';
import { getNmsSocialApi } from '../../../../services/api/nmsSocialApiService';
import { getLog } from '../../../../services/internal/logService';
import { CredentialsContext } from '../../../context/credentials.context';
import { errorPopup } from '../../../helper/popupHelper';


export const QSCompanionSpecific: Component = () => {
    const creds = useContext(CredentialsContext);
    const [networkState, setNetworkState] = createSignal(NetworkState.Pending);

    const triggerQuicksilverMission = async () => {

        const nmsSocialApi = getNmsSocialApi();
        const apiAuthToken = creds?.apiAuthToken ?? '';
        const dialogsResult = await nmsSocialApi.triggerQuicksilverMerchant(apiAuthToken)
        if (dialogsResult.isSuccess == false) {
            const title = 'Could not trigger QS merchant message post';
            getLog().e(title, dialogsResult.errorMessage);
            errorPopup({ title });
        }

        setNetworkState(NetworkState.Success);
    }

    return (
        <>
            <GridItem pt="1.5em" colSpan={2}>
                <Button
                    colorScheme="accent"
                    width="100%"
                    loading={networkState() == NetworkState.Loading}
                    onClick={triggerQuicksilverMission}
                >📈 Post QS status image</Button>
            </GridItem>
            <GridItem pt="1.5em" colSpan={2}>
                <Button
                    colorScheme="accent"
                    width="100%"
                    disabled={true}
                    onClick={triggerQuicksilverMission}
                >❓ Coming soon?</Button>
            </GridItem>
        </>
    );
};
