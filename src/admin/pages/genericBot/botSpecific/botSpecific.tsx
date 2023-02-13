
import { Component, Match, Switch } from 'solid-js';
import { botsThatUsRandomDialog, BotType } from '../../../../constants/enum/botType';
import { ICredentialItem } from '../../../../contracts/credential';
import { SmallScreenOnlyDivider } from '../commonBotComponents';
import { QSCompanionSpecific } from './qsCompanion';
import { RandomDialogBotSpecific } from './randomDialog';

interface IProps {
    botMeta: ICredentialItem;
}

export const SpecificBotComponents: Component<IProps> = (props: IProps) => {

    return (
        <Switch fallback={<></>}>
            <Match when={botsThatUsRandomDialog().includes(props.botMeta.type)} >

                <>
                    <RandomDialogBotSpecific botMeta={props.botMeta} />
                    <SmallScreenOnlyDivider />
                </>
            </Match>
            <Match when={props.botMeta.type === BotType.qsCompanion}>

                <>
                    <QSCompanionSpecific />
                    <SmallScreenOnlyDivider />
                </>
            </Match>
        </Switch>
    );
};