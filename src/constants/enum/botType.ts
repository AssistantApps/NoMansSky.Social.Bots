export enum BotType {
    unknown = 'unknown',
    admin = 'admin',
    ariadne = 'ariadne',
    theRealAriadne = 'theRealAriadne',
    qsCompanion = 'qsCompanion',
    assistantnmstracker = 'assistantnmstracker',
}

export const allBotTypes = () => Object.keys(BotType).filter(bt => bt != BotType.unknown);
export const sidebarBotTypes = () => allBotTypes();

export const dontSetupListenersBotTypes = () => [
    BotType.unknown,
    BotType.admin,
    BotType.assistantnmstracker,
].map(bt => bt.toString());

export const botsThatUsRandomDialog = () => [
    BotType.ariadne,
    BotType.theRealAriadne,
];
